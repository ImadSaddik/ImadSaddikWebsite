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
- **IPs vs. Domains**: Whenever you see `<your_server_ip>`, you can use your server's public IP address. However, if you have already pointed a registered domain name to your server, you can use your domain name instead.

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
If you already have a domain name, you can replace `<your_server_ip>` with your domain (e.g., `www.mywebsite.com`) right now. Otherwise, you can use your IP address and update this file later.
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

## Enable the site and update the firewall

Nginx uses a two-folder system. Configuration files are created in `sites-available`. To turn them on, you must create a [symbolic link](https://en.wikipedia.org/wiki/Symbolic_link) (a shortcut) to them in the `sites-enabled` folder.

First, delete the default placeholder page that comes with Nginx.

```bash
sudo rm /etc/nginx/sites-enabled/default
```

Now, enable your new configuration.

```bash
sudo ln -s /etc/nginx/sites-available/<your_project_name> /etc/nginx/sites-enabled/<your_project_name>
```

Always test your configuration before restarting the server. A single typo in an Nginx file will crash the entire web server.

```bash
sudo nginx -t
```

You should see an output confirming the syntax is ok and the test is successful.

```output
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

If you see an error, Nginx will tell you exactly which line has the problem. Go back and fix it.

If the test is successful, reload Nginx to apply the changes.

```bash
sudo systemctl reload nginx
```

::: info Why reload instead of restart?
Using `sudo systemctl reload nginx` is much safer for a live server than `restart`. A `restart` completely kills the Nginx service and starts it again, instantly dropping any active connections from your users.

A `reload`, however, tells Nginx to gracefully apply the new configuration to new connections while letting existing connections finish naturally, resulting in zero downtime.
:::

### Allow web traffic through the firewall

If your server is protected by a firewall like [UFW](https://www.digitalocean.com/community/tutorials/ufw-essentials-common-firewall-rules-and-commands) (which it should be), it is likely configured to block all incoming web traffic by default. You must now open the gates for HTTP and HTTPS traffic.

Nginx registers application profiles with UFW when it is installed. You can allow all standard web traffic by using the "Nginx Full" profile, which opens both port 80 (HTTP) and port 443 (HTTPS).

```bash
sudo ufw allow 'Nginx Full'
```

Verify that the rules were added correctly.

```bash
sudo ufw status
```

You should see both OpenSSH and Nginx Full in the active list.

```output
Status: active

To                         Action      From
--                         ------      ----
Nginx Full                 ALLOW       Anywhere
OpenSSH                    ALLOW       Anywhere
22/tcp                     ALLOW       Anywhere
Nginx Full (v6)            ALLOW       Anywhere (v6)
OpenSSH (v6)               ALLOW       Anywhere (v6)
22/tcp (v6)                ALLOW       Anywhere (v6)
```

### Test the deployment

Before adding complex security rules, you should verify that your basic configuration actually works.

Open a web browser on your local computer and enter your Server's IP address: `http://<your_server_ip>`. Your Vue.js frontend should load immediately. Now test a feature that makes an API call, like a search bar or a page that fetches data from the backend.

You will likely see the frontend render correctly but every API call return a [502 Bad Gateway](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/502) error if you haven't configured the backend socket permissions correctly.

If you run into this error, don't panic, it is one of the most common hurdles when setting up a reverse proxy. Let's look at why it happens and how to fix it.

#### Why you see a 502 Bad Gateway

Check the Nginx error log you configured earlier:

```bash
sudo cat /var/log/nginx/<your_project_name>-error.log
```

You will find a line like this:

```output
connect() to unix:/web_app/backend/gunicorn.sock failed (13: Permission denied)
```

Here is what is happening: If your backend process (like Gunicorn) was started under your personal user account, the `gunicorn.sock` file it creates is owned by your user. Nginx, however, runs as a completely separate system user called `www-data`. When Nginx tries to forward a request to the socket, Ubuntu's security model blocks it because `www-data` has no access to a file owned by someone else.

The frontend works because those are just static files in `/web_app/frontend/dist`, which Nginx can read directly. The API fails because it requires Nginx to write to your socket file.

#### Fix the socket permissions

The solution requires two steps: adding Nginx to your user group, and ensuring that group is allowed to open your folders.

First, add `www-data` (the Nginx user) to your personal user group. This gives Nginx group-level access without opening up your entire system.

```bash
sudo usermod -aG <your_username> www-data
```

Verify the change took effect by checking the members of your group:

```bash
getent group <your_username>
```

The output should show your group details with `www-data` listed at the very end:

```output
<your_username>:x:1000:www-data
```

Second, you must ensure that your group has "execute" permissions on your project folders. In Linux, execute permission (`x`) on a directory allows a user to pass through it.

If your parent folders do not have this permission for the group, Nginx will be blocked at the top level and will never reach the socket file inside, resulting in a 502 error.

Grant group execute permissions to your application folders to ensure Nginx can traverse them:

```bash
chmod g+x /web_app /web_app/backend
```

Now reload Nginx so it picks up the new group membership and permissions:

```bash
sudo systemctl reload nginx
```

Refresh your browser and test the API again. The 502 errors should be gone. Congratulations! Your Nginx reverse proxy is successfully serving the frontend and communicating with the FastAPI backend.

## Add security headers

Security does not stop at the firewall. Browsers have built-in security features, but they only activate if your server tells them to. You do this by adding [HTTP security headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html) to your Nginx configuration.

### Test your baseline security score

Before we add any code, let's see how your server currently performs. There are free tools that scan your website and grade your security headers.

Go to [SecurityHeaders.com](https://securityheaders.com/) or the [Mozilla HTTP Observatory](https://developer.mozilla.org/en-US/observatory) and enter your server's IP address or domain name.

::: info Note
If you haven't set up a domain name yet and are just using your server's bare IP address, make sure to use **SecurityHeaders.com**. The Mozilla HTTP Observatory requires a proper domain name to run its scans.
:::

Because you have a fresh Nginx installation with no headers configured, you will receive a failing grade like a D or an F.

::: image ./5_1_security_headers_before.png "A screenshot of a security header report showing a failing grade due to missing headers."
Scan results from [HTTP Observatory](https://developer.mozilla.org/en-US/observatory) showing a low score due to missing security headers.
:::

::: image ./5_2_security_headers_before.png "A screenshot of a security header report showing a failing grade due to missing headers."
Scan results from [SecurityHeaders.com](https://securityheaders.com/) showing a low score due to missing security headers.
:::

Keep that tab open. Let's fix that score. Add the following blocks inside your `server` block.

### HTTPS and transport

First, we want to ensure that browsers strictly use secure connections when talking to your server.

```nginx
# HSTS (2 Years)
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

**Strict-Transport-Security (HSTS)** forces the browser to always use HTTPS when talking to your site for the next two years (`max-age=63072000`).

::: info Note
Keep in mind that browsers only respect this header over secure connections. If you are currently testing on regular HTTP, it won't do anything, but it will automatically lock down your site once you enable [SSL](https://www.cloudflare.com/learning/ssl/what-is-ssl/).
:::

### Content and cross-origin protections

Next, you need to protect your website from malicious scripts and framing attacks.

```nginx
# CORP (Allow sharing)
add_header Cross-Origin-Resource-Policy "cross-origin" always;

# Anti-Clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;

# Stop MIME sniffing
add_header X-Content-Type-Options "nosniff" always;
```

Here is what these three headers do:

**Cross-Origin-Resource-Policy (CORP)** controls whether other websites can load resources like images from your server. Setting it to `cross-origin` allows your public assets to be shared securely across the web.

::: tip
If you don't want your images or other resources to be used on other sites, you can set this to `same-origin` instead to prevent hotlinking.
:::

**X-Frame-Options** prevents [clickjacking](https://en.wikipedia.org/wiki/Clickjacking). It stops attackers from putting your website inside an invisible `<iframe>` on their malicious site to trick users into clicking buttons they did not intend to click. By setting it to `SAMEORIGIN`, only your own domain can frame your content.

**X-Content-Type-Options** forces the browser to strictly trust the file type declared by the server. This prevents a common attack where a hacker uploads a malicious file (like a script) but disguises it as an image. With this header, the browser will refuse to execute it as code.

### Privacy and hardware features

Finally, you need to protect your users' privacy and lock down access to their physical hardware.

```nginx
# Privacy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Disable unused features
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
```

These two headers give you strict control over data and devices:

**Referrer-Policy** acts as a privacy shield. When a user clicks a link on your site that goes to an external website, their browser sends a "Referer" header to the new site. The `strict-origin-when-cross-origin` setting protects user privacy by only sending your root domain name, not the full URL path, to external sites.

**Permissions-Policy** acts as a hardware lock. By setting camera, microphone, geolocation, and payment to `()`, you explicitly disable these features. If a hacker somehow manages to run malicious code on your site, they still cannot access your users' webcams or microphones.

### Craft a content security policy (CSP)

The **Content-Security-Policy (CSP)** is your absolute strongest defense against [Cross-Site Scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting).

It acts as a strict whitelist. By default, a browser will download and execute any script a web page asks for. A CSP tells the browser exactly which domains are allowed to load scripts, styles, images, or frames. If a resource is not on the list, the browser blocks it.

You do not just write a CSP from scratch. It is an iterative process. Here is how you do it:

1. You block everything by setting `default-src 'none';`.
2. You open your website in your browser. It will look terrible because all CSS, JS, and images will be blocked.
3. You open the developer tools console in your browser. You will see a sea of red errors telling you exactly what was blocked and where it came from.
4. You add exceptions one by one based on the errors until your website functions normally.

Let's apply this process to your website. Open [Google Chrome](https://www.google.com/chrome/) and open the developer tools console (`Ctrl+Shift+I` or `Cmd+Option+I` on Mac). Go to the "Network" tab.

::: info
This guide uses Google Chrome because you can update the CSP in real-time without having to change your Nginx configuration and refresh the page repeatedly.
:::

::: image ./7_network_tab_chrome.jpg "An image showing the Chrome developer tools with the Network tab open."
On the left, you can see the Network tab. On the right, you can see the website.
:::

The network tab is empty, refresh the page to see all the resources your website is trying to load.

::: image ./8_network_tab_with_resources.jpg "An image showing the Chrome developer tools with the Network tab populated with resources."
The network tab is now populated with all the resources your website is trying to load.
:::

Now, right click on the first resource in the list and select "Show all overrides".

::: image ./9_show_all_overrides.png "An image showing how to find the "Show all overrides" option in the Chrome developer tools."
Select "Show all overrides" in the menu.
:::

This will open the "Overrides" tab, which allows you to edit the response headers in real-time. Click on "Select folder for overrides", create a new folder on your desktop, and select it.

::: image ./10_select_folder_for_overrides.png "An image showing how to select a folder for overrides in the Chrome developer tools."
Create a new folder on your desktop and select it for overrides.
:::

Now, go back to the Network tab. Right click on the first resource again and click on "Override headers". After you do that, Google Chrome will create a file called `.headers` in the folder you selected.

::: image ./11_override_headers.png "An image showing how to select "Override headers" in the Chrome developer tools."
Select "Override headers" in the menu and verify that a .headers file is created in your overrides folder.
:::

Before opening the `.headers` file, click on "Add header" and type `Content-Security-Policy` as the header name and `default-src 'none';` as the value. This is your starting point: a policy that blocks everything.

::: image ./12_add_csp_header.png "An image showing how to add a Content-Security-Policy header in the Chrome developer tools."
Add a Content-Security-Policy header with the value `default-src 'none';`.
:::

Now, click on the `.headers` file and change `Apply to` from whatever resource it is on to `*`. This tells Chrome to apply this CSP to every single resource on the page.

::: image ./13_apply_to_all_resources.png "An image showing how to change the "Apply to" setting for the overridden header in the Chrome developer tools."
Change the "Apply to" setting to `*` to apply the CSP to all resources on the page.
:::

Refresh the page. It will look completely broken because all resources are blocked.

::: image ./14_website_broken_due_to_csp.png "An image showing the website completely broken due to the strict CSP."
The website looks completely broken because all resources are blocked by the strict CSP.
:::

Open the console tab. You will see a sea of red errors. Each error tells you exactly what resource was blocked and where it came from.

::: image ./15_csp_errors_in_console.png "An image showing the console tab filled with CSP violation errors."
The console is filled with CSP violation errors, each showing what was blocked and where it came from.
:::

Let's start relaxing the policy by allowing everything from your own domain. This is done by adding `self` to the CSP.

```json
[
  {
    "applyTo": "*",
    "headers": [
      {
        "name": "Content-Security-Policy",
        "value": "default-src 'self';"
      }
    ]
  }
]
```

Now, refresh the page. You will see that some resources are now loading, but many are still blocked.

::: image ./16_website_partially_loading.png "An image showing the website partially loading after allowing 'self' in the CSP."
The website is partially loading after allowing 'self' in the CSP, but many resources are still blocked.
:::

You can also use `self` with font sources, image sources, and so on. Let's do that because that is an easy way to resolve many errors at once.

```json
[
  {
    "applyTo": "*",
    "headers": [
      {
        "name": "Content-Security-Policy",
        "value": "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; frame-src 'self';"
      }
    ]
  }
]
```

::: info
To learn more about the different types of sources (like `font-src`, `img-src`, `script-src`, etc.) and what they do, check out the [MDN documentation on CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).
:::

If you still see errors, this means you are using resources from third-party domains, like a CDN or an analytics provider. You need to add those domains to your CSP one by one until all errors are resolved and your website functions normally.

From the previous image, we can see that the browser was trying to load stylesheets from these domains:

- `cdnjs.cloudflare.com`
- `fonts.googleapis.com`

To allow your external fonts and icons to load, you need to add their domains to your `style-src` directive.

```json
[
  {
    "applyTo": "*",
    "headers": [
      {
        "name": "Content-Security-Policy",
        "value": "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com; connect-src 'self'; frame-src 'self';"
      }
    ]
  }
]
```

::: info
When you allow stylesheets from `fonts.googleapis.com` and `cdnjs.cloudflare.com`, those stylesheets will try to download the actual font files from `fonts.gstatic.com` and `cdnjs.cloudflare.com`.

You will see a new error for `font-src` after you apply this fix. You can get ahead of this by adding `https://fonts.gstatic.com` and `https://cdnjs.cloudflare.com` to your font-src directive right now.

```json
[
  {
    "applyTo": "*",
    "headers": [
      {
        "name": "Content-Security-Policy",
        "value": "default-src 'self'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self'; script-src 'self'; style-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com; connect-src 'self'; frame-src 'self';"
      }
    ]
  }
]
```

:::

Reload the page again. The errors for stylesheets and fonts should be gone, and your icons and fonts should be loading correctly. We have one final error to fix: inline styles and `SVG` images.

::: image ./17_remaining_csp_errors.png "An image showing the remaining CSP errors for inline styles and SVG images."
The remaining CSP errors are for inline styles and SVG images.
:::

To load `SVG` images, you need to add `data:` to your `img-src` directive. This allows images that are encoded directly in the HTML as base64 strings.

For inline styles, you need to add `'unsafe-inline'` to your `style-src` directive. This is not ideal but if your inline styles are not coming from user input, it is an acceptable risk.

::: warning
You should avoid using `'unsafe-inline'` if your website has any form fields that allow users to submit data. If you allow inline styles and a hacker manages to inject malicious code into your database, that code could be executed in the browsers of every user that visits the infected page.

Read more about this in the [Inline JavaScript](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP#inline_javascript) section on MDN.
:::

Here is your final CSP:

```json
[
  {
    "applyTo": "*",
    "headers": [
      {
        "name": "Content-Security-Policy",
        "value": "default-src 'self'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; connect-src 'self'; frame-src 'self';"
      }
    ]
  }
]
```

Now back on your server terminal, you need to add this header to your Nginx configuration. Open your Nginx config file again.

```bash
sudo nano /etc/nginx/sites-available/<your_project_name>
```

Add the `add_header Content-Security-Policy` line with the value of your final CSP inside the `server` block.

```nginx
add_header Content-Security-Policy "default-src 'self'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; connect-src 'self'; frame-src 'self'; upgrade-insecure-requests;" always;
```

I have added `upgrade-insecure-requests` to the end of the CSP. This tells browsers to automatically upgrade any HTTP requests to HTTPS.

Save the file and exit nano (`Ctrl+O`, `Enter`, `Ctrl+X`).

Test the Nginx configuration and reload the server.

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Now, if you refresh your website at `http://<your_server_ip>`, you should see zero errors in the console related to the CSP.

::: image ./18_csp_errors_resolved.png "An image showing a clean console with no CSP errors."
The console is now clean with no CSP errors.
:::

Visit [SecurityHeaders.com](https://securityheaders.com/) and enter your IP address again. Your grade should now be an A, the highest possible score.

::: image ./19_security_headers_after.png "A screenshot of a security header report showing an A grade after adding security headers."
Your server now receives an A grade after adding security headers.
:::

### The complete configuration

Your full Nginx configuration file should now look like this:

```nginx
upstream <your_project_name>_app_server {
    server unix:/web_app/backend/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name <your_server_ip>;

    access_log /var/log/nginx/<your_project_name>-access.log;
    error_log /var/log/nginx/<your_project_name>-error.log;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header Cross-Origin-Resource-Policy "cross-origin" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
    add_header Content-Security-Policy "default-src 'self'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; connect-src 'self'; frame-src 'self'; upgrade-insecure-requests;" always;

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
