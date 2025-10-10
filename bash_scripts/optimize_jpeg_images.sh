#!/bin/bash

# Usage: ./optimize_jpeg_images.sh <input_file.jpeg> <output_file.jpeg>

# Immediately exit if any command has a non-zero exit status
set -e

if ! command -v jpegoptim &> /dev/null; then
  echo "Error: jpegoptim is not installed." >&2
  echo "Please install it before running the bash script. Try 'sudo apt-get install jpegoptim' on Ubuntu." >&2
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

cp "$INPUT_FILE" "$OUTPUT_FILE"
jpegoptim --max=80 --strip-all --all-progressive "$OUTPUT_FILE"

echo "Optimization complete."
