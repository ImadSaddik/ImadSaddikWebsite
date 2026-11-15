---
title: "How to set up Voxtype for local voice-to-text on Linux"
subtitle: "Configure local, direct-to-cursor voice dictation across any desktop application using NVIDIA Parakeet and Wayland."
date: "November 7, 2026"
tags: ["Linux", "Voxtype", "AI", "Speech to text", "Productivity", "Wayland", "Ubuntu"]
---

## Introduction

For a long time, whenever I wanted to capture quick thoughts or feed context to local LLMs without typing, I relied on a manual transcription workflow. I recorded an audio file, ran a local script powered by the Whisper model, waited for the output text file to generate, opened it, and copied and pasted the text into my editor or browser.

While that workflow worked well for transcribing long audio and video files, it added too much overhead for everyday tasks. Going through a multi-step routine every time I wanted to feed context to a model or capture a quick thought was exhausting, and I found myself avoiding voice input entirely.

I needed a setup that would let me press a shortcut, speak my thoughts, and have the text appear directly at my cursor. It also had to run completely offline, protect my privacy, and require zero cloud subscriptions.

While looking for a better way, I heard Martin talk about [Voxtype](https://github.com/peteonrails/voxtype) on the Linux Matters episode ["Talking to my Computer"](https://linuxmatters.sh/88/). After setting it up and using it daily for the past two weeks, it has completely replaced my old transcription script.

In this guide, you will learn how to set up Voxtype on Ubuntu and Wayland, why NVIDIA Parakeet outperforms Whisper for desktop dictation, and the configuration adjustments that make it reliable for everyday writing.

::: info Scope of this guide
I wrote and tested this guide on Ubuntu 26.04 with GNOME on Wayland. The prebuilt `.deb` package requires Ubuntu 24.04 or newer (`glibc 2.39+`), and Voxtype also supports other Linux distributions, desktop environments, and macOS. If you are on an older Ubuntu release or a different system, check the [Voxtype repository](https://github.com/peteonrails/voxtype) for installation and shortcut instructions tailored to your setup.
:::

Here is the finished setup in action. I press [[Ctrl+Alt+Space]] to start recording, speak, and press the shortcut again to insert the transcribed text at my cursor.

::: video ./voxtype_demo.webm "Pressing Ctrl + Alt + Space starts recording and inserts the transcribed text when toggled off."
:::

## The friction of my manual transcription setup

Before setting up Voxtype, my transcription workflow was entirely file-based. Whenever I wanted to transcribe my thoughts, I opened Audacity, recorded my voice, and exported the audio to an MP3 file. Then, I switched to the terminal to run my local transcription script against that file, waited for it to write the text output to disk, opened the resulting file, and copied the text to my clipboard.

Even with a script handling the transcription, that routine created several friction points:

- I had to switch focus between my active application, Audacity, and the terminal.
- I had to manage temporary audio recordings and text files on disk for a single sentence.
- I had to open the file, copy the text, and paste it back into my original window.

To make voice dictation feel as natural as typing on a physical keyboard, the tool must inject keystrokes directly into whatever window holds focus the moment you stop speaking.

## Streaming versus push-to-talk

When I started exploring voice dictation, I assumed it had to stream words in real time onto the screen as I spoke. Watching words appear live seemed like the natural way for voice input to work. After testing push-to-talk, I found that waiting until you finish speaking provides a much better experience for desktop text entry.

Streaming speech engines predict text incrementally without knowing how your sentence will end. Because the model lacks future context, it often has to revise earlier words on the fly by firing synthetic backspaces at your cursor, which can cause jitter or trigger autocomplete popups in code editors.

More importantly, real-time streaming struggles with punctuation and homophones. The model cannot hear the end of a clause before deciding where a comma belongs or which word you meant.

Push-to-talk avoids these compromises by feeding the entire audio segment to the model at once. Because the engine hears the full sentence before predicting tokens, it understands the context, resolves homophones accurately, and places punctuation naturally.

For everyday sentences and short thoughts, modern engines process speech at roughly fifteen times real-time speed. A four-second sentence transcribes in a fraction of a second. Clean text appears at your cursor almost the moment you release the key, without any of the instability of streaming.

## Choosing the right transcription model

Voxtype supports several transcription backends, including cloud APIs like Cohere and local models like Whisper and NVIDIA Parakeet. Because privacy, zero network latency, and offline reliability were primary requirements for my setup, I ruled out cloud services immediately and focused entirely on local models.

When people think of local transcription, OpenAI Whisper is almost always the default choice. Whisper has been around for years and has had plenty of time to be optimized across different platforms and tools. I used Whisper for my earlier manual scripts, and it is still a solid, capable model that deserves its popularity.

Because Whisper is so familiar, many people stick with it without realizing that newer speech architectures have emerged. Whisper was built as a heavy multilingual model designed to translate dozens of languages. Running that full pipeline on a CPU can feel sluggish during desktop dictation, and it can occasionally get stuck repeating words if there is background noise.

This is why I wanted to explore newer alternatives like NVIDIA Parakeet. Specifically, Voxtype supports [parakeet-tdt-0.6b-v3](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) through its ONNX runtime. It uses a FastConformer-TDT architecture trained on over 670,000 hours of speech.

For my workflow, Parakeet checked every box. I wanted a model that looks at the entire recording, handles capitalization and punctuation naturally, and runs at fifteen to twenty times real-time speed on the CPU. Parakeet delivered exactly that.

## Why I run on the CPU instead of the GPU

My laptop is equipped with a 13th Gen Intel Core i7 processor and an NVIDIA GeForce RTX 4070 Laptop GPU. When I first looked at local transcription, offloading inference to the GPU seemed like the obvious choice.

However, video memory is a scarce resource on laptops. My GPU has 8 GB of VRAM, which I rely on for gaming, running local language models, and training AI models. To keep dictation responsive without reloading weights on every shortcut press, Voxtype holds the model in memory, which consumes around 2.5 to 3 GB for `parakeet-tdt-0.6b-v3` (larger models use more).

Putting that on an 8 GB GPU would take up more than a third of my video memory while sitting idle. In contrast, my laptop has 32 GB of system RAM. Holding 2.5 to 3 GB in system memory consumes less than 10 percent of my available RAM, leaving plenty of room for everything else.

Power consumption and thermals are another major factor. Dedicated laptop GPUs draw significant power every time they wake from an idle state. Running transcription on the CPU lets the RTX 4070 idle at around 3 watts, which prevents battery drain and keeps cooling fans completely silent throughout the day.

Finally, the GPU compute advantage is negligible for everyday text entry. A GPU clearly processes large audio files faster, but for short sentences and quick thoughts, modern CPUs running [AVX2](https://en.wikipedia.org/wiki/Advanced_Vector_Extensions) instructions finish the job in the blink of an eye. In practice, waking an idle GPU from its power-saving state can take longer than the transcription itself.

## The Wayland typing challenge

When I started testing local dictation, I realized that transcribing speech was only half the problem. The other half was getting that text to appear directly at my cursor.

On modern Linux systems running Wayland, this is surprisingly tricky. Wayland isolates applications from one another for security. By default, a background daemon cannot inject keystrokes into your active code editor or browser window.

While some minimal window managers allow background typing through custom Wayland protocols, desktop environments like GNOME block this behavior for privacy. If an input tool tries to type directly through the Wayland display server, it fails immediately.

To solve this, Voxtype relies on `ydotool`. Instead of asking the Wayland compositor for permission, `ydotool` communicates directly with the Linux kernel through `/dev/uinput`. The kernel exposes a virtual input device, so your desktop receives the transcribed text as if you typed it on a physical keyboard.

::: image ./wayland_ydotool_flow.webp "Diagram showing direct Wayland keystroke injection blocked while ydotool sends input through /dev/uinput."
Wayland blocks background daemons from injecting keystrokes directly, while `ydotool` routes input through `/dev/uinput` as a virtual keyboard.
:::

This design makes direct-to-cursor dictation work across any application. Because `/dev/uinput` is locked down to prevent arbitrary programs from faking keystrokes, you need to add your user to the `input` group so `ydotool` can access it.

## Setting up Voxtype on Ubuntu

Getting Voxtype and Parakeet running on my Ubuntu setup took four steps. I had to configure virtual input permissions, install the package, switch to the ONNX runtime with Parakeet, and enable the background daemon.

### Install dependencies and configure input permissions

First, install `ydotool` for virtual typing along with the required clipboard and audio packages:

```bash
sudo apt update
sudo apt install -y ydotool libvulkan1 wl-clipboard pipewire-alsa libnotify-bin wget
```

Next, add your user account to the `input` group so `ydotool` can access the `/dev/uinput` kernel device:

```bash
sudo usermod -aG input $USER
```

Enable and start the user-level `ydotool` service:

```bash
systemctl --user enable --now ydotool
```

::: warning
Linux group permission changes only take effect after starting a fresh session. You must log out of your desktop and log back in (or reboot) for your user account to gain access to `/dev/uinput`.
:::

### Install Voxtype

Download the latest `.deb` release package [from GitHub](https://github.com/peteonrails/voxtype/releases) and install it with `apt`:

```bash
wget https://github.com/peteonrails/voxtype/releases/download/v1.1.1/voxtype_1.1.1-1_amd64.deb
sudo apt install -y ./voxtype_1.1.1-1_amd64.deb
rm voxtype_1.1.1-1_amd64.deb
```

### Switch to the ONNX runtime and download Parakeet

Whisper models run on Voxtype's default binary, but Parakeet runs on the ONNX runtime. Switch the system binary to the ONNX variant:

```bash
sudo voxtype setup onnx --enable
```

Always run model downloads and configuration commands as your regular user without `sudo`. This practice keeps model files and settings inside your home directory.

Download the Parakeet model and activate it in your configuration:

```bash
voxtype setup --download --model parakeet-tdt-0.6b-v3 --activate
```

This command downloads the model files to `~/.local/share/voxtype/models/parakeet-tdt-0.6b-v3`. The `--activate` flag updates `~/.config/voxtype/config.toml` automatically by setting `engine = "parakeet"` and `model = "parakeet-tdt-0.6b-v3"` so you do not have to edit the file manually.

### Enable the background daemon

Voxtype runs as a user-level systemd service. Keeping the daemon active ensures the model stays loaded in memory, which lets keyboard shortcuts trigger recording and transcription instantly.

Reload the systemd user manager and start the service:

```bash
systemctl --user daemon-reload
systemctl --user enable --now voxtype
```

Verify that the daemon is active and running:

```bash
systemctl --user status voxtype
```

## Setting up the global shortcut in GNOME

Because GNOME manages keyboard shortcuts globally, I disabled Voxtype's built-in hotkey listener and let GNOME trigger recording through the command line.

In `~/.config/voxtype/config.toml`, make sure the internal listener is disabled:

```toml
[hotkey]
enabled = false
```

Next, open GNOME Settings and navigate to the **Keyboard** section. Click **View and Customize Shortcuts** to open the shortcut management modal.

::: image ./1_open_keyboard_shortcuts.webp "Opening keyboard shortcuts in GNOME Settings."
Clicking View and Customize Shortcuts inside the GNOME Keyboard settings panel.
:::

Scroll to the bottom of the shortcuts modal and select **Custom Shortcuts**.

::: image ./2_select_custom_shortcuts.webp "Selecting Custom Shortcuts in the GNOME shortcuts modal."
Navigating to Custom Shortcuts at the bottom of the list.
:::

Click **Add Shortcut** to create a new keybinding and fill in the shortcut properties:

- **Name**: Voxtype Dictation
- **Command**: `voxtype record toggle`
- **Shortcut**: [[Ctrl+Alt+Space]] (or your preferred key combination)

Click **Set Shortcut**, press your desired key combination, and click **Add** to save.

::: image ./3_configure_custom_shortcut_modal.webp "Filling in the custom shortcut details for Voxtype."
Setting the name, command, and key combination in the Add Custom Shortcut dialog.
:::

With this shortcut set up, you can dictate text anywhere on your desktop. Pressing [[Ctrl+Alt+Space]] once starts recording, and a microphone icon appears in the top bar to show that your microphone is being used. Pressing the shortcut again stops recording, the icon disappears, and Voxtype types the transcribed text directly at your cursor.

## Useful tweaks after two weeks of use

After using Voxtype as my primary dictation tool for two weeks, I made two adjustments in `~/.config/voxtype/config.toml` to fit my daily workflow.

### Silencing notification banners

By default, Voxtype can show desktop notifications when recording starts, when recording stops, and when transcription finishes.

While these notifications are helpful when troubleshooting your initial setup, they get in the way when you dictate frequently throughout the day. Your text already appears at your cursor, so having extra banners slide in is unnecessary.

To disable alerts for recording start, recording stop, and completed transcriptions, find the `[output.notification]` section in `~/.config/voxtype/config.toml` and set all three options to `false`:

```toml
[output.notification]
on_recording_start = false
on_recording_stop = false
on_transcription = false
```

### Tuning duration limits for longer thoughts

The second issue I encountered happened when recording longer sessions. When you speak past the built-in limit, Voxtype stops recording before you finish and processes whatever audio it captured up to that point. I want to be able to record for as long as I need without getting cut off.

This happens because Voxtype includes a safety guard called `max_duration_secs`, which defaults to **60 seconds**. It keeps a recording from running indefinitely and wasting memory or disk space if you forget to toggle it off.

If you want to record for longer than the default 60-second limit, open `~/.config/voxtype/config.toml` and increase `max_duration_secs` under the `[audio]` section:

```toml
[audio]
sample_rate = 16000
# Increase maximum duration to 5 minutes (300 seconds)
max_duration_secs = 300
```

After modifying your configuration, restart the user daemon to apply the changes:

```bash
systemctl --user restart voxtype
```

### Memory retention

Voxtype keeps the active model resident in system memory by default (`on_demand_loading = false`).

On a machine with 16 GB or 32 GB of RAM, dedicating 2.5 to 3 GB of memory to keep Parakeet warm means every dictation responds with zero startup latency. If you are working on a memory-constrained machine, you can set `on_demand_loading = true` so Voxtype loads the model only for dictation and frees that memory right after transcription.

## Conclusion

Replacing my old Audacity and Whisper script workflow with Voxtype turned voice input from a multi-step chore into something I use every day. Instead of managing temporary audio and text files on disk, you press [[Ctrl+Alt+Space]], speak your thoughts, and get the transcribed text directly at your cursor.

Running NVIDIA Parakeet on the CPU through the ONNX runtime keeps transcription fast while leaving your GPU idle and your VRAM free for other workloads. Combined with `ydotool` for Wayland typing, a global GNOME shortcut, and a couple of configuration adjustments for notifications and recording duration, you get a reliable, offline dictation setup that stays completely on your machine.

I hope this guide helps you set up local voice-to-text on your Linux desktop.
