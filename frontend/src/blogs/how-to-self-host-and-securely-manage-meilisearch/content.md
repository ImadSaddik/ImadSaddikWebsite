---
title: "How to self-host and securely manage Meilisearch"
subtitle: "Deploy a lightning-fast open-source search engine on your server and manage it securely."
date: "March 21, 2026"
tags: ["Meilisearch", "Self-hosting", "DevOps", "Search", "Security"]
---

## Introduction

Modern applications require fast, typo-tolerant search features. A standard SQL database struggles with this. It is too slow for full-text search and does not handle spelling mistakes well. To solve this, you need a dedicated search engine.

For this guide, we use [Meilisearch](https://www.meilisearch.com/). It is an open-source, lightning-fast search engine built in Rust.

Hosting your own search engine on the same server as your backend has massive advantages:

- **Zero network latency:** Your API communicates with the search engine over `localhost`, meaning queries resolve in milliseconds.
- **Cost-effective:** You do not have to pay for an expensive managed search [SaaS](https://en.wikipedia.org/wiki/Software_as_a_service).
- **Maximum security:** By running Meilisearch behind a standard server firewall (like [UFW](https://help.ubuntu.com/community/UFW)), it remains completely invisible to the public internet.

Prefer video? Watch the video tutorial:

::: youtube [https://www.youtube.com/embed/9vydd5uXie0](https://www.youtube.com/embed/9vydd5uXie0)
:::

In this article, you will export local search data, install the Meilisearch binary on your server, isolate it using a highly secure "system user", import your data dumps, and set up secure visual management using [SSH tunneling](https://www.ssh.com/academy/ssh/tunneling).

::: warning Important
Throughout this guide, you will see placeholders inside angle brackets like `<YOUR_LOCAL_MASTER_KEY>`, `<YOUR_STRONG_MASTER_KEY>`, etc. You must replace these with your actual keys and remove the brackets when running the commands.
:::

## Export your local data

If you are starting completely fresh with an empty database, you can skip this step and proceed directly to installing the engine. We will cover how to add documents manually later.

However, if you built your application locally first, I assume you have a local Meilisearch instance running with test data. To migrate this data to your new production server, you need to create an export.

Meilisearch offers two ways to back up data: [Snapshots](https://www.meilisearch.com/docs/learn/data_backup/snapshots_vs_dumps#snapshots) and [Dumps](https://www.meilisearch.com/docs/learn/data_backup/snapshots_vs_dumps#dumps).

- **Snapshots** are exact copies of the database files, meant for quick backups on the exact same Meilisearch version.
- **Dumps** are essentially a set of instructions used to recreate the database from scratch. Dumps are the safest way to migrate data across different machines or OS architectures.

Because your local computer and your production server might not have the exact same setup, you must use a dump.

Run this command on your **local machine** (while your local Meilisearch instance is running):

```bash
curl -X POST 'http://localhost:7700/dumps' \
  -H 'Authorization: Bearer <YOUR_LOCAL_MASTER_KEY>'
```

You will get a JSON response back that looks like this:

```json
{
  "taskUid": 1,
  "indexUid": null,
  "status": "enqueued",
  "type": "dumpCreation",
  "enqueuedAt": "2026-03-18T10:00:00.000000Z"
}
```

Take note of the `taskUid` number. Creating a dump is an asynchronous operation, which means Meilisearch does it in the background. You can check the status to see when it finishes by using that ID:

```bash
curl -X GET 'http://localhost:7700/tasks/<YOUR_TASK_UID>' \
  -H 'Authorization: Bearer <YOUR_LOCAL_MASTER_KEY>'
```

Once the status in the response says `succeeded`, your dump file (which looks something like `20260318-100000.dump`) will appear in your local `dumps/` directory.

If you prefer using Python instead of the terminal, you can use the official SDK to do all of this automatically.

First, install the SDK:

::: warning Important
Make sure your local Python virtual environment is active before running the install command. The exact command depends on your local setup (e.g., `source venv/bin/activate`, `conda activate`, or `uv venv`).
:::

```bash
pip install meilisearch
```

Then, run this Python code to create the dump and wait for it to finish:

```python
import meilisearch

meilisearch_client = meilisearch.Client("http://localhost:7700", "<YOUR_LOCAL_MASTER_KEY>")
task = meilisearch_client.create_dump()

meilisearch_client.wait_for_task(task.task_uid)
print("Dump created successfully!")
```

## Install Meilisearch on the server

Now, it is time to set up the engine on your production VM. SSH into your server:

```bash
ssh <YOUR_USERNAME>@<YOUR_SERVER_IP_ADDRESS>
```

Download the latest stable Meilisearch binary using their official installation script.

```bash
curl -L https://install.meilisearch.com | sh
```

This script downloads a single, compiled file named `meilisearch` into your current directory. It is completely self-contained, meaning you don't need to install Rust or any other dependencies.

Make the binary executable and move it to the global `/usr/local/bin/` directory. This ensures the command can be run from anywhere on the system, which is required when we turn it into a background service later.

```bash
chmod +x ./meilisearch
sudo mv ./meilisearch /usr/local/bin/
```

Verify the installation was successful by checking the version:

```output
meilisearch --version
```

If it prints the version number, you are ready to proceed.
