---
title: "Full-stack web deployment from scratch"
subtitle: "Learn how to deploy, secure, automate, and maintain a full-stack web application on Linux from scratch."
date: "October 11, 2026"
tags:
  [
    "Deployment",
    "DevOps",
    "Linux",
    "Ubuntu",
    "Nginx",
    "FastAPI",
    "Vue.js",
    "DigitalOcean",
    "Cloudflare",
    "GitHub Actions",
    "Python",
    "Meilisearch",
    "Security",
  ]
---

## Course overview

In this comprehensive 10-hour course, you will learn how to take a web application that you developed locally and deploy it to a production Linux server from scratch. The course follows the philosophy of doing things manually before automating them. Doing each step by hand first helps you understand why automation exists and shows you what happens under the hood.

We deploy a complete full-stack web application with a [FastAPI](https://fastapi.tiangolo.com/) backend, a [Vue.js](https://vuejs.org/) frontend, and a self-hosted [Meilisearch](https://www.meilisearch.com/) search engine.

Across six in-depth modules, you will learn:

- How to rent and configure a cloud server on [DigitalOcean](https://www.digitalocean.com/) running [Ubuntu](https://ubuntu.com/), create Ed25519 [SSH](https://en.wikipedia.org/wiki/Secure_Shell) keys, disable root login and password authentication, and configure a dedicated non-root user.
- How to lock down network access using [UFW](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) (Uncomplicated Firewall) and automatically ban malicious brute-force attempts with [Fail2ban](https://www.fail2ban.org/).
- How to transfer code to the server, install [Python](https://www.python.org/) and [Node.js](https://nodejs.org/) via [NVM](https://github.com/nvm-sh/nvm) and [pnpm](https://pnpm.io/), and set up swap memory to prevent out-of-memory build failures on low-resource machines.
- How to preview your application securely through SSH tunneling before opening external ports.
- How to run backend services with [Gunicorn](https://gunicorn.org/) and [Uvicorn](https://uvicorn.dev/), manage processes with [Supervisor](http://supervisord.org/), diagnose orphaned zombie processes, and communicate over Unix domain sockets.
- How to self-host and manage Meilisearch as a `systemd` service, write automated bash backup routines, and securely connect to its administrative dashboard via SSH tunneling.
- How to register custom domains, configure DNS records, and automate [Let's Encrypt](https://letsencrypt.org/) SSL/TLS certificate renewals for HTTPS.
- How to configure [Nginx](https://nginx.org/) as a reverse proxy, set up Content Security Policy (CSP) and HTTP security headers, and use [Cloudflare](https://www.cloudflare.com/) CDN for global edge caching and latency reduction.
- How to establish Git branch protection rules, run linting and code checks with pre-commit hooks, and automate testing and deployment through [GitHub Actions](https://github.com/features/actions) CI/CD workflows.
- How to monitor server metrics in real time with [Btop](https://github.com/aristocratos/btop), analyze access logs with [GoAccess](https://goaccess.io/), ban abusive bots, and stress-test your server using [Locust](https://locust.io/).

All course materials, code, and book chapters are available on my [GitHub repository](https://github.com/ImadSaddik/FullStackDeploymentHandbook).

## Watch the course

I believe knowledge should be free, so I am sharing this course for free on the freeCodeCamp YouTube channel. You can watch the full course below.

::: youtube [https://www.youtube.com/embed/wY5pQOTsGaA](https://www.youtube.com/embed/wY5pQOTsGaA)
:::

Creating courses like this takes months of research, experiments, designing illustrations, recording, and more.
If you want to support my mission to share free knowledge, you can [sponsor me on GitHub](https://github.com/sponsors/ImadSaddik), [support me on Patreon](https://www.patreon.com/3CodeCamp), or [donate via PayPal](https://www.paypal.com/paypalme/ImadSaddik).
