# 📘 MANUAL DE USUARIO | VISORD1 3D INTERACTIVO (HUB SMIb)

**VISORD1: Visualización de Relaciones de Densidad y Preferencia**
**Versión de Norma:** Platinum v6.0 | **Despliegue:** Sistema Interactivo Front-End HTML5/WebGL / Servidor Local Python

> El entorno **HUB VISORD1 3D** es un simulador y visualizador sociométrico. Opera de forma autónoma renderizando grafos de fuerza tridimensionales que reflejan las tensiones, lealtades, percepciones y entropía de los grupos humanos mediante las leyes de la termodinámica social.

## 🚀 0. INICIO RÁPIDO Y SERVIDOR LOCAL

Para garantizar el máximo rendimiento y evitar las restricciones de seguridad de los navegadores modernos (CORS, bloqueos de `file://`), VISORD1 incluye un lanzador propio en Python.
Para iniciar el sistema de forma profesional:
1. Abre tu terminal.
2. Navega a la carpeta del proyecto y ejecuta: `python3 lanzar_visualizador.py`
3. El simulador se abrirá automáticamente en tu navegador por defecto a través de un servidor local seguro (`http://127.0.0.1:8080`), permitiendo guardar historiales y cargar archivos CSV sin bloqueos de lectura.

## 🚀 1. GESTIÓN DE SIMULACIONES Y HORIZONTES

El panel izquierdo "FORMACIÓN GUIADA" permite controlar la creación y evolución de grupos simulados:

*   **NÚMERO DE SUJETOS (N):** Determina el tamaño de los nodos del grupo. Al cambiarlo, el sistema preparará una nueva "Petición de Grupo". Por defecto, simulará automáticamente un grupo de 12. El máximo efectivo será de 50 miembros.
*   **INICIAR DESDE CERO:** Reinicia por completo la simulación y genera el grupo inicial en el espacio 3D. El sistema se **auto-pausará** en este momento para permitirte ajustar el Ritmo de Mutación o añadir Nodos Aislados. Una vez configurado, debes pulsar **▶️ PLAY** en el panel inferior para arrancar la evolución.
*   **EVOLUCIONAR A HORIZONTE:** Fuerza a la red actual a mutar sus vínculos aceleradamente hacia un Horizonte objetivo (SÓLIDO, LÍQUIDO, PLASMA, GAS, CAOS). Una vez que la densidad global (`SDR`) alcanza el clímax térmico del horizonte, la evolución se congela para su análisis.

## 🎛️ 2. EL PANEL INFERIOR Y CONTROLES VCR (v6.0 Platinum)

Situado en la base de la pantalla, aglutina los controles de navegación temporal, visibilidad de capas y utilidades de exportación:

*   ▶️ **PLAY HISTORIA:** Reproduce secuencialmente todas las mutaciones que ha sufrido la red (Moviola), permitiendo ajustar la velocidad (x1, x2, x4) con el desplegable contiguo.
*   ▶️ **PLAY:** Activa la formación progresiva del grupo, paso a paso, siguiendo 4 fases típicas: Exploración / Deshielo, Tormenta / Conflicto, Normalización, Cristalización.
*   ⏭️ **STEP (T+1):** Fuerza manualmente una única mutación de la red.
*   🚁 **MODO DRONE:** Libera la cámara para que orbite automáticamente alrededor de la estructura 3D.
*   🎯 **CENTRAR CÁMARA:** Devuelve la vista a la posición óptima central ortogonal `(0, 0, 80.0)`.
*   🧹 **LIMPIAR ESCENA:** Vacía instantáneamente las capas relacionales del motor y resetea los filtros activos, **preservando intactos los Ejes Cartesianos 3D y la Rejilla Base**.
*   📸 **CAPTURA:** Genera y descarga instantáneamente un archivo `PNG` con la vista actual exacta del ecosistema.
*   💾 **EXPORTAR EXCEL:** Empaqueta y descarga la Matriz SMIb actual en un archivo `CSV`.
*   📊 **FRECUENCIAS:** Abre un panel modal superpuesto con la estadística global de las 81 figuras relacionales sociométricas, en porcentajes y frecuencias, y las Matrices Analíticas (SMIb, SMIa, BDR, SDR, etc).
*   🔲 **PANTALLA COMPLETA:** Expande la interfaz y el motor 3D.

### 🕹️ REGLA DE PRIMERA MARCA EN BOTONES DE CAPAS (`FGTCSED` & `VAK`)
- **Filtro Rápido (Single-Tap)**: Al pulsar cualquier letra de capa global, si la pantalla no tiene ninguna letra activa, el motor limpia automáticamente el espacio 3D y activa incondicionalmente esa capa específica.
- **Pulsaciones Acumulativas**: Las pulsaciones subsecuentes agregan o retiran capas relacionales de forma acumulativa (manteniendo Alt+Click para foco exclusivo).
- **Tarjeta de Criterios del Estudio (`ℹ️ Criterios del Estudio`)**: Ubicada en la franja izquierda por encima de la Rejilla GTC. Muestra la frase literal exacta de los criterios ($C_1, C_2, C_3$) y la insignia del Dominio Activo.
- **Tooltips Literales**: Al pasar el cursor sobre las celdas $T \times C$ o las filas de criterios, el visor despliega la pregunta formulada en positivo.

