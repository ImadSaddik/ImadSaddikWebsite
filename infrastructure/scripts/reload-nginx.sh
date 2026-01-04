#!/bin/bash

# Test nginx configuration before reloading
if nginx -t; then
    systemctl reload nginx
else
    echo "nginx configuration test failed. Not reloading."
    exit 1
fi
