#!/bin/bash

# Usage: ./optimize_png_images.sh <input_file.png> <output_file.png>

# Immediately exit if any command has a non-zero exit status
set -e

if ! command -v pngquant &> /dev/null; then
  echo "Error: pngquant is not installed." >&2
  echo "Please install it before running the bash script. Try 'sudo apt-get install pngquant' on Ubuntu." >&2
  exit 1
fi

# Check for correct number of arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <input_file> <output_file>" >&2
  exit 1
fi

INPUT_FILE="$1"
OUTPUT_FILE="$2"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: Input file does not exist at '$INPUT_FILE'" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_FILE")"
pngquant --output "$OUTPUT_FILE" "$INPUT_FILE"

echo "Optimization complete."
