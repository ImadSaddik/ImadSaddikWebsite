---
title: "How to eliminate laptop thermal throttling with high static pressure"
subtitle: "Analyzing the thermal data of the IETS GT500 cooler during a heavy gaming workload."
date: "May 18, 2026"
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

Before dropping cash on a premium cooling solution, I wanted to see if I could solve the problem with what I already had on hand. I ran a 10-minute Cinebench test across three different setups to create a solid baseline.

### Testing configurations

Here are the three configurations I tested:

- **Flat surface:** The laptop sitting normally on a flat wooden surface.
- **Lifted:** Propping up the rear feet of the laptop using a few books to increase airflow clearance.
- **Flydigi BS2:** Another pressure-sealed laptop cooler.

To track the performance across these setups, I used [HWiNFO](https://www.hwinfo.com/) to collect sensor data throughout the 10-minute Cinebench run, focusing primarily on the CPU package temperature.

After exporting and cleaning the CSV data, I generated the graph below to compare how all three configurations performed.

::: image ./1_cpu_package_temperature_smoothed.png "Line graph showing CPU package temperature over a 10-minute test duration for flat surface, lifted, and Flydigi BS2 configurations."
All three configurations quickly spike and flatten out near the 94°C thermal throttling limit.
:::

Notice how all three setups quickly hit the 94°C thermal wall. What makes this data even more concerning is that these tests were conducted during the cooler spring months in Morocco.

If standard open-air pads and entry-level sealed coolers are already failing to prevent thermal throttling now, they will be completely useless when summer arrives and ambient temperatures regularly cross 40°C. This initial data proves why I need to find a heavy-duty solution before the extreme heat hits.

### Why entry-level sealed coolers fail

It is surprising to see that the Flydigi BS2, which is marketed as a **high-performance cooler capable of massive temperature drops**, performed almost identically to just propping the laptop up with a few books.

While the standard model tops out at a weak 3000 RPM, a lack of raw power is only half the problem. Even if you put a 5000 RPM motor inside this cooler, it would still struggle because of the cooling chamber's design. Instead of a fully open intake, it relies on two tiny openings on the sides. This severely restricts the volume of air it can pull in.

This combination of a weak motor and a choked air supply completely prevents the cooler from building the high static pressure needed to push air into the laptop's internal heatsinks.

::: image ./2_flydigi_bs2_intake_openings.png "Close-up photograph of the Flydigi BS2 cooling pad intake chamber, highlighting the restricted side openings."
The restrictive intake design of the Flydigi BS2, showing the small side openings that limit total airflow.
:::

Another major issue with placing these intakes on the sides is the high likelihood of misalignment with your laptop's internal fans. If the cooler's side vents do not perfectly line up with the laptop's bottom intake zones, the air simply hits the bottom plastic shell. When this happens, the cooler effectively acts just like a flat desk surface, leaving the internal fans **starved for fresh air**.

## The physics of heat dissipation

To understand how a laptop cooler functions, you have to look at the math behind convective heat transfer. The mechanism that cools a laptop is governed by [Newton's law of cooling](https://en.wikipedia.org/wiki/Newton%27s_law_of_cooling):

$$Q = h \cdot A \cdot (T_{CPU} - T_{ambient})$$

This equation breaks down into four physical variables:

- $Q$ is the rate of heat transfer. We want to maximize this value, as a higher $Q$ means heat leaves the laptop faster.
- $A$ is the surface area of the internal heatsink fins. Since you cannot physically fit more copper inside a pre-built laptop, this variable is fixed.
- $(T_{CPU} - T_{ambient})$ is the temperature difference between the hot CPU and the surrounding room air.
- $h$ is the convective heat transfer coefficient. This measures how effectively the moving air strips heat away from the cooling fins.

This equation reveals why summer temperatures are so brutal for gaming laptops. When the ambient room temperature ($T_{ambient}$) climbs to 40°C, that critical temperature gap shrinks significantly.

Since the heatsink surface area ($A$) is a fixed constant, the overall rate of heat transfer ($Q$) drops, forcing the laptop to trigger severe thermal throttling just to stay alive.

If we cannot change the physical size of heatsinks, and the scorching summer heat is destroying the temperature gap, we are left with only one variable to manipulate to save the system: we must massively increase $h$. To do that, we have to force a much higher volume of air across those internal cooling fins at a significantly higher velocity.

This is where standard open-air pads and entry-level sealed coolers fail. A fan with a low RPM blowing through restricted side openings cannot generate enough pressure to force air into the laptop chassis. The air just bounces off the bottom plastic shell.

To cool the internal components, a cooler needs two things:

- A fully open intake design that does not restrict the air supply.
- An industrial-grade motor capable of generating high **static pressure**.

Static pressure is the driving force required to channel cold air through the dense copper fins inside your laptop. If you create a vacuum seal around the bottom of the laptop and use a high-RPM blower fan, you force the cold air to travel exactly where it needs to go, drastically increasing $h$.

This is the exact engineering approach taken by the IETS GT500.

## Introducing the IETS GT500

To test if static pressure solves the thermal throttling problem, I bought the IETS GT500. This device is built precisely around the two physical requirements we just looked at: a completely open intake and an industrial-grade motor.

::: image ./3_iets_gt500_top_down.png "Top-down diagram of the IETS GT500 cooler with an arrow pointing to the wide, open blue air chamber surrounding the central intake."
The massive, completely open air chamber of the GT500, designed to eliminate intake restrictions and allow maximum airflow distribution.
:::

### The high-pressure design

There are three key components that make this high-pressure design work:

- **The massive air chamber**: This wide-open design completely eliminates intake resistance, allowing a large volume of air to easily accumulate beneath the laptop.
- **The memory foam seal**: This dense foam ring acts as a gasket. When the laptop rests on top of it, the intake chamber is completely sealed off from the room, forcing 100% of the pressurized air straight into the laptop's intake vents.
- **The 5000 RPM centrifugal blower**: Instead of using standard axial PC fans, the GT500 uses a large centrifugal blower wheel. At 5000 RPM, it generates an immense amount of static pressure inside the sealed chamber, easily pushing cold air through the dense fins of the laptop's heatsinks.

### The Kingdom Come benchmark

With the hardware theory out of the way, it was time to see how the cooler handles a realistic workload. I ran a 41-minute gaming session of **Kingdom Come: Deliverance**. This game pushes both the CPU and GPU heavily, recreating the exact 135-watt continuous thermal load I mentioned earlier.

I split this session into two distinct phases:

- **Phase 1 (0 to 12 minutes):** I played the game with the GT500 completely turned off. This allowed the laptop to heat up naturally and saturate the internal copper pipes.
- **Phase 2 (12 to 41 minutes):** At exactly the 12-minute mark, I cranked the GT500 turbine to its maximum 5000 RPM setting for the remainder of the session.

After collecting the logs, I parsed the HWiNFO data into two graphs to show the temperature trends for both the CPU package and the GPU.

Let's start with the CPU package temperature:

::: image ./4_cpu_package_temperature_gt500.png "Line graph showing CPU package temperature over a 41-minute gaming session, with a clear drop after the GT500 is turned on at the 12-minute mark."
The CPU package temperature during the gaming session, showing a significant drop after the GT500 is activated at 12 minutes.
:::

Looking at the CPU package temperature, the impact of the GT500 is immediately apparent. During the first 12 minutes with the cooler turned off, the CPU quickly heat-soaked, hitting a critical peak of 96°C and averaging 82.7°C under the heavy gaming load.

The moment the turbine was cranked to 5000 RPM at the 12-minute mark, the thermal trend reversed sharply. The CPU package temperature plummeted, ultimately settling into a very stable average of 61°C for the rest of the 41-minute session. This represents a massive 21.7°C drop in average operating temperature.

Moving over to the graphics card, the GPU temperature followed a very similar path. Here is how the RTX 4070 handled the exact same two-phase test:

::: image ./5_gpu_temperature_gt500.png "Line graph showing GPU temperature over a 41-minute gaming session, demonstrating a steady peak around 87°C followed by a sharp drop to roughly 62°C after the GT500 is turned on."
The GPU temperature during the gaming session, highlighting the thermal drop from the 87.6°C peak down to a stable baseline once the cooler is active.
:::

During Phase 1, the RTX 4070 warmed up incredibly fast, averaging 75.3°C and hitting a peak of 87.6°C. Just like the CPU, the graphics card was completely heat-soaked.

The moment the GT500 was cranked to 5000 RPM at the 12-minute mark, the graphics card got the breathing room it desperately needed. The temperature instantly dropped, eventually settling into a steady average of 62°C for the rest of the test. That is a solid 13.3°C reduction in average temperature. Keeping a high-end GPU at 62°C while running Kingdom Come: Deliverance is a fantastic result.

Comparing these results back to the initial baseline tests reveals a massive difference. Propping the laptop up on books or using a weak cooler made almost no difference, leaving the system trapped near its thermal throttling limit. Meanwhile, the IETS GT500 delivered completely different results.

By creating a pressurized, vacuum-sealed environment, the blower forced a massive volume of air through the chassis. This maximized the convective heat transfer coefficient ($h$) in a way low-pressure setups simply cannot.

Ultimately, dropping the average CPU temperature by 21.7°C and keeping the GPU at a cool 62°C average proves that high static pressure isn't an expensive gimmick. It is a highly effective brute-force solution to keep high-end gaming hardware running optimally when facing harsh thermal conditions.

However, this level of thermal performance comes with a significant compromise: noise. Running the centrifugal blower at its maximum 5000 RPM setting generates an immense amount of noise. For most users, gaming next to the GT500 at full speed is unbearable without a good pair of noise-canceling headphones.

Fortunately, you can use the physical speed adjustment dial to find a better balance. In practice, you rarely need to run the fan at 100% to stop thermal throttling. Dropping the speed down to a more tolerable 40% to 50% still provides enough static pressure to keep temperatures completely safe while keeping the noise levels manageable.

## Verifying power draw and clock speeds

When looking at a massive 20+°C temperature drop, a skeptic might argue that the laptop simply power-throttled. If the CPU and GPU suddenly drop their wattage to protect the silicon, the temperatures will naturally decrease, but gaming performance will suffer.

To prove that the IETS GT500 is actually responsible for the cooling, we must verify that the power draw remained high and the clock speeds remained stable.

::: image ./6_cpu_power_draw.png "Line graph showing CPU package power draw naturally bouncing between 25W and 45W throughout the 41-minute test."
The CPU package power draw naturally fluctuated between 25W and 45W, showing no change when the cooler turned on at the 12-minute mark.
:::

The data shows that the CPU did not throttle its consumption. It continued to draw the exact same wattage before and after the blower was activated. The graphics card tells an even more stable story:

::: image ./7_gpu_power_draw.png "Line graph showing GPU power draw locked solidly between 110W and 120W across both phases of the test."
The RTX 4070 maintained a heavy, stable draw between 110W and 120W for the entire 41-minute session.
:::

If you notice the CPU power line fluctuating like a heartbeat while the GPU remains a flat plateau, this is completely normal behavior for a healthy gaming system. The GPU acts as a constant pipeline, rendering graphics at 100% capacity without a break.

The CPU, however, acts as the manager. It handles bursty tasks like game logic and physics, rapidly spiking and dropping its wattage in milliseconds. This dynamic shifting allows the CPU to efficiently share the laptop's total power budget, making sure the graphics card always gets the heavy 115W it needs to keep frame rates high.

::: info
If you look closely at the GPU power graph, you will spot a few sharp, narrow dips down to 40W or 20W in the second half of the test. These are not thermal throttles. They are normal moments where the game engine naturally drops the rendering load, such as opening the map, navigating inventory menus, or hitting a loading screen.
:::

This power data disproves the throttling theory. The hardware was generating the exact same amount of thermal energy across both phases of the test. The temperature dropped only because the massive increase in convective heat transfer stripped the heat away.

Because the power remained constant, we can look at the clock speeds to see if the cooler provided any actual performance benefits.

::: image ./8_gpu_clock_speeds.png "Line graph showing GPU clock speeds fluctuating initially, then locking onto a flat 2460 MHz line after the cooler is activated."
With the thermal wall removed, the GPU no longer had to limit its frequencies, resulting in a stable maximum clock speed.
:::

With the GT500 turned off, the GPU was constantly hitting its 87°C thermal limit. This caused the clock speeds to fluctuate between 2100 MHz and 2400 MHz as the system adjusted performance to manage the heat.

Once the blower kicked in and dropped the temperatures, the GPU gained significant thermal headroom. The clock speeds stabilized, boosted to their maximum frequency of 2460 MHz, and remained there for the rest of the session.

## The extreme heat test

While the spring data proved that high static pressure works, the goal was always to survive the extreme Moroccan heat. I did not have to wait long. In late May, a sudden heatwave pushed ambient room temperatures past 37°C.

This served as an ideal real-world stress test. I booted up Kingdom Come: Deliverance and ran the same two-phase benchmark:

- **Phase 1 (0 to 4.5 minutes):** Cooler off.
- **Phase 2 (4.5 to 44 minutes):** Cooler on at 5000 RPM.

Why only 4.5 minutes for the first phase? The extreme heat completely overwhelmed the laptop’s internal cooling. The CPU package temperature spiked almost instantly, hitting a critical maximum of 97°C. The fans were fully saturated, and the silicon aggressively throttled to prevent permanent damage.

To visualize the impact of this heat, I overlaid the summer data onto the spring benchmarks. This allows for a direct side-by-side comparison of how the same hardware performed under different ambient conditions. Let’s start with the CPU package temperature:

::: image ./9_cpu_package_temperature_spring_summer.png "Line graph comparing CPU package temperature during the spring and summer tests, highlighting the rapid summer spike."
The cooler performed effectively in both tests. However, the extreme ambient heat in the summer session caused a rapid temperature spike to 97°C in just 4.5 minutes, compared to a slower climb in the spring. Once active, the GT500 successfully stabilized temperatures in both scenarios.
:::

In the spring test, the CPU temperature climbed gradually, taking nearly 12 minutes to hit the laptop's built-in thermal ceiling before the GT500 brought it down to a stable average of 61°C in phase 2. The system had a comfortable "warm-up" window before the fans were completely overwhelmed.

In the extreme heat test, that warm-up window completely vanished. Driven by a 22°C increase in ambient room temperature during the sudden spike in heat, the CPU package temperature jumped almost instantly, hitting a critical 97°C after only 4.5 minutes of gaming. The internal fans were immediately overwhelmed by the rapid heat-soak, forcing the silicon into aggressive thermal throttling to prevent permanent damage.

To visualize the sheer speed of this thermal spike, the graph above overlays the heatwave data onto the spring benchmark, offsetting the timelines so that both tests align perfectly at the 12.5-minute mark: right when the GT500 was activated.

Once the GT500 spun up to 5000 RPM, the thermal curve dropped sharply. The CPU temperature settled into a stable average of 69.5°C for the remainder of the session. While this is 8.5°C higher than the spring baseline, it is a massive improvement over the 97°C throttling ceiling, proving that high static pressure effectively manages the thermal load even under extreme conditions.

## Conclusion

Standard open-air cooling pads and entry-level sealed coolers rely on low-RPM fans that simply cannot generate the static pressure required to push air through dense internal heatsinks. Even if a cooler has a foam ring, a weak motor will just cool the plastic shell of the laptop and do very little to lower internal component temperatures.

By utilizing a memory foam seal and a 5000 RPM centrifugal blower, the IETS GT500 provides a highly effective hardware solution to the thermal throttling problem. It forces ambient air directly through the laptop's internal heatsinks, significantly increasing the convective heat transfer coefficient.

The data is clear. High static pressure prevents thermal throttling under heavy workloads. While the noise at maximum RPM is pretty loud, the trade-off is a massive 20+°C drop in average temperatures, stable power draw, and sustained maximum clock speeds. If you want to protect your hardware and maintain peak performance during the hottest months of the year, a sealed, high-pressure blower is a highly effective solution.
