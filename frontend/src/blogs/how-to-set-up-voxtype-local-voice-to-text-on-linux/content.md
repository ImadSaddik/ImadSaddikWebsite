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

For typical sentences and short thoughts, modern engines process speech at roughly fifteen times real-time speed. A four-second sentence transcribes in a fraction of a second. Clean text appears at your cursor almost the moment you release the key, without any of the instability of streaming.

## Choosing the right transcription model

Voxtype supports several transcription backends, including cloud APIs like Cohere and local models like Whisper and NVIDIA Parakeet. Because privacy, zero network latency, and offline reliability were primary requirements for my setup, I ruled out cloud services immediately and focused entirely on local models.

When people think of local transcription, OpenAI Whisper is almost always the default choice. Whisper has been around for years and has had plenty of time to be optimized across different platforms and tools. I used Whisper for my earlier manual scripts, and it is still a solid, capable model that deserves its popularity.

Because Whisper is so familiar, many people stick with it without realizing that newer speech architectures have emerged. Whisper was built as a heavy multilingual model designed to translate dozens of languages. Running that full pipeline on a CPU can feel sluggish during desktop dictation, and it can occasionally get stuck repeating words if there is background noise.

This is why I wanted to explore newer alternatives like NVIDIA Parakeet. Specifically, Voxtype supports `parakeet-tdt-0.6b-v3` through its ONNX runtime. It uses a FastConformer-TDT architecture trained on over 670,000 hours of speech. Instead of predicting text one word at a time in a slow loop, it evaluates chunks of speech in parallel.

For my workflow, Parakeet checked every box. I wanted a model that looks at the entire recording, handles capitalization and punctuation naturally, and runs at fifteen to twenty times real-time speed on the CPU. Parakeet delivered exactly that.
