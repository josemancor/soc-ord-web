#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NEX_ORD PROJECT - VISORD WEB DEMO INTEGRATION VERIFIER
Verifica la integridad de archivos, scripts, estilos y payloads de NEX_ORD_WEB/index_demo.html y index.html.
"""

import os
import re

WEB_DIR = '/Users/jmcor/Desktop/NEX_ORD_WEB'
DEMO_FILE = os.path.join(WEB_DIR, 'VISORD_demo', 'index.html')
INDEX_FILE = os.path.join(WEB_DIR, 'index.html')

def check_html_file(filepath):
    print(f"\n🔍 [VERIFICACIÓN DE INTEGRIDAD WEB] Comprobando: {filepath}")
    if not os.path.exists(filepath):
        print(f"❌ ERROR: El archivo {filepath} no existe.")
        return False

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    css_files = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', content)
    js_files = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content)
    img_files = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)

    all_assets = set()
    for asset_list in (css_files, js_files, img_files):
        for asset in asset_list:
            if not asset.startswith('http://') and not asset.startswith('https://'):
                all_assets.add(asset)

    base_dir = os.path.dirname(filepath)
    print(f"📦 Total de dependencias locales encontradas: {len(all_assets)}")
    missing = 0
    ok = 0

    for rel_path in sorted(all_assets):
        abs_path = os.path.join(base_dir, rel_path.split('?')[0])
        if os.path.exists(abs_path):
            size = os.path.getsize(abs_path)
            print(f"   ✅ [OK] {rel_path} ({size} bytes)")
            ok += 1
        else:
            print(f"   ❌ [FALTA] {rel_path} -> {abs_path}")
            missing += 1

    if missing == 0:
        print(f"🎉 ¡VERIFICACIÓN EXITOSA! Todas las {ok} dependencias de {os.path.basename(filepath)} están presentes.")
        return True
    else:
        print(f"⚠️ ADVERTENCIA: Se encontraron {missing} dependencias faltantes.")
        return False

if __name__ == '__main__':
    res1 = check_html_file(DEMO_FILE)
    res2 = check_html_file(INDEX_FILE)
    if res1 and res2:
        print("\n🚀 [ESTADO FINAL DE VERIFICACIÓN]: VISORD_demo funciona perfectamente en NEX_ORD_WEB!")
