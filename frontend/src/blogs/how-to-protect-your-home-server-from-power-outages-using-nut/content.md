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

::: tip
While this guide features the **nJoy Horus Plus 2000**, the logic and configuration steps are nearly identical for most line-interactive UPS units. If you are using a different brand, you will only need to adjust the driver name and the battery voltage limits for your specific hardware.
:::

## Understanding the hardware

Before configuring the software, you need to understand the hardware that powers it. For this setup, the infrastructure is backed by an [nJoy Horus Plus 2000](https://www.njoy.global/product/horus-plus-2000/PWUP-LI200H1-AZ01B).

This is a [line interactive UPS](https://www.fs.com/blog/comparison-of-ups-topologies-line-interactive-vs-online-vs-offline-3538.html). This means it actively regulates the incoming AC voltage to correct minor power fluctuations without switching to the battery, which extends the lifespan of the unit. It has a capacity of 2000 VA or 1200 W, which provides plenty of headroom for a mini PC, a network switch, and a laptop.

If you open the case, you will find two GP09122L batteries inside.

### The battery chemistry

These are 12V batteries. They use Valve Regulated Lead-Acid (VRLA) technology with an Absorbent Glass Mat (AGM).

Because they use an AGM design, the sulfuric acid is absorbed into a fiberglass mat rather than floating freely as a liquid. This makes the batteries completely sealed, spill-proof, and maintenance-free. You never have to add water to them.

### Calculating your battery voltage limits

Because there are two 12V batteries wired in series, the UPS operates on a 24V internal system. This detail is important for our software configuration later.

Many affordable line-interactive UPS units do not calculate their own remaining battery percentage. When queried, they only report their raw internal voltage. To a computer, a raw number like "25.2V" is meaningless without context.

To fix this, you need to find the upper and lower voltage limits of your batteries so `NUT` can do the math. You can find this information on your battery manufacturer's datasheet.

#### Finding the maximum voltage

Look for the **float use** or **standby use** charge voltage. For the GP09122 batteries, the datasheet lists a float charge of 13.5V to 13.8V. Since the UPS has two batteries in series, we multiply this by two, giving us a range of 27.0V to 27.6V. A value of `27.4V` is a safe upper limit.

::: image ./01_float_voltage.png "GP09122 battery datasheet showing float charge voltage"
Find the 'float use' voltage in the datasheet to determine the maximum voltage limit for your NUT configuration.
:::

#### Finding the minimum voltage

Look at the discharge characteristics table. While the datasheet lists final voltages as low as 1.60V per cell, those are **absolute minimum** limits that can cause permanent chemical damage if reached frequently.

For a reliable home server setup, we use the industry-standard "safe empty" point of **1.75V per cell**. This threshold extracts nearly all usable energy while ensuring the battery remains healthy enough to be recharged for years. Since a 12V battery contains 6 cells, that is 10.5V per battery. Multiplied by two, we get `21.0V` as our critical empty limit.

::: image ./02_discharge_table.png "GP09122 battery datasheet discharge characteristics table"
This table mapping current (Amps) to runtime helps us determine how much load the battery can handle before reaching our 1.75V per cell safety limit.
:::

#### Estimating your runtime

Before setting up automation, you need to know your safety window: how long your batteries can support your load. To find this, combine the maximum wattage of your devices and compare it to the **Constant Current Discharge** table in your datasheet.

For my current setup, the theoretical maximum load is `348W`. This total comes from the following devices:

- **Gaming laptop:** 280W
- **Mini PC:** 65W
- **Network switch:** 3W

Since this is a 24V system, we calculate the current draw in Amps: `348W / 24V = 14.5A`. Looking at the 1.75V row in the discharge table, a 14.5A draw falls between the 15-minute (16.3A) and 30-minute (9.7A) columns.

::: image ./03_discharge_table_highlight.png "Highlighted discharge table showing the 14.5A window"
By focusing on the 1.75V safety row, you can see exactly where the 14.5A load sits relative to the runtime columns.
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

## The NUT architecture explained

Configuring Network UPS Tools (NUT) can feel overwhelming because the settings are split across several different files. To make sense of them, it helps to visualize the system as a three-layer software stack sitting on top of your physical hardware.

::: image ./05_nut_architecture.png "The three layers of the NUT software architecture"
By splitting the driver, server, and monitor into separate layers, NUT can manage multiple UPS units and coordinate shutdowns across an entire network of machines.
:::

### The driver layer

The driver is the bottom layer and the only part of the software that physically talks to your hardware. It speaks the specialized language of the UPS (such as the Megatec Qx protocol) over the USB cable and translates raw electrical signals into readable data points. You configure this in `ups.conf`.

### The data server layer

The data server (`upsd`) sits in the middle as the central information hub. When it starts up, it reads `ups.conf` to identify which UPS units it needs to manage. Once running, it maintains a **local cache** of the current state so that clients can receive live metrics instantly.

This layer also handles security and network connectivity, which you configure in `upsd.conf` (for server settings) and `upsd.users` (for user credentials). It also handles two-way communication, allowing clients to send administrative commands back to the UPS.

### The monitor layer

The monitor (`upsmon`) is the top layer and acts as the "brain" of the system. It constantly listens to the data server for status updates. It can run as a **primary** monitor (on the server connected to the UPS) or a **secondary** monitor (on other devices like your laptop).

When it detects a critical state (both "on battery" and "low battery"), it coordinates a synchronized shutdown, ensuring secondary devices power off safely before the primary server pulls the plug. You configure this in `upsmon.conf`.

## Bypassing Ubuntu security

By default, Ubuntu restricts direct access to physical USB ports for security reasons. Because the NUT service drops its root privileges and runs as a restricted `nut` system user, it will be blocked from reading the UPS data cable. To fix this, you must create a specific `udev` rule that grants the `nut` group permission to access the hardware.

### Finding the hardware ID

First, plug the UPS into your server via USB and use the `lsusb` command to identify the device signature:

```bash
lsusb
```

Look for the UPS in the output list. For the nJoy Horus Plus 2000, it usually appears as a Cypress Semiconductor chip:

```output
Bus 001 Device 002: ID 0665:5161 Cypress Semiconductor USB to Serial
```

In this example, the **vendor ID** is `0665` and the **product ID** is `5161`. Note these numbers down, as you will need them for the next step.

### Creating a custom udev rule

Begin by installing the Network UPS Tools package on your primary server: the machine physically connected to the UPS via USB. In my case, this is the mini PC:

```bash
sudo apt install nut -y
```

Now, create a new rule file that tells the Linux kernel to grant the `nut` group access to this specific device:

```bash
sudo nano /etc/udev/rules.d/99-nut-ups.rules
```

::: info
The `nut` group is automatically created when you install the NUT package.
:::

Paste the following line into the file. Make sure to replace the `idVendor` and `idProduct` values if your UPS uses different IDs:

```text
SUBSYSTEM=="usb", ATTRS{idVendor}=="0665", ATTRS{idProduct}=="5161", MODE="0664", GROUP="nut"
```

Save the file and exit. To apply the new permissions without rebooting your server, reload the `udev` rules and trigger them manually:

```bash
sudo udevadm control --reload-rules && sudo udevadm trigger
```

::: tip
After running these commands, physically unplug the UPS USB cable, wait a few seconds, and plug it back in to ensure the kernel registers the new permissions correctly.
:::

## Configuring the primary server

With the physical wiring and security permissions in place, you can now configure the software stack.

### Setting the server mode

Because the primary server will broadcast UPS data to other devices on your network, it must be configured as a network server. Open the global configuration file to define the operational role of the NUT stack:

```bash
sudo nano /etc/nut/nut.conf
```

Find the `MODE` line and change it to `netserver`:

```text
MODE=netserver
```

Setting the mode to `netserver` instructs NUT to start all three software layers: the driver, the data server, and the monitor. Unlike `standalone` mode, which is restricted to the local machine, `netserver` allows the system to share its UPS data with other devices across your network.

### Defining the UPS driver

Next, you need to tell NUT exactly which driver to use and how to calculate the battery percentage using the limits we found earlier. Open the UPS definition file:

```bash
sudo nano /etc/nut/ups.conf
```

Paste the following block at the bottom. The `nutdrv_qx` driver handles the communication protocol used by the nJoy unit. Notice how we use the `high` and `low` voltage limits to force the driver to calculate the battery charge:

```text
[njoy]
    driver = nutdrv_qx
    port = auto
    desc = "nJoy Horus Plus 2000"
    vendorid = "0665"
    productid = "5161"
    default.battery.voltage.high = 27.4
    default.battery.voltage.low = 21.0
```

By providing these limits, you are enabling a feature called [battery charge guesstimation](https://networkupstools.org/docs/man/blazer_ser.html#_battery_charge_guesstimation). Since the UPS hardware does not calculate its own percentage, `NUT` uses a linear formula to guess the charge based on the live voltage:

$$
\text{battery.charge} = \frac{\text{current.voltage} - \text{voltage.low}}{\text{voltage.high} - \text{voltage.low}} \times 100
$$

This simple math transforms a raw number like "24.2V" into a meaningful "50%" on your dashboard. While the man page warns that this is a "guess" (since voltage can fluctuate under heavy load), it is incredibly accurate for determining when a battery is reaching its critical empty state.

### Opening the network gates

By default, the data server only listens to the local machine. To allow secondary devices or dashboard widgets to read the data, you must open the NUT port (3493) to your local network. Open the server configuration:

```bash
sudo nano /etc/nut/upsd.conf
```

Add this line to the bottom of the file:

```text
LISTEN 0.0.0.0 3493
```

The `0.0.0.0` address tells the server to listen on **all available network interfaces**. This ensures that the data is accessible not just to the local machine, but also to other devices or dashboard widgets on your local network. Since this opens the service to the network, you will secure it with a password in the next step.

### Setting up authentication

To prevent unauthorized devices from triggering shutdown commands, you must create a secure user. Open the user file:

```bash
sudo nano /etc/nut/upsd.users
```

Paste this block at the bottom. The `primary` tag gives this user the authority to manage the master shutdown sequence:

```text
[admin]
    password = your_strong_password_here
    upsmon primary
```

::: tip
You can generate a strong, random password directly in your terminal by running:

```bash
openssl rand -hex 16
```

Use the output as your password in `upsd.users` and keep it safe, as you will need it again when configuring your monitoring clients.
:::

### Verifying the data server

Restart the NUT services to apply your changes:

```bash
sudo systemctl restart nut-server
```

To verify that the server is successfully talking to your hardware and calculating the percentage, use the `upsc` client to filter for the most important metrics:

```bash
upsc njoy | grep -E "status|voltage|charge"
```

If everything is correct, you should see an output similar to this:

```output
battery.charge: 97
battery.voltage: 27.18
ups.status: OL
```

::: tip
You can also run `upsc njoy` without any filters to see every single data point your UPS reports, including load percentage, input frequency, and firmware versions.
:::

## Automating the shutdown sequence

The final step in this software setup is configuring the monitor (`upsmon`). This background watcher is the "executioner" of the NUT stack: it reads the live metrics from the data server and triggers a safe shutdown when the battery reaches its critical limit.

### Configuring the primary monitor

On your primary server, open the monitor configuration file:

```bash
sudo nano /etc/nut/upsmon.conf
```

First, tell the monitor to watch the local UPS using the credentials you created earlier. Add this line to the bottom of the file:

```text
MONITOR njoy@localhost 1 admin your_strong_password_here primary
```

Let's break down this command:

- `njoy@localhost`: The name of the UPS and the location of the data server.
- `1`: This tells the software how many power supplies your machine has plugged into the UPS. Since a standard mini PC or laptop only has one power supply, this is always 1.
- `primary`: The operational role. This tells the server it is in charge of the UPS and must wait for secondary devices to disconnect before shutting itself down.

Next, ensure the `SHUTDOWNCMD` is defined to tell the system how to power off. Find the line and make sure it looks like this:

```text
SHUTDOWNCMD "/sbin/shutdown -h +0"
```

Save and exit. Finally, enable the services to run on boot and apply your changes by restarting the NUT stack:

```bash
sudo systemctl enable nut-server nut-monitor
sudo systemctl restart nut-server nut-monitor
```

### Configuring the secondary monitor

Now, perform the same setup on your secondary machine. Since your secondary machine only needs to listen to the network, install just the client package:

```bash
sudo apt install nut-client -y
```

Set the operational role to `netclient` in `/etc/nut/nut.conf`:

```text
MODE=netclient
```

Then, open `/etc/nut/upsmon.conf` and add the monitor line using the primary server's static IP address and the `secondary` role:

```text
MONITOR njoy@your-server-ip 1 admin your_strong_password_here secondary
```

Make sure the `SHUTDOWNCMD` line is also uncommented and set correctly, just like on the primary server. Save the file, then enable and restart the monitor service on the laptop:

```bash
sudo systemctl enable nut-monitor
sudo systemctl restart nut-monitor
```

::: info
The monitor is smart. It does not panic and shut down your machines the second the power flickers. Instead, it patiently waits until the UPS broadcasts both the `OB` (On Battery) and `LB` (Low Battery) flags at the same time.

Once the battery voltage physically drops to the 21.0V critical limit we configured earlier, the secondary monitor shuts down the laptop and notifies the primary server that it has safely disconnected. Only then does the primary server trigger its own final shutdown sequence.
:::

## Visualizing the data

With your UPS data now broadcasting over the network, you can integrate it into your existing monitoring tools for real-time visibility and historical tracking.

### Netdata

If you use [Netdata](https://www.netdata.cloud/) for your home lab, it likely already knows about your UPS. Because Netdata's auto-discovery engine constantly scans the default NUT port (3493), it will automatically detect the `nut-server` the moment it starts.

Without any manual configuration, a new UPS section will appear in your Netdata sidebar, giving you detailed charts for input voltage, battery load, and more.

::: image ./06_netdata_ups.png "Historical UPS metrics automatically discovered by Netdata"
Find the UPS section in the Netdata sidebar to view the live metrics.
:::

### PeaNUT

While the data server broadcasts metrics over a raw TCP socket, many dashboard tools (like [Homepage](https://github.com/gethomepage/homepage)) require a modern JSON API to display information.

You can bridge this gap using [PeaNUT](https://github.com/Brandawg93/PeaNUT), a lightweight container that translates NUT metrics into a clean API.

Create a directory for your PeaNUT configuration and set up a `docker-compose.yml` file with the following content:

```yaml
services:
  peanut:
    image: brandawg93/peanut:latest
    container_name: PeaNUT
    restart: unless-stopped
    volumes:
      - ./config:/config
    ports:
      - "8082:8080"
    environment:
      - WEB_PORT=8080
      - AUTH_DISABLED=true
```

Authentication is disabled here so that Homepage can read the data without needing to manage separate credentials. Since this container is only accessible on your local network, it does not pose a security risk.

Start the container in the background:

```bash
docker compose up -d
```

Once the container is running, access the web interface at `http://your-server-ip:8082`. Go to the settings page and add a new NUT server connection by providing the following details:

- **Name:** nJoy Horus Plus 2000
- **Server address:** your-server-ip
- **Port:** 3493
- **Username:** admin
- **Password:** your_strong_password_here

::: image ./07_peanut_setup.png "Connecting PeaNUT to the NUT data server"
Enter the connection details using the admin credentials you created in the authentication step.
:::

Once connected, PeaNUT will automatically begin polling your UPS and displaying the data in its clean, modern interface.

::: image ./08_peanut_dashboard.png "The PeaNUT web dashboard displaying live metrics"
PeaNUT displays the status of your UPS, battery charge, and load. Click on the "Details" button to see every single metric your UPS reports.
:::

### Homepage

Now that PeaNUT is serving an API, you can add a live UPS widget to your Homepage dashboard. Add the following service definition to your `services.yaml`:

```yaml
- Infrastructure:
    - nJoy UPS:
        icon: ups.png
        description: Horus Plus 2000
        href: http://your-server-ip:8082
        widget:
          type: customapi
          url: http://your-server-ip:8082/api/v1/devices/njoy
          mappings:
            - field: battery.charge
              label: Battery
              format: percent
            - field: ups.load
              label: Load
              format: percent
            - field: ups.status
              label: Status
              format: text
              remap:
                - value: OL
                  to: Online
                - value: OB
                  to: On Battery
                - value: LB
                  to: Low Battery
```

::: info
Notice the `njoy` at the very end of the API URL. This must match the exact name you assigned to your device inside your `ups.conf` file. If you named your UPS something else, be sure to update this URL.
:::

Save the file. Homepage updates automatically without needing a restart. If you now go to your Homepage dashboard, you will see your new UPS widget displaying the live battery capacity, current load, and connection status.

::: image ./09_homepage_widget.png "A custom UPS widget in Homepage showing battery percentage, load, and status"
This widget uses the PeaNUT API to display real-time UPS metrics directly on your Homepage dashboard.
:::

## Testing the system

It is important to test your shutdown sequence to make sure everything works perfectly before a real power outage happens. You can do this in two ways: a safe software simulation or a full hardware test.

::: warning
Both of these tests will shut down your computers. Save all your work and close all applications before proceeding.
:::

### Software simulation

This test verifies that the primary server can successfully broadcast the emergency signal and that all secondary machines respond correctly. This method ignores the actual battery level and forces an immediate shutdown command across the network.

On your primary server, trigger the forced shutdown signal:

```bash
sudo upsmon -c fsd
```

You should see your secondary devices begin their shutdown sequence first, followed shortly by the primary server. After you power the machines back on, you must clear the emergency flag before the NUT data server starts normally again:

```bash
sudo rm -f /etc/killpower
sudo systemctl restart nut-server
```

### Real world test

While the software test is great for checking network communication, the physical test is the ultimate proof that your entire stack works.

It verifies that the UPS detects the power loss, the driver reads the battery drain, and the monitor automatically triggers the alert when the voltage hits the critical low limit.

Follow these steps to simulate a blackout:

1. **Unplug the UPS:** Physically pull the UPS power cable from the wall socket.
2. **Monitor the dashboards:** Your Homepage and PeaNUT dashboards should immediately update to show the status as **On Battery**.
3. **Wait for the drain:** Let the battery discharge naturally. You can watch the voltage drop on your Netdata charts.
4. **The critical threshold:** Once the voltage hits your configured limit (e.g., 21.0V), the UPS will flag a low battery state.
5. **The graceful exit:** The primary server will detect this state, broadcast the shutdown signal to the secondary devices, and all machines will power off safely.

If all machines shut down gracefully before the UPS battery completely dies, your home server is officially protected from power outages.

## Conclusion

Setting up NUT takes some effort, but it is the only way to make sure your home server handles power outages safely. Instead of hoping you are home to pull the plug, you now have a system that monitors its own health and shuts down gracefully before the battery runs out.

Just remember to check your battery health once in a while. Lead-acid batteries degrade over time, and it is better to find out your capacity has dropped during a scheduled test than during a real blackout.
