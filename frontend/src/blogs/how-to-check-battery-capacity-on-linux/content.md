---
title: "How to check battery capacity on Linux"
subtitle: "This quick guide will help you find the health of your laptop battery using the terminal."
date: "February 14, 2026"
tags: ["Linux", "Ubuntu", "Battery", "Terminal", "Hardware"]
---

## Introduction

If you've been using your laptop for quite a while, you might notice that you can't work away from the charger for as long as before. When the battery drains faster than before, it is important to understand why.

Prefer video? Watch the video tutorial:

::: youtube [https://www.youtube.com/embed/RjornIF4JBw](https://www.youtube.com/embed/RjornIF4JBw)
:::

Batteries are chemical devices, and they [degrade over time](https://en.wikipedia.org/wiki/Capacity_loss). A battery that held a 4-hour charge when it was new might only hold a 2-hour charge after a few years.

To understand your battery's health, you should check its real numbers: specifically, the original design capacity compared to what it can actually hold today.

In this article, you will learn how to use a simple command-line tool to find this information on your Linux system.

## Finding the battery path

First, you need to find out how the system identifies your battery. Linux treats hardware components as file or device paths.

To list all power-related devices, use the `upower` command with the `-e` (enumerate) flag:

```bash
upower -e
```

The output will display several paths, similar to these:

```output
/org/freedesktop/UPower/devices/battery_BAT0
/org/freedesktop/UPower/devices/line_power_ADP0
/org/freedesktop/UPower/devices/DisplayDevice
```

Look for the line ending in `battery_BAT0`. This is the path to your laptop's physical battery.

## Getting the battery details

Once you have the path, you can ask the system for specific details about that device. Use the `upower` command again, but this time with the `-i` (show info) flag followed by the path you found in the previous step:

```bash
upower -i /org/freedesktop/UPower/devices/battery_BAT0
```

This will generate a complete report on the battery status.

```output
native-path:          BAT0
vendor:               AS3GYFG3KC
model:                R220358
serial:               42D4
power supply:         yes
updated:              Sat 14 Feb 2026 08:12:58 AM +01 (7 seconds ago)
has history:          yes
has statistics:       yes
battery
    present:             yes
    rechargeable:        yes
    state:               pending-charge
    warning-level:       none
    energy:              60.721 Wh
    energy-empty:        0 Wh
    energy-full:         75.901 Wh
    energy-full-design:  90.001 Wh
    energy-rate:         0 W
    voltage:             16.427 V
    charge-cycles:       N/A
    percentage:          80%
    capacity:            84.3335%
    icon-name:           'battery-full-charging-symbolic'
```

## Analyzing the capacity

The output provides a lot of data, but there are three lines that reveal your battery's health:

- `energy-full-design (90.001 Wh)`: This is the capacity the battery had when it left the factory. It is the maximum energy it was designed to hold.
- `energy-full (75.901 Wh)`: This is the maximum energy the battery can hold right now.
- `capacity (84.3335%)`: This is the overall battery health.

By comparing the "design" energy to the current "full" energy, you can see how much the battery has degraded.

In the example above, my battery has lost about **16%** of its original life, sitting at **84.33% health**.

This explains why a laptop doesn't last as long as it used to. It usually isn't a software issue; it is simply the physical hardware aging over time.

## Tips to prolong your battery life

Now that you know the numbers, you might want to keep them as high as possible. While all batteries degrade eventually, you can slow down the process with a few habits:

- **Avoid extreme heat:** High temperatures are the number one enemy of lithium-ion batteries. Make sure your laptop vents are not blocked by blankets or dust.
- **Don't stay at 100% forever:** Leaving your laptop plugged in at 100% charge for weeks will stress the battery. If possible, unplug it occasionally or use software settings to limit the charge threshold to 80%.
- **Avoid deep discharges:** Try not to let your battery drop to 0% regularly.

## Conclusion

Using `upower` is a fast and direct way to check your hardware without installing heavy graphical applications.

If your capacity drops below 50% or 60%, it might be time to look for a replacement. If it’s around 80%, it is still quite functional, but you should start planning for its eventual decline.

Use these steps to diagnose your own battery life and stay informed about your hardware health.