---

## 🎬 8. CASO MAESTRO TRANCRITO: "12 HOMBRES SIN PIEDAD" (HSPD-G1-T3-C2)

El estudio de demostración oficial **HSPD** corresponde a la transcripción sociométrica rigurosa de la obra cinematográfica *"12 Hombres sin Piedad"* (Sidney Lumet, 1957):

### 🍿 1. Sinopsis y Evolución Longitudinal ($T_1 \rightarrow T_2 \rightarrow T_3$)
12 miembros de un jurado se encierran en una sala de Nueva York para emitir un veredicto unánime sobre un joven acusado de homicidio.
- **$T_1$ (Votación Inicial)**: Matriz dominada por la corriente centrípeta de culpabilidad (11 a 1). El Jurado 8 (Henry Fonda) sostiene la duda razonable en soledad.
- **$T_2$ (Fase de Tormenta y Debate)**: Fractura de clústeres dogmáticos, virajes afectivos y emergencia de alianzas argumentativas.
- **$T_3$ (Cristalización Final)**: Unanimidad absoluta de inocencia (0 a 12), reconfigurando la jerarquía sociométrica del grupo.

### 🎯 2. Transcripción de los 2 Criterios Reales Utilizados ($C_1, C_2$)
- **$C_1$ (Tarea / Análisis Racional)**: *"¿A qué compañero de jurado acudirías o elegirías en primer lugar para revisar minuciosamente las pruebas del caso y argumentar con rigor lógico?"*
- **$C_2$ (Afectivo / Sostén Emocional)**: *"¿En qué miembro del jurado te apoyarías para sostener el debate en momentos de alta tensión afectiva o presión del grupo?"*

### 👤 3. Censo Oficial Transcrito de los 12 Nodos ($1J1a \dots 12J12a$)
- `1J1a`: Jurado 1 (Presidente / Moderador)
- `2J2a`: Jurado 2 (Banquero reservado / Dubeat)
- `3J3a`: Jurado 3 (Empresario colérico / Antagonista dogmático)
- `4J4a`: Jurado 4 (Corredor de bolsa analítico)
- `5J5a`: Jurado 5 (Joven de barrio humilde / Sensible)
- `6J6a`: Jurado 6 (Pintor trabajador / Defensor del anciano)
- `7J7a`: Jurado 7 (Vendedor frívolo / Ansioso)
- `8J8a`: Jurado 8 (Arquitecto / Henry Fonda — Núcleo de Duda Razonable)
- `9J9a`: Jurado 9 (Anciano sabio / Primer aliado de J8)
- `10J10a`: Jurado 10 (Comerciante prejuicioso)
- `11J11a`: Jurado 11 (Relojero inmigrante / Riguroso)
- `12J12a`: Jurado 12 (Publicista voluble)

### 📊 4. Variables Socio-Demográficas ($VCS$) y Adjetivos $AAG$ Transcritos
- **10 $VCS$ Transcritas**: `EDAD` (Edad), `EST` (Estatus Profesional), `RIG` (Rigidez Dogmática), `RES` (Resistencia al Cambio), `PREJ` (Prejuicio Psicosocial), `EXP` (Experiencia en Debates), `RAC` (Racionalidad Lógica), `EMPAT` (Empatía Socio-Emocional), `VOTO_T1` (Voto Inicial Culpable/Inocente), `VOTO_T3` (Voto Final Inocente).
- **Factores y Adjetivos $AAG$**:
  - **Factores Positivos**: `Unido`, `Seguro`, `Escuchado`, `Respetado`, `Estimulado`, `Libre`, `Acogido`, `Satisfecho`.
  - **Factores de Tensión**: `Tenso`, `Presionado`, `Juzgado`, `Aislado`, `Frustrado`, `Inseguro`, `Agredido`, `Agotado`.

---

## 🎭 9. DOMINIO 6 — SOCIOMETRÍA CULTURAL Y NARRATIVA

### 🏛️ 1. Definición y Alcance
El **Dominio 6 (Sociometría Cultural y Narrativa)** traslada la instrumentación de SOC_ORD desde colectivos reales a **ecosistemas representacionales, obras dramáticas, guiones cinematográficos, textos literarios e hitos históricos**.

### 🔮 2. Especificidad y Potencialidad Hermenéutica
- **Traducción Cualitativo-Cuantitativa**: Permite codificar los diálogos, tensiones escénicas y arcos de personajes en matrices $SMIb$, transformando el análisis narrativo en un continuo matemático medible.
- **Moviola de Tensiones Dramáticas**: A través de las olas temporales ($T_1, T_2 \dots T_t$), la herramienta mide con precisión quirúrgica el ritmo de mutación de la red, los puntos de inflexión (*Plot Twists*), los vacíos de tensión y la disolución de camarillas antagónicas.
- **Identificación de Catalizadores y Arquetipos**: Las métricas de autocorrelación $COR_{PCA}$, la centralidad en las variedades de Grassmann y los vectores de atracción $E$ descubren quiénes son los verdaderos motores del cambio narrativo (nodos catalizadores) frente a los personajes secundarios de baja tracción sociométrica.

---
*© 2026 SOC_ORD Project - Arquitectura Consolidada Platinum*
*DOI Registro de Referencia: 10.5281/zenodo.18941691*
