---
title: "How to self-host Google Fonts with Fontsource to improve web performance"
subtitle: "Eliminate render-blocking font requests and protect user privacy by packaging fonts as standard npm dependencies."
date: "September 6, 2026"
tags: ["Web performance", "CSS", "Frontend", "Fonts", "Lighthouse"]
---

## Introduction

When adding custom typography to a website, the quickest path is an external CDN like [Google Fonts](https://fonts.google.com/). For years, I did this by copying an `@import` statement directly into my main stylesheet:

```css
@import url("[https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&display=swap](https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&display=swap)");
```

It is convenient to set up, but external CSS imports carry hidden performance costs. While running a [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) audit on my website, I ran into this diagnostic warning:

```output
Resources are blocking the first paint of your page. Consider delivering critical JS/CSS inline and deferring all non-critical JS/styles.
```

Lighthouse flagged that font `@import` as a render-blocking bottleneck. Because the browser had to pause and fetch external files before drawing anything on the screen, metrics like [First Contentful Paint](https://web.dev/articles/fcp) (FCP) and [Largest Contentful Paint](https://web.dev/articles/lcp) (LCP) suffered.

In this article, you will learn why hosted font CDNs slow down your site and how to self-host open-source fonts cleanly using [Fontsource](https://fontsource.org/).

## The hidden cost of third-party font CDNs

Relying on Google Fonts seems harmless at first. It is just one line of CSS, and Google has servers all around the world. However, that single `@import` triggers a chain of network requests that can noticeably delay your page rendering.

### The two-domain network waterfall

When a visitor loads your webpage, their browser reads your stylesheet line by line. The moment it encounters the `@import url(...)` rule pointing to Google Fonts, it cannot start rendering the page. Instead, it must make a series of requests across two separate third-party domains:

1. **The stylesheet:** The browser pauses rendering and connects to `fonts.googleapis.com` to download the CSS file containing the font rules.
2. **The font file:** The browser reads that CSS file and sees that the actual font files live on a completely different domain `fonts.gstatic.com`. It must then open a second connection to download the `.woff2` file.

::: image ./hosted_font_waterfall.svg "A user visits the site, the browser parses the CSS, finds the @import, fetches the stylesheet from fonts.googleapis.com, and opens a second connection to fonts.gstatic.com to download the font files."
How an `@import` rule forces the browser to make multiple external requests before rendering the page.
:::

On a fast fiber connection, these requests might take only 100 to 200 milliseconds. But on a mobile device or a poor cellular connection, that latency can easily jump to several hundred milliseconds or even seconds. During that time, your text either remains invisible ([Flash of Invisible Text](https://fonts.google.com/knowledge/glossary/foit)) or shifts abruptly once the font arrives ([Flash of Unstyled Text](https://fonts.google.com/knowledge/glossary/fout)), dragging down your [First Contentful Paint](https://web.dev/articles/fcp) (FCP) and [Largest Contentful Paint](https://web.dev/articles/lcp) (LCP) scores.
