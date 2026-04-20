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
