#!/bin/bash

# ==============================================================================
# Script de Despliegue Automático para SOC_ORD_WEB
# ==============================================================================

echo "🚀 Iniciando proceso de despliegue a GitHub..."
echo "------------------------------------------------"

# Verifica si hay cambios nuevos o sincroniza el HUB
echo "🔄 0. Sincronizando última versión de HUB_VISORDP..."
SOURCE_HUB="/Users/jmcor/Desktop/SOC_ORD_Project/04_Animaciones_VISORD/HUB_SOC_ORD_SMIb.html"
DEST_HUB="./HUB_SOC_ORD_SMIb.html"

if [ -f "$SOURCE_HUB" ]; then
    cp "$SOURCE_HUB" "$DEST_HUB"
    echo "   ✅ HUB_VISORDP actualizado con éxito para el despliegue."
else
    echo "   ⚠️ Advertencia: No se encontró el archivo origen del HUB en Project. Se usará el existente."
fi

if [[ -n $(git status -s) ]]; then
  # 1. Empaquetar todo
  echo "📦 1. Empaquetando nuevos archivos..."
  git add .

  # 2. Confirmar cambios con fecha y hora
  timestamp=$(date +"%Y-%m-%d %H:%M:%S")
  echo "📝 2. Guardando instantánea: $timestamp"
  git commit -m "Auto-deploy: $timestamp"
else
  echo "✅ No hay archivos nuevos que empaquetar. Pasando directamente a subir actualizaciones pendientes..."
fi

# 3. Subir a la nube
echo "☁️ 3. Subiendo a GitHub Pages..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo "------------------------------------------------"
  echo "🎉 ¡Despliegue completado con éxito!"
  echo "🌐 Tu web estará actualizada en un par de minutos."
else
  echo "------------------------------------------------"
  echo "❌ Error en el despliegue. Revisa la conexión o el Token de Git."
fi
