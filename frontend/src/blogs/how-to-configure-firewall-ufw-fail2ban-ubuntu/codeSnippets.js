export const bashCodeSnippet1 = `sudo ufw status`;

export const bashCodeSnippet2 = `sudo ufw allow OpenSSH`;

export const bashCodeSnippet3 = `sudo ufw enable`;

export const codeOutput1 = `Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup`;

export const bashCodeSnippet4 = `sudo ufw status verbose`;

export const codeOutput2 = `Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                             Action      From
--                             ------      ----
22/tcp (OpenSSH (v6))          ALLOW IN    Anywhere (v6)
22/tcp (v6)                    ALLOW IN    Anywhere (v6)`;

export const codeOutput3 = `2025-12-07T10:59:44 sshd[615989]: Invalid user docker from 142.93.130.134
2025-12-07T11:01:28 sshd[616006]: Invalid user dspace from 142.93.130.134
2025-12-07T11:05:09 sshd[616037]: Invalid user elastic from 142.93.130.134
2025-12-07T11:05:38 sshd[616045]: Invalid user admin from 94.156.152.7`;

export const bashCodeSnippet5 = `sudo apt install fail2ban -y`;

export const bashCodeSnippet6 = `sudo nano /etc/fail2ban/jail.local`;

export const fileContentSnippet1 = `[sshd]
enabled = true
bantime = 1d
maxretry = 5
findtime = 10m`;

export const bashCodeSnippet7 = `sudo systemctl restart fail2ban`;

export const bashCodeSnippet8 = `sudo systemctl enable fail2ban
sudo systemctl start fail2ban`;

export const bashCodeSnippet9 = `sudo fail2ban-client get sshd bantime`;

export const bashCodeSnippet10 = `sudo fail2ban-client status sshd`;

export const codeOutput4 = `Status for the jail: sshd
|- Filter
| |- Currently failed: 4
| |- Total failed: 27
| - Journal matches: _SYSTEMD_UNIT=sshd.service + _COMM=sshd - Actions
|- Currently banned: 1
|- Total banned: 1
- Banned IP list: 142.93.130.134`;

export const bashCodeSnippet11 = `sudo ufw allow OpenSSH`;

export const bashCodeSnippet12 = `ssh <your_username>@<your_server_ip>`;
