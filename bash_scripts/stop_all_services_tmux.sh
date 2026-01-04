#!/bin/bash

SESSION_NAME="imad_saddik_personal_website"

if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "Session found. Stopping services..."
  tmux list-panes -t "$SESSION_NAME" -F '#{pane_id}' | xargs -I paneID tmux send-keys -t paneID C-c
  sleep 1
  tmux kill-session -t "$SESSION_NAME"
  echo "Session '$SESSION_NAME' stopped."
else
  echo "Session '$SESSION_NAME' does not exist."
fi
