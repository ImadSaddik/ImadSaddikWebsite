---
title: "How to eliminate laptop thermal throttling with high static pressure"
subtitle: "Analyzing the thermal data of the IETS GT500 cooler during a heavy gaming workload."
date: "May 17, 2026"
tags: ["Hardware", "Cooling", "Data analysis", "Python", "Gaming"]
---

## Introduction

Modern gaming laptops pack desktop-level performance into incredibly thin enclosures. High-end hardware like the `Intel i7-13650HX` and the `RTX 4070` laptop GPU have massive theoretical limits. When pushed to the absolute maximum, these components can pull well over 200 watts of combined power.

In my testing, the system averaged a continuous 135-watt thermal load during heavy gaming workloads. Inevitably, all of that electrical energy turns into heat. When a laptop CPU hits 95°C trying to dissipate that thermal load, it hits a wall. To prevent physical damage to the silicon, the processor aggressively throttles its clock speeds. This results in lower frame rates and stuttering performance in games.

As summer approaches here in Morocco, ambient room temperatures can push past 40°C. When this happens, a laptop's internal fans simply cannot spin fast enough to keep up. This article analyzes hard data to see if a high-static-pressure cooler like the `IETS GT500` actually solves this problem, or if it is just an expensive gimmick.

::: info
You can find the raw HWiNFO logs, visualization scripts, and Jupyter notebooks used for this article in the [IETSCoolerExperiment GitHub repository](https://github.com/ImadSaddik/IETSCoolerExperiment).
:::

## The baseline test

Before dropping cash on a premium cooling solution, I wanted to see if I could solve the problem with what I already had on hand. I ran a controlled 10-minute Cinebench test across three different setups to create a solid baseline.

Here are the three configurations I tested:

- **Flat surface:** The laptop sitting normally on a flat wooden surface.
- **Lifted:** Propping up the rear feet of the laptop using a few books to increase airflow clearance.
- **Flydigi BS2:** An entry-level laptop cooler.

While these initial tests were conducted during the cooler spring months in Morocco, the ultimate goal is preparing for the summer ahead. When ambient temperatures regularly cross 40°C, every drop in temperature counts.

This initial data allows me to measure the precise thermal improvement before the extreme heat hits, and I plan to repeat this exact experiment with the GT500 once summer arrives.

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

To see how the laptop cooler handles a realistic, heavy workload, I ran a 45-minute session of **Kingdom Come: Deliverance**. This game pushes both the CPU and the RTX 4070 heavily, creating the continuous 135-watt thermal load mentioned earlier.

I split the experiment into two phases:

- **Phase 1 (0 to 12 minutes):** I played the game with the GT500 completely turned off. This allowed the laptop to heat up naturally and saturate the internal copper pipes.
- **Phase 2 (12 to 45 minutes):** At exactly the 12-minute mark, I cranked the GT500 turbine to its maximum 5000 RPM setting for the remainder of the session.

After collecting the logs, I parsed the HWiNFO data into two graphs to show the temperature trends for both the CPU package and the GPU.

Let's start with the CPU package temperature:

::: image ./4_cpu_package_temperature_gt500.png "Line graph showing CPU package temperature over a 45-minute gaming session, with a clear drop after the GT500 is turned on at the 12-minute mark."

The CPU package temperature during the gaming session, showing a significant drop after the GT500 is activated at 12 minutes.
:::

Looking at the CPU package temperature, the impact of the GT500 is immediately apparent. During the first 12 minutes with the cooler turned off, the CPU quickly heat-soaked, fluctuating between 80°C and a peak of roughly 93°C under the heavy gaming load.

The moment the turbine was cranked to 5000 RPM at the 12-minute mark, the thermal trend reversed sharply. Within just three minutes, the CPU package temperature plummeted by nearly 30°C, finally settling into a very low and steady 55°C to 60°C range for the rest of the 45-minute session.

Moving over to the graphics card, the GPU temperature followed a very similar path. Here is how the RTX 4070 handled the exact same two-phase test:

::: image ./5_gpu_temperature_gt500.png "Line graph showing GPU temperature over a 45-minute gaming session, demonstrating a steady peak around 93°C followed by a sharp drop to roughly 68°C after the GT500 is turned on."

The GPU temperature during the gaming session, highlighting the thermal drop from the 93°C peak down to a stable baseline once the cooler is active.
:::

The GPU temperature followed a very similar path. During Phase 1, the RTX 4070 warmed up incredibly fast, spiking to 80°C in less than three minutes before flattening out at a very high 93°C peak. Just like the CPU, the graphics card was completely heat-soaked and running at its absolute limit.

The moment the GT500 was cranked to 5000 RPM at the 12-minute mark, the graphics card got the breathing room it desperately needed. The temperature instantly dropped by about 23°C, eventually settling into a very steady 65°C to 70°C range for the rest of the test. While the drop wasn't quite as massive as the CPU's 30°C plunge, keeping a high-end GPU under 70°C while running Kingdom Come: Deliverance is a fantastic result.

Comparing these results back to our initial baseline tests reveals a massive difference. Propping the laptop up on books or using a standard low-RPM cooling pad barely moved the needle, leaving the system trapped at its 94°C thermal throttling limit. Meanwhile, the IETS GT500 delivered completely different results.

By creating a pressurized, vacuum-sealed environment, the blower managed to force a massive volume of air through the chassis. This maximized the convective heat transfer coefficient ($h$) in a way low-pressure pads simply cannot.

Ultimately, reducing the CPU temperature by 30°C and keeping the GPU well below 70°C proves that high static pressure isn't an expensive gimmick. It is the only viable brute-force solution to keep a high-end gaming laptop running optimally when facing harsh thermal conditions.

However, this level of thermal performance comes with a significant compromise: noise. Running the centrifugal blower at its maximum 5000 RPM setting generates an immense amount of noise. For most users, gaming next to the GT500 at full speed is unbearable without a good pair of noise-canceling headphones.

Fortunately, you can use the physical speed adjustment dial to find a better balance. In practice, you rarely need to run the fan at 100% to stop thermal throttling. Dropping the speed down to a more tolerable 40% to 50% still provides enough static pressure to keep temperatures safe while keeping the noise levels manageable.

## Verifying power draw and clock speeds

When looking at a large 30°C temperature drop, a skeptic might argue that the laptop simply power-throttled. If the CPU and GPU suddenly drop their wattage to protect the silicon, the temperatures will naturally decrease, but gaming performance will suffer.

To prove that the IETS GT500 is actually responsible for the cooling, we must verify that the power draw remained high and the clock speeds remained stable.

::: image ./6_cpu_power_draw.png "Line graph showing CPU package power draw naturally bouncing between 25W and 45W throughout the 45-minute test."
The CPU package power draw naturally fluctuated between 25W and 45W, showing no change when the cooler turned on at the 12-minute mark.
:::

The data shows that the CPU did not throttle its consumption. It continued to draw the exact same wattage before and after the blower was activated. The graphics card tells an even more stable story:

::: image ./7_gpu_power_draw.png "Line graph showing GPU power draw locked solidly between 110W and 120W across both phases of the test."
The RTX 4070 maintained a heavy, stable draw between 110W and 120W for the entire 45-minute session.
:::

If you notice the CPU power line fluctuating like a heartbeat while the GPU remains a flat plateau, this is completely normal behavior for a healthy gaming system. The GPU acts as a constant pipeline, rendering graphics at 100% capacity without a break. The CPU, however, acts as the manager. It handles bursty tasks like game logic and physics, rapidly spiking and dropping its wattage in milliseconds. This dynamic shifting allows the CPU to efficiently share the laptop's total power budget, ensuring the graphics card always gets the heavy 115W it needs to keep frame rates high.

This power data disproves the throttling theory. The hardware was generating the exact same amount of thermal energy across both phases of the test. The temperature dropped only because the massive increase in convective heat transfer stripped the heat away.

Because the power remained constant, we can look at the clock speeds to see if the cooler provided any actual performance benefits.

::: image ./8_gpu_clock_speeds.png "Line graph showing GPU clock speeds fluctuating initially, then locking onto a flat 2460 MHz line after the cooler is activated."
With the thermal wall removed, the GPU no longer had to limit its frequencies, resulting in a stable maximum clock speed.
:::

With the GT500 turned off, the GPU was constantly hitting its 93°C limit. This caused the clock speeds to fluctuate between 2100 MHz and 2400 MHz as the system adjusted performance to manage the heat.

Once the blower kicked in and dropped the temperatures, the GPU gained significant thermal headroom. The clock speeds stabilized, boosted to their maximum frequency of 2460 MHz, and remained there for the rest of the session.

## Conclusion

Standard open-air cooling pads and entry-level sealed coolers rely on low-RPM fans that simply cannot generate the static pressure required to push air through dense internal heatsinks. Even if a cooler has a foam ring, a weak motor will just cool the plastic shell of the laptop and do very little to lower internal component temperatures.

By utilizing a memory foam seal and a 5000 RPM centrifugal blower, the IETS GT500 provides a highly effective hardware solution to the thermal throttling problem. It forces ambient air directly through the laptop's internal heatsinks, significantly increasing the convective heat transfer coefficient.

The data is clear. High static pressure prevents thermal throttling under heavy workloads. While the noise at maximum RPM is substantial, the trade-off is a 30°C drop in temperatures, stable power draw, and sustained maximum clock speeds. If you want to protect your hardware and maintain peak performance during the hottest months of the year, a sealed, high-pressure blower is a highly effective solution.
