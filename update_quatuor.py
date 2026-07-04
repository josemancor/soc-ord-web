import os

files_to_update = [
    '/Users/jmcor/Desktop/SOC_ORD_WEB/index.html',
    '/Users/jmcor/Desktop/SOC_ORD_Project/05_Web_Promocional/index.html'
]

# We will replace the existing <img> tag with two images.
search_str = """<img src="assets/VISORDP_Frecuencias.png" onerror="this.src='assets/VISORDP_9x9_DEN.png'" alt="Matriz QUATUOR 9x9" class="gallery-img" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(0, 162, 255, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer;">
                    <div style="color: #888; font-size: 0.9rem; margin-top: 10px; font-style: italic;">Matriz QUATUOR (9x9): Frecuencias absolutas de las 81 figuras sociométricas</div>"""

replace_str = """<img src="assets/Matriz_81_Figuras.png" alt="81 Figuras Sociométricas" class="gallery-img" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(0, 162, 255, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer; margin-bottom: 20px;">
                    <img src="assets/Matriz_SMIa_Explicacion.png" alt="Explicación SMIa" class="gallery-img" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(0, 162, 255, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer;">
                    <div style="color: #888; font-size: 0.9rem; margin-top: 15px; font-style: italic;">Arriba: Matriz de las 81 figuras sociométricas. Abajo: Leyenda explicativa (SMIa).</div>"""

for fpath in files_to_update:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if search_str in content:
            new_content = content.replace(search_str, replace_str)
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated QUATUOR images in {fpath}")
        else:
            print(f"Could not find exact search string in {fpath}")

