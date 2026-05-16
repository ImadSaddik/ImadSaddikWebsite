---
title: "How to eliminate laptop thermal throttling with high static pressure"
subtitle: "Analyzing the thermal data of the IETS GT500 cooler during a heavy gaming workload."
date: "May 16, 2026"
tags: ["Hardware", "Cooling", "Data analysis", "Python", "Gaming"]
---

## Introduction

Modern gaming laptops pack desktop-level performance into incredibly thin enclosures. High-end hardware like the `Intel i7-13650HX` and the `RTX 4070` laptop GPU have massive theoretical limits. When pushed to their limit, these components can pull well over 200 watts of combined power. Inevitably, all of that electrical energy is converted into heat.

In our testing, the system averaged a continuous 135-watt thermal load during heavy gaming workloads. When a laptop CPU hits 95°C trying to dissipate that much heat, it hits a thermal wall. To prevent physical damage to the silicon, the processor aggressively throttles its clock speeds, resulting in lower frame rates and stuttering performance.

As summer approaches and ambient room temperatures push past 40°C, a laptop's internal fans simply cannot spin fast enough to keep up. This article analyzes hard data to see if a high-static-pressure cooler like the [IETS GT500](https://www.ietstech.com/product/iets-gt500-laptop-cooling-stand) actually solves this problem, or if it is just an expensive gimmick.

## The baseline test

Before dropping cash on a premium cooling solution, I wanted to see if I could solve the problem with what I already had on hand. I ran a controlled 10-minute Cinebench test across three different setups to create a solid baseline.

Here are the three configurations I tested:

1. **Flat surface:** The laptop sitting normally on a flat wooden surface.
2. **Lifted:** Propping up the rear feet of the laptop using a few books to increase airflow clearance.
3. **Flydigi BS2:** An entry-level laptop cooler.

While these initial tests were conducted during the cooler spring months in Morocco, the ultimate goal is preparing for the summer ahead. When ambient temperatures regularly cross 40°C, every drop in temperature counts.

This baseline allows me to measure the precise thermal improvement before the extreme heat hits, and I plan to repeat this exact experiment with the GT500 once summer arrives.

To track the performance, I used [HWiNFO](https://www.hwinfo.com/) to collect sensor data throughout the 10-minute Cinebench run, focusing primarily on the CPU package temperature.

After exporting and cleaning the CSV data, I generated the graph below to compare how all three configurations performed.

::: image ./1_cpu_package_temperature_smoothed.png "Line graph showing CPU package temperature over a 10-minute test duration for flat surface, lifted, and Flydigi BS2 configurations."
All three configurations quickly spike and flatten out near the 94°C thermal throttling limit.
:::

It is surprising to see that the Flydigi BS2, which is marketed as a **high-performance cooler capable of massive temperature drops**, performed almost identically to just propping the laptop up with a few books.

The primary reason the Flydigi BS2 struggles under heavy load comes down to raw power. The standard model tops out at just 3000 RPM, which cannot generate enough static pressure to force sufficient airflow into a hot laptop.

Adding to this issue is the design of the cooling chamber itself. Instead of a fully open intake, it relies on two tiny openings on the sides, severely restricting the volume of air it can push through the laptop's internal heatsinks. Together, this combination of low RPM and choked airflow explains the cooler's underwhelming performance.

::: image ./2_flydigi_bs2_intake_openings.png "Close-up photograph of the Flydigi BS2 cooling pad intake chamber, highlighting the restricted side openings."
The restrictive intake design of the Flydigi BS2, showing the small side openings that limit total airflow.
:::

Another issue with placing the intakes on the sides is the high likelihood of misalignment with your laptop's internal fans. If the cooler's vents don't line up with the laptop's intake zones, the air simply hits the bottom plastic shell. When this happens, the cooler effectively acts just like a flat desk surface, leaving the internal fans **starved for fresh air**.
