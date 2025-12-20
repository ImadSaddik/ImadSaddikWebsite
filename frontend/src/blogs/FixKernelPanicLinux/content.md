# How to fix the kernel panic problem after installing a new version of the kernel

A step-by-step guide to recovering your Linux system from a broken kernel update using GRUB.

**Date:** December 20, 2025

**Tags:** Linux, Ubuntu, Kernel panic, GRUB, Troubleshooting

---

## Introduction

While using my Ubuntu laptop one night, I started an update to the newest Linux kernel. I was exhausted, so once the process finished, I went to sleep immediately without looking to see if it was successful.

That turned out to be a big mistake. I discovered this the next morning when I turned on my laptop and was greeted by a bright pink screen with the words: `KERNEL PANIC!` The installation had failed, and the new kernel was not working correctly.

At first, I didn't know what to do, so I just kept restarting my laptop, hoping the problem would disappear. When that failed, I tried booting into Windows from the GRUB menu, and it worked perfectly.

This confirmed that the issue was caused by the kernel update I had run the day before. With the problem identified, I started researching and thankfully found a way to fix my Linux installation without losing any data.

In this article, I will share the exact steps I took to fix this problem. My goal is to give you a clear solution to fix this error if you ever run into it.

---

## The GRUB menu

After turning on the laptop, the first screen you'll see is the [GNU GRUB](https://en.wikipedia.org/wiki/GNU_GRUB) menu. GRUB is a **[bootloader](https://en.wikipedia.org/wiki/Bootloader)**, a program that lets you choose which operating system to start.

If you have more than one OS, it allows you to choose which one to boot. We will use this menu to select a special option that lets us start Ubuntu with an older kernel, bypassing the one that is causing the panic.

_The GNU GRUB menu._

The first option in the list is `Ubuntu`. This option is automatically set to boot the newest kernel you have installed. Since the newest kernel is the broken one, selecting this will take you right back to the pink kernel panic screen. We need to choose a different option instead.

_The scary kernel panic screen!_

---

## Fixing the problem

### Boot into a working Linux kernel

From the main GRUB menu, use your arrow keys to select `Advanced options for Ubuntu` and press Enter. This will take you to a new screen listing all the Linux kernels installed on your system.

You will see at least two versions. For example, my list showed a new, broken kernel (`6.14.0-24-generic`) and an older, working one (`6.11.0-29-generic`).

_The different versions of the Linux kernel._

The menu doesn't label which kernel is broken. You may need to do a quick test to find a working version. Simply select one from the list and press Enter. If you see the kernel panic screen again, just reboot your computer and try a different one until your system starts successfully.

### Remove the broken kernel

Now that your system is running on a working kernel, it's time to remove the broken one to clean your system.

First, we need to know exactly which kernel you are currently using. This is the safe kernel that you must **not** delete. Open a terminal and run this command:

```bash
uname -r

```

The output will be your current kernel's version.

```text
6.11.0-29-generic

```

Next, list all the kernel packages on your system to find the broken one.

```bash
dpkg --list | grep linux-image

```

You will see a list of kernels. Look for letters like `ii` or `iF` at the beginning of each line.

- `ii` means the kernel is correctly installed. Your working kernel from the previous step should have `ii` next to it.
- `iF` means the kernel installation failed, and it's in a broken state. **This is the one we need to remove.**
- `rc` means the kernel was removed, but its configuration files are still there.

```text
rc linux-image-6.11.0-17-generic 6.11.0-17.17~24.04.2 amd64 Signed kernel image generic
rc linux-image-6.11.0-19-generic 6.11.0-19.19~24.04.1 amd64 Signed kernel image generic
rc linux-image-6.11.0-21-generic 6.11.0-21.21~24.04.1+1 amd64 Signed kernel image generic
rc linux-image-6.11.0-24-generic 6.11.0-24.24~24.04.1 amd64 Signed kernel image generic
rc linux-image-6.11.0-25-generic 6.11.0-25.25~24.04.1 amd64 Signed kernel image generic
rc linux-image-6.11.0-26-generic 6.11.0-26.26~24.04.1 amd64 Signed kernel image generic
rc linux-image-6.11.0-28-generic 6.11.0-28.28~24.04.1 amd64 Signed kernel image generic
ii linux-image-6.11.0-29-generic 6.11.0-29.29~24.04.1 amd64 Signed kernel image generic
iF linux-image-6.14.0-24-generic 6.14.0-24.24~24.04.3 amd64 Signed kernel image generic
rc linux-image-6.8.0-41-generic 6.8.0-41.41 amd64 Signed kernel image generic
rc linux-image-6.8.0-44-generic 6.8.0-44.44 amd64 Signed kernel image generic
rc linux-image-6.8.0-45-generic 6.8.0-45.45 amd64 Signed kernel image generic
rc linux-image-6.8.0-47-generic 6.8.0-47.47 amd64 Signed kernel image generic
rc linux-image-6.8.0-48-generic 6.8.0-48.48 amd64 Signed kernel image generic
rc linux-image-6.8.0-49-generic 6.8.0-49.49 amd64 Signed kernel image generic
rc linux-image-6.8.0-50-generic 6.8.0-50.51 amd64 Signed kernel image generic
rc linux-image-6.8.0-51-generic 6.8.0-51.52 amd64 Signed kernel image generic
rc linux-image-6.8.0-52-generic 6.8.0-52.53 amd64 Signed kernel image generic
ii linux-image-generic-hwe-24.04 6.14.0-24.24~24.04.3 amd64 Generic Linux kernel image

```

Now we will completely remove the broken kernel and its matching header files. We use `apt purge` because it deletes the configuration files as well.

> **Warning:** Double-check that this is **NOT** the version you are currently using (from the `uname -r` command).

```bash
sudo apt purge linux-image-6.14.0-24-generic linux-headers-6.14.0-24-generic

```

After removing the kernel, run `autoremove` to get rid of any other packages that are no longer needed.

```bash
sudo apt autoremove --purge

```

Finally, update your GRUB menu and restart the computer to make sure everything is perfect.

```bash
sudo update-grub

```

Now, reboot your laptop to make sure that everything is set correctly. It should boot directly into your 6.11 kernel when clicking on `Ubuntu` in the GRUB menu.

_Success! The system is working again._

---

## Conclusion

And that's it! By using the GRUB menu to boot into an older, working kernel, you can get your system back online safely. From there, it only takes a few terminal commands to remove the broken kernel and clean your system.

I hope this guide helped you solve the issue.
