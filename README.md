# NEX_ORD & VISORD Engine — Sociometría Ordinal Computacional

Plataforma científica y ecosistema interactivo de diagnóstico socio-termodinámico, matrices relacionales SMIb, variedad de Grassmann $\operatorname{Gr}(k, N)$ y visualización tridimensional interactiva VISORD.

---

## 🌐 Enlaces Oficiales

1. 🔬 **VISORD 3D (Dossier General Caso Empírico $G_2T_1C_1$)**: [https://josemancor.github.io/nex-ord-web/visord_g2t1c1.html](https://josemancor.github.io/nex-ord-web/visord_g2t1c1.html)
2. 📊 **Suite Diagnóstica $G_2T_1C_1$**: [https://josemancor.github.io/nex-ord-web/suite_g2t1c1.html](https://josemancor.github.io/nex-ord-web/suite_g2t1c1.html)
3. 🌐 **Plataforma Web Institucional**: [https://josemancor.github.io/nex-ord-web/](https://josemancor.github.io/nex-ord-web/)

---

## 📚 Dossier General &bull; Estudio de Caso Empírico $G_2T_1C1$ ($N=10$)

Este repositorio alberga la evidencia factual, matrices cuadradas duales SMIb/SMIa y centroides vectoriales del estudio de caso empírico canónico:
* **Cohorte $G_1$ (Cohesión grupal)**: Nodos canónicos `1A1a` a `5A1a` ($\text{SDR} = -0,91$, $\text{Dif-DR} = 8,91$, $\text{BDR} = 8,00$).
* **Cohorte $G_2$ (Fricción y Ostracismo)**: Nodos canónicos `1B1a` a `5B1a` ($\text{SDR} = -1,47$, $\text{Dif-DR} = 9,47$, $\text{BDR} = 8,00$), revelando el aislamiento estructural latente del nodo `5B1a`.
* **Variedad de Grassmann $\operatorname{Gr}(2, 5)$**: Separación geodésica $d_G = 1,455\text{ rad}$ ($83,37^\circ$).

---

## 🚀 Ejecución en Local

Para ejecutar el visualizador interactivo localmente sin conexión a internet:
```bash
cd VISORD_demo
python3 -m http.server 8000
# Abrir en el navegador: http://localhost:8000/?study=G2T1C1
```
