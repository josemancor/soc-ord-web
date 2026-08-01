# MANIFIESTO COMPUTATIONAL ORDINAL SOCIOMETRY (SOC_ORD 2026)
### *Un Marco Algorítmico y Matricial para el Análisis Computacional de la Dinámica Grupal*

**José Manuel Cornejo Álvarez**  
*Universitat de Barcelona (UB) / Proyecto SOC_ORD*  
*Registro DOI Zenodo (v2) | Safe Creative: 2603074794486*

---

## RESUMEN EJECUTIVO / EXECUTIVE SUMMARY

La sociometría clásica acuñada por J. L. Moreno aportó una intuición decisiva sobre las estructuras informales del grupo humano. Sin embargo, su histórica dependencia de la **binarización relacional** (elección vs. rechazo) impuso un truncamiento de la información afectiva y operacional. 

**SOC_ORD 2026** resuelve esta limitación mediante un motor computacional agnóstico al dominio que sustituye la topología discreta por una **matriz ordinal densa de preferencia**, donde la intensidad vincular $W_{ij}$ se calcula en función inversa del rango de elección emitido:

$$W_{ij} = f(r_{ij})^{-1}$$

El presente Manifiesto establece la arquitectura conceptual, el protocolo metodológico y los principios ético-operativos que rigen el proyecto **SOC_ORD**.

---

## 1. EL CAMBIO DE PARADIGMA: DEL GRAFO BINARIO AL CONTINUO ORDINAL

La binarización tradicional colapsa la riqueza de la interacción grupal. Reducir el afecto, la confianza o la cooperación a un valor dicotómico ($1$ ó $0$) introduce un sesgo de truncamiento perceptual y oculta la valencia de la **indiferencia o ausencia de elección**, denotada en SOC_ORD bajo la notación estricta `¿?`.

SOC_ORD propone un espacio vectorial donde las interacciones no son representaciones estáticas, sino **trayectorias ordinales de preferencia e intensidad**.

---

## 2. FORMATOS DE RECABADO DE CAMPO: MORENO VS. BREVE

SOC_ORD soporta dos formatos de recabado de datos sociométricos de campo que se complementan mutuamente:

1. **Formato MORENO (Nominativo Acotado Clásico)**:
   - Cada miembro $S_i$ selecciona un número acotado de pares $k$ (las $k$ elecciones preferidas) y $m$ marginados, apoyándose en la intuición de la meta-percepción dual.
   - *Ventaja*: Menor carga cognitiva directa para el encuestado en grupos masivos.
   - *Limitación*: Deja a los pares no nominados en la "zona muda o neutra" (`'0'`).

2. **Formato BREVE (Ordenamiento Total del Grupo)**:
   - Cada miembro $S_i$ clasifica a **todos** los miembros del grupo en una lista jerárquica continua de $1^{\circ}$ a $(N-1)^{\circ}$ posición de preferencia.
   - *Ventaja*: Continuidad topológica completa, eliminación de empates nulos y máxima resolución factorial en proyecciones PCA/AFC.

---

## 3. DE LA META-PERCEPCIÓN DUAL A LA META-PERCEPCIÓN TRIÁDICA

Mientras la sociometría de Moreno se fundamenta en la **meta-percepción dual** (la intuición diádica directa de lo que $S_j$ responderá a $S_i$), SOC_ORD introduce la **Meta-percepción Triádica / Ecosistémica**:

- El sujeto no evalúa aisladamente la díada, sino que proyecta su posición y la de sus pares frente al **consenso y clima global del colectivo**.
- Los parámetros de frontera **$aE_i$ (Aceptación Esperada)** y **$oE_i$ (Ostracismo Esperado)** representan los umbrales hasta los cuales el sujeto proyecta ser aceptado o marginado por el ecosistema grupal.

---

## 4. GEOMETRÍA TOPOLÓGICA: EL GRASMANIANO DE LAS RELACIONES

SOC_ORD supera la visión de los individuos como puntos fijos en un vacío cartesiano. Mapea las estructuras grupales como subespacios geométricos en una **Variedad Grasmaniana ($Gr(k, n)$)**.

- Un grupo no es la suma estática de sus nodos, sino un subespacio entero de $k$ dimensiones proyectado desde un universo de $n$ dimensiones.
- El cambio dinámico entre dos olas temporales ($T_1 \to T_2$) se mide mediante la **Distancia Grasmaniana ($d_G$)**, que calcula el *ángulo de rotación geodésica* entre el "plano de poder" del grupo en $T_1$ y su nuevo plano en $T_2$:

$$d_G = \theta = \arccos(\langle U_{T1}, U_{T2} \rangle) \in \left[0, \frac{\pi}{2}\right] \text{ rad}$$

Esta métrica independiza la evaluación de los votos individuales, enfocándose en la transformación pura del campo socio-termodinámico.
