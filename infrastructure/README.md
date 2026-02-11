# Production infrastructure

This directory contains the configuration files and scripts required to deploy and maintain the website on a production server (DigitalOcean).

## Directory structure

### [nginx/](./nginx/)

Contains Nginx server blocks and configuration snippets.

- `imadsaddik.com.conf`: The main site configuration. It handles SSL (via Certbot), proxies requests to Gunicorn (backend) and Vite (frontend), and serves static files.
- `cloudflare.conf`: Configuration to correctly handle real user IPs when the site is behind Cloudflare.
- `redirects.map.conf`: A map file for Nginx to handle URL redirects. This encapsulates all the redirect logic in one place, making it easier to manage and update without modifying the main server block.

> [!NOTE]
> The `.conf` extension is used in this repository to enable syntax highlighting via the [NGINX Configuration Language Support](https://marketplace.visualstudio.com/items?itemName=ahmadalli.vscode-nginx-conf) VS Code extension. In production, remove the `.conf` suffix (e.g., rename `imadsaddik.com.conf` to `imadsaddik.com`) so they are correctly included by Nginx.

### [scripts/](./scripts/)

Automation scripts for deployment and server maintenance.

- `gunicorn_start`: A script to start the FastAPI backend using Gunicorn with Uvicorn workers. It uses a Unix socket for communication with Nginx.
- `monthly_cleanup.sh`: Maintenance script to clean system caches, vacuum logs, and remove unnecessary build artifacts.
- `reload-nginx.sh`: A simple helper to test and reload the Nginx configuration.
- `clean_backups.sh`: Production-specific version of the backup cleaning script.

### [supervisor/](./supervisor/)

- `imadsaddik.conf`: Configuration for Supervisor to manage the Gunicorn process. It ensures the backend starts on boot and restarts automatically if it crashes.

### [systemd/](./systemd/)

- `meilisearch.service`: A systemd unit file to manage the Meilisearch service, ensuring it runs as a background daemon with the correct master key and data directory.

## Monthly maintenance checklist

The automated cleanup script (`monthly_cleanup.sh`) runs on the **1st of every month at 3:00 AM**. You should manually audit the server shortly after to ensure everything is healthy.

### Verify disk space

Ensure the automated cleanup actually freed up space.

```bash
df -h
# If usage is > 80%, investigate with:
# sudo ncdu /
```

### Check for kernel updates

The cleanup script removes old packages, but it does not reboot the server. Check if a security update requires a restart.

- **Action:** Log in via SSH.
- **Check:** Look for `System restart required` in the welcome message.
- **Command:** `sudo reboot` (if needed).

### Audit backups

Verify that the rolling backup strategy is keeping the last 5 files and deleting older ones.

```bash
ls -lh /web_app/backups
# Expectation: 5 recent .db files. Sizes should not be 0 bytes.
```

### Review security (Fail2Ban)

Check if any specific IP is aggressively attacking the server.

```bash
sudo fail2ban-client status sshd
# If an IP has thousands of bans, block it permanently:
# sudo ufw deny from <IP> to any
```

### Check Nginx logs

Make sure that log rotation is working and the disk isn't being filled by massive log files.

```bash
ls -lh /var/log/nginx/
# Expectation: Current logs + compressed .gz archives for previous days.
```
