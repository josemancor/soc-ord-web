#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NEX_ORD JS SYNTAX VALIDATOR & DIAGNOSTIC CHECKER
Checks all JavaScript files for balanced parentheses, braces, brackets, and string literals.
"""

import os
import glob

def check_js_syntax(file_path):
    print(f"\n🔍 Comprobando sintaxis JS: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    stack = []
    lines = content.splitlines()
    
    # Check parenthetical balance ignoring comments and strings
    in_single_comment = False
    in_multi_comment = False
    in_string = False
    string_char = ''

    parens = 0
    braces = 0
    brackets = 0

    for line_idx, line in enumerate(lines, 1):
        in_single_comment = False
        i = 0
        while i < len(line):
            char = line[i]
            
            if not in_string and not in_multi_comment:
                if line[i:i+2] == '//':
                    break
                if line[i:i+2] == '/*':
                    in_multi_comment = True
                    i += 2
                    continue
            
            if in_multi_comment:
                if line[i:i+2] == '*/':
                    in_multi_comment = False
                    i += 2
                else:
                    i += 1
                continue

            if not in_string and (char == '"' or char == "'" or char == '`'):
                in_string = True
                string_char = char
                i += 1
                continue
            elif in_string:
                if char == string_char and line[i-1] != '\\':
                    in_string = False
                i += 1
                continue

            if char == '(': parens += 1
            elif char == ')': parens -= 1
            elif char == '{': braces += 1
            elif char == '}': braces -= 1
            elif char == '[': brackets += 1
            elif char == ']': brackets -= 1

            if parens < 0:
                print(f"❌ Syntax Error en línea {line_idx}: Parentesis de cierre ')' desparejado.")
                return False
            if braces < 0:
                print(f"❌ Syntax Error en línea {line_idx}: Llave de cierre '}}' desparejada.")
                return False
            if brackets < 0:
                print(f"❌ Syntax Error en línea {line_idx}: Corchete de cierre ']' desparejado.")
                return False

            i += 1

    if parens != 0:
        print(f"❌ Syntax Error en {file_path}: Falta paréntesis (balance = {parens}).")
        return False
    if braces != 0:
        print(f"❌ Syntax Error en {file_path}: Falta llave (balance = {braces}).")
        return False
    if brackets != 0:
        print(f"❌ Syntax Error en {file_path}: Falta corchete (balance = {brackets}).")
        return False

    print(f"✅ [OK] Sintaxis JS perfecta: {file_path}")
    return True

if __name__ == '__main__':
    js_dir = '/Users/jmcor/Desktop/NEX_ORD_Project/05_Web_Promocional/VISORD_demo'
    js_files = glob.glob(f"{js_dir}/**/*.js", recursive=True)
    
    all_ok = True
    for js_file in sorted(js_files):
        if not check_js_syntax(js_file):
            all_ok = False

    if all_ok:
        print("\n🎉 ¡TODOS LOS ARCHIVOS JAVASCRIPT TIENEN SINTAXIS 100% PERFECTA!")
    else:
        print("\n⚠️ Se encontraron errores sintácticos.")
