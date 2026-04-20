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
