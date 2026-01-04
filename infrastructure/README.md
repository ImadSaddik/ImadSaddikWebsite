# Production infrastructure

This directory contains the configuration files and scripts required to deploy and maintain the website on a production server (DigitalOcean).

## Directory structure

### [nginx/](./nginx/)

Contains Nginx server blocks and configuration snippets.

- `imadsaddik.com`: The main site configuration. It handles SSL (via Certbot), proxies requests to Gunicorn (backend) and Vite (frontend), and serves static files.
- `cloudflare.conf`: Configuration to correctly handle real user IPs when the site is behind Cloudflare.

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
