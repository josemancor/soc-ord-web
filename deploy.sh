#!/bin/bash
# ------------------------------------------------------------------------------
# NEX_ORD WEB DEPLOYMENT SCRIPT (Strict Rule 4)
# Sincroniza desde NEX_ORD_Project/05_Web_Promocional hacia NEX_ORD_WEB y publica en GitHub Pages.
# ------------------------------------------------------------------------------
echo "🚀 Iniciando proceso de despliegue a GitHub Pages..."
echo "------------------------------------------------"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
WEB_DIR="/Users/jmcor/Desktop/SOC_ORD_WEB"

echo "📦 Sincronizando 05_Web_Promocional hacia NEX_ORD_WEB..."
rsync -av --delete --exclude='.git' --exclude='.gitignore' --exclude='.DS_Store' "$SCRIPT_DIR/" "$WEB_DIR/"

cd "$WEB_DIR"

git add -A
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto-deploy: $TIMESTAMP - VISORD_demo & NEX_ORD Web sync" || true
echo "☁️ Subiendo a GitHub Pages..."
git push origin main

echo "------------------------------------------------"
echo "🎉 ¡Despliegue completado con éxito!"
echo "🌐 Tu web estará actualizada en un par de minutos en https://josemancor.github.io/nex-ord-web/"
