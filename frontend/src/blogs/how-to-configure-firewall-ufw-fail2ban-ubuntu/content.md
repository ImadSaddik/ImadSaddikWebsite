# How to configure a firewall with UFW and Fail2Ban

Secure your server by blocking incoming traffic and banning brute-force attackers.

**Date:** January 29, 2026
**Tags:** Security, UFW, Fail2Ban, Ubuntu, Firewall

---

## Introduction

Right now, your server is like a house with the front door locked (SSH keys) but every window wide open. By default, a fresh Linux server accepts connections on any port. This is not ideal.

In this section, you will configure a firewall to block all incoming traffic by default, allowing only the connections you explicitly trust, using **UFW** (Uncomplicated Firewall). You will also install **Fail2Ban** to automatically ban bots that try to guess your SSH keys.

> [!IMPORTANT]
> Throughout this guide, you will see text inside angle brackets like `<your_username>` or `<your_server_ip>`. These are **placeholders**. You must replace them with your actual values and **remove the brackets** when running the commands.

## Configure the firewall

Ubuntu comes with a tool called **UFW** (Uncomplicated Firewall). It is designed to be easy to use while providing robust security.

Check the current status of your firewall.

```bash
sudo ufw status
```

It should say `Status: inactive`. Before you activate it, you must explicitly allow SSH connections.

> [!IMPORTANT]
> If you enable the firewall without allowing SSH first, you will lock yourself out of the server immediately.

```bash
sudo ufw allow OpenSSH
```

Now that SSH is allowed, you can safely enable the firewall.

```bash
sudo ufw enable
```

The system will warn you that this command might disrupt existing SSH connections. Type `y` and hit `Enter`.

```plaintext
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
```

Verify the status again to see the active rules.

```bash
sudo ufw status verbose
```

The output gives you a detailed list. Pay close attention to the Default policy and the ALLOW IN rules.

```plaintext
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                             Action      From
--                             ------      ----
22/tcp (OpenSSH (v6))          ALLOW IN    Anywhere (v6)
22/tcp (v6)                    ALLOW IN    Anywhere (v6)
```

Here is how to interpret this output:

- **Default: deny (incoming)**: This is the most important rule. It means every single port on your server is blocked unless you explicitly allow it.
- **ALLOW IN**: These are your exceptions. Right now, you are only allowing traffic for SSH (port 22).

> [!NOTE]
> Later in the guide, when you install the web server ([Nginx](https://nginx.org/)), you will come back here to open ports [80 (HTTP)](https://en.wikipedia.org/wiki/Port_%28computer_networking%29#Common_port_numbers) and [443 (HTTPS)](https://en.wikipedia.org/wiki/Port_%28computer_networking%29#Common_port_numbers). For now, keeping them closed is safer.

## Protect SSH with Fail2Ban

If you check your authentication logs (`/var/log/auth.log`), you will likely see a stream of failed login attempts. These are automated bots scanning the internet, trying to guess passwords for common usernames like `admin`, `root`, or `test`.

Here is a real example from my own server logs:

```plaintext
2025-12-07T10:59:44 sshd[615989]: Invalid user docker from 142.93.130.134
2025-12-07T11:01:28 sshd[616006]: Invalid user dspace from 142.93.130.134
2025-12-07T11:05:09 sshd[616037]: Invalid user elastic from 142.93.130.134
2025-12-07T11:05:38 sshd[616045]: Invalid user admin from 94.156.152.7
```

Even though they cannot get in (because you disabled password authentication), they waste your server's CPU and fill up your disk space with logs.

To stop this, install [Fail2Ban](https://github.com/fail2ban/fail2ban). This tool monitors your logs in real-time. If an IP address fails to log in too many times, Fail2Ban instantly updates the firewall to block that IP completely.

_How Fail2Ban turns log entries into firewall rules._

Fail2Ban is available in Ubuntu's default repositories. Install it with this command:

```bash
sudo apt install fail2ban -y
```

By default, Fail2Ban only bans attackers for 10 minutes. This is often too short; persistent bots will just come back later. To increase this to 1 day, create a local configuration file.

> [!Important]
> Never edit the `.conf` file directly, as system updates will overwrite it. Always use a `.local` file for your customizations.

Create the file using nano.

```bash
sudo nano /etc/fail2ban/jail.local
```

Paste the following configuration:

```ini
[sshd]
enabled = true
bantime = 1d
maxretry = 5
findtime = 10m
```

Here is what these settings do:

- `enabled`: Turns on protection for SSH.
- `bantime`: Bans the IP for 1 day.
- `maxretry`: Allows a user to fail 5 times before being banned.
- `findtime`: The window of time (10 minutes) in which those 5 failures must occur to trigger a ban.

Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`). Restart the Fail2Ban service for the new configuration to take effect:

```bash
sudo systemctl restart fail2ban
```

Once installed, enable the service to start automatically when the server reboots.

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

You can verify your new ban time (86400 seconds = 24 hours) with this command:

```bash
sudo fail2ban-client get sshd bantime
```

To see if the tool is working, check the status of the SSH jail.

```bash
sudo fail2ban-client status sshd
```

The output will look like this:

```plaintext
Status for the jail: sshd
|- Filter
| |- Currently failed: 4
| |- Total failed: 27
| `- Journal matches: _SYSTEMD_UNIT=sshd.service + _COMM=sshd `- Actions
|- Currently banned: 1
|- Total banned: 1
`- Banned IP list: 142.93.130.134
```

If you see IPs in the "Banned IP list", it means the tool is working. That specific IP from the logs is now blocked and can no longer connect to the server.

## Recovery console

What happens if you make a mistake? For example, if you accidentally run `ufw enable` before allowing OpenSSH, or if you configure SSH keys incorrectly and lose access to your private key.

If you get locked out, DigitalOcean provides a Recovery Console. This feature gives you direct access to the machine through your browser, bypassing SSH entirely.

1. Go to the DigitalOcean dashboard and click on your project.
2. Click the name of your droplet to open its details.
3. Click on the **Access** button in the left sidebar.
4. Click **Launch Recovery Console**.

_Access the Recovery Console from the DigitalOcean dashboard._

Once the console opens, you will need to log in.

> [!WARNING]
> The Recovery Console requires a password to log in. If you created your user without a password, or if you forgot it, you will need to reset the root password first using the "Reset Root Password" button on the same Access page.

The keyboard mapping in the Recovery Console can be tricky. It is a good idea to type your password in the username field first just to see if the characters match what you are pressing, then delete it and log in properly.

_The Recovery Console login screen._

Once you are logged in, you can run the missing command to fix the issue. For example, if you forgot to allow SSH:

```bash
sudo ufw allow OpenSSH
```

After fixing the issue, close the browser window and try to SSH from your terminal again.

```bash
ssh <your_username>@<your_server_ip>
```

## Conclusion

Your foundation is solid. You have a secure server that blocks unauthorized traffic and automatically bans attackers. By combining **UFW** for port management and **Fail2Ban** for automated intrusion prevention, you have significantly reduced your server's attack surface.

Security is an ongoing process. Keep your system updated, monitor your logs occasionally, and always follow the principle of least privilege when opening new ports or services.
