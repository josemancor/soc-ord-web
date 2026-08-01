# 📘 GLOSARIO INTEGRAL Y AVANZADO DE SOCIOMETRÍA Y ANÁLISIS GRUPAL (2026)

Este documento es el fundamento teórico y algorítmico de la suite SOC_ORD. El enfoque SOC_ORD abandona la perspectiva patologizante tradicional. En su lugar, adoptamos un **enfoque ecosistémico**:
- **La red como organismo vivo:** No evaluamos a los miembros del grupo como entes aislados, sino que mapeamos el "tejido social". Un sujeto aislado no es un "problema individual", sino un síntoma de una fractura en el ecosistema.
- **Ética Forense (Zero-Noise):** Garantizamos que los datos representados están purgados de ruido estadístico. Solo se muestra la señal pura, protegiendo la identidad y evitando etiquetas limitantes.
- **Foco en el Capital Social:** Priorizamos el análisis de cómo fluye la energía (cohesión) y la fricción para detectar líderes ocultos, puentes de comunicación y zonas de riesgo estructural.

---

## 📋 TABLA DE SIGLAS Y ABREVIATURAS TEÓRICAS

| Sigla | Nombre Completo | Definición Breve |
| :--- | :--- | :--- |
| **TAG** | Técnicas de Análisis Grupal | Conjunto de instrumentos estadísticos y sociométricos de evaluación grupal (Cornejo, 1988). |
| **SMIa** | Sociomatriz Integrada Ampliada / Abstraída | Reflejo simplificado de SMIb (prescinde del ranking) convertido en una de las 81 figuras de $Q_{81}$. |
| **SMIb** | Sociomatriz Integrada Bipolar | Estructura matricial $N \times N$ fundamental de 4 vías ($A_1 \dots A_4$) generada desde Moreno Ampliado. |
| **IPA** | Interaction Process Analysis | Sistema de observación sistemática del comportamiento en grupos (Bales, 1950). |
| **SYMLOG**| System for the Multiple Level Observation | Modelo tridimensional (U-D, P-N, F-B) de observación de campo (Bales & Cohen, 1979). |
| **AAG** | Análisis de la Actividad Grupal | Diferencial semántico de 16 adjetivos calificativos en 4 factores (Vicente & Cornejo, 1998). |
| **VAR** | Variables Socio-Demográficas | 10 variables cualitativas ordinales/nominales de caracterización disposicional de los sujetos. |
| **MRS** | Modelo de Relaciones Sociales | Modelo estadístico de descomposición en efectos de actor, partner y relación (Kenny, 1994). |
| **FRN** | Fixed Rank Nomination | Corrección estadística para nominaciones sociométricas de rango fijo. |
| **ERGM** | Exponential Random Graph Models | Modelos estocásticos de grafos aleatorios para estimación de estructura endógena. |
| **AFC** | Análisis Factorial de Correspondencias | Método estadístico multivariante para tablas de contingencia relacionales (Benzécri, 1973). |
| **PCA** | Principal Component Analysis | Análisis de Componentes Principales para reducción de dimensionalidad (Pearson, 1901). |
| **MFA** | Multiple Factor Analysis | Análisis Factorial Múltiple para tablas estructuradas (Escofier & Pagès, 1994). |
| **CAJ** | Clasificación Automática Jerarquizada | Técnica de agrupamiento jerárquico ascendente (Ward, 1963; Roux, 1985). |
| **SDA** | Densidad Relacional Emitida | Densidad relativa emitida $A_1 + A_2$ (expansividad relacional). |
| **SRC** | Densidad Relacional Recibida | Densidad relativa recibida $A_3 + A_4$ (estatus relacional). |
| **SDR** | Densidad Relacional Total | Tensión relativa neta normalizada $SDR_i = \frac{SDA_i + SRC_i}{\text{Máximo Teórico}} \in [-1.0, +1.0]$. |
| **IEE** | Índice de Energía Estructural | Densidad relacional ponderada con pesos de rango, tensor $Q_{81}$ y estatus del elector. |
| **BDR** | Densidad Relacional Absoluta | Inercia o carga bruta de actividad $|A_1| + |A_2| + |A_3| + |A_4| \in [0.0, 4(N-1)]$. |
| **$\mathcal{S}_i$** | Entropía Socio-Termodinámica | Métrica de fricción y disipación de energía por ambivalencia $\frac{BDR_i - |SDA_i+SRC_i|}{BDR_i} \in [0.0, 1.0]$. |
| **$aE$** | Aceptación Esperada | Umbral de meta-percepción triádica de atracción en formato BREVE ($1^\circ \dots aE$). |
| **$oE$** | Ostracismo Esperado | Umbral de meta-percepción triádica de marginación en formato BREVE ($(N-oE)^\circ \dots N-1$). |
| **ISV** | Índice de Silencio e Invisibilidad | Disonancia agencial y tasa de marginación/ostracismo sufrido. |
| **IIR** | Inconsistencia Relacional | Varianza poblacional del estatus recibido (ambivalencia o liderazgo disputado). |
| **$Q_{81}$** | Tensor de 81 Figuras | Matriz cartesiana $3 \times 3 \times 3 \times 3$ de figuras sociométricas diádicas. |

---

## 🗺️ ÍNDICE GENERAL DE CONTENIDOS

