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
