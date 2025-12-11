#!/bin/bash

# 1. Clean apt cache (System updates)
apt-get clean
apt-get autoremove -y

# 2. Vacuum system logs (Keep only last 2 days)
journalctl --vacuum-time=2d

# 3. Clean package caches (Pip & PNPM)
rm -rf "$HOME/.cache/pip"
rm -rf "$HOME/.local/share/pnpm/store"

# 4. Remove node_modules if they reappear
rm -rf /web_app/frontend/node_modules
