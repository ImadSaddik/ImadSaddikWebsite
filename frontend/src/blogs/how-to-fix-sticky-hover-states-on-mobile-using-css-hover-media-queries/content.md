---
title: "How to fix sticky hover states on mobile using CSS hover media queries"
subtitle: "Prevent awkward hover styles from getting stuck on touchscreen devices with @media (hover: hover)."
date: "August 29, 2026"
tags: ["CSS", "Frontend", "Web development", "UI/UX", "Mobile"]
---

## Introduction

Adding hover effects to interactive elements like buttons, cards, or links is standard practice in web design. On a desktop computer, a hover state provides immediate visual feedback. It tells the user that an element is clickable, expandable, or active.

However, touchscreens do not have a mouse cursor. When a user taps an element on a mobile device, mobile browsers trigger the `:hover` style and keep it active until the user taps somewhere else on the screen. This is known as a **sticky hover state**.

While this does not break the functionality of your page, it creates visual confusion and leads to an awkward user experience. In this article, you will learn how to use the `@media (hover: hover)` media query to apply hover styles only on devices that actually support hovering.
