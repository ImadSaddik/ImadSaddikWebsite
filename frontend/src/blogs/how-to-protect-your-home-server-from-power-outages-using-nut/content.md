---
title: "How to protect your home server from power outages using NUT"
subtitle: "A complete guide to configuring Network UPS Tools (NUT), automating graceful shutdowns, and understanding battery hardware."
date: "April 26, 2026"
tags: ["Home server", "UPS", "NUT", "Self-hosting", "Automation"]
---

## Introduction

Self-hosting your own services is rewarding, but it comes with physical risks. A sudden power outage can corrupt your databases, break your file systems, and put unnecessary stress on your hardware.

To protect against this, you need an [Uninterruptible Power Supply (UPS)](https://en.wikipedia.org/wiki/Uninterruptible_power_supply). A UPS gives your infrastructure a battery buffer when the grid fails. However, a battery alone is not enough. If you are not home to safely turn off your machines, the battery will eventually drain, and your server will still crash hard.

To fix this, you must build a communication bridge between your UPS and your server. In this article, you will learn how to use [Network UPS Tools (NUT)](https://networkupstools.org/) to continuously monitor your battery metrics and automatically trigger a graceful shutdown across multiple devices before the backup power runs out.

## Understanding the hardware

Before configuring the software, you need to understand the hardware that powers it. For this setup, the infrastructure is backed by an [nJoy Horus Plus 2000](https://www.njoy.global/product/horus-plus-2000/PWUP-LI200H1-AZ01B).

This is a [Line Interactive UPS](https://www.fs.com/blog/comparison-of-ups-topologies-line-interactive-vs-online-vs-offline-3538.html). This means it actively regulates the incoming AC voltage to correct minor power fluctuations without switching to the battery, which extends the lifespan of the unit. It has a capacity of 2000 VA or 1200 W, which provides plenty of headroom for a mini PC, a network switch, and a laptop.

If you open the case, you will find two GP09122L batteries inside.

### The battery chemistry

These are 12V batteries. They use Valve Regulated Lead-Acid (VRLA) technology with an Absorbent Glass Mat (AGM).

Because they use an AGM design, the sulfuric acid is absorbed into a fiberglass mat rather than floating freely as a liquid. This makes the batteries completely sealed, spill-proof, and maintenance-free. You never have to add water to them.

### Calculating your battery voltage limits

Because there are two 12V batteries wired in series, the UPS operates on a 24V internal system. This detail is important for our software configuration later.

Many affordable line-interactive UPS units do not calculate their own remaining battery percentage. When queried, they only report their raw internal voltage. To a computer, a raw number like "25.2V" is meaningless without context.

To fix this, you need to find the upper and lower voltage limits of your batteries so `NUT` can do the math. You can find this information on your battery manufacturer's datasheet.

#### Finding the maximum voltage

Look for the **Float use** or **Standby use** charge voltage. For the GP09122 batteries, the datasheet lists a float charge of 13.5V to 13.8V. Since the UPS has two batteries in series, we multiply this by two, giving us a range of 27.0V to 27.6V. A value of `27.4V` is a safe upper limit.

::: image ./01_float_voltage.png "GP09122 battery datasheet showing float charge voltage"
Find the 'Float use' voltage in the datasheet to determine the maximum voltage limit for your NUT configuration.
:::

#### Finding the minimum voltage

Look at the discharge characteristics table. While the datasheet lists final voltages as low as 1.60V per cell, those are **absolute minimum** limits that can cause permanent chemical damage if reached frequently.

For a reliable home server setup, we use the industry-standard "safe empty" point of **1.75V per cell**. This threshold extracts nearly all usable energy while ensuring the battery remains healthy enough to be recharged for years. Since a 12V battery contains 6 cells, that is 10.5V per battery. Multiplied by two, we get `21.0V` as our critical empty limit.

::: image ./02_discharge_table.png "GP09122 battery datasheet discharge characteristics table"
This table mapping current (Amps) to runtime helps us determine how much load the battery can handle before reaching our 1.75V per cell safety limit.
:::

#### Estimating your runtime

Before setting up automation, you need to know your "safety window": how long your batteries can actually support your load. To find this, combine the maximum wattage of your devices and compare it to the **Constant Current Discharge** table in your datasheet.

For my current setup, the theoretical maximum load is:

- **Gaming laptop:** 280W
- **Mini PC:** 65W
- **Network switch:** 3W
- **Total load:** 348W

Since this is a 24V system, we calculate the current draw in Amps: `348W / 24V = 14.5A`. Looking at the 1.75V row in the discharge table, a 14.5A draw falls between the 15-minute (16.3A) and 30-minute (9.7A) columns.

::: image ./03_discharge_table_highlight.png "Highlighted discharge table showing the 14.5A window"
By focusing on the 1.75V safety row, we can see exactly where our 14.5A load sits relative to the runtime columns.
:::

This tells me that even if every device is running at 100% capacity, I have a **guaranteed 20-minute window** to perform a graceful shutdown. In a normal idle state, this runtime likely extends to several hours.

::: info
By feeding these exact voltage limits into the NUT driver later, the software will translate the raw voltage into a human-readable 0% to 100% battery capacity scale on your dashboards.
:::

## The physical network topology

To automate a shutdown sequence across multiple machines, both your power and network cables must be strategically wired. Software cannot send an emergency signal if the physical network is dead.

The following devices are plugged directly into the battery backup sockets of the nJoy UPS:

- **Mini PC:** the primary server and UPS manager.
- **Gaming laptop:** the secondary client machine.
- **Network switch**

My main internet router is located too far away to be plugged into the UPS. Because of this, it will immediately lose power during a blackout, taking the internet down with it. However, because the local network switch is on the battery backup, the internal network stays alive.

This maintains a stable local link. When the battery reaches a critical level, the mini PC can successfully broadcast an emergency shutdown command through the switch to the gaming laptop. Only after the secondary devices are safe does the mini PC trigger its own power-down sequence.

::: image ./04_ups_topology.png "Wiring diagram showing the power, data, and communication links"
This topology highlights the strategic wiring needed for a reliable NUT setup. The **black lines** represent raw wall power, while **blue lines** indicate devices protected by the UPS battery backup. Local data flows through **green Ethernet cables**, and the **orange USB link** allows the mini PC (primary) to monitor the hardware state directly.
:::
