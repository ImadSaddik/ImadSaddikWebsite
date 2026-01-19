export const bashCodeSnippet1 = `ssh-keygen -t ed25519 -f ~/.ssh/<your_key_name> -C "<key_comment>"`;

export const codeOutput1 = `Generating public/private ed25519 key pair.
Enter passphrase for "/home/<your_username>/.ssh/<your_key_name>" (empty for no passphrase):`;

export const bashCodeSnippet2 = `cat ~/.ssh/<your_key_name>.pub`;

export const bashCodeSnippet3 = `ssh -i ~/.ssh/<your_key_name> root@<your_droplet_ip>`;

export const codeOutput2 = `The authenticity of host '<your_droplet_ip> (<your_droplet_ip>)' can't be established.
ED25519 key fingerprint is SHA256:...
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])?`;

export const codeOutput3 = `Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '<your_droplet_ip>' (ED69696) to the list of known hosts.
Connection closed by <your_droplet_ip> port 22`;

export const codeOutput4 = `*** System restart required ***

The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

root@<your_hostname>:~#`;

export const bashCodeSnippet4 = `sudo apt update
sudo apt upgrade`;

export const bashCodeSnippet5 = `reboot`;

export const bashCodeSnippet6 = `adduser <your_username>`;

export const codeOutput5 = `New password:
Retype new password:
passwd: password updated successfully
Changing the user information for <your_username>
Enter the new value, or press ENTER for the default
Full Name []: <your_fullname>
Room Number []:
Work Phone []:
Home Phone []:
Other []:
Is the information correct? [Y/n] y
info: Adding new user '<your_username>' to supplemental / extra groups 'users' ...
info: Adding user '<your_username>' to group 'users' ...`;

export const bashCodeSnippet7 = `usermod -aG sudo <your_username>`;

export const bashCodeSnippet8 = `ssh -i ~/.ssh/<private_key_name> <your_username>@<your_droplet_ip>`;

export const codeOutput6 = `<your_username>@<your_droplet_ip>: Permission denied (publickey).`;

export const bashCodeSnippet9 = `ssh -i ~/.ssh/<private_key_name> root@<your_droplet_ip>`;

export const bashCodeSnippet10 = `# Copy the .ssh directory, preserving the strict file permissions
cp -r --preserve=mode /root/.ssh /home/<your_username>/

# Give the new user ownership of this directory
chown -R <your_username>:<your_username> /home/<your_username>/.ssh`;

export const bashCodeSnippet11 = `ssh -i ~/.ssh/<private_key_name> <your_username>@<your_droplet_ip>`;

export const codeOutput7 = `To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

<your_username>@<your_hostname>:~$`;

export const bashCodeSnippet12 = `sudo ls /root`;

export const bashCodeSnippet13 = `sudo nano /etc/ssh/sshd_config`;

export const fileContentSnippet1 = `PermitRootLogin no
PasswordAuthentication no`;

export const bashCodeSnippet14 = `sudo systemctl restart ssh`;

export const bashCodeSnippet15 = `exit`;

export const bashCodeSnippet16 = `ssh -i ~/.ssh/<private_key_name> root@<your_droplet_ip>`;

export const codeOutput8 = `# Scenario A: Standard rejection
Permission denied (publickey).

# Scenario B: If you have many SSH keys on your computer
Received disconnect from <your_droplet_ip> port 22:2: Too many authentication failures`;

export const bashCodeSnippet17 = `sudo grep -r "PasswordAuthentication" /etc/ssh/sshd_config.d/`;

export const codeOutput9 = `/etc/ssh/sshd_config.d/50-cloud-init.conf:PasswordAuthentication no
/etc/ssh/sshd_config.d/60-cloudimg-settings.conf:PasswordAuthentication no`;

export const bashCodeSnippet18 = `nano ~/.ssh/config`;

export const fileContentSnippet2 = `Host my-website
    HostName <your_droplet_ip>
    User <your_username>
    IdentityFile ~/.ssh/<private_key_name>
    IdentitiesOnly yes`;

export const bashCodeSnippet19 = `ssh -i ~/.ssh/<private_key_name> <your_username>@<your_droplet_ip>`;

export const bashCodeSnippet20 = `ssh my-website`;
