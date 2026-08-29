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

## The sticky hover problem

To understand the problem, consider a button or dropdown trigger styled with a standard `:hover` state:

```css
.control-button {
  background-color: transparent;
  color: #64748b;
  transition: all 0.2s ease;
}

.control-button:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}
```

On a desktop screen with a mouse, this works as expected:

::: video ./desktop_hover_demo.mp4 "Hover effect working normally on a desktop browser."
:::

When the cursor moves over the language selector, the background color changes. When the cursor moves away, the button returns to its default color.

Now, let's look at what happens on a mobile phone when we interact with the same button:

::: video ./mobile_sticky_hover_demo.mp4 "The hover effect stays stuck on a touchscreen device after tapping."
:::

When you tap the button on a touchscreen, the browser triggers the `:hover` style. When you tap it a second time to close the dropdown, the button stays stuck in its hover state.

Because there is no mouse pointer leaving the element, the browser retains the hover style until you tap somewhere else on the screen.

::: info Why does this happen?
Touch devices emulate mouse events for backward compatibility with older websites. When you tap an element, mobile browsers fire touch and mouse events together.

Because the browser cannot tell where the pointer went after your finger leaves the screen, it leaves the element in both focus and hover states.
:::

## Fixing the problem

Historically, developers tried to prevent this issue using screen width breakpoints (like `@media (min-width: 768px)`). That approach is unreliable because modern devices blur the line between desktop and mobile. A touchscreen laptop can have a large screen with touch input, while a tablet can be connected to a physical mouse.

Instead of guessing based on screen dimensions, CSS provides [interaction media queries](https://www.w3.org/TR/mediaqueries-5/#hover) to test the actual capabilities of the primary input device.

You can wrap your hover styles inside `@media (hover: hover)`:

```css
.control-button {
  background-color: transparent;
  color: #64748b;
  transition: all 0.2s ease;
}

/* Apply hover styles only if the primary input can hover */
@media (hover: hover) {
  .control-button:hover {
    background-color: #f1f5f9;
    color: #0f172a;
  }
}
```

Think of `@media (hover: hover)` like an `if` statement in programming:

- **If the primary device can hover** (like a desktop with a mouse), the condition evaluates to true. The browser loads the `:hover` style and displays the effect when the cursor is over the element.
- **If the primary device cannot hover** (like a mobile phone or tablet), the condition evaluates to false. The browser completely ignores the `:hover` rule, preventing the style from getting stuck after a tap.

## Testing the fix on mobile

With the `@media (hover: hover)` rule in place, let's see how the button behaves on a touchscreen device now:

::: video ./mobile_fixed_hover_demo.mp4 "The hover effect is completely bypassed on mobile touchscreens."
:::

The button responds to taps cleanly. The language selector opens and closes without retaining the background color change, and you no longer need to tap outside the button to clear the state.

## Conclusion

Using `@media (hover: hover)` is a simple and reliable way to keep your hover effects where they belong. Instead of writing JavaScript workarounds or guessing based on screen widths, CSS allows you to adapt directly to the user's input hardware.

I hope this tip helps you keep your interactive elements clean on both desktop and mobile screens.
