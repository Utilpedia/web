#!/bin/bash
# Azure App Service startup script
# Next.js automatically uses PORT env var if set

echo "Starting Next.js on port ${PORT:-3000}..."
exec next start -p ${PORT:-3000}

