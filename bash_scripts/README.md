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

## Run all services with tmux

Use the [run_all_services_tmux.sh](./run_all_services_tmux.sh) script to start all services in a tmux session.

> [!NOTE]
> Change the paths inside the script.

```bash
./run_all_services_tmux.sh
```
