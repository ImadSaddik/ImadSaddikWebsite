# How to use bash scripts

This README file explains how to use the bash scripts located in this directory.

## Optimizing images

### JPEG Images

Use the [optimize_jpeg_images.sh](./optimize_jpeg_images.sh) script to optimize JPEG images.

```bash
./optimize_jpeg_images.sh /path/to/input_file.jpeg /path/to/output_file.jpeg
```

### PNG Images

Use the [optimize_png_images.sh](./optimize_png_images.sh) script to optimize PNG images.

```bash
./optimize_png_images.sh /path/to/input_file.png /path/to/output_file.png
```

## Clean backups

Use the [clean_backups.sh](./clean_backups.sh) script to remove old backup files while keeping a specified number of recent backups.

```bash
./clean_backups.sh 5
```

The script accepts an optional argument for the number of backups to keep (defaults to 5 if not specified). It cleans the following directories:

- `/web_app/backups`
- `/var/lib/meilisearch/dumps`

> [!NOTE]
> Update the target directories inside the script to match your environment.
> The script should be used in the production environment only.

## Run all services with tmux

Use the [run_all_services_tmux.sh](./run_all_services_tmux.sh) script to start all services in a tmux session.

> [!NOTE]
> Change the paths inside the script.

```bash
./run_all_services_tmux.sh
```

## Find large media files

Use the [find_media.sh](./find_media.sh) script to find large media files (images and videos) from the directory where the script is run.

The script accepts an optional size threshold argument (e.g., `500k`, `1M`). If provided, it lists only files larger than the specified size.

```bash
./find_media.sh 500k
```

If no threshold is provided, it lists all media files.

```bash
./find_media.sh
```
