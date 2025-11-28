#!/bin/bash

SESSION_NAME="imad_saddik_personal_website"

# Directories (Change these paths as needed)
MEILISEARCH_DIR="$HOME/Programs/meilisearch"
WEBSITE_CODE_DIR="$HOME/Projects/MyWebsite/code"
BACKEND_DIR="$WEBSITE_CODE_DIR/backend"
FRONTEND_DIR="$WEBSITE_CODE_DIR/frontend"

# Commands
BASH_ENV_CMD="source $HOME/.bashrc"
MEILISEARCH_CMD="sudo ./meilisearch --master-key='aStrongMasterKey'"
BACKEND_CMD="conda activate meilisearch && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
FRONTEND_CMD="pnpm run dev"

# Kill any old session and start a new one
tmux kill-session -t $SESSION_NAME 2>/dev/null
tmux new-session -d -s $SESSION_NAME -n "Dev"

# Split the window to create a new pane on top for the other services.
tmux split-window -v -p 50 -t "$SESSION_NAME:0.0"

# Select the top pane and split it horizontally.
tmux select-pane -t "$SESSION_NAME:0.0"
tmux split-window -h -p 50 -t "$SESSION_NAME:0.0"

# Start services in their respective panes
tmux send-keys -t "$SESSION_NAME:0.0" "echo 'Starting Meilisearch...'; cd '$MEILISEARCH_DIR' && $MEILISEARCH_CMD" C-m
tmux send-keys -t "$SESSION_NAME:0.1" "echo 'Starting Frontend...'; $BASH_ENV_CMD && cd '$FRONTEND_DIR' && $FRONTEND_CMD" C-m
tmux send-keys -t "$SESSION_NAME:0.2" "echo 'Starting Backend...'; $BASH_ENV_CMD && cd '$BACKEND_DIR' && $BACKEND_CMD" C-m

tmux attach-session -t $SESSION_NAME
