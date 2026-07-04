import os

files_to_update = [
    '/Users/jmcor/Desktop/SOC_ORD_WEB/index.html',
    '/Users/jmcor/Desktop/SOC_ORD_Project/05_Web_Promocional/index.html'
]

search_str = """<img src="assets/Matriz_81_Figuras.png" alt="81 Figuras Sociométricas" class="gallery-img" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(0, 162, 255, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer; margin-bottom: 20px;">
                    <img src="assets/Matriz_SMIa_Explicacion.png" alt="Explicación SMIa" class="gallery-img" style="max-width: 100%; border-radius: 8px; border: 1px solid rgba(0, 162, 255, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: pointer;">
                    <div style="color: #888; font-size: 0.9rem; margin-top: 15px; font-style: italic;">Arriba: Matriz de las 81 figuras sociométricas. Abajo: Leyenda explicativa (SMIa).</div>"""

# Improve layout: wrapping in an overflow container, styling the matrix to take full width and the legend to be centered and readable.
replace_str = """<div style="width: 100%; overflow-x: auto; margin-bottom: 1.5rem; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(0, 162, 255, 0.3);">
                        <img src="assets/Matriz_81_Figuras.png" alt="81 Figuras Sociométricas" class="gallery-img" style="min-width: 800px; width: 100%; display: block; cursor: zoom-in;" onclick="window.open(this.src, '_blank')">
                    </div>
                    <div style="text-align: center; max-width: 700px; margin: 0 auto;">
                        <h4 style="color: var(--cyan); margin-bottom: 10px; font-size: 1.1rem;">Leyenda Explicativa de Símbolos</h4>
                        <img src="assets/Matriz_SMIa_Explicacion.png" alt="Explicación SMIa" class="gallery-img" style="width: 100%; border-radius: 8px; border: 1px solid rgba(0, 162, 255, 0.2); box-shadow: 0 5px 15px rgba(0,0,0,0.3); cursor: zoom-in;" onclick="window.open(this.src, '_blank')">
                    </div>
                    <div style="color: #888; font-size: 0.9rem; margin-top: 20px; font-style: italic;">Matriz QUATUOR: Estructura de las 81 figuras sociométricas numeralizadas jerárquicamente. (Haz clic en las imágenes para ampliarlas)</div>"""

for fpath in files_to_update:
    if os.path.exists(fpath):
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if search_str in content:
            new_content = content.replace(search_str, replace_str)
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Improved layout in {fpath}")
        else:
            print(f"Could not find exact search string in {fpath}")

