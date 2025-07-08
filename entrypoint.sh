#!/bin/sh

# SvelteKit Frontend Entrypoint Script
# Reads Docker secrets and sets PUBLIC environment variables

echo "🚀 SvelteKit Frontend starting with domain secrets resolution..."

# Read secrets if available and set PUBLIC environment variables
if [ -f "/run/secrets/frontend_url" ]; then
    export PUBLIC_FRONTEND_URL=$(cat /run/secrets/frontend_url)
    echo "✅ PUBLIC_FRONTEND_URL set from secret: $PUBLIC_FRONTEND_URL"
else
    echo "⚠️ No frontend_url secret found, using environment fallback"
fi

if [ -f "/run/secrets/api_base_url" ]; then
    export PUBLIC_API_BASE_URL=$(cat /run/secrets/api_base_url)
    echo "✅ PUBLIC_API_BASE_URL set from secret: $PUBLIC_API_BASE_URL"
else
    echo "⚠️ No api_base_url secret found, using environment fallback"
fi

# Debug: Show resolved environment variables
echo "🔍 Environment variables resolved:"
echo "  PUBLIC_FRONTEND_URL: $PUBLIC_FRONTEND_URL"
echo "  PUBLIC_API_BASE_URL: $PUBLIC_API_BASE_URL"
echo "  NODE_ENV: $NODE_ENV"

# Start SvelteKit application
echo "🌐 Starting SvelteKit application..."
exec "$@" 