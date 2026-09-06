---
title: "How to self-host Google Fonts with Fontsource to improve web performance"
subtitle: "Eliminate render-blocking font requests and protect user privacy by packaging fonts as standard npm dependencies."
date: "September 6, 2026"
tags: ["Web performance", "CSS", "Frontend", "Fonts", "Lighthouse"]
---

## Introduction

When adding custom typography to a website, the quickest path is an external CDN like [Google Fonts](https://fonts.google.com/). For years, I did this by copying an `@import` statement directly into my main stylesheet:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
```

It is convenient to set up, but external CSS imports carry hidden performance costs. While running a [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) audit on my website, I ran into this diagnostic warning:

```output
Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.
```

Lighthouse flagged that font `@import` as a render-blocking bottleneck. Because the browser had to pause and fetch external files before drawing anything on the screen, metrics like [First Contentful Paint](https://web.dev/articles/fcp) (FCP) and [Largest Contentful Paint](https://web.dev/articles/lcp) (LCP) suffered.

In this article, you will learn why hosted font CDNs slow down your site and how to self-host open-source fonts cleanly using [Fontsource](https://fontsource.org/).

## The hidden cost of third-party font CDNs

Relying on Google Fonts seems harmless at first. It is just one line of CSS, and Google has servers all around the world. However, that single `@import` triggers a chain of network requests that can noticeably delay your page rendering.

### The two-domain network delay

When a visitor loads your webpage, their browser reads your stylesheet line by line. The moment it encounters the `@import url(...)` rule pointing to Google Fonts, it cannot start rendering the page. Instead, it must make a series of requests across two separate third-party domains:

1. The browser pauses rendering and connects to `fonts.googleapis.com` to download the CSS file containing the font rules.
2. The browser reads that CSS file and sees that the actual font files live on a completely different domain: `fonts.gstatic.com`. It must then open a second connection to download the `.woff2` file.

::: image ./hosted_font_requests.svg "A user visits the site with an initially blank page; the browser analyzes the CSS, encounters an @import rule for fonts.googleapis.com, fetches the .woff2 font files from Google Fonts, and only then renders the final page content."
How an `@import` rule delays page rendering by fetching fonts from an external provider.
:::

On a fast fiber connection, these requests might take only 100 to 200 milliseconds. But on a mobile device or a poor cellular connection, that latency can easily jump to several hundred milliseconds or even seconds. During that time, your text either remains invisible ([Flash of Invisible Text](https://fonts.google.com/knowledge/glossary/foit)) or shifts abruptly once the font arrives ([Flash of Unstyled Text](https://fonts.google.com/knowledge/glossary/fout)), dragging down your First Contentful Paint (FCP) and Largest Contentful Paint (LCP) scores.

### Privacy and data transfer

Performance is not the only trade-off. Every time a browser requests a font from an external CDN, it sends the visitor's IP address and browser details to that third party.

In regions with strict privacy laws like the European Union under [GDPR](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation), loading assets from external servers without consent has already led to warnings and fines for website owners.

By hosting the fonts on your own server, you cut out all third-party tracking, protect your visitors' privacy, and keep your site compliant with privacy laws.

## Self-hosting fonts the hard way

If you want better performance and full privacy, consider self-hosting your fonts. This means storing the font files directly in your project and serving them from your own server.

In the past, self-hosting fonts was a tedious process. You had to:

1. Find and download raw `.woff2` or `.ttf` files from the web.
2. Download separate files for every font weight you needed (light, regular, medium, bold).
3. Place those files into your project's assets folder.
4. Manually write `@font-face` rules in your stylesheet for every single weight:

```css
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/inter-regular.woff2") format("woff2");
}

