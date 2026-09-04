/**
 * NEX_ORD PROJECT - VISORD HUB (Omni-Visor)
 * Motor 3D Unificado basado en Super AFC
 */

class VisordHubEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        this.payload = null;
        
        // Layers
        this.layers = {
            'MACRO': new THREE.Group(),    // Capa 0: Centroides (Activos)
            'MICRO': new THREE.Group(),    // Capa 1: Sujetos (Ilustrativos)
            'FEATURES': new THREE.Group(), // Capa 2: Figuras Quatuor
            'SUPP': new THREE.Group(),     // Capa 3: Variables Complementarias
            'TRIADIC': new THREE.Group(),  // Capa 4: META_percepción Triádica
            'CLUSTERS': new THREE.Group(), // Clasificación Automática Jerárquica (CAJ)
            'TRAJECTORIES': new THREE.Group(), // Interpolaciones temporales
            'UNIVERSE': new THREE.Group(),  // Tour Iniciático Cinemático
            'VERTICAL_PLANE': new THREE.Group(), // Plano Vertical 3D (Dim 1 vs Dim 2)
            'ORTHOGONAL_PLANE': new THREE.Group() // Plano Ortogonal 3D (Dim 1 vs Dim 3)
        };
        
        // Estado de visibilidad de las capas (Ocultamos UNIVERSE y CLUSTERS por defecto)
        this.state = {
            'MACRO': true,
            'MICRO': true,
            'FEATURES': false,
            'SUPP': false,
            'TRIADIC': false,
            'CLUSTERS': false,
            'TRAJECTORIES': true,
            'UNIVERSE': true,
            'VERTICAL_PLANE': false,
            'ORTHOGONAL_PLANE': false
        };
        
        // Inicializar Audio
        this.audio = window.VisordAudio ? new window.VisordAudio() : null;
        
        // Interaction
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.tooltip = document.getElementById('tooltip');
        
        this.initThree();
    }

    initThree() {
        if (!this.container) return;
        
        this.scene = new THREE.Scene();
        
        // 🌫️ Atmósfera 3D Instrumental: Niebla Termodinámica Reactiva
        this.scene.fog = new THREE.FogExp2(0x0f172a, 0.005);

        // Add layers to scene
        Object.values(this.layers).forEach(layer => this.scene.add(layer));
        
        const w = (this.container && this.container.clientWidth > 0) ? this.container.clientWidth : window.innerWidth;
        const h = (this.container && this.container.clientHeight > 0) ? this.container.clientHeight : window.innerHeight;
        
        this.camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 50000);
        this.camera.position.set(0, 0, 100);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        this.renderer.setSize(w, h);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.container.appendChild(this.renderer.domElement);
        
        // Controls (Robust OrbitControls resolution with fallback)
        const OrbitControlsClass = (typeof THREE !== 'undefined' && THREE.OrbitControls) || 
                                   (typeof window !== 'undefined' && window.OrbitControls) || 
                                   (typeof OrbitControls !== 'undefined' && OrbitControls) ||
                                   (typeof window !== 'undefined' && window.THREE && window.THREE.OrbitControls);
        
        if (typeof OrbitControlsClass === 'function') {
            try {
                this.controls = new OrbitControlsClass(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
            } catch (errControls) {
                console.warn("VISORDEngine: OrbitControls instantiation failed, fallback active:", errControls);
                this.controls = {
                    update: function() {},
                    target: new THREE.Vector3(0, 0, 0),
                    enableDamping: false,
                    dispose: function() {}
                };
            }
        } else {
            console.warn("VISORDEngine: OrbitControls unavailable. Falling back to static camera controls.");
            this.controls = {
                update: function() {},
                target: new THREE.Vector3(0, 0, 0),
                enableDamping: false,
                dispose: function() {}
            };
        }
        
        // Lighting
        this.scene.add(new THREE.AmbientLight(0x404040, 2));
        const light = new THREE.PointLight(0xffffff, 1, 500);
        light.position.set(50, 50, 50);
        this.scene.add(light);
        
        // Custom Axes for AFC (Negative and Positive, Brighter Colors)
        const axisLength = 25; // Adaptado a la escala normalizada (span = 20)
        
        const matX = new THREE.LineBasicMaterial({ color: 0xff4444, transparent: false });
        const geoX = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-axisLength, 0, 0), new THREE.Vector3(axisLength, 0, 0)]);
        this.scene.add(new THREE.LineSegments(geoX, matX));
        
        const matY = new THREE.LineBasicMaterial({ color: 0x44ff44, transparent: false });
        const geoY = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -axisLength, 0), new THREE.Vector3(0, axisLength, 0)]);
        this.scene.add(new THREE.LineSegments(geoY, matY));
        
        const matZ = new THREE.LineBasicMaterial({ color: 0x44aaff, transparent: false });
        const geoZ = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, -axisLength), new THREE.Vector3(0, 0, axisLength)]);
        this.scene.add(new THREE.LineSegments(geoZ, matZ));
        
        // ✨ Polvo Cuántico Ambiental (Starfield Quantum Particles)
        const particleGeo = new THREE.BufferGeometry();
        const particleCount = 250;
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 180;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.7,
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.35
        });
        this.quantumParticles = new THREE.Points(particleGeo, particleMat);
        this.scene.add(this.quantumParticles);

        // Añadir Grid sutil en el plano base para dar percepción de profundidad
        const gridHelper = new THREE.GridHelper(50, 50, 0x555555, 0x222222);
        gridHelper.position.y = -12;
        this.scene.add(gridHelper);
        
        // Default Projection & View modes
        this.projectionMode = 'freq'; // Por defecto: Frecuencias
        this.viewMode = 'planos';       // Por defecto: Planos

        // Events
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        this.animate();
    }

    createCircularFaceTexture(url) {
        if (!this.textureLoader) this.textureLoader = new THREE.TextureLoader();
        return this.textureLoader.load(url, undefined, undefined, () => {});
    }

    loadPayload(url) {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                this.payload = data;
                this.buildScene();
            })
            .catch(err => console.error("[Omni-Visor] Error loading payload:", err));
    }

    loadPayloadData(data) {
        this.payload = data;
        this.preprocessPayload(this.payload);
        this.buildScene();
        
        // Actualizar contadores del DOM
        const numNodes = (this.payload.subjects ? Object.keys(this.payload.subjects).length : 0) + 
                         (this.payload.centroids ? Object.keys(this.payload.centroids).length : 0);
        const numSubjects = this.payload.subjects ? Object.keys(this.payload.subjects).filter(k => k.match(/^\d+[A-Z][a-z]\d+$/)).length : 0;
        
        const countNodes = document.getElementById('count-nodes');
        const countSubjects = document.getElementById('count-subjects');
        const countLinks = document.getElementById('count-links');
        
        if (countNodes) countNodes.innerText = numNodes;
        if (countSubjects) countSubjects.innerText = numSubjects;
        if (countLinks) countLinks.innerText = numSubjects > 0 ? (numSubjects * 3) : 0; // Aproximación visual
    }
    
    setShowDensity(show) {
        this.state['SHOW_DENSITY'] = show;
        console.log("Toggle Density:", show);
        
        // Modificar materiales/tamaño en la capa MICRO y TRAJECTORIES para reflejar densidad
        const microLayer = this.layers['MICRO'];
        const trajLayer = this.layers['TRAJECTORIES'];
        
        [microLayer, trajLayer].forEach(layer => {
            if (!layer) return;
            layer.children.forEach(child => {
                if (child.userData && child.userData.density !== undefined) {
                    const d = child.userData.density;
                    if (show) {
                        // Guardar escala original
                        if (!child.userData.origScale) child.userData.origScale = child.scale.clone();
                        // Escalar según densidad (SDR/BDR)
                        const factor = 1.0 + Math.min(Math.abs(d) * 0.8, 1.5);
                        child.scale.copy(child.userData.origScale).multiplyScalar(factor);
                    } else {
                        // Restaurar escala original
                        if (child.userData.origScale) child.scale.copy(child.userData.origScale);
                    }
                }
            });
        });
    }
    
    setShowGrassmann(show) {
        this.state['SHOW_GRASSMANN'] = show;
        console.log("Toggle Grassmann:", show);
        
        const layer = this.layers['GRASSMANN'] || (this.layers['GRASSMANN'] = new THREE.Group());
        if (!this.scene.children.includes(layer)) this.scene.add(layer);
        
        // Limpiar contenido previo
        while(layer.children.length > 0) {
            const obj = layer.children[0];
            if(obj.geometry) obj.geometry.dispose();
            if(obj.material) obj.material.dispose();
            layer.remove(obj);
        }
        
        if (!show) return;
        
        // Dibujar plano o malla de Variedad Grassmanniana conectando los centroides
        const centroidPoints = [];
        this.layers['MACRO'].children.forEach(child => {
            if (child.position) centroidPoints.push(child.position.clone());
        });
        
        if (centroidPoints.length >= 3) {
            // Dibujar líneas geodésicas entramadas entre centroides para simular la variedad manifold
            const matLine = new THREE.LineDashedMaterial({
                color: 0x38bdf8,
                dashSize: 0.5,
                gapSize: 0.2,
                linewidth: 2,
                transparent: true,
                opacity: 0.6
            });
            
            for (let i = 0; i < centroidPoints.length; i++) {
                for (let j = i + 1; j < centroidPoints.length; j++) {
                    const geom = new THREE.BufferGeometry().setFromPoints([centroidPoints[i], centroidPoints[j]]);
                    const line = new THREE.Line(geom, matLine);
                    line.computeLineDistances();
                    layer.add(line);
                }
            }
        }
    }

    toggleVerticalPlane(show) {
        this.state['VERTICAL_PLANE'] = show;
        console.log("Toggle Vertical Plane 3D:", show);
        
        const layer = this.layers['VERTICAL_PLANE'] || (this.layers['VERTICAL_PLANE'] = new THREE.Group());
        if (!this.scene.children.includes(layer)) this.scene.add(layer);
        
        while(layer.children.length > 0) {
            const obj = layer.children[0];
            if(obj.geometry) obj.geometry.dispose();
            if(obj.material) obj.material.dispose();
            layer.remove(obj);
        }
        
        if (!show) return;
        
        // Plano Vertical XY (Z = 0) - Dim 1 (Horizontal) vs Dim 2 (Vertical)
        const size = 30;
        const planeGeo = new THREE.PlaneGeometry(size, size);
        const planeMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const planeMesh = new THREE.Mesh(planeGeo, planeMat);
        layer.add(planeMesh);
        
        // Grid Helper en el plano XY (rotado 90deg en X)
        const grid = new THREE.GridHelper(size, 30, 0x38bdf8, 0x1e293b);
        grid.rotation.x = Math.PI / 2;
        layer.add(grid);
        
        // Etiqueta del Plano
        const sprite = this.createTextSprite("PLANO VERTICAL (Dim 1 vs Dim 2)", "#38bdf8", 0.7, true);
        sprite.position.set(0, size / 2 + 1, 0);
        layer.add(sprite);
    }

    toggleOrthogonalPlane(show) {
        this.state['ORTHOGONAL_PLANE'] = show;
        console.log("Toggle Orthogonal Plane 3D:", show);
        
        const layer = this.layers['ORTHOGONAL_PLANE'] || (this.layers['ORTHOGONAL_PLANE'] = new THREE.Group());
        if (!this.scene.children.includes(layer)) this.scene.add(layer);
        
        while(layer.children.length > 0) {
            const obj = layer.children[0];
            if(obj.geometry) obj.geometry.dispose();
            if(obj.material) obj.material.dispose();
            layer.remove(obj);
        }
        
        if (!show) return;
        
        // Plano Ortogonal XZ (Y = 0) - Dim 1 (Horizontal) vs Dim 3 (Profundidad)
        const size = 30;
        const planeGeo = new THREE.PlaneGeometry(size, size);
        planeGeo.rotateX(Math.PI / 2);
        const planeMat = new THREE.MeshBasicMaterial({
            color: 0xa855f7,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        const planeMesh = new THREE.Mesh(planeGeo, planeMat);
        layer.add(planeMesh);
        
        // Grid Helper en el plano XZ (horizontal)
        const grid = new THREE.GridHelper(size, 30, 0xa855f7, 0x1e293b);
        layer.add(grid);
        
        // Etiqueta del Plano
        const sprite = this.createTextSprite("PLANO ORTOGONAL (Dim 1 vs Dim 3)", "#a855f7", 0.7, true);
        sprite.position.set(size / 2 + 1, 0, 0);
        layer.add(sprite);
    }

    preprocessPayload(payload) {
        if (!payload || !payload.subjects || payload._preprocessed) return;
        payload._preprocessed = true;
        
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
        const allPoints = [];
        const primaryPoints = [];
        
        // Extraer puntos primarios de sujetos experimentales (G1, G2, G3)
        Object.entries(payload.subjects).forEach(([key, s]) => {
            if (s.coords) {
                allPoints.push(s.coords);
                const g = s.group || '';
                if (g === 'G1' || g === 'G2' || g === 'G3' || key.match(/^\d+[A-Z][a-z]\d+$/)) {
                    primaryPoints.push(s.coords);
                }
            }
        });
        
        // Incluir centroides de los grupos primarios
        if (payload.centroids) {
            Object.entries(payload.centroids).forEach(([key, c]) => {
                if (c.coords) {
                    allPoints.push(c.coords);
                    if (!key.startsWith('ALL')) {
                        primaryPoints.push(c.coords);
                    }
                }
            });
        }
        
        const targetPts = primaryPoints.length > 0 ? primaryPoints : allPoints;
        
        if (targetPts.length > 0) {
            // Trimming Robusto de Extremos Perturbadores (Percentiles 5% a 95%)
            const xs = targetPts.map(p => p[0]).sort((a, b) => a - b);
            const ys = targetPts.map(p => p[1]).sort((a, b) => a - b);
            const zs = targetPts.map(p => p[2]).sort((a, b) => a - b);
            
            const n = xs.length;
            const pLow = Math.floor(n * 0.05);
            const pHigh = Math.min(Math.floor(n * 0.95), n - 1);
            
            const minX = xs[pLow], maxX = xs[pHigh];
            const minY = ys[pLow], maxY = ys[pHigh];
            const minZ = zs[pLow], maxZ = zs[pHigh];
            
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            const cz = (minZ + maxZ) / 2;
            
            // Respeto absoluto a las asimetrías reales de los 4 extremos con margen interno de respiración (10% padding):
            // Extremo Izquierda (MinX) -> -17.5 | Extrema Derecha (MaxX) -> +17.5
            // Extremo Inferior (MinY)  -> -9.5  | Parte Superior (MaxY)  -> +9.5
            const spanX = Math.max(maxX - minX, 0.001);
            const spanY = Math.max(maxY - minY, 0.001);
            const spanZ = Math.max(maxZ - minZ, 0.001);
            
            const mapToScreenX = (val) => -17.5 + ((val - minX) / spanX) * 35.0;
            const mapToScreenY = (val) => -9.5 + ((val - minY) / spanY) * 19.0;
            const mapToScreenZ = (val) => -4.5 + ((val - minZ) / spanZ) * 9.0;
            
            // Posición asimétrica real del origen (0,0) respetando la proporción Max(+) vs Abs(Min(-))
            this.originScreenPos = {
                x: Math.max(Math.min(mapToScreenX(0.0), 16.5), -16.5),
                y: Math.max(Math.min(mapToScreenY(0.0), 8.8), -8.8),
                z: Math.max(Math.min(mapToScreenZ(0.0), 4.0), -4.0)
            };

            // Transformar todos los puntos de sujetos y centroides preservando la asimetría de los 4 cuadrantes
            allPoints.forEach(c => {
                c[0] = Math.max(Math.min(mapToScreenX(c[0]), 17.5), -17.5);
                c[1] = Math.max(Math.min(mapToScreenY(c[1]), 9.5), -9.5);
                c[2] = Math.max(Math.min(mapToScreenZ(c[2]), 4.5), -4.5);
            });

            // Transformar features modales (Figuras Quatuor)
            if (payload && payload.active_features && typeof payload.active_features === 'object') {
                Object.values(payload.active_features).forEach(f => {
                    if (f && f.Dim1 !== undefined) {
                        f.Dim1 = Math.max(Math.min(mapToScreenX(f.Dim1), 17.5), -17.5);
                        f.Dim2 = Math.max(Math.min(mapToScreenY(f.Dim2), 9.5), -9.5);
                        f.Dim3 = Math.max(Math.min(mapToScreenZ(f.Dim3), 4.5), -4.5);
                    }
                });
            }

            // Transformar variables suplementarias / ilustrativas
            if (payload && payload.supplementary_features && typeof payload.supplementary_features === 'object') {
                Object.values(payload.supplementary_features).forEach(f => {
                    if (f && f.Dim1 !== undefined) {
                        f.Dim1 = Math.max(Math.min(mapToScreenX(f.Dim1), 19.5), -19.5);
                        f.Dim2 = Math.max(Math.min(mapToScreenY(f.Dim2), 10.5), -10.5);
                        f.Dim3 = Math.max(Math.min(mapToScreenZ(f.Dim3), 5.0), -5.0);
                    }
                });
            }
        }
    }

    createTextSprite(text, color, scaleFactor = 1, isPill = false) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 160;
        
        if (isPill) {
            // Fondo 'Pill' sutil opcional (desactivado por defecto para texto limpio sin recuadro)
            context.fillStyle = 'rgba(15, 23, 42, 0.92)';
            context.strokeStyle = color;
            context.lineWidth = 4;
            context.beginPath();
            if (context.roundRect) {
                context.roundRect(10, 10, canvas.width - 20, canvas.height - 20, 24);
            } else {
                context.rect(10, 10, canvas.width - 20, canvas.height - 20);
            }
            context.fill();
            context.stroke();
        }
        
        context.font = 'Bold 64px Inter, system-ui, Arial, sans-serif';
        context.fillStyle = color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Sombra nítida de alta definición para legibilidad perfecta sin necesidad de recuadro
        context.shadowColor = "rgba(0,0,0,0.95)";
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.shadowBlur = 6;
        
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, opacity: 1.0 });
        const sprite = new THREE.Sprite(material);
        
        // Escala proporcional y elegante en 3D para legibilidad impecable sin desbordamientos
        const baseWidth = 2.8 * scaleFactor;
        const baseHeight = 0.88 * scaleFactor;
        sprite.scale.set(baseWidth, baseHeight, 1);
        sprite.userData = { baseScale: { x: baseWidth, y: baseHeight } };
        return sprite;
    }

    buildScene() {
        this.clearLayers();
        if (!this.payload) return;
        
        const scaleFactor = 1; // Ya normalizado a span 20 en preprocessPayload
        
        // 1. Capa MACRO (Centroides -> Texto 1g1t1c, G1...) y Macro-trayectorias
        if (this.payload.centroids) {
            const macroPoints = {}; // { "G1_C1": [ {t: 1, pos: Vector3}, {t: 2, pos: Vector3} ] }
            const placedCentroidPositions = []; // Control anti-colisión
            
            Object.entries(this.payload.centroids).forEach(([key, centroid]) => {
                let rawLabel = centroid.name || key.replace('_CENTROID', ''); 
                let label = rawLabel;
                let g = "1", t = "1", c = "1";
                let isMeso = false;
                
                const m = key.match(/G(\d+)_T(\d+)_C(\d+)/i) || rawLabel.match(/(\d+)g(\d+)t(\d+)c/i);
                if (m) {
                    g = m[1];
                    t = m[2];
                    c = m[3];
                    label = `${g}g${t}t${c}c`; // Formato estandarizado en minúsculas para celda individual (ej: 1g1t1c, 3g4t2c)
                    isMeso = false;
                } else {
                    // Es una agrupación / conjunto (G1, T1, C1, G1T1, GTC, GT, GC, TC, etc.)
                    label = rawLabel.toUpperCase();
                    isMeso = true;
                }
                
                // Tamaño discreto: 0.85 para celdas individuales, 1.1 para conjuntos
                const sprite = this.createTextSprite(label, isMeso ? '#a855f7' : '#f59e0b', isMeso ? 1.1 : 0.85); 
                const pos = new THREE.Vector3(
                    centroid.coords[0] * scaleFactor,
                    centroid.coords[1] * scaleFactor,
                    centroid.coords[2] * scaleFactor
                );
                
                sprite.position.copy(pos);
                sprite.userData = { ...sprite.userData, type: 'Centroide', ...centroid, name: label };
                this.layers['MACRO'].add(sprite);
                
                // Guardar para macro-trayectorias
                const gcKey = `G${g}_C${c}`;
                if (!macroPoints[gcKey]) macroPoints[gcKey] = [];
                macroPoints[gcKey].push({ t: parseInt(t), pos: pos });
            });
            
            // Dibujar líneas fuertes de Macro-trayectorias
            const macroMat = new THREE.LineBasicMaterial({ 
                color: 0xffd700, // Dorado brillante
                linewidth: 2, 
                transparent: true, 
                opacity: 0.9 
            });
            Object.values(macroPoints).forEach(pts => {
                pts.sort((a,b) => a.t - b.t);
                if (pts.length > 1) {
                    const vectors = pts.map(p => p.pos);
                    const geo = new THREE.BufferGeometry().setFromPoints(vectors);
                    const line = new THREE.Line(geo, macroMat);
                    line.computeLineDistances();
                    this.layers['MACRO'].add(line);
                }
            });
        }
        
        // 2. Capa MICRO (Sujetos Suplementarios -> Avatares 2D o Esferas)
        if (this.payload.subjects) {
            const geoMicro = new THREE.SphereGeometry(0.2, 16, 16);
            
            Object.entries(this.payload.subjects).forEach(([key, subject]) => {
                // Saltar los puntos brutos temporales (ej. 1Aa1), porque esos los pinta el Slider (Trayectorias)
                if (key.match(/^\d+[A-Z][a-z]\d+$/)) return;
                
                const density = subject.density || 0;
                
                const numMatch = key.match(/^\d+/);
                const num = numMatch ? parseInt(numMatch[0]) : null;
                
                let mesh;
                if (!this.isMultiGroup && num >= 1 && num <= 12) {
                    // Usar textura de avatar en recorte circular ajustado con anillo neón
                    const tex = this.createCircularFaceTexture(`assets/faces/${num}.jpg`);
                    const matMicro = new THREE.SpriteMaterial({ map: tex });
                    mesh = new THREE.Sprite(matMicro);
                    
                    
                    // Fetch Markov Mass if available
                    let markovMass = 0;
                    try {
                        let g = (subject.group === 'ALL' || !subject.group) ? 'g1' : subject.group.toLowerCase();
                        let t = (subject.time === 'ALL' || !subject.time) ? 't1' : subject.time.toLowerCase();
                        let c = (subject.criterio && subject.criterio !== 'ALL') ? subject.criterio.toLowerCase() : 'c1';
                        let mObj = this.payload.raw_matrices[g+t+c]?.Markov;
                        let sName = num.toString();
                        if (mObj) markovMass = mObj[sName] || 0;
                    } catch(e) {}
                    
                    let scaleMult = 1.0 + (markovMass * 5); // Exaggerate Gravity
                    
                    // Hacerlos un poco más pequeños si son sub-condensados (8_c1)
                    if (key.includes('_c')) {
                        mesh.scale.set(1, 1, 1);
                        matMicro.opacity = 0.7;
                    } else {
                        mesh.scale.set(1.5, 1.5, 1);
                    }
                } else {
                    // Fallback
                    const color = new THREE.Color().setHSL(0.6 - (density * 0.6), 1, 0.5);
                    const matMicro = new THREE.MeshPhongMaterial({ color: color });
                    mesh = new THREE.Mesh(geoMicro, matMicro);
                }
                
                const pos = new THREE.Vector3(
                    subject.coords[0] * scaleFactor,
                    subject.coords[1] * scaleFactor,
                    subject.coords[2] * scaleFactor
                );
                mesh.position.copy(pos);
                mesh.position.copy(pos);
                let markovMassRaw = 0;
                try {
                    let g = (subject.group === 'ALL' || !subject.group) ? 'g1' : subject.group.toLowerCase();
                    let t = (subject.time === 'ALL' || !subject.time) ? 't1' : subject.time.toLowerCase();
                    let c = (subject.criterio && subject.criterio !== 'ALL') ? subject.criterio.toLowerCase() : 'c1';
                    let mObj = this.payload.raw_matrices[g+t+c]?.Markov;
                    if (mObj && num) markovMassRaw = mObj[num.toString()] || 0;
                } catch(e) {}
                
                mesh.userData = { type: 'Sujeto', ...subject, name: key.replace('_CONDENSED', ''), markovMass: markovMassRaw };
                this.layers['MICRO'].add(mesh);
            });
        }
        
        // 3. Capa FEATURES (Figuras Quatuor -> Modalidades VAR)
        if (this.payload.active_features) {
            Object.entries(this.payload.active_features).forEach(([key, feature]) => {
                const pos = new THREE.Vector3(
                    feature.Dim1 * scaleFactor,
                    feature.Dim2 * scaleFactor,
                    feature.Dim3 * scaleFactor
                );
                
                // Esfera Elegante de tamaño fijo y proporcional
                const radius = 0.22; 
                const matF = new THREE.MeshPhongMaterial({ color: 0x38bdf8, emissive: 0x0f172a });
                const meshF = new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 16), matF);
                meshF.position.copy(pos);
                meshF.userData = { type: 'Figura Quatuor', name: key, ...feature };
                this.layers['FEATURES'].add(meshF);

                // Etiqueta flotante discreta
                const sprite = this.createTextSprite(key, '#38bdf8', 0.85);
                sprite.position.copy(pos);
                sprite.position.y += radius + 0.5;
                sprite.userData = { ...sprite.userData, type: 'Figura Quatuor', name: key };
                this.layers['FEATURES'].add(sprite);
            });
        }
        // 4. Capa SUPP (Variables Complementarias -> Texto lima/verde discreto con anti-colisión)
        if (this.payload.supplementary_features) {
            const placedSuppPositions = [];
            Object.entries(this.payload.supplementary_features).forEach(([key, feature]) => {
                const sprite = this.createTextSprite(key, '#a3e635', 0.7); // Lima/Verde claro discreto
                const pos = new THREE.Vector3(
                    feature.Dim1 * scaleFactor,
                    feature.Dim2 * scaleFactor,
                    feature.Dim3 * scaleFactor
                );
                
                sprite.position.copy(pos);
                sprite.userData = { ...sprite.userData, type: 'Var Complementaria', name: key, ...feature };
                this.layers['SUPP'].add(sprite);
            });
        }
        
        // 5. Capa TRIADIC (Capa 4: META_percepción Triádica -> Notación Cian/Rosa discreta)
        if (this.payload.active_features) {
            Object.entries(this.payload.active_features).forEach(([key, feature]) => {
                // Filtrar elementos de Meta-Percepción Triádica (¡Re!, ¡Ee!, ¡Er!, ¡Rr!)
                if (key.includes('¡') || key.includes('Er') || key.includes('Rr') || key.includes('Ee') || key.includes('Re')) {
                    const sprite = this.createTextSprite(key, '#06b6d4', 0.8); // Cian discreto
                    const pos = new THREE.Vector3(
                        feature.Dim1 * scaleFactor,
                        feature.Dim2 * scaleFactor,
                        feature.Dim3 * scaleFactor
                    );
                    
                    sprite.position.copy(pos);
                    sprite.userData = { ...sprite.userData, type: 'Meta-Percepción Triádica', name: key, ...feature };
                    this.layers['TRIADIC'].add(sprite);
                }
            });
        }
        // 5. Capa UNIVERSE (Proyección básica de sujetos brutos)
        this.buildUniverse();
        
        this.updateLayerVisibility();
        
        // Ajustar cámara dinámicamente según el tamaño del Universo
        let maxDist = 100;
        this.layers['MACRO'].traverse((child) => {
            if (child.position && child.position.length() > maxDist) {
                maxDist = child.position.length();
            }
        });
        // Ubicar la cámara lejos para ver todo
        this.camera.position.set(0, maxDist * 0.2, maxDist * 1.5);
        this.camera.lookAt(0, 0, 0);
    }

    toggleLayer(layerName, isVisible) {
        if (this.state[layerName] !== undefined) {
            this.state[layerName] = isVisible;
            if (layerName === 'MICRO') {
                this.state['UNIVERSE'] = isVisible;
            }
            this.updateLayerVisibility();
        }
    }

    drawTrajectories(subjectIds, evSubjects, aagIds, selectedPairs, activeT = []) {
        const layer = this.layers['TRAJECTORIES'];
        // Limpiar trayectorias anteriores
        while(layer.children.length > 0) {
            const obj = layer.children[0];
            if(obj.geometry) obj.geometry.dispose();
            if(obj.material) obj.material.dispose();
            layer.remove(obj);
        }
        
        if (!this.payload || !selectedPairs || selectedPairs.length === 0) return;
        const scaleFactor = 1; // Ya normalizado en preprocessPayload
        
        // Helper para ordenar por tiempo y extraer coords
        const extractTrajectory = (sourceMap, isAag, targetId, metaG, metaC) => {
            const points = [];
            const labels = [];
            
            // Build the time regex part based on activeT (if any selected, otherwise match all a-z)
            // Aceptar tanto 'a','b' como '1','2' para compatibilidad entre AFC y metadatos
            const timePattern = (activeT && activeT.length > 0) ? `([${activeT.join('')}])` : `([a-z1-9])`;
            
            if (!isAag) {
                // Para sujetos: targetId + metaG + (tiempo) + metaC (Ej. 1A1t1c, 24B3t1c)
                let subjNum = targetId;
                let subjG = metaG;
                const mSubj = targetId.match(/^(\d+)([A-Z])$/);
                if (mSubj) {
                    subjNum = mSubj[1];
                    subjG = mSubj[2];
                }
                
                const regex = new RegExp(`^${subjNum}${subjG}${timePattern}${metaC}$`);
                const matches = [];
                Object.entries(sourceMap).forEach(([key, val]) => {
                    const m = key.match(regex);
                    if (m) matches.push({ timeChar: m[1], coords: val.coords, key: key });
                });
                
                matches.sort((a,b) => a.timeChar.localeCompare(b.timeChar));
                matches.forEach(m => {
                    points.push(new THREE.Vector3(m.coords[0]*scaleFactor, m.coords[1]*scaleFactor, m.coords[2]*scaleFactor));
                    
                    // Formatear etiqueta concisa SMIb: 24Bc1 (Sujeto 24, Grupo B, Temporada c/T3, Criterio 1)
                    const parsed = m.key.match(/^(\d+)([A-Z])([a-z1-9])(\d+)$/);
                    if (parsed) {
                        const num = parsed[1];
                        const g = parsed[2];
                        const tRaw = parsed[3];
                        const c = parsed[4];
                        const tChar = (tRaw >= '1' && tRaw <= '9') ? String.fromCharCode(96 + parseInt(tRaw)) : tRaw;
                        labels.push(`${num}${g}${tChar}${c}`);
                    } else {
                        labels.push(m.key);
                    }
                });
            } else {
                // Para AAG: targetId_T1, targetId_T2, etc. (Ej. +Unid_T1, +Unid_T2)
                const matches = [];
                
                // Mapear activeT ('a', 'b', 'c') a números (1, 2, 3) o aceptar números directamente ('1'->1)
                const activeTNums = activeT.map(t => {
                    const code = t.charCodeAt(0);
                    if (code >= 97) return code - 96;
                    return parseInt(t);
                }).filter(n => !isNaN(n));
                
                Object.entries(sourceMap).forEach(([key, val]) => {
                    if (key.startsWith(`${targetId}_T`)) {
                        const tNum = parseInt(key.split('_T')[1]);
                        if (!isNaN(tNum)) {
                            // Filtrar si hay activeT
                            if (activeTNums.length === 0 || activeTNums.includes(tNum)) {
                                matches.push({ timeNum: tNum, coords: val, key: key });
                            }
                        }
                    }
                });
                
                matches.sort((a,b) => a.timeNum - b.timeNum);
                matches.forEach(m => {
                    points.push(new THREE.Vector3(m.coords.Dim1*scaleFactor, m.coords.Dim2*scaleFactor, m.coords.Dim3*scaleFactor));
                    labels.push(m.key);
                });
            }
            return { points, labels };
        };

        this.activeCurves = []; // Almacenar las curvas para la animación
        this.labelsCache = {}; // Cachear etiquetas de texto para no crearlas en cada frame
        this.activeLabels = this.activeLabels || new Set(); // Etiquetas visibles por ID

        // Definir una paleta de colores para diferenciar los grupos en las trayectorias
        const colors = [0xffffff, 0xffd700, 0xff69b4, 0x00ffff, 0x32cd32];
        
        selectedPairs.forEach((pair, pairIdx) => {
            let metaG, metaC;
            if (typeof pair === 'string') {
                const parts = pair.split('_');
                metaG = parts[0].replace('G', '');
                metaC = parts[1] ? parts[1].replace('C', '') : '';
            } else {
                metaG = pair.g;
                metaC = pair.c;
            }
            const groupColor = colors[pairIdx % colors.length];
            const materialS = new THREE.LineBasicMaterial({ color: groupColor, linewidth: 2, transparent: true, opacity: 0.8 });
            const materialA = new THREE.LineBasicMaterial({ color: 0xa3e635, linewidth: 2, transparent: true, opacity: 0.8, dashSize: 1, gapSize: 1 });

        // Sujetos
        subjectIds.forEach(id => {
            const { points, labels } = extractTrajectory(this.payload.subjects, false, id, metaG, metaC);
            if (points.length >= 1) {
                // Dibujar nodos estáticos para todos los seleccionados en tamaño fino y nítido (radio 0.18)
                points.forEach((p, idx) => {
                    const matNode = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
                    const meshNode = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matNode);
                    meshNode.position.copy(p);
                    meshNode.userData = { type: 'Trayectoria Nodo', name: labels[idx] };
                    layer.add(meshNode);
                });
                
                // Añadir etiquetas en los vértices (Tamaño discreto: 0.75)
                points.forEach((pt, idx) => {
                    const labelStr = labels[idx];
                    const sprite = this.createTextSprite(labelStr, '#38bdf8', 0.65); // Azul claro discreto
                    sprite.position.copy(pt);
                    sprite.position.y += 0.45; // Ligeramente por encima del vértice
                    sprite.userData = { ...sprite.userData, type: 'Nodo Sujeto', name: labelStr };
                    layer.add(sprite);
                });
                
                // Módulo Evolutivo: Solo dibujar línea de trayectoria y curva si el sujeto tiene Ev marcado
                if (evSubjects.includes(id)) {
                    if (points.length > 1) {
                        const geometry = new THREE.BufferGeometry().setFromPoints(points);
                        const line = new THREE.Line(geometry, materialS);
                        layer.add(line);
                        
                        const curve = new THREE.CatmullRomCurve3(points, false, 'chordal');
                        this.activeCurves.push({ curve, isAag: false, id });
                    }
                }
                this.labelsCache[id] = this.createTextSprite(id, '#ffffff', 0.55);
            }
        });
        
        // AAGs
        aagIds.forEach(id => {
            const { points, labels } = extractTrajectory(this.payload.supplementary_features, true, id, metaG, metaC);
            if (points.length >= 1) {
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, materialA);
                layer.add(line);
                
                // Dibujar nodos
                points.forEach((p, idx) => {
                    const matNode = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    const meshNode = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), matNode);
                    meshNode.position.copy(p);
                    layer.add(meshNode);
                });
                
                // Añadir etiquetas en los vértices
                points.forEach((pt, idx) => {
                    const labelStr = labels[idx];
                    const sprite = this.createTextSprite(labelStr, '#a3e635', 0.4); // Verde claro
                    sprite.position.copy(pt);
                    sprite.position.y += 1.0;
                    layer.add(sprite);
                });
                
                if (points.length > 1) {
                    const curve = new THREE.CatmullRomCurve3(points, false, 'chordal');
                    this.activeCurves.push({ curve, isAag: true, id });
                }
            }
        });
        
        }); // Fin de selectedPairs.forEach
        
        // Resetear animadores
        this.setTime(0);
    }

    toggleSubjectLabel(id, isVisible) {
        if (!this.activeLabels) this.activeLabels = new Set();
        if (isVisible) {
            this.activeLabels.add(id);
        } else {
            this.activeLabels.delete(id);
        }
        this.toggleSubjectVisibility(id, isVisible);
    }

    toggleSubjectVisibility(id, isVisible) {
        if (!this.hiddenSubjects) this.hiddenSubjects = new Set();
        if (isVisible) {
            this.hiddenSubjects.delete(id);
        } else {
            this.hiddenSubjects.add(id);
        }

        // Aplicar visibilidad en tiempo real a los nodos y etiquetas en los planos 3D
        ['UNIVERSE', 'MICRO', 'TRAJECTORIES'].forEach(layerName => {
            if (this.layers[layerName]) {
                this.layers[layerName].traverse(child => {
                    if (child.userData && child.userData.name) {
                        const name = child.userData.name;
                        if (name === id || name.startsWith(id)) {
                            child.visible = isVisible;
                        }
                    }
                });
            }
        });
    }

    toggleGlobalLayer(key, isAct) {
        const mapKeyToType = {
            'F': ['Figura', 'Q81', 'Quatuor', 'Feature Columna'],
            'G': ['G1', 'G2', 'G3'],
            'T': ['T1', 'T2', 'T3', 'T4'],
            'C': ['C1', 'C2', 'C3'],
            'S': ['Sujeto', 'SUBJECT', 'Nodo Sujeto', 'Nodo Sujeto Base', 'Nodo Sociomatriz Cromático'],
            'E': ['Trayectoria', 'Evolucion', 'Evolución', 'EVOLUTION', 'Trayectoria Nodo'],
            'D': ['CLUSTER', 'Dendrograma', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
            'V': ['VAR', 'Variable', 'Modalidad', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'],
            'A': ['AAG', 'Adjetivo', 'Factor', 'AAG_PLUS', 'AAG_MINUS'],
            'K': ['Cluster', 'K1', 'K2', 'K3', 'K4', 'Cluster Sujetos']
        };

        const targetTypes = mapKeyToType[key] || [key];

        ['UNIVERSE', 'MICRO', 'TRAJECTORIES'].forEach(lName => {
            if (this.layers[lName]) {
                this.layers[lName].traverse(child => {
                    if (child.userData && (child.userData.type || child.userData.name)) {
                        const type = child.userData.type || '';
                        const name = child.userData.name || '';
                        const isMatch = targetTypes.some(t => type.includes(t) || name.includes(t));
                        if (isMatch) {
                            child.visible = isAct;
                        }
                    }
                });
            }
        });

        if (key === 'E' && this.layers['TRAJECTORIES']) {
            this.layers['TRAJECTORIES'].visible = isAct;
        }
    }

    setExclusiveGlobalLayer(exclusiveKey) {
        const mapKeyToType = {
            'F': ['Figura', 'Q81', 'Quatuor', 'Feature Columna'],
            'G': ['G1', 'G2', 'G3'],
            'T': ['T1', 'T2', 'T3', 'T4'],
            'C': ['C1', 'C2', 'C3'],
            'S': ['Sujeto', 'SUBJECT', 'Nodo Sujeto', 'Nodo Sujeto Base', 'Nodo Sociomatriz Cromático'],
            'E': ['Trayectoria', 'Evolucion', 'Evolución', 'EVOLUTION', 'Trayectoria Nodo'],
            'D': ['CLUSTER', 'Dendrograma', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6']
        };

        const targetTypes = mapKeyToType[exclusiveKey] || [exclusiveKey];

        ['UNIVERSE', 'MICRO', 'TRAJECTORIES'].forEach(lName => {
            if (this.layers[lName]) {
                this.layers[lName].traverse(child => {
                    if (child.userData && (child.userData.type || child.userData.name)) {
                        const type = child.userData.type || '';
                        const name = child.userData.name || '';
                        const isMatch = targetTypes.some(t => type.includes(t) || name.includes(t));
                        child.visible = isMatch;
                    }
                });
            }
        });

        if (this.layers['TRAJECTORIES']) {
            this.layers['TRAJECTORIES'].visible = (exclusiveKey === 'E');
        }
    }

    toggleVariableCentroid(varNum, isVisible) {
        if (!this.layers['SUPP']) return;
        this.layers['SUPP'].traverse(child => {
            if (child.userData && child.userData.name) {
                const name = child.userData.name;
                if (varNum === 'all' || name.includes(varNum) || name.endsWith(varNum)) {
                    child.visible = isVisible;
                }
            }
        });
    }

    toggleAAGFactor(factorNum, isVisible) {
        if (!this.layers['SUPP']) return;
        const aagList = Array.from(window.visordApp && window.visordApp.aagMapSet ? window.visordApp.aagMapSet : []);
        const startIdx = (factorNum - 1) * 4;
        const endIdx = factorNum * 4;
        const targetAags = aagList.slice(startIdx, endIdx);

        this.layers['SUPP'].traverse(child => {
            if (child.userData && child.userData.name) {
                const name = child.userData.name.replace(/^[+-]/, '');
                if (targetAags.includes(name) || targetAags.some(tag => child.userData.name.includes(tag))) {
                    child.visible = isVisible;
                }
            }
        });
    }

    clearAllProjections() {
        // 1. Apagar todas las capas registradas en this.state y en escena Three.js
        Object.keys(this.layers).forEach(lName => {
            this.state[lName] = false;
            if (this.layers[lName]) {
                this.layers[lName].visible = false;
                this.layers[lName].traverse(child => {
                    child.visible = false;
                });
            }
        });

        // 2. Limpiar físicamente la capa de trayectorias
        if (this.layers['TRAJECTORIES']) {
            const layer = this.layers['TRAJECTORIES'];
            while (layer.children.length > 0) {
                const obj = layer.children[0];
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
                layer.remove(obj);
            }
        }

        // 3. Detener cualquier dron de audio activo
        if (this.audio && this.audio.stopAll) {
            this.audio.stopAll();
        }

        this.updateLayerVisibility();
    }

    setTime(progress) {
        // progress va de 0 a 1
        const layer = this.layers['TRAJECTORIES'];
        
        // Limpiar animadores previos liberando memoria de GPU (Previene cuelgues)
        for (let i = layer.children.length - 1; i >= 0; i--) {
            const child = layer.children[i];
            if (child.userData.isAnimator) {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
                layer.remove(child);
            }
        }
        
        if (!this.activeCurves) return;
        
        const textureLoader = new THREE.TextureLoader();
        
        this.activeCurves.forEach(item => {
            const pos = item.curve.getPoint(progress);
            
            let mesh;
            if (!item.isAag) {
                if (!this.isMultiGroup && parseInt(item.id) >= 1 && parseInt(item.id) <= 12) {
                    // Avatar del sujeto con recorte circular perfecto y anillo neón
                    const tex = this.createCircularFaceTexture(`assets/faces/${item.id}.jpg`);
                    const mat = new THREE.SpriteMaterial({ map: tex });
                    mesh = new THREE.Sprite(mat);
                    mesh.scale.set(1.4, 1.4, 1);
                } else {
                    const mat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Verde neutro
                    mesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshPhongMaterial({ color: 0xa3e635 }));
                }
                
                // Etiqueta de ID flotante si está activa
                if (this.activeLabels && this.activeLabels.has(item.id) && this.labelsCache[item.id]) {
                    const labelSprite = this.labelsCache[item.id];
                    const clone = labelSprite.clone();
                    clone.position.copy(pos);
                    clone.position.y += 2.0; // Encima de la cabeza
                    clone.userData.isAnimator = true;
                    layer.add(clone);
                }
                
            } else {
                // Esfera brillante para el AAG
                const geo = new THREE.SphereGeometry(0.6, 16, 16);
                const mat = new THREE.MeshPhongMaterial({ color: 0xa3e635, emissive: 0xa3e635, emissiveIntensity: 0.5 });
                mesh = new THREE.Mesh(geo, mat);
            }
            
            mesh.position.copy(pos);
            mesh.userData.isAnimator = true;
            layer.add(mesh);
        });
    }

    setCTAFilter(threshold) {
        const filterLayer = (layerName) => {
            if (!this.layers[layerName]) return;
            this.layers[layerName].children.forEach(mesh => {
                if (mesh.userData && mesh.userData.stats && mesh.userData.stats.cta !== undefined) {
                    // Check threshold, but respect global layer visibility
                    mesh.visible = (mesh.userData.stats.cta >= threshold);
                }
            });
        };
        
        filterLayer('MACRO');
        filterLayer('MICRO');
        filterLayer('FEATURES');
        filterLayer('SUPP');
    }
    buildUniverse() {
        const payload = this.payload || {};
        
        // Conteo total de puntos considerando la estructura GTC con los nodos asociados a cada grupo
        const subjectEntries = payload.subjects ? Object.entries(payload.subjects).filter(([k, s]) => s && s.coords) : [];
        const totalGTCPoints = subjectEntries.length;
        
        // Umbral adaptativo: Si la estructura GTC cuenta con <= 150 elementos (p. ej. G1T3C2 con n=15 -> 15x1x3x2 = 90 elementos),
        // se activa la Proyección Directa Monolítica con el 100% de las etiquetas desplegadas simultáneamente.
        // Para cargas mayores (> 150 elementos, como G3T4C3 con 516 nodos), se activa el Modo Gestalt Multipantalla.
        this.isSmallPayload = totalGTCPoints > 0 && totalGTCPoints <= 150;

        this.layers['UNIVERSE'].clear();

        if (this.isSmallPayload) {
            // ====================================================
            // MODO COMPACTO (N < 15): Proyección Directa Monolítica Total
            // ====================================================
            this.universeWaves = [new THREE.Group()];
            this.layers['UNIVERSE'].add(this.universeWaves[0]);
            const targetGroup = this.universeWaves[0];

            // 1. Columnas Quatuor con etiquetas
            const addFeature = (dict, defaultColor) => {
                if (!dict) return;
                Object.entries(dict).forEach(([key, f]) => {
                    if (f.Dim1 === undefined && !f.coords) return;
                    const pos = new THREE.Vector3(
                        f.Dim1 !== undefined ? f.Dim1 : f.coords[0],
                        f.Dim2 !== undefined ? f.Dim2 : f.coords[1],
                        f.Dim3 !== undefined ? f.Dim3 : f.coords[2]
                    );
                    const color = key.startsWith('+') ? 0x00FF9D : (key.startsWith('-') ? 0xef4444 : defaultColor);
                    const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
                    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mat);
                    mesh.position.copy(pos);
                    mesh.userData = { type: 'Feature Columna', name: key };
                    targetGroup.add(mesh);

                    const sprite = this.createTextSprite(key, key.startsWith('+') ? '#00FF9D' : (key.startsWith('-') ? '#ef4444' : '#fbbf24'), 0.8);
                    sprite.position.copy(pos);
                    sprite.position.y += 0.6;
                    targetGroup.add(sprite);
                });
            };
            addFeature(payload.active_features, 0xf59e0b);
            addFeature(payload.supplementary_features, 0xa855f7);

            // 2. Centroides disponibles con etiquetas
            if (payload.centroids) {
                Object.entries(payload.centroids).forEach(([k, item]) => {
                    if (item && item.coords) {
                        const pos = new THREE.Vector3(...item.coords);
                        const mat = new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.5 });
                        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 20), mat);
                        mesh.position.copy(pos);
                        mesh.userData = { type: 'Centroide', name: k };
                        targetGroup.add(mesh);

                        const sprite = this.createTextSprite(k.replace('_CENTROID', ''), '#10b981', 0.9);
                        sprite.position.copy(pos);
                        sprite.position.y += 0.9;
                        targetGroup.add(sprite);
                    }
                });
            }

            // 3. Sujetos individuales con sus etiquetas desplegadas en sus colores cromáticos
            const getMatrixColorHex = (gCode, tCode, cCode) => {
                const gMap = { 'A': 0, 'B': 1, 'C': 2, '1': 0, '2': 1, '3': 2 };
                const tMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
                const cMap = { '1': 0, '2': 1, '3': 2 };

                const gi = gMap[gCode] !== undefined ? gMap[gCode] : 0;
                const ti = tMap[tCode] !== undefined ? tMap[tCode] : 0;
                const ci = cMap[cCode] !== undefined ? cMap[cCode] : 0;

                const idx = (gi * 12) + (ti * 3) + ci;
                const hue = (idx * 360 / 36) % 360;
                return '#' + new THREE.Color().setHSL(hue / 360, 0.9, 0.65).getHexString();
            };

            subjectEntries.forEach(([key, subj]) => {
                const pos = new THREE.Vector3(...subj.coords);
                const match = key.match(/^(\d+)([A-Z])([a-z])(\d+)$/);
                let textColor = subj.density >= 0 ? '#38bdf8' : '#ef4444';
                if (match) {
                    textColor = getMatrixColorHex(match[2], match[3], match[4]);
                }
                const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(textColor), transparent: true, opacity: 0.9 });
                const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10), mat);
                mesh.position.copy(pos);
