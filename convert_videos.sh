#!/bin/bash
cd "$(dirname "$0")"
mkdir -p assets
for f in n_videos/*.mov; do
    filename=$(basename "$f")
    name="${filename%.*}"
    echo "Converting $f to assets/${name}.mp4"
    # Escalar a 1920 de ancho, cortar a 60 segundos, comprimir
    ffmpeg -y -i "$f" -t 60 -vf "scale=1920:-2" -c:v libx264 -preset fast -crf 26 -c:a aac -b:a 128k "assets/${name}.mp4"
done

# Copiar imágenes (por si acaso)
cp n_videos/*.png assets/
cp n_videos/*.jpg assets/
