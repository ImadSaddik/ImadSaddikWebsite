#!/bin/bash

# 1. Get the number of backups to keep from the first argument
#    ${1:-5} means: "Use argument 1, but if it is empty, default to 5"
KEEP_COUNT=${1:-5}

# 2. Calculate the offset for tail
#    If we want to keep 5, we need to start deleting from the 6th file.
#    So Offset = Keep Count + 1
OFFSET=$((KEEP_COUNT + 1))

echo "Starting cleanup. Retention policy: Keep last $KEEP_COUNT files."

clean_old_files() {
    TARGET_DIR=$1
    if [ -d "$TARGET_DIR" ]; then
        echo "Cleaning $TARGET_DIR..."
        cd "$TARGET_DIR" || exit

        ls -tp | grep -v '/$' | tail -n +$OFFSET | xargs -I {} rm -- "{}"
    else
        echo "Directory $TARGET_DIR does not exist. Skipping."
    fi
}

# Run the cleanup on your directories
clean_old_files "/web_app/backups"
clean_old_files "/var/lib/meilisearch/dumps"