mesh.userData = { type: 'Nodo Sujeto', name: subj.name || key };
                targetGroup.add(mesh);

                const sprite = this.createTextSprite(subj.name || key, textColor, 0.95);
                sprite.position.copy(pos);
                targetGroup.add(sprite);
            });

        } else {
            // ====================================================
            // MODO DENSE (N >= 15): Estructura de 2 PASES DEFINIDOS
            // PASE I: Repertorio Global de Puntos + Etiquetas <Ee> y Rótulos Base G1..G3, T1..T4, C1..C3
            // PASE II: Estructura Interseccional (GxT, GxC, TxC) y Red Cromática de Sujetos por Grupos
            // ====================================================
            this.universeWaves = [
                new THREE.Group(), // PASE I: Constelación Global + Rótulos Quatuor <Ee> + Esqueleto G1..C3
                new THREE.Group(), // PASE II.1: Intersección GxT (12 Puntos Cromáticos + Etiquetas)
                new THREE.Group(), // PASE II.2: Intersección GxC (9 Puntos Cromáticos + Etiquetas)
                new THREE.Group(), // PASE II.3: Intersección TxC (12 Puntos Cromáticos + Etiquetas)
                new THREE.Group()  // PASE II.4: Red Sociométrica de Sujetos por Grupos (Puntos HSL + Etiquetas)
            ];
            this.universeWaves.forEach(w => this.layers['UNIVERSE'].add(w));

            // ----------------------------------------------------
            // 0. Proyectar los 2 Ejes Principales bien visibles cruzándose en la coordenada de origen (0,0)
            // ----------------------------------------------------
            const addMainAxes = (targetGroup) => {
                const matAxis1 = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
                const matAxis2 = new THREE.LineBasicMaterial({ color: 0x00FF9D, transparent: true, opacity: 0.7 });
                
                const origX = this.originScreenPos ? this.originScreenPos.x : 0;
                const origY = this.originScreenPos ? this.originScreenPos.y : 0;

                // Eje 1 (Horizontal de borde a borde en Y = origY)
                const geomAxis1 = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(-17.5, origY, 0),
                    new THREE.Vector3(17.5, origY, 0)
                ]);
                const lineAxis1 = new THREE.Line(geomAxis1, matAxis1);
                targetGroup.add(lineAxis1);
                
                // Eje 2 (Vertical de borde a borde en X = origX)
                const geomAxis2 = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(origX, -9.5, 0),
                    new THREE.Vector3(origX, 9.5, 0)
                ]);
                const lineAxis2 = new THREE.Line(geomAxis2, matAxis2);
                targetGroup.add(lineAxis2);

                // Rótulos de los Ejes
                const labelEje1R = this.createTextSprite("EJE 1 (+)", "#38bdf8", 0.7);
                labelEje1R.position.set(16.5, origY - 0.6, 0);
                targetGroup.add(labelEje1R);

                const labelEje1L = this.createTextSprite("EJE 1 (-)", "#38bdf8", 0.7);
                labelEje1L.position.set(-16.5, origY - 0.6, 0);
                targetGroup.add(labelEje1L);

                const labelEje2T = this.createTextSprite("EJE 2 (+)", "#00FF9D", 0.7);
                labelEje2T.position.set(origX + 0.8, 8.8, 0);
                targetGroup.add(labelEje2T);

                const labelEje2B = this.createTextSprite("EJE 2 (-)", "#00FF9D", 0.7);
                labelEje2B.position.set(origX + 0.8, -8.8, 0);
                targetGroup.add(labelEje2B);
            };
            addMainAxes(this.universeWaves[0]);

            // Helper: Crear Traza Quebrada para dimensiones superiores (Ejes 3, 4, 5, 6)
            const addTrazaQuebrada = (basePos, extraDims, waveGroup) => {
                if (!extraDims || extraDims.length === 0) return;
                const angles = [Math.PI / 6, 5 * Math.PI / 6, 7 * Math.PI / 6, 11 * Math.PI / 6];
                
                const pts = [basePos.clone()];
                let curr = basePos.clone();
                let hasSignificantShift = false;
                
                extraDims.forEach((dimVal, i) => {
                    if (dimVal && Math.abs(dimVal) > 0.05) {
                        hasSignificantShift = true;
                        const angle = angles[i % 4];
                        const dx = Math.cos(angle) * dimVal * 1.2;
                        const dy = Math.sin(angle) * dimVal * 1.2;
                        curr = new THREE.Vector3(curr.x + dx, curr.y + dy, curr.z + (i + 1) * 0.3);
                        pts.push(curr.clone());
                    }
                });
                
                if (hasSignificantShift && pts.length > 1) {
                    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
                    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
                    const line = new THREE.Line(lineGeo, lineMat);
                    waveGroup.add(line);

                    // Punto extremo de la traza quebrada
                    const endGeo = new THREE.SphereGeometry(0.18, 8, 8);
                    const endMat = new THREE.MeshBasicMaterial({ color: 0x00FF9D });
                    const endMesh = new THREE.Mesh(endGeo, endMat);
                    endMesh.position.copy(curr);
                    waveGroup.add(endMesh);
                }
            };

            // ----------------------------------------------------
            // CONSTRUCCIÓN DEL PASE I: Repertorio Global Completo de Puntos + Rótulos <Ee> & G1..C3
            // ----------------------------------------------------
            // 1. Añadir Rótulos Quatuor <Ee> a la onda del Pase I
            const addQuatuorFeatures = (waveGroup) => {
                const addFeature = (dict, defaultColor) => {
                    if (!dict) return;
                    Object.entries(dict).forEach(([key, f]) => {
                        if (f.Dim1 === undefined && !f.coords) return;
                        const pos = new THREE.Vector3(
                            f.Dim1 !== undefined ? f.Dim1 : f.coords[0],
                            f.Dim2 !== undefined ? f.Dim2 : f.coords[1],
                            f.Dim3 !== undefined ? f.Dim3 : f.coords[2]
                        );
                        const color = key.startsWith('+') ? 0x00FF9D : (key.startsWith('-') ? 0xef4444 : defaultColor);
                        const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
                        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mat);
                        mesh.position.copy(pos);
                        mesh.userData = { type: 'Feature Columna <Ee>', name: key };
                        waveGroup.add(mesh);

                        const sprite = this.createTextSprite(key, key.startsWith('+') ? '#00FF9D' : (key.startsWith('-') ? '#ef4444' : '#fbbf24'), 0.9);
                        sprite.position.copy(pos);
                        waveGroup.add(sprite);

                        // Traza quebrada si posee dimensiones superiores (Dim 3, 4, 5, 6)
                        if (f.extra_dims) {
                            addTrazaQuebrada(pos, f.extra_dims, waveGroup);
                        }
                    });
                };
                addFeature(payload.active_features, 0xf59e0b);
                addFeature(payload.supplementary_features, 0xa855f7);
            };
            addQuatuorFeatures(this.universeWaves[0]);

            // 2. Mapear los 36 centroides base (G1_T1_C1..G3_T4_C3)
            const c36Map = {};
            if (payload.centroids) {
                for (let g = 1; g <= 3; g++) {
                    for (let t = 1; t <= 4; t++) {
                        for (let c = 1; c <= 3; c++) {
                            const key = `G${g}_T${t}_C${c}`;
                            if (payload.centroids[key] && payload.centroids[key].coords) {
                                c36Map[key] = payload.centroids[key].coords;
                            }
                        }
                    }
                }
            }

            // 3. Añadir todo el repertorio de puntos neutros/globales al PASE I
            if (payload.centroids) {
                Object.entries(payload.centroids).forEach(([k, c]) => {
                    if (c.coords) {
                        const pos = new THREE.Vector3(...c.coords);
                        const mat = new THREE.MeshPhongMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.5 });
                        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), mat);
                        mesh.position.copy(pos);
                        mesh.userData = { type: 'Centroide Global', name: k };
                        this.universeWaves[0].add(mesh);
                    }
                });
            }
            subjectEntries.forEach(([key, subj]) => {
                const pos = new THREE.Vector3(...subj.coords);
                const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
                const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), mat);
                mesh.position.copy(pos);
                mesh.userData = { type: 'Nodo Sujeto Base', name: key };
                this.universeWaves[0].add(mesh);

                if (subj.extra_dims) {
                    addTrazaQuebrada(pos, subj.extra_dims, this.universeWaves[0]);
                }
            });

            // 4. Añadir únicamente el esqueleto básico G1..G3, T1..T4, C1..C3 al PASE I
            if (payload.centroids) {
                const totals = [
                    { keys: ['G1_CENTROID', 'G2_CENTROID', 'G3_CENTROID'], color: 0x10b981, textColor: '#10b981', label: 'Grupo' },
                    { keys: ['T1_CENTROID', 'T2_CENTROID', 'T3_CENTROID', 'T4_CENTROID'], color: 0xa855f7, textColor: '#a855f7', label: 'Turno' },
                    { keys: ['C1_CENTROID', 'C2_CENTROID', 'C3_CENTROID'], color: 0x38bdf8, textColor: '#38bdf8', label: 'Criterio' }
                ];
                totals.forEach(grp => {
                    grp.keys.forEach(k => {
                        const item = payload.centroids[k];
                        if (item && item.coords) {
                            const pos = new THREE.Vector3(...item.coords);
                            const mat = new THREE.MeshPhongMaterial({ color: grp.color, emissive: grp.color, emissiveIntensity: 0.8 });
                            const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), mat);
                            mesh.position.copy(pos);
                            mesh.userData = { type: grp.label, name: k };
                            this.universeWaves[0].add(mesh);

                            const sprite = this.createTextSprite(k.replace('_CENTROID', ''), grp.textColor, 1.25);
                            sprite.position.copy(pos);
                            this.universeWaves[0].add(sprite);
                        }
                    });
                });
            }

            // ----------------------------------------------------
            // CONSTRUCCIÓN DEL PASE II: Estructura Interseccional y Sujetos Cromáticos
            // ----------------------------------------------------

            // PASE II.1: Intersecciones y Rótulos GxT en Verde
            for (let g = 1; g <= 3; g++) {
                for (let t = 1; t <= 4; t++) {
                    const pts = [c36Map[`G${g}_T${t}_C1`], c36Map[`G${g}_T${t}_C2`], c36Map[`G${g}_T${t}_C3`]].filter(Boolean);
                    if (pts.length > 0) {
                        const avg = [
                            pts.reduce((s, p) => s + p[0], 0) / pts.length,
                            pts.reduce((s, p) => s + p[1], 0) / pts.length,
                            pts.reduce((s, p) => s + p[2], 0) / pts.length
                        ];
                        const pos = new THREE.Vector3(...avg);
                        const mat = new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.8 });
                        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), mat);
                        mesh.position.copy(pos);
                        mesh.userData = { type: 'Parcial GxT', name: `G${g}T${t}` };
                        this.universeWaves[1].add(mesh);

                        const sprite = this.createTextSprite(`G${g}T${t}`, '#10b981', 1.2);
                        sprite.position.copy(pos);
                        this.universeWaves[1].add(sprite);
                    }
                }
            }

            // PASE II.2: Intersecciones y Rótulos GxC en Cyan
            for (let g = 1; g <= 3; g++) {
                for (let c = 1; c <= 3; c++) {
                    const pts = [c36Map[`G${g}_T1_C${c}`], c36Map[`G${g}_T2_C${c}`], c36Map[`G${g}_T3_C${c}`], c36Map[`G${g}_T4_C${c}`]].filter(Boolean);
                    if (pts.length > 0) {
                        const avg = [
                            pts.reduce((s, p) => s + p[0], 0) / pts.length,
                            pts.reduce((s, p) => s + p[1], 0) / pts.length,
                            pts.reduce((s, p) => s + p[2], 0) / pts.length
                        ];
                        const pos = new THREE.Vector3(...avg);
                        const mat = new THREE.MeshPhongMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.8 });
                        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), mat);
                        mesh.position.copy(pos);
                        mesh.userData = { type: 'Parcial GxC', name: `G${g}C${c}` };
                        this.universeWaves[2].add(mesh);

                        const sprite = this.createTextSprite(`G${g}C${c}`, '#38bdf8', 1.2);
                        sprite.position.copy(pos);
                        this.universeWaves[2].add(sprite);
                    }
                }
            }

            // PASE II.3: Intersecciones y Rótulos TxC en Púrpura
            for (let t = 1; t <= 4; t++) {
                for (let c = 1; c <= 3; c++) {
                    const pts = [c36Map[`G1_T${t}_C${c}`], c36Map[`G2_T${t}_C${c}`], c36Map[`G3_T${t}_C${c}`]].filter(Boolean);
                    if (pts.length > 0) {
                        const avg = [
                            pts.reduce((s, p) => s + p[0], 0) / pts.length,
                            pts.reduce((s, p) => s + p[1], 0) / pts.length,
                            pts.reduce((s, p) => s + p[2], 0) / pts.length
                        ];
                        const pos = new THREE.Vector3(...avg);
                        const mat = new THREE.MeshPhongMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.8 });
                        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), mat);
                        mesh.position.copy(pos);
                        mesh.userData = { type: 'Parcial TxC', name: `T${t}C${c}` };
                        this.universeWaves[3].add(mesh);

                        const sprite = this.createTextSprite(`T${t}C${c}`, '#a855f7', 1.2);
                        sprite.position.copy(pos);
                        this.universeWaves[3].add(sprite);
                    }
                }
            }

            // PASE II.4: Sujetos de cada Grupo en Colores HSL y Rótulos
            const getMatrixColor = (gCode, tCode, cCode) => {
                const gMap = { 'A': 0, 'B': 1, 'C': 2, '1': 0, '2': 1, '3': 2 };
                const tMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
                const cMap = { '1': 0, '2': 1, '3': 2 };

                const gi = gMap[gCode] !== undefined ? gMap[gCode] : 0;
                const ti = tMap[tCode] !== undefined ? tMap[tCode] : 0;
                const ci = cMap[cCode] !== undefined ? cMap[cCode] : 0;

                const idx = (gi * 12) + (ti * 3) + ci;
                const hue = (idx * 360 / 36) % 360;
                return new THREE.Color().setHSL(hue / 360, 0.85, 0.55);
            };

            subjectEntries.forEach(([key, subj]) => {
                const match = key.match(/^(\d+)([A-Z])([a-z])(\d+)$/);
                let color = new THREE.Color(0x38bdf8);
                if (match) {
                    color = getMatrixColor(match[2], match[3], match[4]);
                }
                const pos = new THREE.Vector3(...subj.coords);
                const mat = new THREE.MeshPhongMaterial({ color: color, emissive: color, emissiveIntensity: 0.5, transparent: true, opacity: 0.95 });
                const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), mat);
                mesh.position.copy(pos);
                mesh.userData = { type: 'Nodo Sociomatriz Cromático', name: key };
                this.universeWaves[4].add(mesh);
            });
        }
    }

    async playUniverseTour() {
        this.abortTour = false;
        if (this.controls) this.controls.enabled = false;
        
        // Ocultar bandas laterales y barras 3D para ejecutar el Tour a Pantalla Completa sin interferencias
        ['left-sidebar', 'right-sidebar', 'top-bar', 'bottom-action-dock'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        Object.keys(this.state).forEach(k => this.state[k] = false);
        this.state['UNIVERSE'] = true;
        this.updateLayerVisibility();
        
        this.buildUniverse();
        
        const center = new THREE.Vector3(0, 0, 0);
        
        if (this.universeWaves) {
            this.universeWaves.forEach(w => w.visible = false);
        }
        
        if (this.audio) this.audio.playDrone();
        
        // Titulares flotando estratégicamente arriba en tamaño discreto y elegante para no tapar la escena 3D
        const titleOverlay = document.createElement('div');
        titleOverlay.id = 'tour-title-overlay';
        titleOverlay.style.position = 'absolute';
        titleOverlay.style.top = '20px';
        titleOverlay.style.left = '50%';
        titleOverlay.style.transform = 'translateX(-50%)';
        titleOverlay.style.color = '#ffffff';
        titleOverlay.style.fontSize = '16px';
        titleOverlay.style.fontWeight = '700';
        titleOverlay.style.textShadow = '0px 0px 10px rgba(0, 255, 157, 0.7)';
        titleOverlay.style.fontFamily = "'Outfit', 'Inter', sans-serif";
        titleOverlay.style.pointerEvents = 'none';
        titleOverlay.style.zIndex = '1000';
        titleOverlay.style.opacity = '0';
        titleOverlay.style.transition = 'opacity 0.8s ease-in-out';
        titleOverlay.style.textAlign = 'center';
        titleOverlay.style.background = 'rgba(15, 23, 42, 0.92)';
        titleOverlay.style.backdropFilter = 'blur(10px)';
        titleOverlay.style.padding = '8px 20px';
        titleOverlay.style.borderRadius = '10px';
        titleOverlay.style.border = '1px solid rgba(56, 189, 248, 0.5)';
        titleOverlay.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.6)';
        this.container.appendChild(titleOverlay);
        
        const showTitle = (text) => {
            titleOverlay.innerHTML = text;
            titleOverlay.style.opacity = '1';
        };
        const hideTitle = () => {
            titleOverlay.style.opacity = '0';
        };

        // Proyección Axonométrica Normalizada 100% Pantall Completa (Z = 20.0, Y = 0.0) alineada con los 2 Ejes Principales
        this.camera.position.set(0, 0, 20.0);
        this.camera.lookAt(center);
        if (this.controls) {
            this.controls.enabled = true;
            this.controls.target.copy(center);
            this.controls.update();
        }
        
        const resetCameraAndControls = () => {
            if (titleOverlay) titleOverlay.remove();
            if (this.audio && this.audio.stopAll) {
                this.audio.stopAll();
            }
            if (this.controls) {
                this.controls.enabled = true;
                this.controls.target.copy(center);
                this.controls.update();
            }
        };
        
        const pause = (ms) => new Promise((resolve) => {
            let elapsed = 0;
            const interval = setInterval(() => {
                if (this.abortTour) {
                    clearInterval(interval);
                    resolve(false);
                }
                elapsed += 100;
                if (elapsed >= ms) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 100);
        });
        
        const revealProgressively = async (target, durationMs = 2000) => {
            const isLayer = typeof target === 'string';
            const group = isLayer ? this.layers[target] : target;
            if (!group) return true;
            
            const items = [...group.children];
            items.forEach(c => c.visible = false);
            
            if (isLayer) {
                this.state[target] = true;
                this.updateLayerVisibility();
            } else {
                group.visible = true;
            }
            
            items.sort(() => Math.random() - 0.5);
            const batchSize = Math.max(1, Math.floor(items.length / 20));
            const stepDelay = durationMs / 20;
            
            for (let i = 0; i < items.length; i += batchSize) {
                if (this.abortTour) return false;
                for (let j = 0; j < batchSize && (i+j) < items.length; j++) {
                    items[i+j].visible = true;
                }
                await pause(stepDelay);
            }
            items.forEach(c => c.visible = true);
            return true;
        };
        
        if (this.isSmallPayload) {
            // ====================================================
            // MODO COMPACTO (N <= 150): Proyección Directa
            // ====================================================
            showTitle('Proyección Directa');
            await pause(1000);
            if (this.audio) this.audio.playChime();
            if (!(await revealProgressively(this.universeWaves[0], 2500))) { resetCameraAndControls(); return; }
            await pause(6000);
            hideTitle();
            await pause(1000);
        } else {
            // ====================================================
            // MODO DENSE (N > 150): ESTRUCTURA EN DOS PASES DEFINIDOS
            // ====================================================
            
            // 🌟 PASE I: Repertorio Global de Puntos + Rótulos Quatuor <Ee> y Esqueleto Básico G1..C3
            showTitle('PASE I: Constelación Global &amp; Referencias Base<br><span style="font-size:22px; font-weight:700; color:#00FF9D; display:block; margin-top:6px;">Puntos Ecosistémicos, Etiquetas &lt;Ee&gt; y Oleadas G1..G3, T1..T4, C1..C3</span>');
            await pause(1000);
            if (this.audio) this.audio.playChime();
            if (!(await revealProgressively(this.universeWaves[0], 3000))) { resetCameraAndControls(); return; }
            await pause(5000);
            hideTitle();
            await pause(1200);

            // 🌟 PASE II: Estructura Interseccional & Sujetos Cromáticos
            showTitle('PASE II: Intersecciones &amp; Red Cromática de Sujetos<br><span style="font-size:22px; font-weight:700; color:#38bdf8; display:block; margin-top:6px;">Rótulos Cromáticos GxT, GxC, TxC y Oleadas de Sujetos (T1..T4)</span>');
            if (this.audio) this.audio.playChime();
            
            // Sub-pasos acumulativos del Pase II
            if (!(await revealProgressively(this.universeWaves[1], 2000))) { resetCameraAndControls(); return; } // GxT
            if (!(await revealProgressively(this.universeWaves[2], 2000))) { resetCameraAndControls(); return; } // GxC
            if (!(await revealProgressively(this.universeWaves[3], 2000))) { resetCameraAndControls(); return; } // TxC
            if (!(await revealProgressively(this.universeWaves[4], 3000))) { resetCameraAndControls(); return; } // Sujetos Cromáticos HSL
            
            await pause(6000);
        }
        
        // Pausa contemplativa final del Tour
        if (!(await pause(6000))) { resetCameraAndControls(); return; }
        hideTitle();
        if (!(await pause(1000))) { resetCameraAndControls(); return; }
        
        // Fase II: Esqueleto        // Ocultar el Universo para no confundir con las trayectorias temporales
        this.layers['UNIVERSE'].visible = false;
        
        showTitle('Fase II<br><span style="font-size:24px; font-weight:700; color:#38bdf8; display:block; margin-top:6px;">Meta-Percepción Triádica (Figuras Quatuor)</span>');
        await pause(1000);
        if (this.audio) this.audio.playChime();
        if (!(await revealProgressively('FEATURES', 3000))) { resetCameraAndControls(); return; }
        
        if (!(await pause(8000))) { resetCameraAndControls(); return; }
        hideTitle();
        if (!(await pause(1500))) { resetCameraAndControls(); return; }
        
        // Fase III: Macro/Micro dinámicas
        showTitle('Fase III<br><span style="font-size:24px; font-weight:700; color:#f59e0b; display:block; margin-top:6px;">Estructura MACRO y Evolución Dinámica de Oleadas (T1..T4)</span>');
        this.state['FEATURES'] = false;
        await pause(1000);
        if (this.audio) this.audio.playChime();
        
        if (!(await revealProgressively('MACRO', 2500))) { resetCameraAndControls(); return; }
        if (!(await revealProgressively('MICRO', 2500))) { resetCameraAndControls(); return; }
        
        if (!(await pause(7000))) { resetCameraAndControls(); return; }
        hideTitle();
        if (!(await pause(1000))) { resetCameraAndControls(); return; }
        
        // Simular movimiento rápido del slider (Moviola)
        let t = 0;
        const moviola = setInterval(() => {
            if (this.abortTour) clearInterval(moviola);
            t += 0.05;
            if (t > 1) t = 1;
            this.setTime(t);
        }, 60);
        
        if (!(await pause(3000))) { clearInterval(moviola); resetCameraAndControls(); return; }
        clearInterval(moviola);
        
        // Vuelta a T=0 rápido
        this.setTime(0);
        
        // Fase IV: CAJ (Clústeres Prototípicos)
        showTitle('Fase IV<br><span style="font-size:24px; font-weight:700; color:#c084fc; display:block; margin-top:6px;">Topología: Clústeres Prototípicos (CAJ)</span>');
        this.state['MACRO'] = false;
        this.state['MICRO'] = false;
        await pause(1000);
        
        if (this.layers['CLUSTERS'].children.length === 0) {
            this.buildCAJClusters();
        }
        if (this.audio) this.audio.playChime();
        if (!(await revealProgressively('CLUSTERS', 3000))) { resetCameraAndControls(); return; }
        
        if (!(await pause(7000))) { resetCameraAndControls(); return; }
        hideTitle();
        if (!(await pause(1500))) { resetCameraAndControls(); return; }
        
        // Fase V: AAG (Percepción Grupal / Variables Complementarias)
        showTitle('Fase V<br><span style="font-size:24px; font-weight:700; color:#fbbf24; display:block; margin-top:6px;">Percepción Grupal (AAG) y Tensión Bipolar</span>');
        this.state['CLUSTERS'] = false;
        await pause(1000);
        if (this.audio) this.audio.playChime();
        if (!(await revealProgressively('SUPP', 3000))) { resetCameraAndControls(); return; }
        
        // Alternancia de polos +/- para evitar cacofonía
        let toggleAAG = true;
        const aagInterval = setInterval(() => {
            this.layers['SUPP'].children.forEach(child => {
                if (child.userData && child.userData.name) {
                    const isPos = child.userData.name.startsWith('+');
                    const isNeg = child.userData.name.startsWith('-');
                    if (isPos || isNeg) {
                        child.visible = toggleAAG ? isPos : isNeg;
                    }
                }
            });
            if (this.audio) this.audio.playPulse();
            toggleAAG = !toggleAAG;
        }, 1500);
        
        await pause(8000);
        hideTitle();
        await pause(4000);
        clearInterval(aagInterval);
        
        // Retorno breve a CAJ
        this.state['SUPP'] = false;
        this.state['CLUSTERS'] = true;
        this.updateLayerVisibility();
        if (this.audio) this.audio.playChime();
        
        if (this.layers['CLUSTERS'].children.length === 0) {
            this.buildCAJClusters();
        }
        
        await pause(5000);
        
        // Fase VI: Repositorio Global BSOC & Open Science
        showTitle('Fase VI<br><span style="font-size:24px; font-weight:800; color:#38bdf8; display:block; margin-top:6px;">🏛️ Repositorio Global BSOC (Open Science Q-GID)</span>');
        if (this.audio) this.audio.playChime();
        await pause(5000);
        hideTitle();
        await pause(600);

        // Fase VII: Estallido Orgásmico (Grand Finale progresivo)
        
        // Respiración dramática: Apagar todo brevemente
        hideTitle();
        Object.keys(this.state).forEach(k => this.state[k] = false);
        this.updateLayerVisibility();
        await pause(600);
        
        showTitle('Fase VII<br><span style="font-size:26px; font-weight:800; color:#ffffff; display:block; margin-top:6px;">Integración Estructural Absoluta</span>');
        
        if (this.audio) this.audio.playGrandFinale();
        
        // Encendido progresivo en cascada
        this.state['UNIVERSE'] = true;
        this.layers['UNIVERSE'].traverse((child) => {
            if (child.material && child.userData.originalOpacity !== undefined) {
                child.material.opacity = child.userData.originalOpacity;
            }
        });
        this.updateLayerVisibility();
        await pause(500);
        
        this.state['MACRO'] = true;
        this.updateLayerVisibility();
        await pause(500);
        
        this.state['MICRO'] = true;
        this.state['TRAJECTORIES'] = true;
        this.updateLayerVisibility();
        await pause(500);
        
        this.state['FEATURES'] = true;
        this.state['SUPP'] = true;
        this.state['CLUSTERS'] = true;
        this.updateLayerVisibility();
        
        // Acelerar rotación
        stopRotate();
        let fastRotateReq;
        let fastAngle = angle;
        const fastRotateLoop = () => {
            if (this.abortTour) return;
            fastAngle += 0.015;
            this.camera.position.x = center.x + Math.sin(fastAngle) * (radius * 1.3);
            this.camera.position.z = center.z + Math.cos(fastAngle) * (radius * 1.3);
            this.camera.position.y = center.y + 15 + Math.sin(fastAngle * 4) * 35; // Órbita majestuosa arriba y abajo
            this.camera.lookAt(center);
            fastRotateReq = requestAnimationFrame(fastRotateLoop);
        };
        fastRotateReq = requestAnimationFrame(fastRotateLoop);
        
        await pause(10000);
        
        if (fastRotateReq) cancelAnimationFrame(fastRotateReq);
        if (this.audio) this.audio.stopAll();
        
        if (titleOverlay) titleOverlay.remove();
        
        // Restaurar estado inicial (Pantalla final solicitada)
        Object.keys(this.state).forEach(k => this.state[k] = false);
        this.state['UNIVERSE'] = true; // Restaurar la proyección básica (nodos y etiquetas)
        this.state['MACRO'] = true;
        this.state['MICRO'] = true; // Mostrar sujetos
        this.state['TRAJECTORIES'] = true;
        this.state['FEATURES'] = false; // Oculto por defecto en la vista básica
        this.state['SUPP'] = false;
        
        // Restaurar opacidades alteradas durante el tour
        this.layers['UNIVERSE'].traverse((child) => {
            if (child.material && child.userData.originalOpacity !== undefined) {
                child.material.opacity = child.userData.originalOpacity;
            }
        });
        
        // Sincronizar visibilidad de capas al finalizar el tour
        this.state['UNIVERSE'] = true;
        this.state['MACRO'] = true;
        this.state['MICRO'] = true;
        this.updateLayerVisibility();
        
        // Restaurar la visibilidad de las bandas laterales y barras del visor al finalizar o cancelar el Tour
        ['left-sidebar', 'right-sidebar', 'top-bar', 'bottom-action-dock'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = '';
        });

        // Disparar evento para sincronizar la UI en app.js
        window.dispatchEvent(new Event('tour-ended'));
    }
    
    buildCAJClusters() {
        // Algoritmo de clustering simple (K-Means K=3) para agrupar los sujetos
        if (!this.payload || !this.payload.subjects || typeof this.payload.subjects !== 'object') return;
        const subjects = Object.values(this.payload.subjects).filter(s => s && s.name && !s.name.includes('_c') && s.time === 'T1');
        if (subjects.length === 0) return;
        
        const scale = 1; // Igualado a la escala normalizada global
        let centroids = [
            subjects[0].coords, 
            subjects[Math.floor(subjects.length/2)].coords, 
            subjects[subjects.length-1].coords
        ];
        let clusters = [[], [], []];
        
        // Iterar K-means
        for (let iter = 0; iter < 10; iter++) {
            clusters = [[], [], []];
            subjects.forEach(s => {
                let minD = Infinity, bestC = 0;
                centroids.forEach((c, i) => {
                    const d = Math.pow(s.coords[0]-c[0],2) + Math.pow(s.coords[1]-c[1],2) + Math.pow(s.coords[2]-c[2],2);
                    if (d < minD) { minD = d; bestC = i; }
                });
                clusters[bestC].push(s);
            });
            
            centroids = clusters.map(cArr => {
                if(cArr.length===0) return [0,0,0];
                let sx=0, sy=0, sz=0;
                cArr.forEach(s => { sx+=s.coords[0]; sy+=s.coords[1]; sz+=s.coords[2]; });
                return [sx/cArr.length, sy/cArr.length, sz/cArr.length];
            });
        }
        
        const colors = [0xff0044, 0x00ff44, 0x0044ff];
        
        clusters.forEach((cArr, i) => {
            if (cArr.length === 0) return;
            const cPos = new THREE.Vector3(centroids[i][0]*scale, centroids[i][1]*scale, centroids[i][2]*scale);
            
            // Prototipo / Centroide del Clúster (CAJ)
            const matC = new THREE.MeshPhongMaterial({ color: colors[i], emissive: colors[i], emissiveIntensity: 0.5, transparent: true, opacity: 0.8 });
            const meshC = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), matC);
            meshC.position.copy(cPos);
            this.layers['CLUSTERS'].add(meshC);
            
            const sprite = this.createTextSprite(`Clúster CAJ ${i+1}`, '#ffffff', 1.2);
            sprite.position.copy(cPos);
            sprite.position.y += 2.5;
            this.layers['CLUSTERS'].add(sprite);
            
            // Dendrograma: Líneas desde el prototipo a sus miembros
            const lineMat = new THREE.LineBasicMaterial({ color: colors[i], transparent: true, opacity: 0.5 });
            cArr.forEach(s => {
                const sPos = new THREE.Vector3(s.coords[0]*scale, s.coords[1]*scale, s.coords[2]*scale);
                const geo = new THREE.BufferGeometry().setFromPoints([cPos, sPos]);
                this.layers['CLUSTERS'].add(new THREE.Line(geo, lineMat));
            });
        });
    }

    updateLayerVisibility() {
        Object.keys(this.layers).forEach(layerName => {
            this.layers[layerName].visible = this.state[layerName];
        });
    }

    clearLayers() {
        Object.values(this.layers).forEach(layer => {
            while(layer.children.length > 0) { 
                const obj = layer.children[0];
                if(obj.geometry) obj.geometry.dispose();
                if(obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(m => {
                            if (m.map) m.map.dispose();
                            m.dispose();
                        });
                    } else {
                        if (obj.material.map) obj.material.map.dispose();
                        obj.material.dispose();
                    }
                }
                layer.remove(obj); 
            }
        });
    }

    onMouseMove(event) {
        if (!this.scene) return;
        
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Collect visible objects to test intersection
        const visibleObjects = [];
        Object.keys(this.layers).forEach(key => {
            if (this.state[key]) visibleObjects.push(...this.layers[key].children);
        });
        
        const intersects = this.raycaster.intersectObjects(visibleObjects);
        
        // Reset previo del sprite resaltado
        if (this.hoveredSprite && (!intersects.length || intersects[0].object !== this.hoveredSprite)) {
            if (this.hoveredSprite.userData && this.hoveredSprite.userData.baseScale) {
                const bs = this.hoveredSprite.userData.baseScale;
                this.hoveredSprite.scale.set(bs.x, bs.y, 1);
            }
            if (this.hoveredSprite.material) {
                this.hoveredSprite.material.opacity = 0.85;
            }
            this.hoveredSprite.renderOrder = 0;
            this.hoveredSprite = null;
        }
        
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            const data = obj.userData;
            
            // Resaltar puntualmente la etiqueta al pasar el cursor (Hover Highlight)
            if (obj.isSprite) {
                this.hoveredSprite = obj;
                if (data && data.baseScale) {
                    obj.scale.set(data.baseScale.x * 1.6, data.baseScale.y * 1.6, 1);
                }
                if (obj.material) {
                    obj.material.opacity = 1.0;
                }
                obj.renderOrder = 999;
            }
            
            this.tooltip.style.display = 'block';
            this.tooltip.style.left = (event.clientX + 15) + 'px';
            this.tooltip.style.top = (event.clientY + 15) + 'px';
            
            let html = `<strong>${data.type || 'Elemento'}: ${data.name || ''}</strong>`;
            if (data.group) html += `<br>Grupo: ${data.group}`;
            if (data.density !== undefined) html += `<br>Densidad: ${data.density.toFixed(2)}`;
            this.tooltip.innerHTML = html;
            
            document.body.style.cursor = 'pointer';
        } else {
            this.tooltip.style.display = 'none';
            document.body.style.cursor = 'default';
        }
    }

    onWindowResize() {
        if (!this.camera) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}
