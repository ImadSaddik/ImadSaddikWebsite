#!/bin/bash

SESSION_NAME="imad_saddik_personal_website"

if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "Session found. Stopping services..."
  tmux send-keys -t "$SESSION_NAME:0.0" C-c
  tmux send-keys -t "$SESSION_NAME:0.1" C-c
  tmux send-keys -t "$SESSION_NAME:0.2" C-c
  sleep 1
  tmux kill-session -t "$SESSION_NAME"
  echo "Session '$SESSION_NAME' stopped."
else
  echo "Session '$SESSION_NAME' does not exist."
fi
