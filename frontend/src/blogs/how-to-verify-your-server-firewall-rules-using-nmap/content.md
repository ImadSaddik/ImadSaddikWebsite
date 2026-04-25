---
title: "How to verify your server firewall rules using nmap"
subtitle: "Scan your server from the outside to ensure only the right ports are exposed to the public internet."
date: "April 25, 2026"
tags: ["Security", "Nmap", "Firewall", "Networking", "DevOps"]
---

## Introduction

Securing your server from the inside using firewalls (like UFW) and SSH keys is a great start. But how do you know if your defenses actually work? The best way to find out is to attack your own server.

Checking your firewall rules from inside the server provides a good baseline, but scanning it from the outside is the only way to know the truth. This process simulates an attacker's perspective, revealing exactly which ports are exposed to the public internet.

## Scan the server from the outside

To properly verify your exposed ports, use [nmap](https://nmap.org/), an industry-standard network scanning tool.

::: warning
Run the following command **from your local machine**, not from your remote server. If you do not have it installed locally, you can get it via `sudo apt install nmap` (Linux) or `brew install nmap` (macOS).

If you use a [Content Delivery Network (CDN)](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) like Cloudflare, you must scan your server's direct public IP address, not your domain name. If you scan your domain, you are just scanning Cloudflare's edge firewalls and will get invalid results!
:::

```bash
nmap -F <your_server_ip>
```

The `-F` flag runs a "Fast" scan, checking only the 100 most common network ports instead of all 65,535.

If your server is properly secured, the output should look exactly like this:

```output
Starting Nmap 7.95 ( https://nmap.org ) at 2025-10-31 21:39 +01
Nmap scan report for <your_server_ip>
Host is up (0.051s latency).
Not shown: 97 filtered tcp ports (no-response)
PORT      STATE SERVICE
22/tcp    open  ssh
80/tcp    open  http
443/tcp   open  https

Nmap done: 1 IP address (1 host up) scanned in 2.38 seconds
```

Here is how to interpret your security report:

- **`Host is up`**: Your server is online and responding to basic network routing.
- **`PORT 22, 80, 443`**: Only the absolute minimum required ports are open; SSH for your remote access, and HTTP/HTTPS for web traffic.
- **`Not shown: 97 filtered tcp ports`**: This is the proof that your setup works. It means your firewall successfully blocked connection attempts to every other port on the list.

::: info Filtered vs. Closed
Notice that nmap says your other 97 ports are **filtered**, not **closed**. What is the difference?

If your server had no firewall and a port had no service listening on it, the server would actively reject nmap's scan by sending an `RST` (Reset) packet back. Nmap would label this port as `closed`.

However, a well-configured firewall is set to "drop" (deny) unauthorized traffic by default. It acts like a black hole, receiving nmap's probe and completely ignoring it. Nmap waits for a response, eventually times out, and labels the port as `filtered`. This "stealth" behavior is exactly what you want, as it gives attackers zero information about your system.
:::

This result confirms that even if you have internal services running (like a backend API on port `8000` or a database on port `5432`), no one can access them directly from the internet. They are perfectly insulated behind your firewall rules.

::: tip
Want to verify a specific internal service? You can use the `-p` flag to target an exact port. For example, running `nmap -p 8000 <your_server_ip>` will explicitly confirm whether your backend is successfully hidden from the outside world.
:::

## Conclusion

Your server's perimeter is now thoroughly tested against external vulnerabilities. Taking the time to verify your firewall rules with tools like `nmap` ensures your internal databases, caching layers, and background services remain hidden from the outside world.
