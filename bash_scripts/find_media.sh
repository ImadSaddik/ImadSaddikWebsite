#!/bin/bash

THRESHOLD="$1"

GREEN='\033[0;32m'
BOLD='\033[1m'
NO_COLOR='\033[0m'

printf "${BOLD}%-10s %s${NO_COLOR}\n" "SIZE" "FILE PATH"
echo "---------------------------------------------------"

CMD="find . -type f \( \
    -iname '*.jpg' -o \
    -iname '*.jpeg' -o \
    -iname '*.png' -o \
    -iname '*.gif' -o \
    -iname '*.webp' -o \
    -iname '*.svg' -o \
    -iname '*.ico' -o \
    -iname '*.mp4' -o \
    -iname '*.mov' -o \
    -iname '*.webm' -o \
    -iname '*.avi' -o \
    -iname '*.mkv' \
\)"

if [ ! -z "$THRESHOLD" ]; then
    CMD="$CMD -size +$THRESHOLD"
fi

eval $CMD -print0 | xargs -0 -r du -h | sort -rh
