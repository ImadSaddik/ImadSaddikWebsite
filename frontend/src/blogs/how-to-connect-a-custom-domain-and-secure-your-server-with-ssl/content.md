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

## Configure DNS

Now that you own a domain, you must tell the rest of the internet where to find your server when someone types that name into their browser. This is achieved using the [Domain Name System (DNS)](https://en.wikipedia.org/wiki/Domain_Name_System).

Think of DNS as the phonebook of the internet. It translates human-readable names (like `imadsaddik.com`) into machine-readable IP addresses (like `142.93.130.134`).

::: image ./6_dns_resolution_illustration.svg "A diagram showing how DNS works"
A visual representation of how a browser queries a DNS server to resolve a domain name into an IP address before connecting.
:::

Go to your domain provider’s dashboard and locate the **DNS records** section for your domain. If you are using **Porkbun**, locate your domain in the list. You need to hover over the domain row to reveal the options. Click on the **DNS** link to open the configuration panel.

::: image ./7_click_on_dns_porkbun.jpg "Locating the DNS link on the Porkbun dashboard"
The quick-access DNS menu appears when you hover over the domain name in your dashboard.
:::

Scroll down to the “Current Records” section. You will see some default records created by the registrar, such as `ALIAS`, `CNAME`, or `_acme-challenge` records. **Delete these default records** to ensure they do not conflict with your real server.

::: image ./8_remove_unwanted_records.jpg "Deleting default records on Porkbun"
Click the trash can icon next to the default registrar records so you can start with a clean slate.
:::

You need to create two specific records to point your traffic to your server:

### The A record

An [A record](https://www.cloudflare.com/learning/dns/dns-records/dns-a-record/) (Address Record) maps a domain name directly to an [IPv4 address](https://en.wikipedia.org/wiki/IPv4).

Fill in the form with the following values:

- **Type:** `A`
- **Host/Name:** Leave this blank.
- **Answer/Value:** Paste the IP address of your server.
- **TTL (Time To Live):** `600` (or leave as default).

Click **Add** to save the record.

::: image ./9_add_a_record_to_dns.jpg "Adding an A record on Porkbun"
Follow these steps to create an A record that points your domain to your server's IP address.
:::

### The CNAME record

A [CNAME record](https://www.cloudflare.com/learning/dns/dns-records/dns-cname-record/) (Canonical Name Record) maps one domain name to another domain name. You use this to ensure that users who type `www` in front of your domain still reach your website.

Fill in the form with the following values:

- **Type:** `CNAME`
- **Host/Name:** `www`
- **Answer/Value:** `<your_domain>.com`

Click **Add** to save the record.

::: image ./10_add_cname_record_to_dns.jpg "Adding a CNAME record on Porkbun"
Follow these steps to create a CNAME record that points the `www` subdomain to your main domain, ensuring both versions of your site are accessible.
:::

By the end, your DNS configuration should look like this:

::: image ./11_final_dns_records_look.png "The final DNS configuration on Porkbun"
The completed DNS table showing the two newly added records.
:::

::: info
DNS changes can take anywhere from a few minutes to 48 hours to propagate globally. Usually, it takes less than 15 minutes. You can use a tool like [whatsmydns.net](https://www.whatsmydns.net/) to verify if the world can see your new A record.
:::

Once the DNS has propagated, you should be able to type `http://<your_domain>.com` in your browser and see your web application load.
