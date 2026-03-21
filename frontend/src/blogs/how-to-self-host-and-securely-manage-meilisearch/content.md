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
- **Cost-effective:** You don't have to pay for an expensive managed search [SaaS](https://en.wikipedia.org/wiki/Software_as_a_service).
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

## Create a dedicated system user

Running applications as `root` is a massive security risk. Instead of running Meilisearch as `root` or under your personal user account, you should create a dedicated [system user](https://wiki.archlinux.org/title/Users_and_groups#Example_adding_a_system_user) specifically for this service.

System users are "dummy" accounts. They exist purely to own files and run specific background processes. They have no password and cannot accept login attempts, making them immune to SSH brute-force attacks.

Run this command to create the user:

```bash
sudo useradd -d /var/lib/meilisearch -s /bin/false -m -r meilisearch
```

This command looks complex, so let's break down exactly what each flag does:

- `sudo useradd`: This is the command to add a user. It's different from `adduser` as it does not prompt you for a password or full name.
- `-d /var/lib/meilisearch`: This flag sets the user's **home directory**. Instead of the default `/home/meilisearch`, you set it to `/var/lib/meilisearch`, which is the standard Linux directory path for a background service's data.
- `-s /bin/false`: This flag sets the user's **shell**. `/bin/false` is a dummy shell that immediately exits and does nothing. This is what makes it **impossible for anyone to log in** as this user.
- `-m`: This flag tells `useradd` to physically **create the home directory** you specified with the `-d` flag.
- `-r`: This flag creates the **system user**.

Next, create a specific folder inside that home directory for the actual database files, and ensure the new system user owns everything inside its home directory.

```bash
sudo mkdir -p /var/lib/meilisearch/data
sudo chown -R meilisearch:meilisearch /var/lib/meilisearch
```

## Transfer and import the dump

::: info Note
If you are starting from scratch and didn't create a dump file in the previous step, you can skip this section and go straight to [Run Meilisearch as a service](#run-meilisearch-as-a-service).
:::

You need to get the dump file from your computer over to the server.

First, log out of your active SSH session by typing `exit` or pressing `Ctrl+D`. Once you are back in your local terminal, use the `scp` command to upload the file.

You are going to send it to the `/tmp/` directory for now. We do this because `/tmp/` is openly writable by any user, whereas our final destination (`/var/lib/meilisearch`) is strictly locked down.

```bash
scp /path/to/your/local/dumps/<YOUR_DUMP_FILE.dump> <YOUR_USERNAME>@<YOUR_SERVER_IP_ADDRESS>:/tmp/
```

**SSH back in** to the machine.

```bash
ssh <YOUR_USERNAME>@<YOUR_SERVER_IP_ADDRESS>
```

Move the dump file from the temporary folder to the Meilisearch directory, and immediately transfer the file ownership to the `meilisearch` user. If you skip the `chown` command, the Meilisearch service will crash because it won't have permission to read the file uploaded by your user account.

```bash
sudo mv /tmp/<YOUR_DUMP_FILE.dump> /var/lib/meilisearch/
sudo chown meilisearch:meilisearch /var/lib/meilisearch/<YOUR_DUMP_FILE.dump>
```

## Run Meilisearch as a service

You don't want to run Meilisearch manually in a terminal. You want it to run in the background, start automatically when the server boots, and restart if it crashes.

To do this, you will use [systemd](https://systemd.io/), which is the built-in service manager that comes with Ubuntu. It is the industry standard for managing low-level background services and infrastructure.

### Create the environment file

You must secure your search engine with a strong Master Key. Instead of hardcoding this sensitive information directly into the service file, you will create a secure environment file. This keeps your secrets hidden from anyone viewing the server's process list via commands like `ps`.

First, create a directory for the configuration and create the environment file:

```bash
sudo mkdir -p /etc/meilisearch
sudo nano /etc/meilisearch/env
```

Paste the following configuration into the file. Meilisearch automatically detects environment variables that start with `MEILI_`.

```ini
MEILI_ENV=production
MEILI_MASTER_KEY=<YOUR_STRONG_MASTER_KEY>
```

::: warning Important
Replace `<YOUR_STRONG_MASTER_KEY>` with a long, randomized string (at least 16 bytes). Do not use spaces or quotes.

You can easily generate a secure key directly in your terminal by running:

```bash
openssl rand -hex 32
```

:::

Secure the file so that only the `meilisearch` user and `root` can read it:

```bash
sudo chown meilisearch:meilisearch /etc/meilisearch/env
sudo chmod 600 /etc/meilisearch/env
```

### Create the systemd service file

Now, create the service file that tells Ubuntu how to manage Meilisearch:

```bash
sudo nano /etc/systemd/system/meilisearch.service
```

Paste the configuration below, but pay close attention to the `ExecStart` command depending on whether you are importing data.

::: warning Important
**If you are importing a dump file:** Leave the code exactly as it is below, but replace `<YOUR_DUMP_FILE.dump>` with the actual filename you uploaded earlier.

**If you are starting with a fresh, empty database:** Delete the two lines starting with `--import-dump` and `--ignore-dump-if-db-exists` entirely.
:::

```ini
[Unit]
Description=Meilisearch search engine
After=network.target

[Service]
Type=simple
User=meilisearch
Group=meilisearch

EnvironmentFile=/etc/meilisearch/env
WorkingDirectory=/var/lib/meilisearch

ExecStart=/usr/local/bin/meilisearch \
  --db-path "/var/lib/meilisearch/data" \
  --dump-dir "/var/lib/meilisearch/dumps" \
  --import-dump "/var/lib/meilisearch/<YOUR_DUMP_FILE.dump>" \
  --ignore-dump-if-db-exists

Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Let's explain this configuration file:

- `After=network.target`: This tells Linux: "Do not attempt to start this service until the server's networking stack is fully active."
- `EnvironmentFile=...`: This securely loads the `MEILI_ENV` and `MEILI_MASTER_KEY` variables from the file you just created.
- `ExecStart=...`: This is the exact command that runs. It points to the binary, specifies where the database should be stored (`--db-path`), and tells Meilisearch where to save future dumps (`--dump-dir`).
- `--import-dump`: This tells Meilisearch to load your local data from the specified file on its first start.
- `--ignore-dump-if-db-exists`: This is a safety feature. It tells Meilisearch to skip the dump import entirely if a database already exists in the `data` folder.
- `Restart=on-failure`: If the process crashes or gets killed due to low memory, `systemd` will automatically spin it back up.

Save the file and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

### Enable and start the service

Now, tell `systemd` to recognize your new file, enable it to start on boot, and start it immediately:

```bash
sudo systemctl daemon-reload
sudo systemctl enable meilisearch
sudo systemctl start meilisearch
```

Check the status to ensure it did not crash during the import or startup process:

```bash
sudo systemctl status meilisearch
```

You should see `active (running)` in the output.

```output
● meilisearch.service - Meilisearch
    Loaded: loaded (/etc/systemd/system/meilisearch.service; enabled; preset: enabled)
    Active: active (running) since Sat 2026-11-01 07:13:50 UTC; 21s ago
  Main PID: 44061 (meilisearch)
    Tasks: 46 (limit: 503)
    Memory: 164.8M (peak: 165.0M)
      CPU: 505ms
```

::: info Note
If you started with a fresh database and didn't import a dump, you can skip the following verification step and the cleanup step.
:::

If you imported a dump, you can explicitly verify that your data was imported by asking Meilisearch for index statistics. Use `127.0.0.1` because the engine is running locally on the server.

```bash
curl -X GET 'http://127.0.0.1:7700/indexes/<YOUR_INDEX_NAME>/stats' \
  -H 'Authorization: Bearer <YOUR_STRONG_MASTER_KEY>'
```

If the import worked, you will see a JSON response detailing your documents:

```json
{
  "numberOfDocuments": 10,
  "rawDocumentDbSize": 434176,
  "avgDocumentSize": 43409,
  "isIndexing": false,
  "numberOfEmbeddings": 0,
  "numberOfEmbeddedDocuments": 0,
  "fieldDistribution": {
    "...": "..."
  }
}
```

### Clean up the service file

Once your service is running and the data is imported, you should clean up the service file.

Leaving the `--import-dump` flag in your configuration permanently is a hidden risk. If you (or an automated script) ever delete that `.dump` file to clean up your directory, Meilisearch will fatally crash on the next server reboot because it will hunt for a file that no longer exists.

Open the service file again:

```bash
sudo nano /etc/systemd/system/meilisearch.service
```

Remove these two lines from the `ExecStart` command:

```ini
  --import-dump "/var/lib/meilisearch/<YOUR_DUMP_FILE.dump>" \
  --ignore-dump-if-db-exists
```

Save the file, then reload systemd and restart the service to apply the clean configuration:

```bash
sudo systemctl daemon-reload
sudo systemctl restart meilisearch
```
