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
