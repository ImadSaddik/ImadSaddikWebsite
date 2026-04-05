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

## Secure the server with SSL (Certbot)

Your site is accessible via your domain, but it is currently running over unencrypted HTTP. You will use [Certbot](https://certbot.eff.org/) to obtain an SSL certificate from [Let's Encrypt](https://letsencrypt.org/).

Certbot is fantastic because it completely automates the complex parts: it proves you own the domain, downloads the certificate, and safely edits your Nginx configuration to enable HTTPS.

### Install Certbot

Connect to your server via SSH:

```bash
ssh <your_username>@<your_server_ip>
```

Install the Certbot client and its dedicated Nginx plugin using `apt`:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### Prepare Nginx

Before you run Certbot, you need to ensure Nginx is configured to recognize your new domain. Certbot reads your Nginx configuration files and looks for the `server_name` directive to know which site to secure.

Open the Nginx configuration file for your website. On standard Ubuntu setups, this is located in the `sites-available` directory. Use `nano` or your preferred text editor to open it:

```bash
sudo nano /etc/nginx/sites-available/<your_domain>
```

Find the `server_name` directive. If it currently contains your server's IP address, change it to match your new root domain and `www` subdomain:

```nginx
server_name <your_domain>.com www.<your_domain>.com;
```

Save and exit the file (`Ctrl+O`, `Enter`, `Ctrl+X`). Then, test the configuration to make sure there are no typos, and reload Nginx so it registers your new domain setup:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Obtain the certificate

Run the following command, making sure to replace the placeholders with your actual domain names. This command requests certificates for both your root domain and the `www` subdomain.

```bash
sudo certbot --nginx -d <your_domain>.com -d www.<your_domain>.com
```

Certbot will guide you through a quick interactive setup:

1. It will ask for an email address. This is used strictly for urgent security notices and renewal warnings if automation fails.
2. It will ask you to agree to the Terms of Service.
3. It will ask if you want to share your email with the Electronic Frontier Foundation (EFF) for news and research. Skip this if you want, it is not required.

Certbot will then communicate with the Let's Encrypt servers to complete a challenge verifying you control the domain. Once verified, you will see a success message:

```output
Deploying certificate
Successfully deployed certificate for <your_domain>.com to /etc/nginx/sites-enabled/<your_domain>
Successfully deployed certificate for www.<your_domain>.com to /etc/nginx/sites-enabled/<your_domain>
Congratulations! You have successfully enabled HTTPS on https://<your_domain>.com and https://www.<your_domain>.com
```

## Understand the Nginx changes

Certbot does more than just download your certificate. It automatically edits your Nginx configuration file to enforce the new secure connection.

I highly recommend taking a moment to understand exactly what Certbot changed. Open your configuration file to see the new layout:

```bash
sudo nano /etc/nginx/sites-available/<your_domain>
```

You will notice two big changes:

### The HTTPS upgrade

Your original `server` block, which used to `listen 80;`, has been upgraded. Certbot changed it to `listen 443 ssl;` and injected several lines pointing to the newly downloaded cryptographic keys.

```nginx
server {
    server_name <your_domain>.com www.<your_domain>.com;

    # ... (Your existing application routing configuration remains untouched) ...

    # Certbot added these lines to handle SSL encryption
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/<your_domain>.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/<your_domain>.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}
```

### The HTTP redirect

Because the block above now only listens on secure port 443, what happens if a user types `http://`?

Certbot anticipated this and created a new, separate `server` block at the bottom of the file specifically to catch insecure port 80 traffic and permanently redirect it ([HTTP status 301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/301)) to the secure version.

```nginx
server {
    if ($host = www.<your_domain>.com) {
        return 301 https://$host$request_uri;
    }

    if ($host = <your_domain>.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name <your_domain>.com www.<your_domain>.com;
    return 404;
}
```

Exit the file (`Ctrl+X`).

::: tip
By setting up SSL at the Nginx level, you are using a pattern called [SSL Termination](https://www.f5.com/glossary/ssl-termination).

This means Nginx handles all the complex encryption and decryption at the front door. Your application doesn't need to know anything about these certificates or handle HTTPS directly. Your architecture gracefully absorbs this major security upgrade with zero code changes required in your app.
:::

## Automate certificate renewal

Let's Encrypt certificates are highly secure, but they [expire every 90 days](https://letsencrypt.org/docs/faq/#what-is-the-lifetime-for-let-s-encrypt-certificates-for-how-long-are-they-valid). This short lifespan minimizes damage if a key is ever compromised.

Certbot automatically installs a background timer to check for renewals, but it is best practice to test this system and set up explicit automation so you never wake up to an expired certificate warning.

First, test that the renewal system works without modifying your live certificates:

```bash
sudo certbot renew --dry-run
```

If it works, you will see:

```output
Congratulations, all simulated renewals succeeded:
/etc/letsencrypt/live/<your_domain>.com/fullchain.pem (success)
```

### Explicit cron job

To guarantee you have control over the renewal schedule, you will use [cron](https://en.wikipedia.org/wiki/Cron), the Linux job scheduler.

Run this command to edit the `cron` file for the `root` user:

```bash
sudo crontab -e
```

If this is your first time, it will ask you to select an editor. Press `1` for [nano](https://www.nano-editor.org/). Add the following line to the very bottom of the file:

```text
0 0 * * 0 certbot renew --quiet
```

Here is how to read this cron expression: "At exactly midnight (`0 0`), every Sunday (`* * 0`), run the `certbot renew` command."

::: tip
You can use an online tool like [crontab.guru](https://crontab.guru/) to visualize and verify your cron schedule.
:::

The `--quiet` flag ensures it does not spam your system logs unless a critical error occurs. Certbot is smart; even though it checks every Sunday, it will only request a new certificate if your current one is expiring within the next 30 days.

### Create a post-renewal hook

There is one minor flaw in this automation. When Certbot downloads a fresh certificate, Nginx does not automatically notice. Nginx loads certificates into memory when it starts, so it will continue using the old, soon-to-be-expired certificate until the service is reloaded.

You can fix this by creating a "post-renewal hook". This is a script that Certbot will automatically trigger immediately after a successful renewal.

Create the script file:

```bash
sudo nano /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
```

Paste this bash command inside:

```bash
#!/bin/bash
systemctl reload nginx
```

Save and exit `nano` (`Ctrl+O`, `Enter`, `Ctrl+X`). Make the script executable so Certbot has permission to run it:

```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
```

Now, your server is entirely self-sustaining. It will fetch a new certificate before the 90 days are up, and it will instantly reload the web server to apply the new encryption keys. You can just kick back and enjoy your sleep.

## Conclusion

Your website is now successfully live on your custom domain and fully secure with an auto-renewing SSL certificate. By letting Nginx handle the SSL termination, your application remains simple while your users benefit from encrypted, secure connections.

However, there is one problem you cannot fix with server configuration alone: physical distance. Right now, if your server is located in Germany, a user in Australia will experience a slight delay because the data has to travel across the globe.

As a next step to improve your site's performance, consider exploring [Content Delivery Networks (CDNs)](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) like [Cloudflare](https://www.cloudflare.com/). A CDN will cache your static files on edge servers all around the world, ensuring your site loads quickly for users everywhere.
