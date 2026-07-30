#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SOC_ORD PROJECT - VISORD ETHICAL PURGE ENGINE
Motor de Purga Ética y Expiración Temporal (TTL) de Datos Sociométricos
Sobreescritura Cero (0x00) y Borrado Seguro Forense
"""

import os
import sys
import json
import time

HISTORICO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'historico')

def safe_zero_overwrite_and_remove(filepath):
    """Realiza una sobreescritura binaria con ceros (0x00) antes de eliminar el archivo."""
    try:
        size = os.path.getsize(filepath)
        with open(filepath, 'wb') as f:
            f.write(b'\x00' * size)
            f.flush()
            os.fsync(f.fileno())
        os.remove(filepath)
        print(f"🔒 [PURGA ÉTICA EXITOSA] Archivo {os.path.basename(filepath)} sobreescrito con 0x00 y eliminado del sistema.")
        return True
    except Exception as e:
        print(f"❌ [ERROR PURGA] No se pudo eliminar {filepath}: {e}")
        return False

def check_and_purge_expired_studies():
    """Escanea el directorio /data/historico/ y purga archivos que hayan superado su TTL."""
    if not os.path.exists(HISTORICO_DIR):
        os.makedirs(HISTORICO_DIR, exist_ok=True)
        print(f"📁 Directorio de repositorio histórico creado: {HISTORICO_DIR}")
        return

    now = int(time.time())
    purged_count = 0
    valid_count = 0

    print(f"🛡️ [SOC_ORD ETHICAL ENGINE] Iniciando auditoría de TTL en: {HISTORICO_DIR}")
    
    for fname in os.listdir(HISTORICO_DIR):
        if not fname.endswith('.json'):
            continue
            
        fpath = os.path.join(HISTORICO_DIR, fname)
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            sec_hdr = data.get('_security_header', {})
            expiration_ts = sec_hdr.get('expiration_timestamp')
            
            if expiration_ts and now > expiration_ts:
                print(f"⚠️ [TTL EXPIRADO] El estudio {fname} superó la fecha límite ({expiration_ts} < {now}). Procediendo a la purga.")
                if safe_zero_overwrite_and_remove(fpath):
                    purged_count += 1
            else:
                ttl_remaining_days = round((expiration_ts - now) / 86400, 1) if expiration_ts else 'Indefinido'
                print(f"✅ [VÁLIDO] {fname} | Propietario IP: {sec_hdr.get('ip_owner_hash', 'Global')} | Días de acceso restantes: {ttl_remaining_days}")
                valid_count += 1
                
        except Exception as e:
            print(f"⚠️ Error procesando {fname}: {e}")

    print(f"📊 Resumen de Auditoría Ética: {valid_count} estudios válidos en custodia | {purged_count} estudios purgados.")

if __name__ == '__main__':
    check_and_purge_expired_studies()
