#!/bin/bash
# Deploy Dungeon Sam to production server
# Usage: ./deploy.sh

set -e

SERVER="165.227.241.60"
SSH_KEY="./ssh"
SSH_USER="root"
REMOTE_PATH="/var/www/dungeonsam"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Deploying Dungeon Sam to $SERVER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Build the project
echo "📦 Building production bundle..."
npm run build

# Ensure SSH key has correct permissions
chmod 600 "$SSH_KEY"

# Create remote directory if it doesn't exist
echo "🔧 Setting up remote directory..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SSH_USER@$SERVER" "mkdir -p $REMOTE_PATH"

# Upload dist folder
echo "🚀 Uploading files..."
rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  ./dist/ "$SSH_USER@$SERVER:$REMOTE_PATH/"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✅ Deployed to $SERVER"
echo " 🌐 https://dungeonsam.site"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