1. [🧲 I. Fundamentos de la Grupalidad y Sociometría Clásica](#-i-fundamentos-de-la-grupalidad-y-sociometria-clasica)
2. [🌊 II. La "Física de los Grupos": Teoría del Campo (Kurt Lewin)](#-ii-la-fisica-de-los-grupos-teoria-del-campo-kurt-lewin-1890-1947)
3. [🧮 III. Topología y Análisis Multidimensional (Suite SOC_ORD)](#-iii-topologia-y-analisis-multidimensional-suite-soc_ord)
4. [🎭 IV. Actividad, Roles y Comportamiento Grupal](#-iv-actividad-roles-y-comportamiento-grupal)
5. [🕸️ V. Estructuras Sociométricas Clásicas](#-v-estructuras-sociometricas-clasicas)
6. [🛠️ VI. Instrumentos y Métricas de Observación (TAG)](#️-vi-instrumentos-y-metricas-de-observacion-tag)
7. [🌟 VII. Conceptos de Sociometría Ordinal Computacional](#-vii-conceptos-de-sociometria-ordinal-computacional)
8. [🚀 VIII. Geometría Grasmaniana Relacional (Hermann Grassmann)](#-viii-geometria-grasmaniana-relacional-hermann-grassmann-1844)
9. [📐 IX. Tabla de Notación y Simbología Matemática](#-ix-tabla-de-notacion-y-simbologia-matematica)
10. [📊 X. Caso Práctico Paso a Paso ($N=4$)](#-x-caso-practico-paso-a-paso-n4)
11. [📚 XI. Referencias Bibliográficas Fundamentales](#-xi-referencias-bibliograficas-fundamentales)

---

## 🧲 I. FUNDAMENTOS DE LA GRUPALIDAD Y SOCIOMETRÍA CLÁSICA
Partimos de la topología y los vectores de Lewin, pasamos por la intuición clínica del átomo social de Moreno, integramos la observación sistemática de Bales (IPA/SYMLOG) y la teoría de la actividad de Munné, para culminar en la algoritmia matricial y espacial (SMIb, AFC, CAJ, Masa, Inercia) de las Técnicas de Análisis Grupal y la suite SOC_ORD.

**Jacob Levy MORENO (1889-1974)**
*   **Sociometría:** Indagación sobre la evolución y organización interna de los grupos mediante la medición matemática de las redes de atracción y repulsión entre sus miembros, fundada por J.L. Moreno en 1934 (*Who Shall Survive?*).
*   📌 **Sociatría:** La vertiente aplicada y terapéutica de la sociometría ("la medicina de la sociedad"). Mientras la sociometría diagnostica y mide la red, la sociatría es la praxis orientada a intervenir, sanar y reestructurar las relaciones hacia formas más satisfactorias para el desarrollo colectivo e individual.
*   📌 **Ley de la Gravitación Social:** Principio de Moreno que postula que los grupos humanos forman una unidad orgánica regida por fuerzas psicosociales (atracciones y repulsiones). Estas fuerzas determinan el acercamiento, el fraccionamiento y la movilidad de los individuos en la estructura social, de manera análoga a la gravedad en la física.
*   **Tele:** Unidad de relación empática y transferencial bidireccional (positiva o negativa). Es el "cemento" socioafectivo invisible que forma los lazos sociométricos.
*   **Átomo Social:** La unidad microsocial más pequeña. Es el individuo (foco central) junto con la red de todas las figuras significativas (reales o imaginarias) con las que se interrelaciona.

## 🌊 II. LA "FÍSICA DE LOS GRUPOS": TEORÍA DEL CAMPO (Kurt Lewin, 1890-1947)
Conceptos derivados de la física, la topología y la mecánica que Lewin adaptó para explicar el comportamiento humano como el resultado de un campo de fuerzas en tensión (*Teoría del Campo*, 1936, 1951). La genialidad de Lewin fue importar los conceptos de la física newtoniana, el electromagnetismo y la topología matemática para explicar el comportamiento humano. Su visión es el puente conceptual perfecto para entender por qué la sociometría moderna necesita representaciones espaciales, vectoriales y topológicas.

*   📌 **Teoría del Campo (Field Theory):** Modelo paradigmático que postula que el comportamiento grupal o individual no depende del pasado ni de variables aisladas, sino que es una función del campo de fuerzas interdependientes que operan en el momento presente: $C = f(P, A)$ (la Conducta es función de la Persona y su Ambiente). Un cambio en una parte del campo afecta a todo el sistema.
*   📌 **Espacio Vital (Life Space):** La totalidad de los hechos (psicológicos, físicos y sociales) que determinan el comportamiento de un individuo o de un grupo en un instante concreto. Es el "mapa topológico" o universo subjetivo de la realidad tal y como el grupo la percibe, compuesto por regiones, metas y obstáculos.
*   📌 **Dinámica de Grupos:** Término acuñado por el propio Lewin (inspirado en la termodinámica) para describir el complejo juego de fuerzas internas, interacciones y tensiones que determinan la estructura, el desarrollo y la evolución de un colectivo.
*   📌 **Valencia (Valence):** Concepto tomado del electromagnetismo que indica el valor de atracción o repulsión que posee una meta, objeto o región del espacio vital. Una valencia positiva ejerce una fuerza de atracción; una valencia negativa genera repulsión, alejamiento o evitación.
*   📌 **Vectores (Fuerzas):** Magnitud física que Lewin utiliza para representar los impulsos psicológicos o presiones sociales. Un vector psicosocial tiene tres propiedades exactas: dirección, sentido y magnitud.
*   📌 **Tensión (Sistemas en Tensión):** Estado de desequilibrio energético o presión interna en el espacio vital generado por una necesidad insatisfecha, un conflicto de fuerzas o una tarea inacabada. El sistema grupal tiende siempre a la homeostasis.
*   📌 **Locomoción (Locomotion):** Es el movimiento o desplazamiento que realiza el individuo o el grupo a través de las distintas "regiones" de su espacio vital para acercarse a una valencia positiva o alejarse de una negativa.
*   📌 **Barreras / Fronteras:** Obstáculos dinámicos que bloquean la locomoción del grupo hacia su objetivo, generando desviación de los vectores, resistencia y frustración.
*   📌 **Equilibrio Cuasi-Estacionario:** Lewin concebía los hábitos y rutinas del grupo como un "río que fluye" donde las fuerzas impulsoras y las fuerzas restrictivas se igualan y anulan mutuamente.
*   📌 **Descongelamiento / Cambio / Recongelamiento:** Fases topológicas del cambio grupal. Descongelar implica desestabilizar el equilibrio previo; Cambiar es la locomoción hacia la nueva norma; Recongelar es estabilizar el nuevo campo de fuerzas.
*   📌 **Investigación-Acción (Action-Research):** Paradigma metodológico que fusiona la investigación rigurosa con la intervención clínica/social.

## 🧮 III. TOPOLOGÍA Y ANÁLISIS MULTIDIMENSIONAL (Suite SOC_ORD)
Esta sección traduce la red social a propiedades del álgebra matricial y la estadística espacial, revelando la estructura geométrica oculta del grupo.

*   📌 **SMIa (Sociomatriz Integrada Ampliada / Abstraída):** Es un **"reflejo simplificado" (sin considerar el orden jerárquico de elección)** de la matriz SMIb, donde la codificación ordenada de 4 vías **prescinde del ranking jerárquico ($1^\circ, 2^\circ, 3^\circ, \dots$)** para convertirse directamente en una de las **81 figuras relacionales sociométricas diádicas** del tensor $Q_{81}$ ($3 \times 3 \times 3 \times 3$). Mientras SMIb retiene la intensidad ordinal fina, SMIa ofrece la tipificación categórica pura de la figura socioafectiva.
*   📌 **SMIb (Sociomatriz Integrada Básica / Bipolar):** Estructura matricial fundamental en la suite SOC_ORD. Aglutina en una sola casilla toda la complejidad de la relación diádica: lo que el sujeto emite ($A_{2,ij}$), lo que recibe ($A_{3,ij}$) y las percepciones de ambos ($A_{1,ij}, A_{4,ij}$). **Incluye explícitamente en su notación el orden de elección jerárquico ($1^{\circ}, 2^{\circ}, 3^{\circ}, \dots$)** en el que cada miembro del grupo ha sido seleccionado.
    > ⚠️ **REGLA ARQUITECTÓNICA DE GENERACIÓN DE SMIb**: La matriz SMIb se genera **SIEMPRE a partir del Formato MORENO AMPLIADO a $E_{-k_1}$ y $R_{-k_2}$ y sus hipótesis selectivas automáticas**, NUNCA directamente desde BREVE. Cuando un estudio se recaba de campo en formato BREVE, el motor SOC_ORD convierte primero la matriz continua de ordenamiento al formato MORENO ampliado (imputando los polos $E_{-k_1}, R_{-k_2}$ y los umbrales de meta-percepción $aE, oE$), y desde esta base de MORENO ampliado se compila la estructura final SMIb de 4 vías.
*   📌 **Densidad Relacional Total ($SDR_i$):** Índice matemático estandarizado computado por SOC_ORD como la tensión estructural neta normalizada:
$$SDR_i = \frac{SDA_i + SRC_i}{\text{Máximo Teórico}} \in [-1.0, +1.0]$$
*   📌 **Índice de Energía Estructural ($IEE_i$):** Modelo de densidad ponderada que integra el ranking de la figura relacional sociométrica diádica (entre 1 y 81 figuras posibles del tensor $Q_{81}$), el orden de elección jerárquico ($1^{\circ}, 2^{\circ}, 3^{\circ}$ con ponderación $w_{\text{rango}}(1^\circ)=1.0, w_{\text{rango}}(2^\circ)=0.8, w_{\text{rango}}(3^\circ)=0.6$), y el estatus ponderado del elector:
$$IEE_i = \sum_{j \neq i} \left( w_{\text{rango}}(r_{ij}) \cdot Q_{81}(i,j) \cdot \text{Estatus}(S_j) \right)$$
*   📌 **AFC / PCA / MFA (Análisis Factorial de Correspondencias / Componentes Principales):** Métodos estadísticos multivariantes de reducción de dimensionalidad utilizados por SOC_ORD que comprimen las interacciones relacionales de las tablas para proyectar a los miembros del grupo en un espacio factorial de 2D a 6D. Autores de referencia: Jean-Paul Benzécri (1973) para AFC, Karl Pearson (1901) y Harold Hotelling (1933) para PCA, y Brigitte Escofier & Jérôme Pagès (1994) para MFA. La proximidad geométrica refleja fielmente la similitud psicosocial.
*   📌 **Masa ($m_i$):** El peso marginal o la influencia relativa de un individuo dentro de la red total. Se calcula como la proporción marginal de la suma de masa relacional respecto al total de la matriz: $m_i = \frac{\sum_j p_{ij}}{N}$. Un miembro con alta masa ejerce una gran fuerza de atracción o gravitación sobre el sistema.
*   📌 **Inercia ($\Phi^2$):** Equivalente multidimensional a la varianza total en el espacio factorial. Mide la cantidad de información, dispersión o heterogeneidad contenida en la nube de datos respecto a su centro de gravedad ($g$). Se calcula como la suma ponderada de las distancias al cuadrado: $\Phi^2 = \sum_i m_i \cdot d^2(i, g) = \frac{\chi^2}{N}$.
*   📌 **CAJ (Clasificación Automática Jerarquizada):** Técnica estadística de clasificación jerárquica y agrupamiento (clustering) utilizada por SOC_ORD para fusionar iterativamente a los individuos topológicamente más próximos, delimitando fronteras y coaliciones (Benzécri, 1973; Roux, 1985; Ward, 1963).
*   📌 **Clúster (Conglomerado):** Técnica estadística de particionamiento y agrupación de miembros del grupo detectada por la CAJ que comparten una alta densidad endogrupal o perfiles de proximidad semejantes.
*   📌 **Dendrograma:** Representación gráfica en forma de diagrama de árbol que revela las estructuras de proximidad y jerarquía entre los elementos de un conjunto relacional.
*   📌 **Proyección Axonométrica:** Técnica de visualización gráfica espacial original. Permite visualizar hasta 6 dimensiones en un espacio 2D [2D(6D)] utilizando la descomposición ortogonal de los factores de un AFC o PCA y quebrando la traza de los elementos en las direcciones de nuevos ejes de coordenadas desplazados a 33º y 66º.
*   📌 **Mapa Alegórico (País de Tendre):** Representación cartográfica conceptual que sectoriza el espacio proyectado (PCA) en zonas alegóricas (Polo Normativo, Zona de Alerta, etc.), permitiendo una lectura intuitiva e inmediata sobre el nivel de integración o riesgo psicosocial de los individuos en la red.

## 🎭 IV. ACTIVIDAD, ROLES Y COMPORTAMIENTO GRUPAL
*   **Actividad de Grupo (Modelo de Munné, 1985, 1995, 2008):** Entiende el grupo como una realidad unitaria analizable en cuatro niveles diferenciados: Temático, Funcional, Cognitivo y Afectivo.
*   📌 **Energía (Grupal/Afectiva):** En el modelo de Munné, se asocia directamente al nivel afectivo como el "nivel energético por excelencia". Es el motor en el que se activan las fuerzas de cohesión y de locomoción.
*   **Roles de Tarea:** Conductas orientadas a facilitar y coordinar el esfuerzo del grupo para resolver el problema.
*   **Roles de Mantenimiento:** Conductas dirigidas a preservar la cohesión y la unidad emocional del grupo.
*   **Chivo Expiatorio:** Miembro en quien el grupo proyecta, centraliza y descarga sus tensiones o frustraciones latentes.
*   **Pensamiento Grupal (Groupthink):** Deterioro patológico de la eficacia mental por una extrema presión interna por mantener la unanimidad.

## 🕸️ V. ESTRUCTURAS SOCIOMÉTRICAS CLÁSICAS
*   **Clique (Camarilla):** Subgrupo cerrado de tres o más miembros que se eligen mutuamente entre todos ellos.
*   **Líder Sociométrico:** Miembro que puede comunicarse con todos los integrantes en el menor número de pasos. Posee la mayor capacidad de influencia.
*   **Eminencia Gris:** Miembro ignorado o marginado por la mayoría, pero elegido recíprocamente por el líder.
*   **Ignorado vs. Marginado:** El ignorado pasa desapercibido; el marginado acumula nominaciones negativas declaradas. El Desatendido elige a muchos pero no es correspondido.

## 🛠️ VI. INSTRUMENTOS Y MÉTRICAS DE OBSERVACIÓN (TAG)
*   **IPA (Interaction Process Analysis - Bales, 1950):** Sistema de observación sistemática que codifica toda interacción grupal.
*   **SYMLOG (Bales & Cohen, 1979):** Sistema de niveles múltiples que evalúa el campo grupal en tres dimensiones: U-D, P-N y F-B.
*   **AAG (Análisis de la Actividad Grupal):** Técnica de medición desarrollada para cuantificar los niveles de la Actividad Grupal de F. Munné (Vicente, R., Cornejo, J.M. et al., *Anuario de Psicología*, UB, 1998, 2003), estructurada a través de un Diferencial Semántico (Osgood, Suci & Tannenbaum, 1957) formado por 16 adjetivos calificativos bipolares aplicables a los grupos, subdivididos en 4 factores o niveles: Temático, Funcional, Cognitivo y Afectivo.
*   **VAR (Variables Socio-Demográficas y Disposicionales):** Datos de clasificación no clínicos que agrupan a los miembros en estratos fijos. Por defecto, SOC_ORD propone 10 variables socio-demográficas y disposicionales: `EDAD`, `EST` (Estatus Socio-Profesional), `RIG` (Rigidez/Dogmatismo), `RES` (Respeto a Procedimientos), `PREJ` (Prejuicio Implícito), `EXP` (Experiencia Previa), `RAC` (Racionalidad Lógica), `EMPAT` (Empatía/Escucha), `VOTO_T1` (Posición Inicial) y `VOTO_T3` (Posición Final).
*   **Índice de Hemphill (Group Dimensions, Hemphill & Westie, 1950):** Cuestionario estandarizado que describe la fisionomía estructural del grupo a través de 13 dimensiones fundamentales: Autonomía, Control, Cohesión, Flexibilidad, Intimidad, Homogeneidad, Participación, Permeabilidad, Polarización, Potencia, Estabilidad, Visibilidad y Dependencia.
*   **I-Sociometría (Sociometría Indirecta):** Metodología de medición indirecta que analiza redes sin aplicar el test sociométrico nominativo clásico. Se basa en: 1) la valoración independiente de cada sujeto en una escala numérica de 0 a 9 sobre el grado de aceptación de los miembros del grupo, o a través de cualquier otra escala actitudinal o ideológica; 2) el cálculo de la matriz $N \times N$ de distancias y proximidades euclídeas entre las puntuaciones de los sujetos.
*   **Modelo de Relaciones Sociales (MRS, Kenny & Lavoie, 1984; Kenny, 1994):** Sistema estadístico que descompone una interacción recíproca en tres componentes independientes: efecto del emisor (actor), efecto del receptor (partner) y efecto interactivo o de la relación diádica.

## 🌟 VII. CONCEPTOS DE SOCIOMETRÍA ORDINAL COMPUTACIONAL
*   **Sociometría Ordinal vs. Binaria:** Actualización y ampliación del modelo clásico de "sí/no". Pide a los miembros del grupo clasificar a sus pares en rangos jerárquicos de elección ($1^{\circ}, 2^{\circ}, 3^{\circ}$ lugar).
*   **Red Cognitiva vs. Red Conductual:** La Red Cognitiva o Perceptual se refiere a lo que los miembros del grupo creen (meta-percepción dual) que el otro hará en reciprocidad (elección, marginación o indiferencia). La Red Conductual se refiere a la interacción directa real entre los miembros.
*   **Homofilia y Cierre Triádico:** La Homofilia es la tendencia a asociarse con similares. El Cierre Triádico es la regla que dice que "el amigo de mi amigo tenderá a ser mi amigo".
*   **Agujeros Estructurales e Intermediación (Brokerage):** Zonas de desconexión entre subgrupos. El actor "puente" ejerce intermediación y control de flujo.
*   **Verosimilitud FRN (Fixed Rank Nomination):** Corrección estadística vital en encuestas con límite de respuestas.
*   **ERGMs (Modelos de Grafos Aleatorios de Familia Exponencial):** Algoritmos avanzados que calculan la probabilidad estadística de la red debido a mecanismos endógenos ocultos.

### A. FORMATO MORENO VS. FORMATO BREVE: SIMILITUDES Y DIFERENCIAS
El sistema SOC_ORD soporta dos formatos de recabado de datos sociométricos de campo:

1. **Formato MORENO (Nominativo Acotado Clásico)**:
   - **Mecánica**: Cada miembro $S_i$ selecciona un número acotado de pares $k$ (ej. los $k=3$ preferidos) y $m$ marginados (los $m=3$ rechazados), basándose en la **Meta-percepción Dual** (intuición directa de lo que el otro sujeto específico responderá de manera recíproca en la díada).
   - **Ventajas**: Menor esfuerzo cognitivo para el encuestado; focalización en las dinámicas de mayor intensidad emocional.
   - **Limitación**: Los pares no elegidos ni rechazados quedan en una "zona muda o neutra" (`'0'`), perdiendo la resolución del ordenamiento interno de la zona media.

2. **Formato BREVE (Ordenamiento Total del Grupo)**:
   - **Ámbito Óptimo**: Especialmente apropiado y diseñado para **pequeños grupos o equipos de trabajo ($N = 15 \dots 20$ sujetos)**.
   - **Propiedades y Beneficios Ético-Clínicos**:
     - **1 Sola Pregunta Positiva**: Se administra mediante un único ítem general de preferencia o facilidad de colaboración (ej. *"Ordena a tus compañeros según tu preferencia de trabajo en equipo"*).
     - **Sin Mención a Marginaciones**: **No menciona en ningún momento elecciones negativas ni marginaciones**, lo que elimina la reactividad y la carga aversiva del test, protegiendo el clima ético del grupo. Las marginaciones se deducen matemáticamente por la posición en la cola inferior del ranking ($(N-m)^\circ \dots (N-1)^\circ$).
     - **Máxima Resolución Factorial**: Garantiza continuidad topológica completa, eliminación de empates nulos y óptima proyección en PCA/AFC.

---

### B. META-PERCEPCIÓN TRIÁDICA Y PARÁMETROS $aE$ Y $oE$
A diferencia de la *meta-percepción dual* de Moreno (centrada en la díada $S_i \leftrightarrow S_j$), el formato BREVE se fundamenta en la **Meta-percepción Triádica / Ecosistémica**: el sujeto proyecta su posición y la de los demás en relación con el campo y consenso del colectivo.

Para recuperar las 4 vías ($A_1 \dots A_4$) en el formato BREVE sin añadir preguntas adicionales, SOC_ORD utiliza dos **umbrales sintéticos de frontera**:

- **$aE_i$ (Aceptación Esperada / Umbral de Atracción)**: Rango jerárquico límite ($1^\circ \dots aE_i$) dentro del cual el emisor $S_i$ proyecta que el consenso del grupo lo situará en reciprocidad de atracción.
- **$oE_i$ (Ostracismo / Marginación Esperada)**: Rango jerárquico límite ($(N-oE_i)^\circ \dots (N-1)^\circ$) a partir del cual el emisor $S_i$ proyecta ser ubicado en la zona de exclusión o marginación relacional.

---

### C. ESTRATEGIA PARA GRANDES GRUPOS ($N > 20$): ALGORITMO DE LAS 5 FASES DE ORDENAMIENTO
Cuando el tamaño del colectivo es muy numeroso ($N > 20$), exigir un ordenamiento continuo directo de una sola pasada resulta inviable. SOC_ORD resuelve la ordenación total en BREVE aplicando un **protocolo algorítmico estructurado en 5 Fases consecutivas (Trabajar los Extremos)**:

1. **Fase 1 (Preselección del Polo Superior)**: El encuestado selecciona de la lista general del grupo, sin ordenarlos previamente, al menos los $k$ sujetos más apreciados o con quienes tiene mayor preferencia de trabajo.
2. **Fase 2 (Ordenación Fina del Polo Superior)**: De la lista filtrada en la Fase 1, el encuestado ordena jerárquicamente a los $k_1$ sujetos más apreciados ($1^\circ, 2^\circ, \dots, k_1^\circ$).
3. **Fase 3 (Preselección del Polo Inferior)**: De la lista del resto de sujetos (los descartados de la Fase 2 más los no seleccionados en la Fase 1), el encuestado selecciona al menos los $m$ sujetos de menor preferencia o mayor dificultad de colaboración.
4. **Fase 4 (Ordenación del Polo Inferior de Mayor a Menor Descarte)**: De la lista seleccionada en la Fase 3, el encuestado ordena jerárquicamente los $k_2$ sujetos de mayor a menor descarte.
5. **Fase 5 (Inversión y Continuo de Zona Intermedia)**: Se invierte el orden de la lista ordenada en la Fase 4 (situando a los de mayor descarte en la cola final del grupo $(N-1)^\circ$), y se ubican intercalados en la zona intermedia el resto de los sujetos (los descartados de la Fase 2, los nunca seleccionados en 1 y 3, y los descartados de la Fase 4).

> 📌 **Propiedad Socio-Termodinámica de la Función Inversa de Rango ($1/r_{ij}$)**:
> La matriz de ponderación $w(r_{ij}) = \frac{1}{r_{ij}}$ atenúa logarítmicamente las oscilaciones de la zona intermedia (los sujetos no seleccionados en 1 ni en 3), **ponderando con máxima precisión matemática los polos extremos ($1^\circ \dots k_1^\circ$ y $(N-k_2)^\circ \dots (N-1)^\circ$)** y minimizando el impacto del ruido en la zona neutra.

---

### D. FUNCIÓN DE CONVERSIÓN RECÍPROCA: $\mathcal{F}_{\text{MORENO} \leftrightarrow \text{BREVE}}$

Como derivación directa del modelo de Sociometría Ordinal Computacional, SOC_ORD establece las funciones biyectivas de transformación entre ambos formatos:

#### 1. Transformación Directa: $\mathcal{F}_{\text{MORENO} \to \text{BREVE}}$
Transforma una matriz acotada de Moreno con $k$ elecciones ($E_1 \dots E_k$) y $m$ marginaciones ($R_1 \dots R_m$) en un ordenamiento total continuo $r_{ij} \in \{1, 2, \dots, N-1\}$:

$$r_{ij} = \begin{cases}
\text{rango}(E_p) & \text{si } S_j \text{ es la } p\text{-ésima elección } (p \le k) \\
N - m + q - 1 & \text{si } S_j \text{ es la } q\text{-ésima marginación } (q \le m) \\
k + \text{Rank}_{\text{intermedios}}\left( d_{\text{PCA}}(S_i, S_j) \right) & \text{si } S_j \text{ está en la zona neutra } (`'0'`)
\end{cases}$$

Donde $d_{\text{PCA}}(S_i, S_j)$ imputa el ordenamiento relativo de la zona neutra utilizando la distancia euclídea factorial en el subespacio proyectado de las $VAR$ y del estatus indirecto.

#### 2. Transformación Inversa: $\mathcal{F}_{\text{BREVE} \to \text{MORENO}}$
Dada una matriz de ordenamiento total BREVE $r_{ij} \in \{1, \dots, N-1\}$ y los parámetros de corte del investigador IP ($k_1, k_2, aE, oE$), se imputa primero la representación de **MORENO AMPLIADO a $E_{-k_1}$ y $R_{-k_2}$**:

$$\begin{aligned}
A_{2,ij} \text{ [DA]} &= \begin{cases} +1 & \text{si } r_{ij} \le k_1 \text{ (Elección } E) \\ -1 & \text{si } r_{ij} \ge N - k_2 \text{ (Marginación } R) \\ 0 & \text{en otro caso (Neutralidad } ¿) \end{cases} \\
A_{1,ij} \text{ [pDA]} &= \begin{cases} +1 & \text{si } r_{ij} \le aE_i \text{ (Aceptación Esperada)} \\ -1 & \text{si } r_{ij} \ge N - oE_i \text{ (Ostracismo Esperado)} \\ 0 & \text{en otro caso} \end{cases}
\end{aligned}$$

> 📌 **FLUJO ARQUITECTÓNICO FUNDAMENTAL**:
> $$\text{BREVE} \xrightarrow{\mathcal{F}_{\text{B}\to\text{M}}} \text{MORENO AMPLIADO } (E_{-k_1}, R_{-k_2}) \xrightarrow{\text{Hipótesis Selectivas Automáticas}} \text{SMIb (4 Vías)}$$
> Esta regla garantiza que la matriz SMIb **NUNCA se compile directamente desde BREVE**, sino siempre desde el formato MORENO ampliado a $E_{-k_1}$ y $R_{-k_2}$ aplicando las hipótesis selectivas automáticas sobre las 4 vías ($A_1 \dots A_4$).

---

## 🚀 VIII. GEOMETRÍA GRASMANIANA RELACIONAL (Hermann Grassmann, 1844)

### A. Geometría Topológica: El Grasmaniano de las Relaciones
La geometría de Grassmann (1844) permite modelar las preferencias colectivas no como vectores individuales aislados, sino como subespacios de dimensión variable, capturando la emergencia topológica de estructuras grupales que no se reducen a la suma de sus miembros.
*   **Variedad Grasmaniana ($Gr(k, n)$):** El espacio topológico multidimensional donde "habitan" las estructuras grupales. Un punto en un Grasmaniano no es una coordenada, sino un *subespacio entero de k dimensiones* proyectado desde un universo de *n* dimensiones (el grupo). Cuando SOC_ORD calcula el PCA, está seleccionando el "punto" Grasmaniano óptimo que resume el poder del grupo.
*   **Prisma Sociométrico como Subespacio:** En SOC_ORD, un "Prisma" es matemáticamente un subespacio Grasmaniano específico (un plano de proyección) elegido intencionalmente para revelar una simetría o asimetría pura (ej. fricción, idealización).
*   **Difracción Espectral:** El proceso topológico mediante el cual el tensor bruto de interacciones (SMIa) se descompone al atravesar los diferentes subespacios Grasmanianos, revelando las "frecuencias de onda" del comportamiento social (espectros de luz relacional).
*   **Distancia Grasmaniana ($d_G$):** La medida pura del cambio estructural. En lugar de restar votos, mide el *ángulo de rotación geodésica* entre el "plano de poder" de un grupo en $T_1$ y su nuevo plano en $T_2$, ignorando las posiciones individuales y enfocándose en la esencia del campo.

### B. La Matriz de 4 Vías (Vectores A1 a A4)
Toda interacción entre dos miembros del grupo ($S_i \to S_j$) se codifica internamente en 4 posiciones o vectores conjugados $A_{k,ij}$:
1.  **$A_{1,ij}$ [pDA] (Expectativa de Acción Directa / Expectativa Dada por el Emisor):** Expectativa del emisor sobre lo que hará el partner o receptor en la relación. Se caracteriza en la notación SMIb con las marcas angulares de apertura: `'<'` (atracción esperada), `'¡'` (indiferencia esperada), `'['` (marginación esperada).
2.  **$A_{2,ij}$ [DA] (Acción Directa / Matriz de Preferencias Reales Emitidas):** Preferencia o marginación efectiva que el emisor declara hacia el partner. Se caracteriza en la notación SMIb con los símbolos de emisión en mayúsculas: `'E'` (elección/atracción), `'¿'` (indiferencia), `'R'` (marginación).
3.  **$A_{3,ij}$ [REC] (Recepción / Realidad Recibida):** Lo que el partner o receptor selecciona realmente para el emisor ($A_{3,ij} = A_{2,ji}$). Se caracteriza en la notación SMIb con los símbolos recibidos en minúsculas: `'e'` (atracción recibida), `'?'` (indiferencia recibida), `'r'` (marginación recibida).
4.  **$A_{4,ij}$ [pREC] (Percepción de Recepción / Expectativa de Respuesta):** Lo que el partner o receptor supone que el emisor seleccionará efectivamente hacia él. Se caracteriza en la notación SMIb con las marcas angulares de cierre: `'>'` (atracción supuesta), `'!'` (indiferencia supuesta), `']'` (marginación supuesta).

### B. Masas Relacionales y Densidades
El motor SOC_ORD ha sustituido el simple "recuento de preferencias nominales" para medir la Energía Estructural de los vínculos:
*   **SDA (Densidad Relacional Relativa Emitida, $A_1+A_2$):** El volumen total de energía relacional (positiva o de marginación) que un miembro del grupo emite hacia el colectivo: $SDA_i = \sum_{j \neq i} (A_{1,ij} + A_{2,ij}) \cdot w_{\text{rango}}(r_{ij})$.
*   **SRC (Densidad Relacional Relativa Recibida, $A_3+A_4$):** El volumen total de energía relacional que un miembro del grupo recibe del colectivo: $SRC_i = \sum_{j \neq i} (A_{3,ij} + A_{4,ij}) \cdot w_{\text{estatus}}(S_j)$.
*   **SDR (Densidad Relacional Relativa Total Normalizada):** La tensión estructural neta del nodo normalizada dividiendo la suma de densidad emitida y recibida ($SDA_i + SRC_i$) entre el máximo teórico alcanzable del grupo, lo que garantiza que oscile en el rango $[-1.0, +1.0]$:
$$SDR_i = \frac{SDA_i + SRC_i}{\text{Máximo Teórico}} \in [-1.0, +1.0]$$
*   **BDA, BRC, BDR (Densidades Relacionales Absolutas o Brutas):** Equivalentes a SDA, SRC y SDR, pero calculadas sumando los valores absolutos $|A_{1,ij}|, |A_{2,ij}|, |A_{3,ij}| \text{ y } |A_{4,ij}|$ (sin aplicar signo ni restar polaridades). Representan la inercia o carga total de actividad (atracción + marginación) inyectada en el sistema relacional:
$$BDR_i = \sum_{j \neq i} \left( |A_{1,ij}| + |A_{2,ij}| + |A_{3,ij}| + |A_{4,ij}| \right) \in [0.0, 4(N-1)]$$
*   **ENTROPÍA SOCIO-TERMODINÁMICA ($\mathcal{S}_i$):** Métrica fundamental de disipación de energía y fricción relacional que se calcula comparando la Densidad Relativa Neta ($SDR_i$) frente a la Densidad Absoluta ($BDR_i$). Mide el grado en que la energía relacional inyectada en el nodo se disipa por la presencia de fuerzas contrapuestas (atracción y marginación simultáneas):
$$\mathcal{S}_i = \frac{BDR_i - |SDA_i + SRC_i|}{BDR_i} \in [0.0, 1.0]$$
    *   **$\mathcal{S}_i = 0.0$ (Entropía Nula / Coherencia Cohesiva):** Toda la energía del nodo es isotérmica y apunta en una misma dirección (consenso absoluto de atracción o de marginación).
    *   **$\mathcal{S}_i = 1.0$ (Entropía Máxima / Caos de Campo):** Máxima fricción por cancelación vectorial. Ocurre cuando el nodo acumula la misma cantidad de atracción que de marginación ($BDR_i > 0$ pero $SDR_i = 0.0$), disipando toda su energía en ambivalencia estructural.
    *   **Entropía Macroscópica del Grupo ($\mathcal{S}_{\text{grupo}}$):** Promedio de desorden disipativo del ecosistema: $\mathcal{S}_{\text{grupo}} = 1 - \frac{\sum |SDR_{\text{bruto}, i}|}{\sum BDR_i}$.

### C. Los 6 Prismas Relacionales, Ópticas Especializadas
Los **PRISMAS** ($P_1$ al $P_6$) son matrices específicas compuestas por el producto cartesiano de 9 combinaciones conjugadas de pares ordenados:
*   **PRISMA 1 ($P_1 = A_1 \times A_4$):** "Cámaras de Eco". Cruza las expectativas emitidas ($A_1$) con las expectativas recibidas ($A_4$). Evalúa las meta-percepciones subjetivas. Caracterizado por las 9 combinaciones conjugadas: `'<..>'`, `'<..!'`, `'<..]'`, `'¡..>'`, `'¡..!'`, `'¡..]'`, `'[..>'`, `'[..!'`, `'[..]'`.
*   **PRISMA 2 ($P_2 = A_2 \times A_3$):** "Matriz de Preferencias Dadas por la Díada". Cruza la preferencia efectiva emitida ($A_2$) con la respuesta efectiva recibida ($A_3$). Evalúa colaboración genuina vs antagonismo abierto. Caracterizado por las 9 combinaciones conjugadas: `'.Ee.'`, `'.E?.'`, `'.Er.'`, `'.¿e.'`, `'.¿?.'`, `'.¿r.'`, `'.Re.'`, `'.R?.'`, `'.Rr.'`.
*   **PRISMA 3 ($P_3 = A_1 \times A_3$):** "Realismo Perceptivo del Emisor". Cruza la expectativa emitida ($A_1$) frente a la respuesta real recibida del partner ($A_3$). Caracterizado por las 9 combinaciones conjugadas: `'<.e.'`, `'<.?.'`, `'<.r.'`, `'¡.e.'`, `'¡.?.'`, `'¡.r.'`, `'[.e.'`, `'[.?.'`, `'[.r.'`. Métrica de diferencia derivada: $\Delta P_3(i,j) = A_{1,ij} - A_{3,ij}$.
*   **PRISMA 4 ($P_4 = A_4 \times A_2$):** "Espejo Invertido". Cruza lo que el partner supone que se le responderá ($A_4$) frente a la preferencia efectiva declarada ($A_2$). Caracterizado por las 9 combinaciones conjugadas: `'.E.>'`, `'.E.!'`, `'.E.]'`, `'.¿.>'`, `'.¿.!'`, `'.¿.]'`, `'.R.>'`, `'.R.!'`, `'.R.]'`.
*   **PRISMA 5 ($P_5 = A_1 \times A_2$):** "Sinceridad Operativa". Evalúa si las expectativas del emisor ($A_1$) coinciden con su preferencia efectiva ($A_2$). Caracterizado por las 9 combinaciones conjugadas: `'<E..'`, `'<¿..'`, `'<R..'`, `'¡E..'`, `'¡¿..'`, `'¡R..'`, `'[E..'`, `'[¿..'`, `'[R..'`.
*   **PRISMA 6 ($P_6 = A_4 \times A_3$):** "Ceguera al Rechazo/Afecto". Cruza lo que el receptor supone que se hará ($A_4$) con la respuesta efectiva del emisor ($A_3$). Caracterizado por las 9 combinaciones conjugadas: `'..e>'`, `'..e!'`, `'..e]'`, `'..?>'`, `'..?!'`, `'..?]'`, `'..r>'`, `'..r!'`, `'..r]'`. Métrica de diferencia derivada: $\Delta P_6(i,j) = A_{4,ij} - A_{3,ij}$.

### D. Indicadores Dinámicos de Campo
*   **SINTONÍA RELACIONAL ($SR$ / Resonancia Dinámica):** Es la medida macroscópica de Acoplamiento Estructural. Evalúa el grado en que la percepción general del grupo coincide con la realidad de sus acciones. Se calcula como la proporción de coincidencia escalar entre las expectativas ($P_1$) y la realidad efectivizada ($P_2$):
$$SR = \frac{1}{N(N-1)} \sum_{i \neq j} \text{Coincidencia}\left(P_{1,ij}, P_{2,ij}\right)$$
    *   **Alta Sintonía ($SR > 0.5$):** Grupo maduro (Sincronía Existencial); los miembros saben con quién cuentan y a quién marginan.
    *   **Baja Sintonía ($SR < 0.5$):** Disonancia de campo; cegueras masivas y vínculos basados en falsas expectativas.
*   **ISV (Índice de Silencio / Invisibilidad):** Medida de Disonancia Agencial que cuantifica el grado de marginación o silencio sufrido por un miembro del grupo. Se calcula como la proporción de elecciones o respuestas neutras/nulas (`'0'`) recibidas en relación con las emitidas:
$$ISV_i = \frac{\sum_{j \neq i} \text{I}(A_{3,ij} == 0)}{\sum_{j \neq i} \text{I}(A_{2,ij} == 0) + \epsilon}$$
*   **IIR (Índice de Inconsistencia Relacional):** Mide la polaridad y varianza de las nominaciones recibidas por un miembro del grupo. Se calcula como la varianza poblacional del estatus recibido:
$$IIR_i = \text{Var}_j (A_{3,ij}) = \frac{1}{N-1} \sum_{j \neq i} \left( A_{3,ij} - \bar{A}_{3,i} \right)^2$$
Un $IIR$ alto indica un liderazgo disputado o alta ambivalencia relacional.

---

## 📐 IX. TABLA DE NOTACIÓN Y SIMBOLOGÍA MATEMÁTICA

Esta tabla agrupa la notación formal de SOC_ORD. Cada símbolo reúne su definición formal, su dominio numérico estricto y su interpretación ecosistémica.

| Símbolo | Nombre Técnico | Dominio Numérico | Definición Formal Matemática | Significado Ecosistémico / Campo |
| :--- | :--- | :--- | :--- | :--- |
| $S_i$ | Nodo / Miembro del Grupo | $i \in \{1, \dots, N\}$ | Entidad individual dentro del universo sociométrico de tamaño $N$. | El miembro en su espacio vital (Moreno/Lewin). |
| $W_{ij}$ | Vínculo Ordinal Bruto | $\{-1, 0, +1\}$ | Valor codificado SMIb de la emisión del sujeto $S_i$ hacia $S_j$ ($+1$=Atracción, $0$=Neutralidad, $-1$=Marginación). | Polaridad del flujo afectivo o relacional directo. |
| $A_{1,ij} \text{ [pDA]}$ | Expectativa DADA por el emisor | $\{-1, 0, +1\}$ | Expectativa que $S_i$ supone que emitirá hacia $S_j$ en su espacio ideal. | "Mundo Ideal" proyectado o expectativas de emisión. |
| $A_{2,ij} \text{ [DA]}$ | Acción Directa / Preferencia Emitida | $\{-1, 0, +1\}$ | Elección o marginación efectiva declarada por $S_i$ hacia $S_j$. | Realidad de las preferencias emitidas. |
| $A_{3,ij} \text{ [REC]}$ | Recepción Efectiva Recibida | $\{-1, 0, +1\}$ | Elección o marginación efectiva seleccionada por $S_j$ hacia $S_i$ ($A_{3,ij} = A_{2,ji}$). | Realidad del estatus recibido del colectivo. |
| $A_{4,ij} \text{ [pREC]}$ | Percepción de Recepción | $\{-1, 0, +1\}$ | Lo que $S_i$ presupone o adivina que $S_j$ ha respondido sobre él. | Percepción de aceptación o marginación en la red. |
| $P_1$ | Prisma 1: Cámaras de Eco | $A_1 \times A_4$ | Matriz conjugada de 9 pares $P_1(i,j) = (A_{1,ij}, A_{4,ij})$. | Idealización y meta-percepciones subjetivas. |
| $P_2$ | Prisma 2: Preferencias de la Díada | $A_2 \times A_3$ | Matriz conjugada de 9 pares $P_2(i,j) = (A_{2,ij}, A_{3,ij})$. | Preferencias reales dadas por la díada. |
| $P_3$ | Prisma 3: Realismo Perceptivo Emisor | $A_1 \times A_3$ | Matriz conjugada de 9 pares $P_3(i,j) = (A_{1,ij}, A_{3,ij})$. | Ajuste perceptivo entre expectativa y respuesta real. |
| $P_4$ | Prisma 4: Espejo Invertido | $A_4 \times A_2$ | Matriz conjugada de 9 pares $P_4(i,j) = (A_{4,ij}, A_{2,ij})$. | Grado de acierto en la auto-percepción frente a pares. |
| $P_5$ | Prisma 5: Sinceridad Operativa | $A_1 \times A_2$ | Matriz conjugada de 9 pares $P_5(i,j) = (A_{1,ij}, A_{2,ij})$. | Consistencia entre el deseo ideal y la acción real. |
| $P_6$ | Prisma 6: Ceguera al Rechazo/Afecto| $A_4 \times A_3$ | Matriz conjugada de 9 pares $P_6(i,j) = (A_{4,ij}, A_{3,ij})$. | Ceguera relacional; incapacidad de percibir la marginación. |
| $SDA_i$ | Densidad Relacional Emitida | $\mathbb{R}$ | $\sum_{j \neq i} (A_{1,ij} + A_{2,ij}) \cdot w_{\text{rango}}$ | Gasto energético total o expansividad relacional. |
| $SRC_i$ | Densidad Relacional Recibida | $\mathbb{R}$ | $\sum_{j \neq i} (A_{3,ij} + A_{4,ij}) \cdot w_{\text{estatus}}$ | Estatus o gravitación recibida del colectivo. |
| $SDR_i$ | Densidad Relacional Total | $[-1.0, +1.0]$ | $\frac{SDA_i + SRC_i}{\text{Máximo Teórico}}$ | Tensión estructural neta del nodo (Normalizada). |
| $IEE_i$ | Índice de Energía Estructural | $\mathbb{R}$ | $\sum_{j \neq i} \left( w_{\text{rango}}(r_{ij}) \cdot Q_{81}(i,j) \cdot \text{Estatus}(S_j) \right)$ | Densidad relacional ponderada tensorial $Q_{81}$. |
| $BDR_i$ | Densidad Absoluta o Bruta | $[0.0, 4(N-1)]$ | $\sum_{j \neq i} (|A_{1,ij}| + |A_{2,ij}| + |A_{3,ij}| + |A_{4,ij}|)$ | Inercia o carga de actividad inyectada en el sistema. |
| $\mathcal{S}_i$ | Entropía Socio-Termodinámica | $[0.0, 1.0]$ | $\frac{BDR_i - |SDA_i + SRC_i|}{BDR_i}$ | Métrica de fricción y disipación de energía por ambivalencia. |
| $Q_{81}$ | Tensor de 81 Figuras | $\{1, \dots, 81\}$ | Descomposición cartesiana $3 \times 3 \times 3 \times 3$ de la relación diádica. | Tipificación exacta de la figura socioafectiva. |
| $d_G$ | Distancia Grasmaniana | $[0, \pi/2] \text{ rad}$ | Ángulo geodésico $\theta = \arccos(\langle U_{T1}, U_{T2} \rangle)$ entre subespacios. | Magnitud pura del cambio estructural del campo. |
| $ISV_i$ | Índice Silencio / Invisibilidad | $[0.0, 1.0]$ | Proporción de respuestas neutras `'0'` recibidas vs emitidas. | Nivel de ostracismo o marginación no deseada. |
| $IIR_i$ | Inconsistencia Relacional | $[0.0, 1.0]$ | Varianza poblacional de las nominaciones recibidas. | Liderazgo disputado o ambivalencia de rol. |

---

## 📊 X. CASO PRÁCTICO PASO A PASO ($N=4$)

Para ilustrar de forma concreta la notación y trazabilidad de SOC_ORD con total **anonimato nominal**, consideremos un grupo de **$N=4$ miembros censados**: **$S_1$**, **$S_2$**, **$S_3$** y **$S_4$**, evaluados en las 4 vías ($A_1, A_2, A_3, A_4$), 10 Variables Socio-Demográficas ($VAR$) y 16 Adjetivos Bipolares ($AAG$).

### 1. Desglose de las 4 Vías Relacionales ($A_1, A_2, A_3, A_4$) por Miembro del Grupo

- **Matriz $A_1$ (Expectativas de Emisión Dadas, $pDA$)**:
  - $S_1$: $\to S_2 (+1.0)$, $\to S_3 (0.0)$, $\to S_4 (+0.8)$
  - $S_2$: $\to S_1 (+1.0)$, $\to S_3 (-1.0)$, $\to S_4 (0.0)$
  - $S_3$: $\to S_1 (-1.0)$, $\to S_2 (-0.8)$, $\to S_4 (+1.0)$
  - $S_4$: $\to S_1 (+1.0)$, $\to S_2 (+0.8)$, $\to S_3 (0.0)$

- **Matriz $A_2$ (Acción Directa Emitida / Preferencias Reales, $DA$)**:
  - $S_1$: $\to S_2 (+1.0, \text{`E1`}), \to S_3 (0.0, \text{`¿0`}), \to S_4 (+0.8, \text{`E2`})$ $\Rightarrow SDA_2 = +1.8$
  - $S_2$: $\to S_1 (+1.0, \text{`E1`}), \to S_3 (-1.0, \text{`R1`}), \to S_4 (0.0, \text{`¿0`})$ $\Rightarrow SDA_2 = 0.0$
  - $S_3$: $\to S_1 (-1.0, \text{`R1`}), \to S_2 (-0.8, \text{`R2`}), \to S_4 (+1.0, \text{`E1`})$ $\Rightarrow SDA_2 = -0.8$
  - $S_4$: $\to S_1 (+1.0, \text{`E1`}), \to S_2 (+0.8, \text{`E2`}), \to S_3 (0.0, \text{`¿0`})$ $\Rightarrow SDA_2 = +1.8$

- **Matriz $A_3$ (Recepción Efectiva Recibida, $REC = A_2^T$)**:
  - $S_1$: recibe de $S_2 (+1.0), S_3 (-1.0), S_4 (+1.0) \Rightarrow SRC_3 = +1.0$
  - $S_2$: recibe de $S_1 (+1.0), S_3 (-0.8), S_4 (+0.8) \Rightarrow SRC_3 = +1.0$
  - $S_3$: recibe de $S_1 (0.0), S_2 (-1.0), S_4 (0.0) \Rightarrow SRC_3 = -1.0$
  - $S_4$: recibe de $S_1 (+0.8), S_2 (0.0), S_3 (+1.0) \Rightarrow SRC_3 = +1.8$

- **Matriz $A_4$ (Percepción de Recepción / Expectativas Recibidas, $pREC$)**:
  - $S_1$: supone recibir de $S_2 (+1.0), S_3 (0.0), S_4 (+0.8) \Rightarrow SRC_4 = +1.8$
  - $S_2$: supone recibir de $S_1 (+1.0), S_3 (-1.0), S_4 (0.0) \Rightarrow SRC_4 = 0.0$
  - $S_3$: supone recibir de $S_1 (-1.0), S_2 (-0.8), S_4 (+1.0) \Rightarrow SRC_4 = -0.8$
  - $S_4$: supone recibir de $S_1 (+1.0), S_2 (+0.8), S_3 (0.0) \Rightarrow SRC_4 = +1.8$

---

### 2. Matriz Conjugada de Preferencias Dadas por la Díada (Prisma 2: $A_2 \times A_3$)
Al cruzar la preferencia efectiva emitida ($A_2$) con la recepción real ($A_3$), aislamos el tipo de vínculo diádico entre pares:

| Par Diádico ($S_i \leftrightarrow S_j$) | Emitido ($A_{2,ij}$) | Recibido ($A_{3,ij}$) | Código Prisma 2 | Diagnóstico Ecosistémico del Vínculo |
| :--- | :---: | :---: | :---: | :--- |
| **$S_1 \leftrightarrow S_2$** | $+1.0$ (`E1`) | $+1.0$ (`e1`) | `'.Ee.'` | **Elección Recíproca de $1^{\circ}$ Rango (Sinergia Máxima)** |
| **$S_1 \leftrightarrow S_3$** | $0.0$ (`¿0`) | $-1.0$ (`r1`) | `'.¿r.'` | **Marginación Unilateral Sufrida (Asimetría)** |
| **$S_1 \leftrightarrow S_4$** | $+0.8$ (`E2`) | $+1.0$ (`e1`) | `'.Ee.'` | **Elección Recíproca Acoplada (Sinergia Fuerte)** |
| **$S_2 \leftrightarrow S_3$** | $-1.0$ (`R1`) | $-0.8$ (`r2`) | `'.Rr.'` | **Marginación Mutua (Conflicto Antagónico Directo)** |
| **$S_3 \leftrightarrow S_4$** | $+1.0$ (`E1`) | $0.0$ (`?0`) | `'.E?.'` | **Atracción Unilateral no correspondida** |

---

### 3. Cómputo de Densidades Termodinámicas ($SDA, SRC, SDR, BDR$)

Para $N=4$, el máximo teórico de emisión/recepción relativa es $SDA_{\text{max}} = 2 \times (4-1) = 6.0$, y el máximo teórico absoluto es $BDR_{\text{max}} = 4 \times (4-1) = 12.0$.

$$\begin{aligned}
SDA_i &= \sum_{j \neq i} (A_{1,ij} + A_{2,ij}) \\
SRC_i &= \sum_{j \neq i} (A_{3,ij} + A_{4,ij}) \\
SDR_i &= \frac{SDA_i + SRC_i}{12.0} \in [-1.0, +1.0] \\
BDR_i &= \sum_{j \neq i} (|A_{1,ij}| + |A_{2,ij}| + |A_{3,ij}| + |A_{4,ij}|) \in [0.0, 12.0]
\end{aligned}$$

| Miembro ($S_i$) | $SDA_i$ ($A_1+A_2$) | $SRC_i$ ($A_3+A_4$) | $SDR_i$ (Total Normalizada) | $BDR_i$ (Inercia Absoluta) | Diagnóstico de Posición de Campo |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **$S_1$** | $+3.6$ | $+2.8$ | **$+0.53$** | **$6.4$** | **Centroide Afectivo Integrador** |
| **$S_2$** | $0.0$ | $+1.0$ | **$+0.08$** | **$4.6$** | **Nodo Estable de Sostén** |
| **$S_3$** | $-1.6$ | $-1.8$ | **$-0.28$** | **$5.6$** | **Sujeto Marginado / Zona de Riesgo** |
| **$S_4$** | $+3.6$ | $+3.6$ | **$+0.60$** | **$7.2$** | **Líder Sociométrico de Campo** |

---

### 💡 Diagnóstico Ecosistémico Resultante:
1. **$S_4$** se consolida como el **Líder Sociométrico** del grupo (máxima Densidad Total $SDR = +0.60$ y mayor inercia $BDR = 7.2$).
2. **$S_1$** actúa como **Centroide Integrador** ($SDR = +0.53$), manteniendo sinergia recíproca directa tanto con $S_2$ como con $S_4$.
3. **$S_3$** concentra la tensión de marginación del ecosistema (marginación mutua con $S_2$ y marginación sufrida desde $S_1$), constituyendo un **nodo de marginación de alta inercia ($BDR = 5.6, SDR = -0.28$)** que requiere intervención orientada a la desescalada del conflicto.

---

## 📚 XI. REFERENCIAS BIBLIOGRÁFICAS FUNDAMENTALES

Las siguientes referencias bibliográficas constituyen el corpus teórico, estadístico y metodológico que fundamenta las definiciones y algoritmos de **SOC_ORD**:

1. **Benzécri, J.-P.** (1973). *L'Analyse des Données: Tome 1, La Taxinomie; Tome 2, L'Analyse des Correspondances*. Paris: Dunod.
2. **Bales, R. F.** (1950). *Interaction Process Analysis: A Method for the Study of Small Groups*. Cambridge, MA: Addison-Wesley.
3. **Bales, R. F., & Cohen, S. P.** (1979). *SYMLOG: A System for the Multiple Level Observation of Groups*. New York: Free Press.
4. **Cornejo, J. M.** (1988). *Técnicas de Análisis Grupal (TAG)*. Barcelona: Publicacions de la Universitat de Barcelona.
5. **Escofier, B., & Pagès, J.** (1994). *Análisis factoriales simples y múltiples: Teoría y aplicaciones*. Bilbao: Universidad del País Vasco.
6. **Grassmann, H.** (1844). *Die Lineale Ausdehnungslehre, ein neuer Zweig der Mathematik*. Leipzig: Otto Wigand.
7. **Hemphill, J. K., & Westie, C. M.** (1950). The measurement of group dimensions. *The Journal of Psychology*, 29(2), 325–342.
8. **Hotelling, H.** (1933). Analysis of a complex of statistical variables into principal components. *Journal of Educational Psychology*, 24(6), 417–441.
9. **Kenny, D. A., & Lavoie, L.** (1984). The social relations model. *Advances in Experimental Social Psychology*, 18, 141–182.
10. **Kenny, D. A.** (1994). *Interpersonal Perception: A Social Relations Analysis*. New York: Guilford Press.
11. **Lewin, K.** (1936). *Principles of Topological Psychology*. New York: McGraw-Hill.
12. **Lewin, K.** (1951). *Field Theory in Social Science: Selected Theoretical Papers* (D. Cartwright, Ed.). New York: Harper & Row.
13. **Moreno, J. L.** (1934). *Who Shall Survive? A New Approach to the Problem of Human Interrelations*. Washington, DC: Nervous and Mental Disease Publishing Co.
14. **Munné, F.** (1985). *La interacción social: Teoría y método en psicología social*. Barcelona: Hispano Europea.
15. **Munné, F.** (1995). La interacción grupal: Estructura y dinámicas de la actividad relacional. *Revista de Psicología Social*, 10(2), 145–162.
16. **Munné, F.** (2008). *La complejidad en los grupos y en la sociedad: De la física teórica a la psicología social*. Barcelona: UOC.
17. **Osgood, C. E., Suci, G. J., & Tannenbaum, P. H.** (1957). *The Measurement of Meaning*. Urbana, IL: University of Illinois Press.
18. **Pearson, K.** (1901). On lines and planes of closest fit to systems of points in space. *Philosophical Magazine*, 2(11), 559–572.
19. **Roux, M.** (1985). *Algorithmes de Classification*. Paris: Masson.
20. **Vicente, R., Cornejo, J. M., et al.** (1998). El Análisis de la Actividad Grupal (AAG): Medición del clima y la dinámica relacional en pequeños grupos. *Anuario de Psicología*, UB, 29(4), 45–68.
21. **Vicente, R., Cornejo, J. M., et al.** (2003). Evaluación sociométrica y diferencial semántico aplicados al diagnóstico de redes interpersonales. *Anuario de Psicología*, UB, 34(3), 312–335.
22. **Ward, J. H.** (1963). Hierarchical grouping to optimize an objective function. *Journal of the American Statistical Association*, 58(301), 236–244.
