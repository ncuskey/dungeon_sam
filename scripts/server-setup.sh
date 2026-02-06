#!/bin/bash
# First-time server setup for Dungeon Sam
# Run this ONCE on the server to set up nginx and SSL
# Usage: ./scripts/server-setup.sh

set -e

DOMAIN="dungeonsam.site"
WEB_ROOT="/var/www/dungeonsam"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Setting up server for $DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install nginx and certbot
echo "🔧 Installing nginx and certbot..."
apt install -y nginx certbot python3-certbot-nginx

# Create web root
echo "📁 Creating web root..."
mkdir -p $WEB_ROOT

# Create nginx configuration
echo "⚙️ Configuring nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name dungeonsam.site www.dungeonsam.site;
    
    root /var/www/dungeonsam;
    index index.html;
    
    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload nginx
nginx -t
systemctl reload nginx

# Get SSL certificate
echo "🔐 Obtaining SSL certificate..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ✅ Server setup complete!"
echo " 🌐 https://$DOMAIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
