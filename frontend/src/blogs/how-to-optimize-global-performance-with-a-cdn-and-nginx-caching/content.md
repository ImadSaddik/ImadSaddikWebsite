---
title: "How to optimize global performance with a CDN and Nginx caching"
subtitle: "Learn how to use Cloudflare to globally distribute your frontend and configure Nginx to implement aggressive caching for Single Page Applications."
date: "April 20, 2026"
tags: ["CDN", "Cloudflare", "Nginx", "Caching", "Performance"]
---

## Introduction

Physical distance creates unavoidable latency. If your server is located in [Meknès](https://en.wikipedia.org/wiki/Meknes), Morocco, a user in [Oujda](https://en.wikipedia.org/wiki/Oujda) will see your site load in milliseconds. But when a user in Sydney, Australia, or Beijing, China, tries to access it, the request has to travel through [fiber-optic cables](https://en.wikipedia.org/wiki/Fiber-optic_cable) across oceans and continents.

To visualize this, I used the [Free Website Uptime Test](https://www.uptrends.com/tools/uptime) by [Uptrends](https://www.uptrends.com/) to check how fast different cities can connect to the server. The results clearly show the impact of physical distance.

::: image ./1_latency_before_cloudflare.png "Latency test results before enabling Cloudflare"
Latency test results showing fast connections nearby (0.1s) but high delays in Beijing (3.9s) and other places.
:::

Since the server is local, a nearby user sees the site load almost instantly. However, a user in Beijing has to wait for the signal to travel halfway around the world. In the specific test shown above, this trip took over 3.9 seconds.

While actual times will fluctuate depending on network conditions and exact locations, the long physical distance alone means distant users can expect a slower experience.

To solve this, you need a [Content Delivery Network (CDN)](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/). A CDN sits between your users and your server. It caches your static files (like your built HTML, CSS, and images) on thousands of [edge servers](https://www.akamai.com/glossary/what-is-an-edge-server) (servers placed on the outer edges of the network, physically close to the users) worldwide. When a user in Sydney visits your site, they download the frontend from a server in Australia or nearby, not all the way from Morocco.

::: image ./2_before_and_after_cdn.png "A two-part diagram comparing network routing on a world map."
Notice how the edge servers intercept the traffic. By serving files locally, the long trip across the globe is bypassed, dropping the user's wait time down to just a fraction of a second.
:::

In this article, you will integrate [Cloudflare](https://www.cloudflare.com/) to globally distribute your frontend. You will also configure Nginx to implement aggressive caching strategies for your [Single Page Application (SPA)](https://developer.mozilla.org/en-US/docs/Glossary/SPA).

Prefer video? Watch the video tutorial:

::: youtube [https://www.youtube.com/embed/Z_rh9YbwETM](https://www.youtube.com/embed/Z_rh9YbwETM)
:::

::: info
Platforms like Cloudflare, Porkbun, and others frequently update their dashboards. While the specific buttons or layouts in these screenshots might drift over time, the underlying technical concepts, such as DNS propagation, nameserver updates, and SSL configuration, remain identical.
:::

## Set up Cloudflare

Cloudflare is one of the most popular CDNs in the world. It acts as both a CDN and a highly secure DNS provider. Best of all, it offers a generous free tier that is perfect for personal websites and side projects.

Start by creating a free account on Cloudflare. After registration, you should land on a page prompting you to add your domain. If you do not see this page, click on the **Add** button in the dashboard and select **Connect a domain**.

::: image ./3_access_connect_domain_cloudflare.png "An illustration showing how to access the Connect a domain page on Cloudflare"
After logging in, click on the "Add" button and select "Connect a domain" to start the setup process.
:::

On this screen, follow these steps:

1. **Enter your domain:** Type your domain name (e.g., `<your_domain>.com`) into the input box.
2. **DNS scan:** Leave "Quick scan for DNS records" checked. Cloudflare will automatically fetch the A and CNAME records you previously created with your domain registrar.
3. **AI crawlers:** You have the option to block AI companies from scraping your site. This is a personal choice and does not impact your site's performance.
4. **Click Continue:** This will take you to the plan selection screen.

::: image ./4_initial_domain_setup_cloudflare.png "An illustration showing the initial domain setup page on Cloudflare"
Add your domain name, block AI training bots, and allow Cloudflare to scan common DNS records.
:::

In the plan selection page, choose the **Free** plan. It includes everything you need for a personal website.

::: image ./5_select_free_plan_cloudflare.png "An illustration showing the plan selection page on Cloudflare"
Select the Free plan, which is sufficient for personal websites and side projects.
:::

### Review and proxy your DNS records

The next screen is very important. Cloudflare will list the DNS records it found. You need to verify their proxy status.

- **Web traffic (A and CNAME records):** Ensure the proxy status is toggled on. You should see an **orange cloud**. This tells Cloudflare to intercept the traffic, cache your files, and hide your server's real IP address from the public.
- **Email traffic (MX and TXT records):** If you have records for email, they must be set to "DNS only". Cloudflare proxies HTTP and HTTPS web traffic, not email traffic. If you proxy your mail records, your email will stop working.

Finally, look for the **NS (Nameserver)** records pointing to your domain registrar (e.g., `porkbun.com`). You must delete these from the list because you are about to replace them.

::: image ./6_review_dns_records_cloudflare.png "An illustration showing the DNS records review page on Cloudflare"
Review the DNS records. Make sure your A and CNAME records are proxied (orange cloud), and delete any NS records pointing to your old registrar.
:::

### Hand over DNS authority

To make Cloudflare your CDN, you must hand over control of your DNS routing. Cloudflare will provide you with two new nameservers (for example, `paige.ns.cloudflare.com` and `yevgen.ns.cloudflare.com`).

To do this, head over to your domain registrar's dashboard and locate your domain. Hover over it and click the **NS** label (or equivalent setting) to open your nameserver settings. A popup will appear showing the default nameservers. Go ahead and delete all of them.

Next, paste the two new Cloudflare nameservers you just received, making sure you put each one on a separate line. Finally, hit **Submit** to apply your changes.

::: image ./7_change_nameservers_porkbun.png "An illustration showing how to change the nameservers on your registrar"
Delete the old nameservers and replace them with the new ones provided by Cloudflare.
:::

Return to the Cloudflare dashboard and click **Continue**.

::: image ./8_continue_after_nameservers_cloudflare.png "An illustration showing the continue button after changing nameservers on Cloudflare"
After updating the nameservers, click "Continue" to let Cloudflare verify the changes.
:::

You will arrive at the overview page. Click the **Check nameservers now** button. DNS changes take time to propagate across the internet. This process usually finishes in a few minutes, but it can occasionally take up to an hour.

::: image ./9_check_nameservers_cloudflare.png "An illustration showing the nameservers check page on Cloudflare"
Click "Check nameservers now" to verify that Cloudflare has taken control of your DNS. This may take a few minutes to complete.
:::

## Configure SSL/TLS encryption mode

While you wait for the nameservers to propagate, you must configure Cloudflare's encryption mode.

::: warning Important
**Do not skip this step!** If you forget to do this, your website will get stuck in an infinite loop and crash with a [Too Many Redirects](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/) error.
:::

In the Cloudflare dashboard, locate **SSL/TLS** in the left sidebar and click on **Overview**.

::: image ./10_access_ssl_tls_cloudflare.png "An illustration showing how to access the SSL/TLS settings on Cloudflare"
Click on "SSL/TLS" in the left sidebar, then select "Overview" to access the encryption settings.
:::

On this page, you will see a few different encryption modes. Select the **Full (strict)** option.

::: image ./11_select_full_strict_cloudflare.png "An illustration showing the SSL/TLS encryption mode options on Cloudflare"
Choose the "Full (strict)" encryption mode to ensure end-to-end encryption between users, Cloudflare, and your origin server.
:::

**Why Full (strict)?** This assumes you already have a valid SSL certificate (like [Let's Encrypt](https://letsencrypt.org/)) installed on your origin server.

This strict setting tells Cloudflare to encrypt the connection from the user's browser to Cloudflare, and then strictly verify your origin server's certificate before passing the traffic along. It guarantees true end-to-end encryption.

### Verify the DNS switch

Before moving on, you should confirm that the internet sees your new nameservers. You can verify this directly from your local terminal using the [dig command](<https://en.wikipedia.org/wiki/Dig_(command)>).

```bash
dig +short NS <your_domain>.com
```

If the propagation is complete, you will see your new Cloudflare nameservers in the output:

```output
paige.ns.cloudflare.com.
yevgen.ns.cloudflare.com.
```

If you still see the old nameservers, wait a few more minutes and try again. Once you see the Cloudflare addresses, your traffic is officially flowing through their network.

Refresh the Cloudflare dashboard. You should see a green **Active** badge next to your domain, along with a "Great news!" message.

::: image ./12_active_status_cloudflare.png "An illustration showing the active status of the domain on Cloudflare"
Once the nameservers have propagated, you should see an "Active" status in the Cloudflare dashboard, confirming that your domain is now using Cloudflare's DNS and CDN services.
:::

If you want an extra check, you can also use the [whatsmydns.net](https://www.whatsmydns.net/) website to verify that the new nameservers are active globally. After visiting the website, enter your domain, select **NS** from the dropdown, and hit search. You should see your new Cloudflare nameservers appearing on the map.

::: image ./13_check_nameservers_whatsmydns.png "An illustration showing the global nameservers check on whatsmydns.net"
Use whatsmydns.net to verify that your new Cloudflare nameservers are active globally. You should see them appearing in multiple locations around the world.
:::

### Verify the speed

Now for the best part. Once everything is set, run the global speed test again to see the difference.

::: image ./14_latency_after_cloudflare.png "Latency test results after enabling Cloudflare"
The latency test results after enabling Cloudflare show a huge improvement, especially in distant locations like Beijing, which dropped from 3.9s to 1.5s.
:::

The improvement is massive:

- **Montreal:** Dropped from 0.6s to **0.4s**.
- **Tokyo:** Dropped from 1.3s to **0.3s**.
- **Seoul:** Dropped from 1.3s to **0.4s**.
- **Jakarta:** Dropped from 1.4s to **0.3s**.
- **Beijing:** Dropped from 3.9s to **1.5s**.

Your website now loads almost instantly for users all over the world.

## Restore visitor IPs at the server level

Now that traffic is routing through Cloudflare, a hidden issue arises. Both your Nginx logs and your application backend will see Cloudflare's IP address instead of the actual visitor's IP. This breaks your analytics and ruins any geolocation tracking.

Instead of writing complex backend code to extract the real IP from request headers, you can configure Nginx to unwrap the connection globally at the server level.

::: image ./15_cloudflare_real_ip.png "Diagram showing how Cloudflare masks the real IP"
By default, your backend only sees Cloudflare's IP. Configuring Nginx to read the CF-Connecting-IP header restores the true visitor IP.
:::

Create a new configuration file in Nginx's `conf.d` directory. Nginx automatically loads any file placed in this folder.

```bash
sudo nano /etc/nginx/conf.d/cloudflare.conf
```

Paste the following configuration. This tells Nginx to trust requests originating from Cloudflare's known IP ranges and to extract the real visitor's IP from the [CF-Connecting-IP](https://developers.cloudflare.com/fundamentals/reference/http-headers/#cf-connecting-ip) header.

```nginx
# Cloudflare IPv4 Ranges
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;

# Cloudflare IPv6 Ranges
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;

# Use the 'CF-Connecting-IP' header to get the real IP
real_ip_header CF-Connecting-IP;
```

::: info
Cloudflare occasionally updates their IP ranges. You can always find the most up-to-date lists at [https://www.cloudflare.com/ips/](https://www.cloudflare.com/ips/).
:::

### Verify the fix

To see the change in action, test and reload Nginx first:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Now, open your terminal and watch your access logs in real-time. Replace the placeholder with your domain name:

```bash
sudo tail -f /var/log/nginx/<your_domain>.com-access.log
```

While this command is running, open your website in your browser. Look at the first column of the logs that appear:

- **Before the fix:** You would see a Cloudflare IP address (like `172.70.240.61`) for every single request.
- **After the fix:** You should now see your own [ISP](https://en.wikipedia.org/wiki/Internet_service_provider)'s IP address.

Your Nginx logs and your application backend will now see the actual IP addresses of your users.

## Optimize Nginx caching for SPAs

Your CDN is active, but you need to tell it how to cache your files. By default, browsers and CDNs try to cache static assets to improve performance. However, for a Single Page Application (SPA) built with Vue, React, or another frontend framework, default caching behavior can cause massive headaches when you deploy updates.

If a browser caches your `index.html` file, a user visiting your site tomorrow might load the old version of the app. That old `index.html` will try to load old JavaScript files that you may have already deleted from the server during a deployment, resulting in a blank white screen.

To fix this, you must explicitly separate your caching logic into two rules:

- **Never cache the entry point (`index.html`).**
- **Cache the assets (`/assets/`) forever.**

Open your site's Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/<your_domain>.com
```

Find your existing `location /` block. You are going to replace it and expand it. Add the following blocks inside your secure (port 443) `server` block:

```nginx
# 1. Never cache the entry point
# The browser must always check the server for the latest version of the app.
location = /index.html {
    root /web_app/frontend/dist;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}

# 2. Cache assets forever
# Modern build tools add a unique hash to filenames in the /assets directory.
# If the code changes, the filename changes. Therefore, we can cache these heavily.
location /assets/ {
    root /web_app/frontend/dist;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# 3. Handle SPA routing (Fallback)
# If the request is not for a specific asset or index.html, fall back to index.html
location / {
    root /web_app/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

Here is what those specific caching headers mean:

```nginx
add_header Cache-Control "no-cache, no-store, must-revalidate";
```

- **no-cache, no-store:** Tells the browser and Cloudflare to never save a permanent copy of this file.
- **must-revalidate:** Forces the browser to connect to your server every single time to verify it has the absolute latest version before showing the page to the user.

```nginx
add_header Cache-Control "public, max-age=31536000, immutable";
```

- **public:** Allows anyone, including Cloudflare's edge servers, to cache the files.
- **max-age=31536000:** Tells the browser to keep the file in its cache for exactly one year (31,536,000 seconds).
- **immutable:** An instruction that tells the browser the file will never change. This stops the browser from even asking the server if the file is up to date, resulting in instant load times.

With this configuration, your users will always fetch the freshest `index.html` file upon navigating to your site, ensuring they get your latest features immediately, while the heavy lifting (downloading your compiled scripts, stylesheets, and images) is cached efficiently at the edge.

## Pros and cons

Before wrapping up, let's summarize what you gained and what you risked by adding this CDN layer.

### The benefits

- **Speed:** Your frontend loads instantly for users everywhere.
- **Security:** Cloudflare hides your real server IP and provides basic [DDoS](https://en.wikipedia.org/wiki/Denial-of-service_attack) protection.
- **Bandwidth:** It saves you money by serving images and scripts from their cache instead of your server.

### The downsides

- **Complexity:** You have introduced a middleman. If your site goes down, you now have to check if the issue is with your server or Cloudflare.
- **Dynamic latency:** While your frontend is fast, your backend API requests still need to travel the full distance to your server. Cloudflare cannot speed up the database query itself, only the network path to reach it.

## Conclusion

Your website is now globally distributed, fast, and protected by Cloudflare's network. You have successfully finished the performance setup!

By implementing a CDN, you ensure that your frontend loads instantly for users everywhere while saving bandwidth.

Combined with the proper Nginx caching strategies for your SPA, you've created a robust delivery layer that prevents common caching bugs while serving assets at lightning speed ::fa{fa-solid fa-bolt}::.
