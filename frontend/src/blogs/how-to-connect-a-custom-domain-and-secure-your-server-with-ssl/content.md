---
title: "How to connect a custom domain and secure your server with SSL"
subtitle: "Learn how to register a domain, configure DNS records, and secure your site with a free Let's Encrypt SSL certificate."
date: "April 6, 2026"
tags: ["DNS", "SSL", "Let's Encrypt", "Certbot", "Nginx"]
---

## Introduction

When you deploy a web application, it is only accessible via a raw IP address. While this proves your server works, it is not user-friendly, and more importantly, it is not secure. Browsers will flag your website as "not secure" because traffic is sent in plain text using [HTTP](https://en.wikipedia.org/wiki/HTTP).

In this article, you will purchase a custom domain name, connect it to your server using [DNS records](https://www.cloudflare.com/learning/dns/dns-records/), and secure all traffic with free, auto-renewing [SSL certificates](https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/) via [Let's Encrypt](https://letsencrypt.org/).

Prefer video? Watch the video tutorial:

::: youtube [https://www.youtube.com/embed/SYt46WotV1w](https://www.youtube.com/embed/SYt46WotV1w)
:::

## Register a domain

To give your website a recognizable name, you need to register a domain. There are many domain registrars available, such as [Namecheap](https://www.namecheap.com/), or [GoDaddy](https://www.godaddy.com/fr). For this guide, I will use [Porkbun](https://porkbun.com/) as the example because of its transparent pricing, but the concepts apply everywhere.

Go to your registrar of choice and type your desired domain into the search bar.

Analyze the results. Pay close attention to the **renewal price**. Registrars often provide a steep discount for the first year, but the subsequent years might be surprisingly expensive. Always choose a domain with a sustainable renewal cost (around $10–$15 per year for a `.com`).

Once you find a domain that fits your budget, add it to your cart and proceed to checkout.

::: image ./1_find_domain_on_porkbun_inkscape.jpg "An illustration showing how to find a domain on Porkbun"
Type your desired domain into the search bar to see if it's available. Add it to your cart if it is.
:::

After adding the domain, click the cart icon in the top navigation bar to open the checkout page and review your order.

::: image ./2_purchasing_domain_porkbun.png "An illustration showing the checkout page on Porkbun"
This screen displays your shopping cart and the final order summary. Before continuing, verify that the total price is correct and that you have selected only the domain you intended to purchase.
:::

::: info
During checkout, companies will try to upsell you on extra features like email hosting, website builders, or premium DNS. You do not need any of these. You only need the domain name itself.
:::

You should see this success message after completing the purchase.

::: image ./3_success_page.png "An illustration showing the success message after purchasing a domain on Porkbun"
This screen confirms that your purchase was successful and that your new domain is now linked to your account.
:::

Now, navigate to your registrar's **Domain Management** dashboard.

::: image ./4_domain_management_button.jpg "An illustration showing how to access the domain management dashboard on Porkbun"
Click on "Account" and then "Domain Management" to access the dashboard where you can manage your domains.
:::

Once the page loads, verify that your new domain is active in your account.

::: image ./5_domain_management_dashboard.png "An illustration showing the domain management dashboard on Porkbun"
The Domain Management dashboard showing the newly registered domain ready for configuration.
:::
