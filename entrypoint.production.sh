#!/bin/sh

# Load secrets if available
if [ -f "/run/secrets/api_base_url" ]; then
    export PUBLIC_API_BASE_URL=$(cat /run/secrets/api_base_url)
fi

if [ -f "/run/secrets/frontend_url" ]; then
    export PUBLIC_FRONTEND_URL=$(cat /run/secrets/frontend_url)
fi

# Execute the main command
exec "$@"
