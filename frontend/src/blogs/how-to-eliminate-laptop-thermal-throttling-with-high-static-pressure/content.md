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

## The physics of heat dissipation

To understand what a laptop cooler actually needs to do, you have to look at the math behind convective heat transfer. The mechanism that cools a laptop is governed by **Newton's law of cooling**:

$$Q = h \cdot A \cdot (T_{CPU} - T_{ambient})$$

This equation looks complex, but it breaks down into simple physical variables:

- **$Q$** is the rate of heat transfer. This is what we want to maximize. A higher $Q$ means heat is leaving the laptop faster.
- **$A$** is the surface area of the internal heatsink fins. Since you cannot physically fit more copper inside a pre-built laptop, this variable is fixed.
- **$(T_{CPU} - T_{ambient})$** is the temperature gap between the hot CPU and the ambient room air.
- **$h$** is the convective heat transfer coefficient. This measures how effectively the moving air strips heat away from those cooling fins.

This equation reveals why summer temperatures are so brutal for gaming laptops. When the ambient room temperature ($T_{ambient}$) climbs to 40°C, that critical temperature gap shrinks significantly.

Since the heatsink surface area ($A$) is a fixed constant, the overall rate of heat transfer ($Q$) drops, forcing the laptop to trigger severe thermal throttling just to stay alive.

If we cannot change the physical size of heatsinks, and the scorching summer heat is destroying the temperature gap, we are left with only one variable to manipulate to save the system: we must massively increase $h$. To do that, we have to force a much higher volume of air across those internal cooling fins at a significantly higher velocity.

This is where standard cooling pads fail. A fan with a low RPM blowing through restricted side openings cannot generate enough pressure to force air into the laptop chassis. The air just bounces off the bottom plastic shell.

To cool the internal components, a cooler needs two things:

- A fully open intake design that does not restrict the air supply.
- An industrial-grade motor capable of generating high **static pressure**.

Static pressure is the driving force required to channel cold air through the dense copper fins inside your laptop. If you create a vacuum seal around the bottom of the laptop and use a high-RPM blower fan, you force the cold air to travel exactly where it needs to go, drastically increasing $h$.

This is the exact engineering approach taken by the IETS GT500.

## Introducing the IETS GT500

To test if static pressure actually solves the thermal throttling problem, I bought the IETS GT500. Unlike standard cooling pads, this device is built around the two physical requirements we just looked at: a completely open intake and an industrial-grade motor.

::: image ./3_iets_gt500_top_down.png "Top-down diagram of the IETS GT500 cooler with an arrow pointing to the wide, open blue air chamber surrounding the central intake."
The massive, completely open air chamber of the GT500, designed to eliminate intake restrictions and allow maximum airflow distribution.
:::

There are three key components that make this high-pressure design work:

- **The massive air chamber**: Unlike traditional cooling pads that restrict airflow through small vents, this wide-open chamber eliminates intake resistance, allowing a large volume of air to accumulate beneath the laptop.
- **The memory foam seal**: This dense foam ring acts as a gasket. When the laptop rests on top of it, the intake chamber is completely sealed off from the room, ensuring that 100% of the pressurized air is directed straight into the laptop's intake vents.
- **The 5000 RPM centrifugal blower**: Instead of using standard axial PC fans, the GT500 uses a large centrifugal blower wheel. At 5000 RPM, it generates an immense amount of static pressure inside the sealed chamber, easily forcing cold air through the dense fins of the laptop's heatsinks.
