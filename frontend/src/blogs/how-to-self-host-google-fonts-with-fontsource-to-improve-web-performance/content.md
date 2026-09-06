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
