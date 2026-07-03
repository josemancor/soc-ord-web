import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix showcase links
content = content.replace('<a href="#showcase">Demos</a>', '<a href="#modules">Demos</a>')
content = content.replace('<a href="#showcase" class="btn btn-primary">Ver Demostraciones</a>', '<a href="#modules" class="btn btn-primary">Ver Demostraciones</a>')

# 2. Reorder cards in Escaparate.
# The card is:
# <!-- Tarjeta 4: Atlas PDF -->
# ... up to </a>
atlas_card = """                <!-- Tarjeta 4: Atlas PDF -->
                <a href="assets/Atlas_Resultados_SOC_ORD.pdf" target="_blank" class="feature-card" style="text-decoration:none; text-align:center; background: rgba(0, 162, 255, 0.05); border-color: var(--cyan);">
                    <div class="feature-icon" style="color: var(--cyan);">📘</div>
                    <h3 style="font-size: 1.2rem; color: var(--cyan);">Atlas Científico</h3>
                    <p style="font-size: 0.9rem;">Descarga el dossier completo con matrices (SMIb), densidades (9x9) y proyecciones 6D.</p>
                </a>
"""

if atlas_card in content:
    content = content.replace(atlas_card, "")
    # insert it after Galeria Analitica
    galeria_card = """                <!-- Tarjeta 8: Galería Analítica -->
                <a href="javascript:void(0)" onclick="toggleProf('prof-galeria', 'modules')" class="feature-card" style="text-decoration:none; text-align:center;">
                    <div class="feature-icon">📊</div>
                    <h3 style="font-size: 1.2rem;">Galería Analítica</h3>
                    <p style="font-size: 0.9rem;">Sociogramas avanzados, radares de alienación y mapas de densidad estructural.</p>
                </a>
"""
    content = content.replace(galeria_card, galeria_card + atlas_card)

# 3. Fix the "Cerrar y Volver a Módulos" buttons
btn_maestro = """<button onclick="toggleProf('prof-video-maestro', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">⬆️ Cerrar y Volver a Módulos</button>"""
btn_datos = """<button onclick="toggleProf('prof-datos', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">⬆️ Cerrar y Volver a Módulos</button>"""
btn_sdr = """<button onclick="toggleProf('prof-sdr', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">⬆️ Cerrar y Volver a Módulos</button>"""
btn_opticas = """<button onclick="toggleProf('prof-opticas', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">⬆️ Cerrar y Volver a Módulos</button>"""

new_maestro = """<button onclick="toggleProf('prof-datos', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">Siguiente Módulo: Protocolos de Datos ➡️</button>"""
new_datos = """<button onclick="toggleProf('prof-sdr', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">Siguiente Módulo: Densidad Relacional ➡️</button>"""
new_sdr = """<button onclick="toggleProf('prof-opticas', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">Siguiente Módulo: Proyecciones y Óptica ➡️</button>"""
new_opticas = """<button onclick="toggleProf('prof-galeria', 'modules')" class="btn" style="background: rgba(0, 162, 255, 0.1); color: var(--cyan); border: 1px solid var(--cyan); padding: 8px 20px; font-weight: bold; cursor: pointer;">Siguiente Módulo: Galería Analítica ➡️</button>"""

content = content.replace(btn_maestro, new_maestro)
content = content.replace(btn_datos, new_datos)
content = content.replace(btn_sdr, new_sdr)
content = content.replace(btn_opticas, new_opticas)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
