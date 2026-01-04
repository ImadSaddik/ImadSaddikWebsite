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

PANE_TOP_LEFT_ID=$(tmux list-panes -t "$SESSION_NAME" -F '#{pane_id}')
PANE_BOTTOM_ID=$(tmux split-window -v -p 50 -t "$PANE_TOP_LEFT_ID" -P -F '#{pane_id}')
PANE_TOP_RIGHT_ID=$(tmux split-window -h -p 50 -t "$PANE_TOP_LEFT_ID" -P -F '#{pane_id}')

# Start services in their respective panes using their unique IDs
tmux send-keys -t "$PANE_TOP_LEFT_ID" "echo 'Starting Meilisearch...'; cd '$MEILISEARCH_DIR' && $MEILISEARCH_CMD" C-m
tmux send-keys -t "$PANE_TOP_RIGHT_ID" "echo 'Starting Frontend...'; $BASH_ENV_CMD && cd '$FRONTEND_DIR' && $FRONTEND_CMD" C-m
tmux send-keys -t "$PANE_BOTTOM_ID" "echo 'Starting Backend...'; $BASH_ENV_CMD && cd '$BACKEND_DIR' && $BACKEND_CMD" C-m

tmux attach-session -t $SESSION_NAME
