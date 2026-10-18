---
title: "How to safely open temporary firewall ports for local development on Linux"
subtitle: "Keep your local development workflow smooth without turning your UFW firewall into an abandoned graveyard of open ports."
date: "October 18, 2026"
tags: ["Linux", "UFW", "Firewall", "Web development", "Security", "Bash"]
---

## Introduction

When developing full-stack web applications, you regularly need to test your work across multiple devices on your local network. Maybe you are checking how a responsive layout behaves on an actual mobile device, or maybe you need to share a quick live preview with someone else on the same Wi-Fi.

If you have an active software firewall like UFW running on your Linux laptop, other devices on your Wi-Fi can't connect to your local services by default. To let them in, you bind your server to all network interfaces using `0.0.0.0` (like passing `--host` to Vite or `--bind 0.0.0.0` to Python), and then you punch a hole through your firewall:

```bash
sudo ufw allow 5173/tcp
```

Your mobile browser connects, everything works, and you move on with your day.

The problem is what happens afterward. Days or weeks later, you check your firewall rules:

```bash
sudo ufw status
```

```output
Status: active

To                         Action      From
--                         ------      ----
5173/tcp                   ALLOW       Anywhere
3000/tcp                   ALLOW       Anywhere
8080/tcp                   ALLOW       Anywhere
2000/tcp                   ALLOW       Anywhere
6379/tcp                   ALLOW       Anywhere
6999/tcp                   ALLOW       Anywhere
```

Your firewall has quietly become a graveyard of forgotten rules. While these ports are typically shielded from the public internet by your home [router's NAT boundary](https://en.wikipedia.org/wiki/Network_address_translation), they remain wide open to anyone sharing your local network. If you take your laptop to a coffee shop, an office, or an airport, any process binding to that port is immediately exposed to unknown peers on that subnet.

In this guide, you will learn how to properly manage development ports in UFW. You will start by labeling temporary rules so they remain easy to identify. Then, you will automate their cleanup when your dev process exits or when your computer shuts down.

::: info Is UFW active on your machine?
On desktop distributions like Ubuntu, UFW comes preinstalled, but it is inactive by default. If your firewall is inactive, local devices can already connect to any service bound to `0.0.0.0` without opening ports.

You can verify whether your firewall is running with this command:

```bash
sudo ufw status
```

If the status reports `Status: inactive`, your system is not filtering inbound connections. This guide specifically applies if your firewall is active and you want to keep it secure while developing.
:::
