#!/bin/bash
# ------------------------------------------------------------------------------
# SOC_ORD WEB DEPLOYMENT SCRIPT (Strict Rule 4)
# ------------------------------------------------------------------------------
echo "🚀 Iniciando proceso de despliegue a GitHub..."
echo "------------------------------------------------"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

git add .
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto-deploy: $TIMESTAMP - Clean 05_Web_Promocional architecture"
echo "☁️ Subiendo a GitHub Pages..."
git push origin HEAD:main

echo "------------------------------------------------"
echo "🎉 ¡Despliegue completado con éxito!"
echo "🌐 Tu web estará actualizada en un par de minutos."
