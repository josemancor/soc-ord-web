#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DEBUG JS SYNTAX PARSER
Comprueba si hay caracteres no ASCII, comillas mal cerradas o errores de sintaxis en js/app.js
"""

import os

filepath = '/Users/jmcor/Desktop/SOC_ORD_Project/05_VISORD_Standalone/js/app.js'

with open(filepath, 'rb') as f:
    raw = f.read()

lines = raw.split(b'\n')
print(f"Total líneas: {len(lines)}")

for i in range(10, 25):
    print(f"Line {i+1}: {repr(lines[i])}")