@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/inter-bold.woff2") format("woff2");
}
```

This manual process had several problems:

- **Updates are tedious:** When the font creator fixes bugs or updates character designs, you have to repeat the entire download and replacement process by hand.
- **Missing weights:** If your design calls for `font-weight: 600` and you forgot to download it, the browser tries to fake a bold version, making your text look blurry.
- **Language support:** For example, if you decide to localize your website into Arabic, you have to find a compatible font, make sure all necessary weights exist, download the files, and write another set of `@font-face` blocks.

Fortunately, modern tooling makes this entire process much easier.

## Modern self-hosting with Fontsource

To avoid managing font files and writing `@font-face` definitions by hand, you can use [Fontsource](https://fontsource.org/). It is an open-source project that packages typefaces, including the entire Google Fonts catalog, into standard npm dependencies.

Instead of manually downloading font files and configuring CSS rules, you install the font as a dependency using your package manager. Fontsource handles file organization, version pinning, and `@font-face` rules for you.

::: image ./self_hosted_font_pipeline.svg "A user visits the site with an initially blank page; the browser fetches the .woff2 font files directly from its own domain, rendering the content without any third-party requests."
Self-hosting serves fonts directly from your own domain, eliminating external network requests.
:::

### Variable fonts

When using Fontsource, install **variable font** packages whenever they are available. Standard fonts require separate files for each style (such as 400 for regular and 700 for bold). A variable font stores an entire range of weights (such as 100 to 900) in a single compact file.

This reduces the number of network requests and gives you total design flexibility across any weight without adding extra files to your project.

### Install the fonts

To demonstrate how easy it is to manage multiple fonts, let's look at an example where we use **Inter** for English and **Cairo** for Arabic. If your site only needs one font, you can install that single package.

Install both variable packages as development dependencies:

```bash
pnpm add -D @fontsource-variable/inter @fontsource-variable/cairo
```

::: info
If you don't have `pnpm` installed, you can use `npm` or `yarn` instead.
:::

### Import the font stylesheets

Next, replace your previous Google Fonts `@import` rules in your main stylesheet with the installed packages:

```css
@import "@fontsource-variable/inter";
@import "@fontsource-variable/cairo";
```

When you build your project, bundlers like Vite handle the rest. They copy the font files into your build folder, add unique cache hashes to the filenames, and create the `@font-face` rules for you.

When you run your build command (such as `pnpm build`), Vite bundles the CSS and copies the hashed font files directly into your production directory:

```output
dist/assets/inter-latin-wght-normal-Dx4kXJAl.woff2          48.25 kB
dist/assets/cairo-arabic-wght-normal-CJWMIGCx.woff2         30.89 kB
dist/assets/inter-cyrillic-wght-normal-DqGufNeO.woff2       18.74 kB
dist/assets/inter-greek-wght-normal-CkhJZR-_.woff2          18.99 kB
dist/assets/inter-vietnamese-wght-normal-CBcvBZtf.woff2     10.25 kB
```

### Apply the fonts in CSS

Now use the font families in your CSS rules:

```css
body {
  font-family: "Inter Variable", "Inter", sans-serif;
}

:lang(ar) {
  font-family: "Cairo Variable", "Cairo", sans-serif;
}
```

In this example setup, English text uses Inter by default, while any element with an Arabic language attribute (`lang="ar"`) switches to Cairo.

::: info Do visitors download every font file?
You might wonder if visitors have to download every font file right away.

They do not. Fontsource splits fonts into character subsets (like Latin and Arabic) using CSS [unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/unicode-range). Modern browsers only download a font file when characters from that subset appear on the page.

If your page contains only English text, the browser downloads the Latin files for Inter. It ignores Cairo until Arabic text appears on the screen.
:::

## Conclusion

Switching from a hosted font CDN to self-hosted fonts eliminates extra network round trips, speeds up initial page rendering, and keeps your visitors' data private.

With Fontsource, you get all the performance and privacy benefits of self-hosting without the manual maintenance of downloading font files or managing `@font-face` rules. By combining variable fonts with package management, you can treat your typography like any other standard dependency in your project.

I hope this article helps you improve your website's performance and eliminate render-blocking warnings in your Lighthouse audits.
