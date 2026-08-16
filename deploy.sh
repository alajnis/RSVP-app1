#!/bin/bash
# Deploy script for Dokploy
# This script should be run on the server to pull latest changes

cd /opt/dokploy/rsvp-app || cd /app || exit 1
git pull origin main
echo "Deploy completed at $(date)" >> /tmp/deploy.log
