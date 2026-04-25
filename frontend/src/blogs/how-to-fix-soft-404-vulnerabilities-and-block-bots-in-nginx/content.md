---
title: "How to fix soft 404 vulnerabilities and block bots in Nginx"
subtitle: "Protect your server by returning hard 404 errors for sensitive files and preventing SPA fallback traps."
date: "April 20, 2026"
tags: ["Security", "Nginx", "Web server", "Soft 404", "SPA"]
---

## Introduction

Securing your server with a firewall, SSH keys, and HTTP headers is a great start. But how your web server handles bad requests is equally important. In this article, you will learn how to block malicious bots from reading sensitive files and prevent Single Page Application (SPA) fallback traps.

## The SPA fallback trap

When hosting a Single Page Application (like React, Vue, or Angular), it is standard practice to configure Nginx with a fallback routing block. This ensures that if a user refreshes a dynamic frontend route, the server doesn't throw an error, but instead loads the main app.

It usually looks something like this:

```nginx
location / {
    root /web_app/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

Because of how this `location /` block works, any request to a non-existent file on your server gets redirected to your `index.html`.

If a hacker or a malicious bot scans your server looking for sensitive files like `/.env`, `/.git/config`, or `/wp-login.php`, Nginx does not block them. Instead, it serves them your SPA's `index.html` file and returns a successful [HTTP 200 OK status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/200).

To a human, it looks like a "Page Not Found" screen rendered by your frontend router. To a bot or Google's search crawler, your server just said, "Yes, this `.env` file exists and here is the content!". This is known as a [Soft 404](https://developers.google.com/search/blog/2008/08/farewell-to-soft-404s), and it wastes your server's resources while severely confusing search engines.

::: image ./1_soft_404_trap.png "Diagram showing how Nginx routes a bad request to index.html resulting in a 200 OK, versus the secure setup which explicitly returns a 404 error."
The Soft 404 trap: Nginx fails to serve `.env` but takes the bot to `index.html`, resolving with a 200 HTTP status code. Bots will think they got access to the file and will keep hammering your web server.
:::

## Fix soft 404 vulnerabilities and block bots

You need to set a strict boundary. Nginx should block known malicious requests instantly, returning a hard [404 Not Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/404) or [403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/403), preventing them from ever reaching your frontend application.

Add these security blocks to your Nginx configuration, placing them **right above** your `location /` SPA fallback block:

```nginx
# Block files that bots try to access (like .env or .git)
# EXCEPTION: Allow .well-known for Certbot SSL renewals!
location ~ /\.(?!well-known).* {
    deny all;
    access_log off;
    log_not_found off;
    return 404;
}

# Immediately drop requests for PHP, backups, or CMS admin panels
location ~* \.(php|pl|py|jsp|asp|sh|cgi|bak|old|sql|conf|ini|zip|tar|gz)$|/(wp-admin|wp-includes|node_modules) {
    access_log off;
    log_not_found off;
    return 404;
}
```

If you are not familiar with [regular expressions](https://en.wikipedia.org/wiki/Regular_expression), here is how Nginx reads those location blocks:

- `~` tells Nginx to perform a case-sensitive regex match.
- `/\.` looks for a forward slash followed by a dot (meaning any hidden file or directory, like `/.env`).
- `(?!well-known)` is a [negative lookahead](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Lookahead_assertion). It tells Nginx to block the hidden file _unless_ the folder is exactly `/.well-known/`.
- `~*` tells Nginx to perform a case-insensitive regex match.
- `|` acts as an "OR" operator. It allows you to block multiple file extensions or specific directories (like `/wp-admin`) in a single rule.

::: info
Notice that the first block uses `/\.` while the second just uses `\.`.

- `/\.` (a slash followed by a dot) targets **hidden files or directories** (like `/.env`). It ensures the dot is the very first character after a directory path. If we didn't include the slash, Nginx would block every single file containing a dot anywhere in its name (like `index.html`), which is not what we want.
- `\.` (just a dot) targets **file extensions**. In the second block, we want to block specific file types (like `.php` or `.zip`) regardless of what comes before the dot, so the slash isn't needed.
  :::

Now that Nginx knows what to look for, it uses two directives to block the traffic:

- **`deny all;`** immediately drops the connection and returns a `403 Forbidden` status.
- **`return 404;`** explicitly forces the server to say "Page Not Found".

Notice the `access_log off;` and `log_not_found off;` lines inside those blocks. These are there to keep your server logs clean. Since bots scan these common URLs thousands of times a day, recording every single blocked attempt would just waste your disk space.

::: warning
The regex `\.(?!well-known).*` is important. If you block all dot-files, you will block the `/.well-known/acme-challenge/` directory. If you do that, Certbot will not be able to verify your domain, and your SSL certificates will fail to renew, breaking your site after 90 days. [Learn more about the /.well-known directory](https://en.wikipedia.org/wiki/Well-known_URI).
:::

Save the file and test your Nginx configuration:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Now, if you try to visit `https://<your_domain>.com/.env`, Nginx will instantly step in and return a raw server 404 error page.

::: image ./2_blocked_file_404.png "An illustration showing the raw 404 error page when trying to access a blocked file"
The raw Nginx 404 response.
:::

::: info Why a 404 and not a 403?
You might be wondering: If we explicitly wrote `deny all;` (which triggers a 403 Forbidden), why did the server return a 404 Not Found?

Unlike many scripts that read top-to-bottom, Nginx processes every HTTP request through **11 distinct phases** in a strict, pre-defined order.

- The `return` directive belongs to the **Rewrite phase** (Phase 4).
- The `deny` directive belongs to the **Access phase** (Phase 7).

Because the Rewrite phase happens earlier, Nginx hits the `return 404;`, drops the connection, and finishes the request before it ever reaches the security check in the Access phase.

**So why include both?** It is a "belt and suspenders" approach. If someone accidentally deletes or comments out the `return 404;` line in the future, the `deny all;` acts as a fallback to ensure the sensitive files remain protected.
:::

But if a user visits a broken link like `https://<your_domain>.com/broken-article`, Nginx will gracefully pass it to your frontend router, providing a good user experience.

::: image ./3_vue_router_404.png "An illustration showing the frontend router 404 page when visiting a non-existent route"
The fallback frontend 404 page. Because the file is not explicitly blocked by the new Nginx rules, the frontend application loads and handles the missing route gracefully.
:::

## Conclusion

By updating your Nginx rules, your web server now actively protects sensitive paths and preserves its own resources. Bots are stopped at the edge, server logs stay clean, and legitimate users still get the seamless SPA experience they expect when hitting broken links.
