# 1. The "Upstream" block
upstream imadsaddik_app_server {
    server unix:/web_app/backend/venv/run/gunicorn.sock fail_timeout=0;
}

# 2. HTTPS server block
server {
    # SSL Configuration (Managed by Certbot)
    listen 443 ssl;
    server_name imadsaddik.com www.imadsaddik.com;

    ssl_certificate /etc/letsencrypt/live/imadsaddik.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/imadsaddik.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Logs
    access_log /var/log/nginx/imadsaddik.com-access.log;
    error_log /var/log/nginx/imadsaddik.com-error.log;

    # --- Security layers ---

    # A. Block sensitive files
    location ~ /\.(?!well-known).* {
        deny all;
        access_log off;
        log_not_found off;
        return 404;
    }

    # B. Block common bot targets
    location ~* \.(php|pl|py|jsp|asp|sh|cgi|bak|old|sql|conf|ini|zip|tar|gz)$|/(wp-admin|wp-includes|node_modules) {
        return 404;
    }

    # --- Application routes ---

    # C. Resume PDF
    location = ~ ^/resume(\.pdf)?$ {
        alias /web_app/frontend/dist/imad_saddik.pdf;
        default_type application/pdf;
        add_header Content-Disposition "inline; filename=imad_saddik.pdf";
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # D. Secure analytics dashboard
    location = /analytics.html {
        root /web_app/frontend/dist;
        auth_basic "Restricted Area";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    # --- Caching & SPA routing ---

    # E. Never cache the entry point (index.html)
    location = /index.html {
        root /web_app/frontend/dist;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # F. Cache assets forever (Hashed files)
    location /assets/ {
        root /web_app/frontend/dist;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # G. Root static files (og-image, favicon, robots.txt)
    location ~* \.(ico|png|svg|xml|txt)$ {
        root /web_app/frontend/dist;
        try_files $uri =404;
        expires 1d;
        access_log off;
    }

    # H. Handle SPA routing (Fallback)
    location / {
        root /web_app/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # --- Backend proxy ---

    location /api/ {
        proxy_pass http://imadsaddik_app_server;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
    }
}

# 3. HTTP redirect block
server {
    if ($host = www.imadsaddik.com) {
        return 301 https://$host$request_uri;
    }

    if ($host = imadsaddik.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name imadsaddik.com www.imadsaddik.com;
    return 404;
}
