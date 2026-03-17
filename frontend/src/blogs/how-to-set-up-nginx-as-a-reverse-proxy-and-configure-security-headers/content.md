---
title: "How to set up Nginx as a reverse proxy and configure security headers"
subtitle: "Learn how to connect your frontend and backend, and apply security headers to protect your application."
date: "March 16, 2026"
tags: ["Nginx", "Reverse Proxy", "Security", "DevOps", "Vue.js", "FastAPI"]
---

## Introduction

When you deploy a modern web application, you typically have two main components: a backend API running in the background (listening on a [local port](<https://en.wikipedia.org/wiki/Port_(computer_networking)>) or a [Unix socket](https://en.wikipedia.org/wiki/Unix_domain_socket)) and a frontend consisting of built static files (HTML, CSS, and JavaScript).

While these components might be running perfectly on your server, they are isolated. Your users cannot access them directly from the outside internet. You need a front door for your server. This is where [Nginx](https://nginx.org/) comes in.

Nginx is an efficient web server. In this architecture, it will act as a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy). When a user types your domain name into their browser, the request hits Nginx first. Nginx then decides what to do with that request:

- If the user wants a web page, Nginx grabs the static HTML, CSS, and JS files from your frontend's `dist` folder and sends them back immediately.
- If the user action triggers an API call (like searching for an article), Nginx catches the request starting with `/api` and forwards it to your backend application.

::: image ./1_nginx_reverse_proxy.svg "Diagram illustrating Nginx as a reverse proxy, routing frontend requests to the Vue.js dist folder and backend API requests via a Unix socket to Gunicorn and Uvicorn, supervised by a process manager."
Nginx acts as a reverse proxy, routing frontend requests to the Vue.js dist folder and backend API requests via a Unix socket to Gunicorn.
:::

In this article, you will install Nginx, connect your frontend and backend, and apply security headers to protect your users from common web vulnerabilities.

::: info
This guide specifically demonstrates how to deploy a **Vue.js** frontend and a **FastAPI** backend (managed by **Gunicorn/Uvicorn** and **Supervisor**).

If you are using a different technology stack (such as React, Node.js, Django, or PM2), the core Nginx reverse proxy concepts and security headers taught here will still apply, and you can easily adapt them to your architecture.

However, if you are looking for an exact, copy-paste tutorial for a completely different stack, you may want to look for a guide tailored specifically to your tools!
:::

::: warning
Before you begin, please note that this guide uses placeholder values and example directory paths that you will need to adapt to your specific server environment:

- **Placeholders**: Throughout this guide, you will see text inside angle brackets like `<your_project_name>`, `<your_username>`, or `<your_server_ip>`. You must replace these with your actual values and **remove the brackets** when running the commands.
- **File paths**: This guide uses the directory `/web_app/` as an example for where your project code lives (e.g., `/web_app/frontend/dist` and `/web_app/backend/gunicorn.sock`). Be sure to replace these with the actual file paths on your server.

:::

## Update the application URLs

Before you configure Nginx, you need to prepare your code. You want your frontend and backend to act as if they live on the exact same server, both in local development and in production. This avoids complex [cross-origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS) issues.

### Update the frontend base URL

Open your `main.js` file or wherever you configure [Axios](https://axios-http.com/) in your Vue project. Set the `baseURL` to a relative path.

```javascript
// In main.js
import axios from "axios";

axios.defaults.baseURL = "/";
```

By doing this, the browser will automatically send requests to the current host. If you are developing locally, the request goes to your local server. If your user is on your production website, the request goes to your production domain.

### Configure Vite proxy for local development

Because you set the base URL to `/`, your local Vue development server will try to handle API requests itself. You need to tell Vite to forward these requests to your local FastAPI server.

Update your `vite.config.js` to include a [proxy rule](https://vite.dev/config/server-options#server-proxy).

```javascript
...

export default defineConfig({
  ...

  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
```

This setup perfectly mimics how Nginx will work in production.

::: info Note
The `...` in the code snippet means you should keep the existing configuration and just add the `server` block.
:::

::: image ./2_vite_nginx_proxies.svg "Diagram showing how Vite's development server proxies API requests to the local FastAPI server, while in production Nginx will handle the proxying."
In development, Vite's dev server proxies API requests to the local FastAPI server. In production, Nginx will handle the proxying.
:::

### Remove backend CORS

Because your frontend and backend now share the exact same origin in both development and production, the browser will no longer block your requests.

You can completely remove `CORSMiddleware` from your FastAPI `main.py` file.

```python
# Remove this entire block from main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rebuild the frontend

Because Vue.js is a static framework, these changes do not happen automatically. You must rebuild the project to bake the new URL into the [minified JavaScript](https://www.cloudflare.com/learning/performance/why-minify-javascript-code/) files.

Navigate to your frontend folder and run the build command.

```bash
cd /web_app/frontend
pnpm run build
```

If your server has low RAM (like a $4/month VPS), the build process might crash due to [out-of-memory](https://en.wikipedia.org/wiki/Out_of_memory) errors. You can prevent this by passing a memory limit flag to Node.js:

```bash
NODE_OPTIONS="--max-old-space-size=2048" pnpm run build
```

## Install and configure Nginx

Now that the application code is ready, install Nginx.

```bash
sudo apt install nginx -y
```

Nginx uses [configuration files](https://nginx.org/en/docs/beginners_guide.html#conf_structure) to know how to route traffic. Create a new configuration file for your website in the `sites-available` directory.

```bash
sudo nano /etc/nginx/sites-available/<your_project_name>
```

You are going to build this file block by block to understand exactly what each part does.

### The upstream block

The first thing you need to define is where your backend lives. You do this using an `upstream` block. This block points Nginx to the Unix socket file created by your backend process (like `Gunicorn`).

Paste this at the top of the file:

```nginx
upstream <your_project_name>_app_server {
    server unix:/web_app/backend/gunicorn.sock fail_timeout=0;
}
```

This acts as a variable. Later in the configuration, instead of typing the long path to the socket, you will tell Nginx to send traffic to `<your_project_name>_app_server`.

`fail_timeout=0` is an important setting. It tells Nginx to never mark the backend as "down" even if it fails to respond. If you are using a process manager (like [systemd](https://systemd.io/), [Supervisor](https://supervisord.org/), or [PM2](https://pm2.keymetrics.io/)) that automatically restarts your backend if it crashes, this setting allows Nginx to resume sending traffic the moment the service is back online, preventing unnecessary downtime.

### The server block

Next, you define the main `server` block. This tells Nginx to listen for incoming web traffic on port 80 (standard `HTTP`) and to respond when someone asks for your specific domain.

```nginx
server {
    listen 80;
    server_name <your_server_ip>;

    access_log /var/log/nginx/<your_project_name>-access.log;
    error_log /var/log/nginx/<your_project_name>-error.log;
}
```

Setting up dedicated `access_log` and `error_log` files is very important. If something breaks, these files will tell you exactly what went wrong.

::: info Note
After creating a domain name we will come back to this file and replace `<your_server_ip>` with your domain (e.g., `www.mywebsite.com`).
:::

### Serve the frontend

Inside the `server` block, you need to tell Nginx how to handle regular traffic. You want it to serve your built Vue.js files.

Add this `location /` block inside your `server` block:

```nginx
location / {
    root /web_app/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

Here is how this works:

- `root`: Tells Nginx where to look for files. In this case, it points to the `dist` folder of your Vue.js frontend, which contains the final HTML, CSS, and JS files after the build process.
- `try_files`: This is important for [Single Page Applications](https://developer.mozilla.org/en-US/docs/Glossary/SPA) (SPAs) like Vue.js. It tells Nginx: "Try to find the exact file the user asked for (`$uri`). If it is not there, try a directory (`$uri/`). If neither exists, do not show a 404 error. Instead, return `index.html`." This allows Vue Router to take over and show the correct page or your custom 404 component.

### Proxy the backend

Now, you need a rule for your API. Add this `location /api` block right below the frontend block:

```nginx
location /api {
    proxy_pass http://<your_project_name>_app_server;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_redirect off;
}
```

This block catches any URL that starts with `/api`.

The `proxy_pass` directive hands the request over to your backend socket. The `proxy_set_header` lines are crucial. They take information about the real user (like their IP address) and pass it along. Without these headers, FastAPI would think every single request was coming from Nginx itself.

Finally, the `proxy_redirect off;` directive stops Nginx from interfering with backend redirects. Sometimes, your FastAPI code might tell the browser to redirect to another URL. If you leave Nginx to its default behavior, it might try to rewrite the `Location` header in that response, which can accidentally point your users to an internal server name instead of your public domain. Setting this to `off` tells Nginx to trust the redirect URLs exactly as FastAPI sends them.

::: warning
Be very careful with trailing slashes in your Nginx configuration.

First, use `location /api` instead of `location /api/`. If you leave the trailing slash on the location block, a request to exactly `/api` will trigger a 301 redirect. For API `POST` requests, this redirect can cause the browser to drop the JSON body, resulting in strange 405 or 422 errors in your backend.

Second, never add a trailing slash to the end of your `proxy_pass` URL (for example, `proxy_pass http://<your_project_name>_app_server/;`). If you add that slash, Nginx will chop `/api` out of the URL before sending it to FastAPI. Because your FastAPI code explicitly expects the `/api` prefix, your backend will return 404 Not Found errors for every single request.
:::

### Test your configuration safely (Optional)

Before you restart your real server, you might want to test how Nginx routes different URLs. Testing this directly on your server can be frustrating if you make a mistake and crash your live site.

You can use a free tool called [Nginx playground](https://nginx-playground.wizardzines.com/) to simulate your routing rules safely in your browser.

To use it, you need to wrap your server block in `events` and `http` blocks. The playground has a built-in testing backend running on port 7777 that echoes back exactly what it receives. Here is a simplified test template you can paste into the playground:

```nginx
events {}

http {
    server {
        listen 80;

        location / {
            return 200 "FRONTEND: Serving Vue.js files\n";
        }

        location /api {
            proxy_pass http://127.0.0.1:7777;
        }
    }
}
```

::: image ./3_nginx_playground_put_config.svg "An image showing where to put your Nginx configuration in the playground"
Paste your Nginx configuration into the playground to test it safely.
:::

In the command panel on the right side of the playground, you can simulate user requests using [curl](https://curl.se/).

::: info Note
Always use `http://localhost` in the playground's `curl` commands. The playground is completely disconnected from the internet for security. If you type your real domain name, the command will fail with a "Could not resolve host" error.
:::

Try running these two commands to see how your configuration handles them:

```bash
curl http://localhost/api
curl http://localhost/api/search
```

::: image ./4_nginx_playground_test_config.svg "An image showing where to put the curl commands and where to observe the output"
Put the `curl` commands into the first box, click on the `Run` button, and observe the output in the second box.
:::

This is a great way to verify your trailing slashes and proxy rules before applying them to your production server.

### How Ubuntu organizes Nginx

You might notice that the final configuration below does not have the `events {}` or `http {}` blocks that you used in the testing playground.

This is because Ubuntu uses a modular system for Nginx. There is a master configuration file located at `/etc/nginx/nginx.conf`. That master file already contains the `events` and `http` blocks required to start the server. At the very bottom of its `http` block, it has a special line that says `include /etc/nginx/sites-enabled/*;`.

You can verify this by printing the contents of the master file:

```bash
cat /etc/nginx/nginx.conf
```

You will see a large file print to your terminal, but if you look closely, the core structure looks exactly like this:

```nginx
user www-data;
worker_processes auto;
# ...

events {
    worker_connections 768;
}

http {
    # ... lots of global settings ...

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

There are three important things happening in this master file:

- `user www-data;`: This tells Nginx to run using the `www-data` user account.
- `events {}`: The mandatory events block is already defined globally, so you do not need to rewrite it for every website you host.
- `include /etc/nginx/sites-enabled/*;`: When Nginx starts up, it reads this master file, finds your custom project configuration inside the sites-enabled folder, and seamlessly pastes your code right here inside the http block.

This modular system keeps your project files clean and focused only on your specific routing rules.

### The complete Nginx configuration

Here is what your complete configuration file should look like:

```nginx
upstream <your_project_name>_app_server {
    server unix:/web_app/backend/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name <your_server_ip>;

    access_log /var/log/nginx/<your_project_name>-access.log;
    error_log /var/log/nginx/<your_project_name>-error.log;

    location / {
        root /web_app/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://<your_project_name>_app_server;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_redirect off;
    }
}
```

Save the file and exit nano (`Ctrl+O`, `Enter`, `Ctrl+X`).
