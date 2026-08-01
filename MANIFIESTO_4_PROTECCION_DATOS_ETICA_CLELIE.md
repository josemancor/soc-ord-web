# PROTECCIÓN DE DATOS, CÓDIGO ABIERTO Y ARQUITECTURA TÉCNICA
### *Seguridad Forense (Q-GID), Cifrado Tensorial (SMIb), Protocolo Clélie y Open Science en SOC_ORD 2026*

**José Manuel Cornejo Álvarez**  
*Universitat de Barcelona (UB) / Proyecto SOC_ORD*  
*Registro DOI Zenodo (v2) | Safe Creative: 2603074794486*

---

## 1. COMPROMISO OPEN SCIENCE Y REPRODUCIBILIDAD

El proyecto SOC_ORD rechaza explícitamente la opacidad de los desarrollos propietarios o de "caja negra". La investigación social y clínica requiere herramientas transparentes cuya formulación pueda ser auditada y replicada por la comunidad científica internacional.

Toda la arquitectura de cálculo (`ENGINE_Simulator.py`) y el configurador de parámetros por oleadas (`SOCORD_ConfigWizard.py`) se ofrecen como **código abierto de autoría**, manteniendo la sincronización entre el repositorio de GitHub y el registro oficial en Zenodo (`DOI: 10.5281/zenodo.18941691`).

---

## 2. PROTOCOLO DE PRIVACIDAD Y SEGURIDAD FORENSE (RGPD)

SOC_ORD cumple estrictamente con el Reglamento General de Protección de Datos (RGPD) mediante un diseño de privacidad desde la cuna (*Privacy by Design*):

1. **Destrucción Efímera de Identificadores:** Los nombres y marcadores visuales se procesan en memoria volátil y se eliminan automáticamente tras la generación del informe.
2. **Tokenización Q-GID:** Asignación de identificadores alfanuméricos únicos y no reversibles que permiten el seguimiento longitudinal del sujeto entre $T_1$ y $T_n$ sin revelar la identidad real.
3. **Cifrado Tensorial $SMI_b$:** Las matrices almacenadas para investigación comparada se cifran en capas tensoriales, imposibilitando la re-identificación cruzada de participantes.

---

## 3. EL PROTOCOLO CLÉLIE DE SEGURIDAD ÉTICA

El marco ético de SOC_ORD se rige por el **Protocolo Clélie**:

- **Principio de la Sombra Necesaria**: Derecho a la privacidad y al *No-Anclaje* (posibilidad de borrado de trayectorias antiguas para evitar estigmatización permanente).
- **Veto a la Purga (Anti-Maquiavelismo)**: Prohibición estricta de utilizar SOC_ORD para ejecutar despidos o segregar a la periferia; los algoritmos priorizan el *rescate relacional* del sujeto aislado.
- **Devolución Social (Human-in-the-Loop)**: Obligación de realizar devolver el mapa al grupo y veto a que la IA tome decisiones ejecutivas autónomas (*Factor de Piedad*).

---

## 4. PROPIEDADES ÉTICAS Y ALGORITMO DE LAS 5 FASES DE BREVE

El formato BREVE se administra mediante **1 sola pregunta general positiva, sin mencionar jamás marginaciones o rechazos en la encuesta**, protegiendo el clima ético del grupo.

Para colectivos muy numerosos ($N > 20$), SOC_ORD aplica el **Algoritmo de las 5 Fases de Ordenamiento (Trabajar los Extremos)**:
1. **Fase 1 (Preselección Polo Superior)**: Selección libre de los $k$ más apreciados.
2. **Fase 2 (Ordenación Polo Superior)**: Ordenación jerárquica de los $k_1$ más apreciados ($1^\circ \dots k_1^\circ$).
3. **Fase 3 (Preselección Polo Inferior)**: Selección de los $m$ menos apreciados de la lista de residuos.
4. **Fase 4 (Ordenación Polo Inferior)**: Ordenación de los $k_2$ sujetos de mayor a menor descarte.
5. **Fase 5 (Inversión y Continuo Intermedio)**: **Inversión de la cola de descartes** e intercalado de los miembros de la zona media.

> 📌 **Propiedad de Rango Inverso ($1/r_{ij}$)**: La ponderación por el inverso del rango atenúa logarítmicamente las oscilaciones de la zona intermedia, ponderando con máxima precisión matemática los polos extremos.

---

## 5. GOBERNANZA INSTITUCIONAL DE ROLES Y DESACOPLAMIENTO

El sistema establece dos niveles de acceso diferenciados:
- **Rol IPIS (Investigador Principal Institucional Superior)**: Control absoluto de los algoritmos, orquestación y desarrollo.
- **Rol IPI (Investigador Principal Institucional)**: Operación institucional y generación de informes .HTML. **Bloqueo estricto de descarga de JSONs crudos** con datos nominativos para prevenir fugas.

Los servidores de SOC_ORD están diseñados de forma **desacoplada y multicanal**, preparados para conectarse mediante APIs nativas, conectores LTI (Moodle/Canvas) o Webhooks.

---

## 6. EL PROYECTO CONTEXT: SOCIOMETRÍA LITERARIA Y ARTÍSTICA

SOC_ORD incluye el módulo **ConText** para el análisis de obras literarias y cine (*La Casa de Bernarda Alba*, teatro clásico).

- Considera el arte como un **"Sistema Cerrado Perfecto"**, libre de restricciones éticas empíricas.
- Permite forzar al límite las ecuaciones de la física social en simulaciones de ficción para la investigación avanzada de frontera.

---

## 7. NORMA DE AUTOR Y SINTAXIS DE CONTROL EN ESPAÑOL

Para preservar la homogeneidad y la legibilidad del sistema, los archivos de entrada y control (`.txt`) leídos por el motor de simulación siguen la **Estricta Norma de Autor en Español**:

```text
# CLAVE MAESTRA: AA-GxTyCz-Vn-An-ES-N
TAMANOS_GRUPO: 12, 15, 20
TIEMPOS: T1, T2, T3
CRITERIOS: Tarea, Lúdico
LISTA_VAR: 10
FACTORS_AAG: 4
COHESION: 0.50
TRANSPARENCIA: 0.50
SESGO: 0.20
RUIDO: 0.10
INERCIA: 0.50
OLVIDO: 0.90
CONTEXTO: 1
SEMILLA: 42
IDIOMA: ES
MODO: NORMAL
```
