# NEX_ORD & VISORD Engine — Sociometría Ordinal Computacional

Plataforma científica y ecosistema interactivo de diagnóstico socio-termodinámico, matrices relacionales SMIb, variedad de Grassmann $\operatorname{Gr}(k, N)$ y visualización tridimensional interactiva VISORD.

---

## 🌐 Enlaces Oficiales

1. 🔬 **VISORD 3D (Caso Empírico $G_2T_1C_1$ — Psicothema)**: [https://josemancor.github.io/soc-ord-web/visord/](https://josemancor.github.io/soc-ord-web/visord/)
2. 🌐 **Plataforma Web Promocional e Institucional**: [https://josemancor.github.io/soc-ord-web/](https://josemancor.github.io/soc-ord-web/)

---

## 📚 Estudio Empírico Psicothema (Diseño $G_2T_1C_1$, $N=10$)

Este repositorio alberga los datos primarios, matrices cuadradas duales SMIb/SMIa y centroides vectoriales del estudio empírico publicado en *Psicothema*:
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
