# ESPECIFICACIÓN TÉCNICA, ESTRUCTURA Q81 Y TAXONOMÍA DE INDICADORES
### *Manual de Fundamentación Algebraica Diádica y Espacio de Estados en SOC_ORD 2026*

**José Manuel Cornejo Álvarez**  
*Universitat de Barcelona (UB) / Proyecto SOC_ORD*  
*Registro DOI Zenodo (v2) | Safe Creative: 2603074794486*

---

## 1. FUNDAMENTACIÓN ALGEBRAICA DIÁDICA: LA ESTRUCTURA Q81

Frente a las lecturas simplificadas que interpretan la multiplicidad de indicadores como una superposición de métricas independientes, SOC_ORD demuestra que la totalidad del espacio relacional diádico en disyuntiva completa se fundamenta algebraicamente en las **81 Figuras Relacionales Sociométricas Diádicas ($Q_{81}$)**.

Estas 81 figuras emergen de cruzar la doble dimensión del vínculo relacional ($3 \times 3 \times 3 \times 3$):
1. **Vector Operativo:** Lo que se DA (emisión afectiva/operativa $A_2$) vs. lo que se RECIBE (recepción $A_3$).
2. **Vector Cognitivo:** Preferencias reales manifestadas vs. Expectativas mutuas de la conducta efectiva que adoptará el *partner* ($A_1, A_4$).

---

## 2. REGLA ARQUITECTÓNICA DE GENERACIÓN DE SMIb

La matriz sociométrica fundamental del motor SOC_ORD es la **Sociomatriz Integrada Bipolar (SMIb)** de 4 vías ($A_1, A_2, A_3, A_4$).

El motor establece una **Regla Arquitectónica Inviolable**:
> ⚠️ La matriz SMIb se genera **SIEMPRE a partir del Formato MORENO AMPLIADO a $E_{-k_1}$ y $R_{-k_2}$ y sus hipótesis selectivas automáticas**, NUNCA directamente desde el ordenamiento bruto de BREVE.

$$\text{BREVE} \xrightarrow{\mathcal{F}_{\text{B}\to\text{M}}} \text{MORENO AMPLIADO } (E_{-k_1}, R_{-k_2}) \xrightarrow{\text{Hipótesis Selectivas Automáticas}} \text{SMIb (4 Vías)}$$

Cuando los datos se recaban en campo mediante el formato BREVE (ordenamiento total del grupo de $1^\circ$ a $(N-1)^\circ$), el backend de SOC_ORD convierte primero el continuo al formato MORENO ampliado (imputando los polos de elección $E_{-k_1}$, marginación $R_{-k_2}$ y los umbrales de meta-percepción $aE, oE$), y a partir de esta base compila la matriz SMIb de 4 vías.

---

## 3. DEFINICIÓN DE SMIa COMO REFLEJO SIMPLIFICADO DE SMIb

Mientras SMIb preserva toda la intensidad ordinal fina y el orden de elección jerárquico ($1^\circ, 2^\circ, 3^\circ, \dots$), la **Sociomatriz Integrada Ampliada (SMIa)** se define como un **"reflejo simplificado" de SMIb**:

- **Prescinde del ranking jerárquico** ($1^\circ, 2^\circ, 3^\circ$) para despojar a la casilla de la intensidad del orden.
- Convierte la codificación de 4 vías directamente en una de las **81 figuras relacionales sociométricas ($Q_{81}$)** del tensor diádico.
- Mientras SMIb retiene la varianza de la masa relacional, SMIa ofrece la tipificación categórica pura de la figura socioafectiva.

---

## 4. LOS 6 PRISMAS RELACIONALES Y TRAZABILIDAD MATRICIAL

El tensor diádico SMIb de 4 vías se descompone en **6 Prismas Relacionales ($P_1 \dots P_6$)**, compuestos por el producto cartesiano de 9 pares ordenados conjugados:

1. **Prisma 1 ($P_1 = A_1 \times A_4$)**: *Cámaras de Eco* (expectativas emitidas vs. recibidas).
2. **Prisma 2 ($P_2 = A_2 \times A_3$)**: *Matriz de Preferencias Dadas por la Díada* (colaboración real vs. antagonismo directo).
3. **Prisma 3 ($P_3 = A_1 \times A_3$)**: *Realismo Perceptivo del Emisor* (cruce entre expectativa $A_1$ y respuesta real $A_3$).
4. **Prisma 4 ($P_4 = A_4 \times A_2$)**: *Espejo Invertido* (auto-percepción frente a la respuesta real emitida por el partner).
5. **Prisma 5 ($P_5 = A_1 \times A_2$)**: *Sinceridad Operativa* (coincidencia entre el deseo ideal $A_1$ y la acción declarada $A_2$).
6. **Prisma 6 ($P_6 = A_4 \times A_3$)**: *Ceguera Relacional* (incapacidad de percibir el rechazo o el afecto).

Esta formulación garantiza una **trazabilidad paso a paso estricta con anonimato nominal completo ($S_1, S_2, S_3, S_4$)** en matrices de $N$ sujetos.
