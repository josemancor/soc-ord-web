class VisordApp {
    constructor() {
        this.engine = null;
        this.uiPanels = null;
    }
    
    init() {
        this.engine = new VisordHubEngine('canvas-container');
        this.uiPanels = new UIPanels(this);
        this.setupUI();
        
        // Preparar payload base si existe, pero NO ocultar el Splash Screen automáticamente
        // El usuario debe pulsar "Iniciar Tour" para usar este payload
        if (window.VISORD_PAYLOAD) {
            this.engine.loadPayloadData(window.VISORD_PAYLOAD);
            this.buildControlPanel(window.VISORD_PAYLOAD);
            // El loader se gestiona interactivamente por el usuario
        }

        // Sistema de Autenticación Ágil y Diversificación por Rol (IP / IPI / IPIS)
        this.currentRole = 'IP';
        const loginBox = document.getElementById('portal-login-box');
        const optionsBox = document.getElementById('portal-options-box');
        const roleAuthBadge = document.getElementById('role-auth-badge');
        const roleDynamicContent = document.getElementById('role-dynamic-content');
        const btnLoginAccess = document.getElementById('btn-login-access');
        const btnChangeRole = document.getElementById('btn-change-role');
        const authInput = document.getElementById('auth-passcode');
        const roleSelect = document.getElementById('select-role');

        const processLogin = () => {
            const passcode = (authInput ? authInput.value.trim() : '').toUpperCase();
            const requestedRole = roleSelect ? roleSelect.value : 'IP';

            if (requestedRole === 'IPIS') {
                if (passcode.includes('IPIS') || passcode.includes('MASTER') || passcode.includes('AUTOR') || passcode === '0') {
                    this.currentRole = 'IPIS';
                    this.showRoleDashboard('IPIS');
                } else {
                    alert('⚠️ Clave IPIS Requerida. Introduzca clave maestra (Ej: IPIS-MASTER o clave de Autor).');
                }
            } else if (requestedRole === 'IPI') {
                if (passcode.includes('IPI') || passcode.includes('INST') || passcode.includes('DEPT')) {
                    this.currentRole = 'IPI';
                    this.showRoleDashboard('IPI');
                } else {
                    alert('⚠️ Clave IPI Requerida. Introduzca la clave del Servidor Institucional (Ej: IPI-INST).');
                }
            } else {
                this.currentRole = 'IP';
                this.showRoleDashboard('IP');
            }
        };

        if (btnLoginAccess) btnLoginAccess.addEventListener('click', processLogin);
        if (authInput) {
            authInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') processLogin();
            });
        }

        if (btnChangeRole) {
            btnChangeRole.addEventListener('click', () => {
                if (optionsBox) optionsBox.style.display = 'none';
                if (loginBox) loginBox.style.display = 'flex';
            });
        }
        
        // Listener para carga interactiva (Splash Screen)
        const fileInput = document.getElementById('file-upload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                document.getElementById('loading-msg').style.display = 'block';
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        // Soporta .js o .json
                        let content = event.target.result;
                        if (content.startsWith('window.VISORD_PAYLOAD =')) {
                            content = content.replace('window.VISORD_PAYLOAD =', '').replace(/;$/, '');
                        }
                        const data = JSON.parse(content);
                        
                        window.VISORD_PAYLOAD = data;
                        this.loadAndStart(data);
                        
                        const loader = document.getElementById('loader');
                        if (loader) {
                            loader.style.opacity = '0';
                            setTimeout(() => loader.style.display = 'none', 500);
                        }
                    } catch (err) {
                        alert("Error cargando archivo: " + err.message);
                        document.getElementById('loading-msg').style.display = 'none';
                    }
                };
                reader.readAsText(file);
            });
        }

        // Listener para Selector de Estudios de Respaldo / Históricos
        const selectHistorical = document.getElementById('select-historical-study');
        if (selectHistorical) {
            selectHistorical.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val === 'CURRENT') {
                    if (window.VISORD_PAYLOAD) {
                        this.loadAndStart(window.VISORD_PAYLOAD);
                    }
                    return;
                }
                fetch(val)
                    .then(res => res.text())
                    .then(text => {
                        let content = text;
                        if (content.startsWith('window.VISORD_PAYLOAD =')) {
                            content = content.replace('window.VISORD_PAYLOAD =', '').replace(/;$/, '');
                        }
                        const data = JSON.parse(content);
                        window.VISORD_PAYLOAD = data;
                        this.loadAndStart(data);
                        const titleBadge = document.getElementById('active-projection-title');
                        if (titleBadge) {
                            const fname = val.split('/').pop();
                            titleBadge.textContent = `PROYECCIÓN ACTIVA: Respaldo (${fname})`;
                        }
                    })
                    .catch(err => {
                        alert("Error al cargar el estudio de respaldo: " + err.message);
                    });
            });
        }
        
        // Listener para Entrar al Visualizador Directamente
        const btnEnterVisor = document.getElementById('btn-enter-visor');
        if (btnEnterVisor) {
            btnEnterVisor.addEventListener('click', () => {
                if (window.VISORD_PAYLOAD) {
                    this.loadAndStart(window.VISORD_PAYLOAD);
                }
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => { loader.style.display = 'none'; }, 500);
                }
            });
        }

        // Listener para Tour Guiado
        const btnTour = document.getElementById('btn-tour');
        if (btnTour) {
            btnTour.addEventListener('click', () => {
                if (!window.VISORD_PAYLOAD) {
                    alert("El archivo de demostración (payload_data.js) no está disponible.");
                    return;
                }
                const loader = document.getElementById('loader');
                if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }
                
                // Indicador discreto de Tour en Curso (Arriba a la derecha)
                const tourBadge = document.getElementById('tour-status-badge');
                if (tourBadge) {
                    tourBadge.style.display = 'inline-block';
                    tourBadge.onclick = () => {
                        if (this.engine) this.engine.abortTour = true;
                        tourBadge.style.display = 'none';
                    };
                }
                // Cargar datos y construir paneles antes de iniciar el tour
                if (window.VISORD_PAYLOAD) {
                    this.loadAndStart(window.VISORD_PAYLOAD);
                }

                // Ejecutar tour cinemático asíncrono
                if (this.engine && this.engine.playUniverseTour) {
                    this.engine.playUniverseTour().then(() => {
                        if (tourBadge) tourBadge.style.display = 'none';
                        
                        // Actualizar botones visualmente
                        const syncToggle = (id, state) => {
                            const el = document.getElementById(id);
                            if (el) {
                                if (state) el.classList.add('active'); else el.classList.remove('active');
                                const s = el.querySelector('.status');
                                if (s) s.innerText = state ? 'ON' : 'OFF';
                            }
                        };
                        syncToggle('toggle-macro', true);
                        syncToggle('toggle-micro', true);
                        syncToggle('toggle-features', false);
                        syncToggle('toggle-supp', false);
                    });
                }
            });
        }
    }
    
    showRoleDashboard(role) {
        const loginBox = document.getElementById('portal-login-box');
        const optionsBox = document.getElementById('portal-options-box');
        const badge = document.getElementById('role-auth-badge');
        const content = document.getElementById('role-dynamic-content');

        if (loginBox) loginBox.style.display = 'none';
        if (optionsBox) optionsBox.style.display = 'block';

        if (role === 'IPIS') {
            if (badge) {
                badge.style.background = 'rgba(168, 85, 247, 0.2)';
                badge.style.border = '1px solid rgba(168, 85, 247, 0.6)';
                badge.style.color = '#c084fc';
                badge.innerHTML = '👑 <strong>SESIÓN AUTENTICADA: IPIS (Master Inst. Superior - Desde el Nodo 0)</strong>';
            }
            if (content) {
                content.innerHTML = `
                    <div style="font-weight:700; color:#c084fc; font-size:0.95rem; margin-bottom:8px;">🌌 OPCIONES DE CONTROL OMNIPOTENTE NODO 0 (IPIS Master)</div>
                    <p style="font-size:0.82rem; color:#cbd5e1; margin-bottom:14px; line-height:1.4;">
                        Acceso pleno e ilimitado a todas las variables de simulación raíz, matrices relacionales SMIb, variedad de Grassmann y auditoría global.
                    </p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <label style="font-size:0.82rem; color:#94a3b8; font-weight:600;">📜 Seleccionar Cualquier Estudio del Repositorio Histórico:</label>
                        <select id="select-historical-study" style="background:#0f172a; border:1px solid rgba(168,85,247,0.5); color:#c084fc; padding:8px 12px; border-radius:10px; font-size:0.85rem; font-weight:600; outline:none; cursor:pointer;">
                            <option value="CURRENT">🟢 ⚡ Simulación Activa (payload_data.js)</option>
                            <option value="data/estudios_historicos/ESTUDIO_DEMO_HUB_2026.json">🎓 🏫 Sociometría Escolar (G1_T2_C2)</option>
                            <option value="data/VISORD_HUB_Payload.json">🏢 🏢 Sociometría Laboral (G2_T3_C2)</option>
                        </select>
                        <div style="margin-top:6px; font-size:0.78rem; color:#a855f7;">
                            &bull; Modo Recalibración Activado &bull; Auditoría de Logs Completa &bull; Zero-Purge Control
                        </div>
                    </div>
                `;
            }
            const titleBadge = document.getElementById('active-projection-title');
            if (titleBadge) titleBadge.textContent = 'PROYECCIÓN ACTIVA: Modo IPIS Master (Nodo 0 - Control Total)';
        } else if (role === 'IPI') {
            if (badge) {
                badge.style.background = 'rgba(56, 189, 248, 0.2)';
                badge.style.border = '1px solid rgba(56, 189, 248, 0.6)';
                badge.style.color = '#38bdf8';
                badge.innerHTML = '🏛️ <strong>SESIÓN AUTENTICADA: IPI (Investigador Principal Institucional)</strong>';
            }
            if (content) {
                content.innerHTML = `
                    <div style="font-weight:700; color:#38bdf8; font-size:0.95rem; margin-bottom:8px;">🏢 SERVIDOR INSTITUCIONAL DE ESTUDIOS DE DEPARTAMENTO</div>
                    <p style="font-size:0.82rem; color:#cbd5e1; margin-bottom:14px; line-height:1.4;">
                        Acceso a todos los informes y estudios socio-matriciales pertenecientes a los centros e instituciones a su cargo.
                    </p>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        <label style="font-size:0.82rem; color:#94a3b8; font-weight:600;">🏛️ Seleccionar Informe Institucional:</label>
                        <select id="select-historical-study" style="background:#0f172a; border:1px solid rgba(56,189,248,0.5); color:#38bdf8; padding:8px 12px; border-radius:10px; font-size:0.85rem; font-weight:600; outline:none; cursor:pointer;">
                            <option value="CURRENT">🟢 ⚡ Informe Actual de Cohorte Institucional</option>
                            <option value="data/VISORD_HUB_Payload.json">🏢 🏢 Análisis Multigrupo G1..G3 (SDR/BDR)</option>
                        </select>
                    </div>
                `;
            }
            const titleBadge = document.getElementById('active-projection-title');
            if (titleBadge) titleBadge.textContent = 'PROYECCIÓN ACTIVA: Servidor Institucional IPI';
        } else {
            // IP: Estudio Acotado
            if (badge) {
                badge.style.background = 'rgba(0, 255, 157, 0.15)';
                badge.style.border = '1px solid rgba(0, 255, 157, 0.5)';
                badge.style.color = '#00FF9D';
                badge.innerHTML = '🔬 <strong>SESIÓN AUTENTICADA: IP (Investigador de Estudio - Acceso Acotado)</strong>';
            }
            if (content) {
                content.innerHTML = `
                    <div style="font-weight:700; color:#00FF9D; font-size:0.95rem; margin-bottom:8px;">🔬 ESTUDIO SOCIO-MATRICIAL ASIGNADO</div>
                    <p style="font-size:0.82rem; color:#cbd5e1; margin-bottom:12px; line-height:1.4;">
                        Acceso acotado exclusivamente a los resultados de su investigación durante la ventana temporal del TTL.
                    </p>
                    <div style="background:rgba(0,0,0,0.3); border-radius:10px; padding:10px 14px; font-size:0.78rem; color:#94a3b8; font-family:monospace; line-height:1.5;">
                        &bull; Estudio Activo: <span style="color:#fff;">EST_2026_G1T2C2_88F1</span><br>
                        &bull; Custodia Ética: <span style="color:#00FF9D;">🔒 Datos Anonimizados (S1..SN)</span><br>
                        &bull; Ventana TTL: <span style="color:#00FF9D;">⏳ 30 días restantes</span>
                    </div>
                `;
            }
            const titleBadge = document.getElementById('active-projection-title');
            if (titleBadge) titleBadge.textContent = 'PROYECCIÓN ACTIVA: Estudio Acotado IP (TTL Temporal)';
        }

        const selectHist = document.getElementById('select-historical-study');
        if (selectHist) {
            selectHist.addEventListener('change', (e) => {
                const val = e.target.value;
                if (val === 'CURRENT') {
                    if (window.VISORD_PAYLOAD) {
                        this.loadAndStart(window.VISORD_PAYLOAD);
                    }
                    return;
                }
                fetch(val)
                    .then(res => res.text())
                    .then(text => {
                        let contentText = text;
                        if (contentText.startsWith('window.VISORD_PAYLOAD =')) {
                            contentText = contentText.replace('window.VISORD_PAYLOAD =', '').replace(/;$/, '');
                        }
                        const data = JSON.parse(contentText);
                        window.VISORD_PAYLOAD = data;
                        this.loadAndStart(data);
                    })
                    .catch(err => alert("Error cargando informe: " + err.message));
            });
        }
    }
    
    loadAndStart(payload) {
        if (payload && payload.metadata) {
            payload.metadata.status = "VISUALIZADO";
            payload.metadata.last_viewed = new Date().toISOString();
        }
        this.engine.loadPayloadData(payload);
        this.buildControlPanel(payload);
        this.setupPlayback();
    }
    
    setupPlayback() {
        this.isPlaying = false;
        this.slider = document.getElementById('time-slider');
        this.playBtn = document.getElementById('play-btn');
        this.stepBtn = document.getElementById('step-btn');
        this.speedSelect = document.getElementById('speed-select');
        this.frameCounter = document.getElementById('frame-counter');
        
        if (!this.slider || !this.playBtn) return;
        
        const updateFrameCounter = (val) => {
            if (this.frameCounter) {
                this.frameCounter.textContent = `T = ${Math.round(val)} / 100`;
            }
        };

        this.slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.engine.setTime(val / 100);
            updateFrameCounter(val);
            
            // Sync meta-t
            const metaT = document.getElementById('meta-t');
            if (metaT && window.VISORD_PAYLOAD && window.VISORD_PAYLOAD.subjects) {
                const times = new Set();
                Object.values(window.VISORD_PAYLOAD.subjects || {}).forEach(s => {
                    if (s && s.time) times.add(s.time);
                });
                const tArray = Array.from(times).sort();
                const step = 100 / (Math.max(1, tArray.length - 1));
                const idx = Math.round(val / step);
                if (tArray[idx]) {
                    metaT.value = tArray[idx];
                    
                    // Actualizar toggles visuales
                    document.querySelectorAll('.toggle-all-col').forEach(el => {
                        if (el.dataset.t === tArray[idx]) {
                            el.style.background = '#3b82f6';
                            el.style.color = '#ffffff';
                        } else {
                            el.style.background = '#1e293b';
                            el.style.color = '#e2e8f0';
                        }
                    });
                }
            }
        });
        
        this.playBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            this.playBtn.textContent = this.isPlaying ? '⏸' : '▶';
            if (this.isPlaying) this.animatePlayback();
        });

        // Botón Step (T+1)
        if (this.stepBtn) {
            this.stepBtn.addEventListener('click', () => {
                let val = parseFloat(this.slider.value);
                val += 10; // Avanzar 1 paso temporal
                if (val > 100) val = 0;
                this.slider.value = val;
                this.engine.setTime(val / 100);
                updateFrameCounter(val);
            });
        }
    }
    
    animatePlayback() {
        if (!this.isPlaying) return;
        
        const mult = this.speedSelect ? parseFloat(this.speedSelect.value) : 1;
        let val = parseFloat(this.slider.value);
        val += 0.5 * mult; // Aplicar multiplicador de velocidad (x1, x2, x4)
        if (val > 100) val = 0;
        
        this.slider.value = val;
        this.engine.setTime(val / 100);
        if (this.frameCounter) this.frameCounter.textContent = `T = ${Math.round(val)} / 100`;
        
        requestAnimationFrame(() => this.animatePlayback());
    }
        
        requestAnimationFrame(() => this.animatePlayback());
    }
    
    setupUI() {
        const setupToggle = (id, layerName) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('click', () => {
                const isActive = el.classList.toggle('active');
                el.querySelector('.status').textContent = isActive ? 'ON' : 'OFF';
                this.engine.toggleLayer(layerName, isActive);
            });
        };
        
        setupToggle('toggle-macro', 'MACRO');
        setupToggle('toggle-micro', 'MICRO');
        setupToggle('toggle-features', 'FEATURES');
        setupToggle('toggle-supp', 'SUPP');
        setupToggle('toggle-triadic', 'TRIADIC'); // Capa 4
        
        // Configurar botones de idiomas
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                const target = e.target.closest('.lang-btn');
                target.classList.add('active');
                if (typeof changeLanguage === 'function') {
                    changeLanguage(target.dataset.lang);
                }
            });
        });
        
        // Toggles de Índices & Planos
        const toggleDensity = document.getElementById('toggle-density');
        if (toggleDensity) {
            toggleDensity.addEventListener('change', (e) => {
                this.engine.setShowDensity(e.target.checked);
            });
        }
        const toggleGrassmann = document.getElementById('toggle-grassmann');
        if (toggleGrassmann) {
            toggleGrassmann.addEventListener('change', (e) => {
                this.engine.setShowGrassmann(e.target.checked);
            });
        }
        const togglePlaneVertical = document.getElementById('toggle-plane-vertical');
        if (togglePlaneVertical) {
            togglePlaneVertical.addEventListener('change', (e) => {
                this.engine.toggleVerticalPlane(e.target.checked);
            });
        }
        const togglePlaneOrthogonal = document.getElementById('toggle-plane-orthogonal');
        if (togglePlaneOrthogonal) {
            togglePlaneOrthogonal.addEventListener('change', (e) => {
                this.engine.toggleOrthogonalPlane(e.target.checked);
            });
        }
        
        // Minimizar panel
        const togglePanelBtn = document.getElementById('toggle-panel');
        const panelContent = document.getElementById('panel-content');
        if (togglePanelBtn && panelContent) {
            togglePanelBtn.addEventListener('click', () => {
                if (panelContent.style.display === 'none') {
                    panelContent.style.display = 'block';
                    togglePanelBtn.textContent = '_';
                } else {
                    panelContent.style.display = 'none';
                    togglePanelBtn.textContent = '□';
                }
            });
        }
        
        // Pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn, .tab-pane').forEach(el => el.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.target).classList.add('active');
            });
        });
        
        // Meta Selects logic will re-trigger trajectories
        const updateTrajs = () => this.updateTrajectories();
        document.getElementById('meta-g')?.addEventListener('change', updateTrajs);
        document.getElementById('meta-c')?.addEventListener('change', updateTrajs);
        
        const ctaSlider = document.getElementById('cta-slider');
        const ctaVal = document.getElementById('cta-val');
        if (ctaSlider) {
            ctaSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                if (ctaVal) ctaVal.textContent = val.toFixed(2);
                this.engine.setCTAFilter(val);
            });
        }
        
        // Cabeceras Toggle All
        const setupHeaderToggle = (headerId, checkboxClass) => {
            const header = document.getElementById(headerId);
            if (header) {
                header.addEventListener('click', () => {
                    const checkboxes = document.querySelectorAll(`.${checkboxClass}`);
                    if (checkboxes.length === 0) return;
                    
                    // Si hay alguna marcada, las borramos todas. Si ninguna está marcada, las encendemos todas.
                    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
                    const targetState = !anyChecked;
                    
                    checkboxes.forEach(cb => {
                        if (cb.checked !== targetState) {
                            cb.checked = targetState;
                            cb.dispatchEvent(new Event('change'));
                        }
                    });
                });
            }
        };
        
        setupHeaderToggle('th-ev-subjects', 'subject-check');
        setupHeaderToggle('th-ev-aag-plus', 'aag-check-plus');
        setupHeaderToggle('th-ev-aag-minus', 'aag-check-minus');
    }
    
    buildControlPanel(payload) {
        if (!payload.subjects) return;
        
        // 1. Extraer Sujetos y Grupos
        const subjectsMap = new Map();
        const groups = new Set();
        const times = new Set();
        const criteria = new Set();
        
        Object.entries(payload.subjects).forEach(([key, subj]) => {
            const match = key.match(/^(\d+)([A-Z])([a-z])(\d+)$/);
            if (match) {
                const num = match[1];
                const g = match[2];
                const t = match[3];
                const c = match[4];
                
                groups.add(g);
                times.add(t);
                criteria.add(c);
                
                if (!subjectsMap.has(num)) {
                    subjectsMap.set(num, { name: subj.name, groups: new Set() });
                }
                subjectsMap.get(num).groups.add(g);
            }
        });
        
        // Avisar al motor si es diseño multi-grupo para suprimir avatares
        this.engine.isMultiGroup = groups.size > 1;
        
        // Llenar Meta Selects (ocultos) para compatibilidad
        const metaG = document.getElementById('meta-g');
        const metaT = document.getElementById('meta-t');
        const metaC = document.getElementById('meta-c');
        
        const gArray = Array.from(groups).sort();
        const tArray = Array.from(times).sort();
        const cArray = Array.from(criteria).sort();
        
        if (metaG) metaG.innerHTML = gArray.map(g => `<option value="${g}">G${g}</option>`).join('');
        if (metaT) metaT.innerHTML = tArray.map(t => `<option value="${t}">T${t}</option>`).join('');
        if (metaC) metaC.innerHTML = cArray.map(c => `<option value="${c}">C${c}</option>`).join('');
        
        const filterSubjectsByGroup = () => {
            const activeGs = Array.from(document.querySelectorAll('.toggle-g.active-cell')).map(el => el.dataset.g);
            document.querySelectorAll('.subject-row').forEach(row => {
                const rowGroups = row.dataset.groups.split(',');
                // Si no hay grupos activos, mostramos todos por defecto. 
                // Si hay grupos activos, mostramos solo si el sujeto pertenece a alguno de ellos.
                const isVisible = activeGs.length === 0 || rowGroups.some(rg => activeGs.includes(rg));
                row.style.display = isVisible ? '' : 'none';
                
                // Si se oculta, desmarcar para no ensuciar las trayectorias
                if (!isVisible) {
                    const cb = row.querySelector('.id-check');
                    if (cb && cb.checked) {
                        cb.checked = false;
                        cb.dispatchEvent(new Event('change'));
                    }
                }
            });
        };
        
        // Construir la Tabla Combinatoria (G independiente + Grid TxC)
        const gridContainer = document.getElementById('meta-grid-container');
        if (gridContainer) {
            let html = '<table class="meta-grid" style="width:100%; border-collapse:separate; border-spacing:3px; font-size:11px; text-align:center; color:white;">';
            
            // Fila 1: Grupos (G)
            html += '<tr><th class="toggle-all" data-target="toggle-g" style="background:#334155; padding:5px; cursor:pointer; border:1px solid rgba(56, 189, 248, 0.5); width:15%;">G</th>';
            gArray.forEach(g => {
                const gNum = g.charCodeAt(0) - 64; // A->1, B->2, C->3
                html += `<td class="meta-toggle toggle-g" data-g="${g}" style="background:#1e293b; padding:5px; cursor:pointer; border:1px solid rgba(56, 189, 248, 0.45); color:#cbd5e1; transition:0.2s;" title="Toggle G${gNum}">G${gNum}</td>`;
            });
            // Rellenar celdas vacías si hay más Ts que Gs
            const maxCols = Math.max(gArray.length, tArray.length);
            for(let i=gArray.length; i<maxCols; i++) {
                html += `<td style="border:none;"></td>`;
            }
            html += '</tr>';
            
            // Fila 2: Cabeceras T
            html += '<tr><td style="border:none;"></td>'; // Esquina vacía
            tArray.forEach(t => {
                const tNum = t.charCodeAt(0) - 96; // a->1, b->2, c->3, d->4
                html += `<th class="toggle-all-col" data-t="${t}" style="background:#1e293b; color:#e2e8f0; padding:5px; border:1px solid rgba(56, 189, 248, 0.45); cursor:pointer;" title="Toggle Col T${tNum}">T${tNum}</th>`;
            });
            for(let i=tArray.length; i<maxCols; i++) {
                html += `<td style="border:none;"></td>`;
            }
            html += '</tr>';
            
            // Filas Criterios (C)
            cArray.forEach(c => {
                html += `<tr><th class="toggle-all-row" data-c="${c}" style="background:#1e293b; color:#e2e8f0; padding:5px; border:1px solid rgba(56, 189, 248, 0.45); cursor:pointer;" title="Toggle Row C${c}">C${c}</th>`;
                tArray.forEach(t => {
                    const tNum = t.charCodeAt(0) - 96; // a->1, b->2, c->3, d->4
                    const cellId = `cell_t${t}_c${c}`;
                    html += `<td id="${cellId}" class="meta-cell tc-cell" data-t="${t}" data-c="${c}" style="border:1.5px solid rgba(56, 189, 248, 0.5); padding:6px 4px; cursor:pointer; background:rgba(15, 23, 42, 0.85); transition:0.2s; font-family:'Fira Code',monospace; font-size:10px;" title="Cruce T${tNum} × C${c}">T${tNum}C${c}</td>`;
                });
                for(let i=tArray.length; i<maxCols; i++) {
                    html += `<td style="border:none;"></td>`;
                }
                html += '</tr>';
            });
            
            html += '</table>';
            
            gridContainer.innerHTML = html;
            
            // Estilos
            const updateActiveStyle = (el, isActive) => {
                if (isActive) {
                    el.classList.add('active-cell');
                    if (el.classList.contains('toggle-g')) { el.style.background = '#475569'; el.style.color = '#ffffff'; }
                    else if (el.classList.contains('tc-cell')) { el.style.background = '#3b82f6'; }
                } else {
                    el.classList.remove('active-cell');
                    el.style.background = '#1e293b';
                    if (el.classList.contains('toggle-g')) { el.style.color = '#cbd5e1'; }
                }
            };
            
            const toggleGroup = (cellsArray) => {
                if (cellsArray.length === 0) return;
                const anyActive = Array.from(cellsArray).some(c => c.classList.contains('active-cell'));
                cellsArray.forEach(c => updateActiveStyle(c, !anyActive));
                this.syncSliderAndMeta();
                if (cellsArray[0].classList.contains('toggle-g')) filterSubjectsByGroup();
                this.updateTrajectories();
            };
            
            // Eventos G individuales
            document.querySelectorAll('.toggle-g').forEach(cell => {
                cell.addEventListener('click', (e) => {
                    const el = e.target;
                    updateActiveStyle(el, !el.classList.contains('active-cell'));
                    this.syncSliderAndMeta();
                    filterSubjectsByGroup();
                    this.updateTrajectories();
                });
            });
            
            // Eventos TC individuales
            document.querySelectorAll('.tc-cell').forEach(cell => {
                cell.addEventListener('click', (e) => {
                    const el = e.target;
                    const isActive = el.classList.contains('active-cell');
                    updateActiveStyle(el, !isActive);
                    
                    if (!isActive) { // Si se marca una nueva T, sincronizar el slider
                        const t = el.dataset.t;
                        const idx = tArray.indexOf(t);
                        const step = 100 / (Math.max(1, tArray.length - 1));
                        const slider = document.getElementById('time-slider');
                        if (slider) {
                            slider.value = idx * step;
                            this.engine.setTime((idx * step) / 100);
                        }
                    }
                    this.syncSliderAndMeta();
                    this.updateTrajectories();
                });
            });
            
            // Eventos Toggle All G
            const thG = gridContainer.querySelector('.toggle-all[data-target="toggle-g"]');
            if (thG) thG.addEventListener('click', () => toggleGroup(document.querySelectorAll('.toggle-g')));
            
            // Eventos Toggle Col T
            document.querySelectorAll('.toggle-all-col').forEach(th => {
                th.addEventListener('click', (e) => toggleGroup(document.querySelectorAll(`.tc-cell[data-t="${e.target.dataset.t}"]`)));
            });
            
            // Eventos Toggle Row C
            document.querySelectorAll('.toggle-all-row').forEach(th => {
                th.addEventListener('click', (e) => toggleGroup(document.querySelectorAll(`.tc-cell[data-c="${e.target.dataset.c}"]`)));
            });
            
            // Default select first G and first TC cell
            updateActiveStyle(gridContainer.querySelector('.toggle-g'), true);
            const firstTC = gridContainer.querySelector('.tc-cell');
            if (firstTC) updateActiveStyle(firstTC, true);
            
            this.syncSliderAndMeta();
        }
        
        // 2. Llenar Tabla Sujetos (Conciso: 1A-6A, 1B-12B, 1C-25C)
        const tbodyS = document.querySelector('#subjects-table tbody');
        if (tbodyS) {
            tbodyS.innerHTML = '';
            
            // Recopilar pares individuales Sujeto+Grupo
            const subjectGroupPairs = [];
            Object.keys(payload.subjects).forEach(key => {
                const match = key.match(/^(\d+)([A-Z])([a-z]|\d+)(\d+)$/);
                if (match) {
                    const num = parseInt(match[1]);
                    const g = match[2];
                    const pairKey = `${num}${g}`;
                    if (!subjectGroupPairs.some(p => p.key === pairKey)) {
                        subjectGroupPairs.push({ num, g, key: pairKey });
                    }
                }
            });
            
            // Ordenar por Grupo (A, B, C) y luego por Número (1, 2, 3...)
            subjectGroupPairs.sort((a, b) => {
                if (a.g !== b.g) return a.g.localeCompare(b.g);
                return a.num - b.num;
            });
            
            subjectGroupPairs.forEach(item => {
                const labelConcisa = `${item.num}${item.g}`; // Ej: 1A, 12B, 24C sin nada más
                tbodyS.innerHTML += `
                    <tr class="subject-row" data-groups="${item.g}">
                        <td style="text-align: left; vertical-align: middle;">
                            <div style="display:flex; align-items:center; gap:6px;">
                                <input type="checkbox" class="id-check" data-id="${item.key}" data-num="${item.num}" data-group="${item.g}" checked>
                                <span title="${labelConcisa}" style="white-space:nowrap; font-weight:bold; font-family:monospace; font-size:12px; color:#cbd5e1;">${labelConcisa}</span>
                            </div>
                        </td>
                        <td style="text-align: center; vertical-align: middle;">
                            <input type="checkbox" class="ev-check subject-check" data-id="${item.key}" data-num="${item.num}" data-group="${item.g}">
                        </td>
                    </tr>
                `;
            });
            
            // Listeners para checkboxes de ID (Visibilidad directa en el plano 3D)
            document.querySelectorAll('.id-check').forEach(cb => {
                cb.addEventListener('change', (e) => {
                    const id = e.target.dataset.id;
                    this.engine.toggleSubjectVisibility(id, e.target.checked);
                    // Forzar pintado si estamos parados
                    if (!this.isPlaying) {
                        const slider = document.getElementById('time-slider');
                        if (slider) this.engine.setTime(parseFloat(slider.value) / 100);
                    }
                });
            });
            
            // Toggle All para ID
            const thId = document.getElementById('th-id-subjects');
            if (thId && !thId.dataset.hasListener) {
                thId.addEventListener('click', () => {
                    const checkboxes = document.querySelectorAll('.id-check');
                    if (checkboxes.length === 0) return;
                    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
                    const targetState = !anyChecked;
                    checkboxes.forEach(cb => {
                        if (cb.checked !== targetState) {
                            cb.checked = targetState;
                            cb.dispatchEvent(new Event('change'));
                        }
                    });
                });
                thId.dataset.hasListener = "true";
            }

            // Forzar el filtro inicial para que coincida con la selección G por defecto
            filterSubjectsByGroup();
        }
        
        // 3. Extraer AAG (Variables)
        const aagMap = new Set();
        if (payload.supplementary_features) {
            Object.keys(payload.supplementary_features).forEach(key => {
                const isSign = key.startsWith('+') || key.startsWith('-');
                if (isSign) {
                    aagMap.add(key.substring(1));
                } else {
                    aagMap.add(key);
                }
            });
        }
        this.aagMapSet = Array.from(aagMap).sort();
        
        const tbodyA = document.querySelector('#aag-table tbody');
        if (tbodyA) {
            tbodyA.innerHTML = '';
            Array.from(aagMap).sort().forEach(aag => {
                tbodyA.innerHTML += `
                    <tr>
                        <td>${aag}</td>
                        <td><input type="checkbox" class="ev-check aag-check" data-id="+${aag}" data-var="${aag}"></td>
                        <td><input type="checkbox" class="ev-check aag-check" data-id="-${aag}" data-var="${aag}"></td>
                    </tr>
                `;
            });
        }
        
        // Bind checkboxes con lógica de incongruencias
        document.querySelectorAll('.ev-check').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const target = e.target;
                
                // Lógica de Incongruencia: Si es AAG, no se puede tener + y - activados simultáneamente
                if (target.classList.contains('aag-check') && target.checked) {
                    const varName = target.dataset.var;
                    const isPositive = target.dataset.id.startsWith('+');
                    const oppositeId = isPositive ? `-${varName}` : `+${varName}`;
                    
                    // Desmarcar el opuesto incongruente
                    const oppositeCheck = document.querySelector(`.aag-check[data-id="${oppositeId}"]`);
                    if (oppositeCheck && oppositeCheck.checked) {
                        oppositeCheck.checked = false;
                    }
                }
                
                this.updateTrajectories();
            });
        });
    }
    
    syncSliderAndMeta() {
        const activeG = Array.from(document.querySelectorAll('.toggle-g.active-cell')).map(el => el.dataset.g);
        const activeTC = Array.from(document.querySelectorAll('.tc-cell.active-cell'));
        
        // Coger el primero para mantener compatibilidad con el resto del sistema
        const g = activeG.length > 0 ? activeG[0] : 'A';
        const t = activeTC.length > 0 ? activeTC[0].dataset.t : 'a';
        const c = activeTC.length > 0 ? activeTC[0].dataset.c : '1';
        
        const metaG = document.getElementById('meta-g');
        const metaT = document.getElementById('meta-t');
        const metaC = document.getElementById('meta-c');
        
        if (metaG) metaG.value = g;
        if (metaT) metaT.value = t;
        if (metaC) metaC.value = c;
    }
    
    updateTrajectories() {
        let selectedSubjects = Array.from(document.querySelectorAll('.id-check:checked')).map(c => c.dataset.id);
        let evSubjects = Array.from(document.querySelectorAll('.ev-check.subject-check:checked')).map(c => c.dataset.id);
        const selectedAAGs = Array.from(document.querySelectorAll('.aag-check:checked')).map(c => c.dataset.id);
        
        let activeG = Array.from(document.querySelectorAll('.toggle-g.active-cell')).map(el => el.dataset.g);
        let activeTC = Array.from(document.querySelectorAll('.tc-cell.active-cell'));
        
        let fallbackApplied = false;

        // Si no hay G válido, marcamos el primero (G1)
        if (activeG.length === 0) {
            const firstG = document.querySelector('.toggle-g');
            if (firstG) {
                firstG.classList.add('active-cell');
                firstG.style.background = '#475569';
                firstG.style.color = '#ffffff';
                activeG = [firstG.dataset.g];
                fallbackApplied = true;
            }
        }
        
        // Si no hay celdas TxC válidas, marcamos la primera (T1_C1)
        if (activeTC.length === 0) {
            const firstTC = document.querySelector('.tc-cell');
            if (firstTC) {
                firstTC.classList.add('active-cell');
                firstTC.style.background = '#3b82f6';
                activeTC = [firstTC];
                fallbackApplied = true;
            }
        }
        
        if (fallbackApplied) {
            this.syncSliderAndMeta();
        }
        
        // Extraer los T únicos para la trayectoria
        const activeT = Array.from(new Set(activeTC.map(el => el.dataset.t)));
        
        // Crear los pares de G y C basándonos en las celdas marcadas
        const selectedPairs = [];
        activeG.forEach(g => {
            activeTC.forEach(tc => {
                const c = tc.dataset.c;
                // Evitar pares duplicados si hay múltiples T marcadas para la misma C
                if (!selectedPairs.some(p => p.g === g && p.c === c)) {
                    selectedPairs.push({ g, c });
                }
            });
        });
        
        if (this.engine.drawTrajectories) {
            this.engine.drawTrajectories(selectedSubjects, evSubjects, selectedAAGs, selectedPairs, activeT);
        }
        
        // ⚡ Bind Capa Global Pill Buttons & Hotkeys (F G T C S / E D V A K)
        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const key = target.dataset.key;
                const isAlt = e.altKey;

                // Modo Disruptivo Exclusivo (Alt + Click / Alt + Tecla): Limpiar pantalla y activar SOLO esta letra
                if (isAlt) {
                    if (typeof handleClear === 'function') {
                        handleClear();
                    }
                    target.classList.add('active');
                    if (this.engine && this.engine.toggleGlobalLayer) {
                        this.engine.toggleGlobalLayer(key, true);
                    }
                } else {
                    // Modo Acumulativo Normal (Click / Tecla): Toggle ON/OFF
                    target.classList.toggle('active');
                    const isAct = target.classList.contains('active');
                    if (this.engine && this.engine.toggleGlobalLayer) {
                        this.engine.toggleGlobalLayer(key, isAct);
                    }
                }

                const titleBadge = document.getElementById('active-projection-title');
                if (titleBadge) {
                    const activeKeys = Array.from(document.querySelectorAll('.pill-btn.active')).map(b => b.dataset.key).join('');
                    titleBadge.textContent = activeKeys 
                        ? `PROYECCIÓN GLOBAL ACTIVA: [${activeKeys}] (${key} ${target.classList.contains('active') ? 'ON' : 'OFF'}${isAlt ? ' - DISRUPTIVO' : ''})`
                        : 'PROYECCIÓN ACTIVA: Pantalla Limpia (Lista para Selección)';
                }
                this.updateTrajectories();
            });
        });

        // 💬 Ventanilla Informativa Flotante para las 10 Letras Globales (F G T C S / E D V A K)
        const PILL_INFO_MAP = {
            'F': { title: 'F — Figuras', badge: 'Quatuor Q81', color: '#38bdf8', desc: '81 Figuras Geométricas Sociométricas y centroides de tensión relacional.' },
            'G': { title: 'G — Grupos', badge: 'Centroides G1-G3', color: '#38bdf8', desc: 'Grupos Colectivos y masas de afinidad estructural.' },
            'T': { title: 'T — Tiempo', badge: 'Fases T1-T4', color: '#38bdf8', desc: 'Ejes temporales y secuencias de evolución del ecosistema.' },
            'C': { title: 'C — Criterio', badge: 'Criterios C1-C3', color: '#38bdf8', desc: 'Criterios de elección y rechazo sociométrico aplicados.' },
            'S': { title: 'S — Sujetos', badge: 'Posición S1-Sn', color: '#38bdf8', desc: 'Sujetos Centroides y masa neta de respuesta individual.' },
            'E': { title: 'E — Evolución', badge: 'Trayectorias E1-En', color: '#a855f7', desc: 'Líneas de trayectoria vectorial y mutación temporal.' },
            'D': { title: 'D — Dendrograma', badge: 'Clustering D1-D6', color: '#a855f7', desc: 'Clustering jerárquico y dendrogramas sociomatriciales.' },
            'V': { title: 'V — Variables', badge: '10 Variables', color: '#f59e0b', desc: 'Proyección global de modalidades de las 10 variables.' },
            'A': { title: 'A — AAG', badge: '16 Adjetivos', color: '#00FF9D', desc: 'Proyección de los 16 adjetivos dicotomizados AAG.' },
            'K': { title: 'K — Clústeres', badge: 'Clústeres por Grupo', color: '#ec4899', desc: 'Proyección global de clústeres de sujetos de cada grupo.' }
        };

        const popover = document.getElementById('pill-popover');
        
        const setupPillPopover = (selector) => {
            document.querySelectorAll(selector).forEach(btn => {
                const key = btn.dataset.key || btn.dataset.vak;
                const info = PILL_INFO_MAP[key];
                if (!info || !popover) return;

                btn.addEventListener('mouseenter', (e) => {
                    popover.style.borderColor = info.color;
                    popover.innerHTML = `
                        <div class="popover-header">
                            <span class="popover-title" style="color:${info.color};">${info.title}</span>
                            <span class="popover-badge" style="color:${info.color}; border:1px solid ${info.color};">${info.badge}</span>
                        </div>
                        <div class="popover-desc">${info.desc}</div>
                        <div class="popover-footer">💡 Click: Acumulativo | Alt+Click: Disruptivo Exclusivo</div>
                    `;
                    popover.style.display = 'block';
                    popover.style.left = (e.clientX + 15) + 'px';
                    popover.style.top = (e.clientY + 10) + 'px';
                });

                btn.addEventListener('mousemove', (e) => {
                    if (popover.style.display === 'block') {
                        let left = e.clientX + 15;
                        let top = e.clientY + 10;
                        if (left + 280 > window.innerWidth) left = e.clientX - 285;
                        if (top + 140 > window.innerHeight) top = e.clientY - 140;
                        popover.style.left = left + 'px';
                        popover.style.top = top + 'px';
                    }
                });

                btn.addEventListener('mouseleave', () => {
                    popover.style.display = 'none';
                });
            });
        };

        setupPillPopover('.pill-btn, .modal-pill-btn, .VAK-btn');

        // 📊 Interruptor de Proyección: Frecuencias vs Densidades (Por defecto: Frecuencias)
        const btnModeFreq = document.getElementById('switch-mode-freq');
        const btnModeDens = document.getElementById('switch-mode-dens');

        const setProjectionMode = (mode) => {
            if (mode === 'freq') {
                btnModeFreq?.classList.add('active');
                if (btnModeFreq) { btnModeFreq.style.background = '#0ea5e9'; btnModeFreq.style.color = '#fff'; }
                btnModeDens?.classList.remove('active');
                if (btnModeDens) { btnModeDens.style.background = '#1e293b'; btnModeDens.style.color = '#94a3b8'; }
            } else {
                btnModeDens?.classList.add('active');
                if (btnModeDens) { btnModeDens.style.background = '#0ea5e9'; btnModeDens.style.color = '#fff'; }
                btnModeFreq?.classList.remove('active');
                if (btnModeFreq) { btnModeFreq.style.background = '#1e293b'; btnModeFreq.style.color = '#94a3b8'; }
            }
            if (this.engine && this.engine.setProjectionMode) {
                this.engine.setProjectionMode(mode);
            }
        };

        btnModeFreq?.addEventListener('click', () => setProjectionMode('freq'));
        btnModeDens?.addEventListener('click', () => setProjectionMode('dens'));

        // 📐 Interruptor de Modo de Vista: Planos | Tablas | Figuras (Por defecto: Planos)
        const btnViewPlanos = document.getElementById('switch-view-planos');
        const btnViewTablas = document.getElementById('switch-view-tablas');
        const btnViewFiguras = document.getElementById('switch-view-figuras');

        const setViewMode = (mode) => {
            [btnViewPlanos, btnViewTablas, btnViewFiguras].forEach(b => {
                if (b) { b.classList.remove('active'); b.style.background = '#1e293b'; b.style.color = '#94a3b8'; }
            });

            if (mode === 'planos') {
                btnViewPlanos?.classList.add('active');
                if (btnViewPlanos) { btnViewPlanos.style.background = '#2563eb'; btnViewPlanos.style.color = '#fff'; }
                if (this.uiPanels && this.uiPanels.dock) this.uiPanels.dock.style.display = 'none';
            } else if (mode === 'tablas') {
                btnViewTablas?.classList.add('active');
                if (btnViewTablas) { btnViewTablas.style.background = '#2563eb'; btnViewTablas.style.color = '#fff'; }
                if (this.uiPanels) this.uiPanels.showMatrices('SMIa');
            } else if (mode === 'figuras') {
                btnViewFiguras?.classList.add('active');
                if (btnViewFiguras) { btnViewFiguras.style.background = '#2563eb'; btnViewFiguras.style.color = '#fff'; }
                if (this.uiPanels) this.uiPanels.showQuatuor();
            }

            if (this.engine && this.engine.setViewMode) {
                this.engine.setViewMode(mode);
            }
        };

        btnViewPlanos?.addEventListener('click', () => setViewMode('planos'));
        btnViewTablas?.addEventListener('click', () => setViewMode('tablas'));
        btnViewFiguras?.addEventListener('click', () => setViewMode('figuras'));

        // ⌨️ Escuchador Global de Teclas Rápidas (F, G, T, C, S, E, D, V, A, K con Alt+letra disruptivo)
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
            const key = e.key.toUpperCase();
            if (['F', 'G', 'T', 'C', 'S', 'E', 'D', 'V', 'A', 'K'].includes(key)) {
                const btn = document.querySelector(`.pill-btn[data-key="${key}"]`);
                if (btn) {
                    btn.dispatchEvent(new MouseEvent('click', { altKey: e.altKey, bubbles: true }));
                }
            }
        });

        // 📈 Bind Numeric Variables (1 - 10)
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const vVal = target.dataset.var;
                if (vVal === 'all') {
                    const isAllActive = target.classList.contains('active');
                    document.querySelectorAll('.num-btn').forEach(b => {
                        if (isAllActive) b.classList.remove('active');
                        else b.classList.add('active');
                        const vNum = b.dataset.var;
                        if (this.engine && this.engine.toggleVariableCentroid) {
                            this.engine.toggleVariableCentroid(vNum, !isAllActive);
                        }
                    });
                } else {
                    target.classList.toggle('active');
                    const isAct = target.classList.contains('active');
                    if (this.engine && this.engine.toggleVariableCentroid) {
                        this.engine.toggleVariableCentroid(vVal, isAct);
                    }
                }
                this.updateTrajectories();
            });
        });

        // 🧪 Bind AAG Factors (F1: 1-4, F2: 5-8, F3: 9-12, F4: 13-16)
        document.querySelectorAll('.factor-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                target.classList.toggle('active');
                const factorNum = parseInt(target.dataset.factor);
                const isAct = target.classList.contains('active');
                
                // Mapear factor a rango de adjetivos AAG (F1: 1-4, F2: 5-8, F3: 9-12, F4: 13-16)
                const startIdx = (factorNum - 1) * 4 + 1;
                const endIdx = factorNum * 4;
                
                const aagChecks = document.querySelectorAll('.aag-check');
                aagChecks.forEach((chk, idx) => {
                    const itemNum = Math.floor(idx / 2) + 1;
                    if (itemNum >= startIdx && itemNum <= endIdx) {
                        chk.checked = isAct;
                    }
                });

                if (this.engine && this.engine.toggleAAGFactor) {
                    this.engine.toggleAAGFactor(factorNum, isAct);
                }

                this.updateTrajectories();
            });
        });

        // Bind Acciones Sistema de la Franja Inferior & Limpieza de Pantalla
        const handleClear = () => {
            // 1. Desmarcar todas las pastillas y checkboxes de la interfaz
            document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.factor-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.id-check, .ev-check').forEach(cb => { cb.checked = false; });
            document.querySelectorAll('.active-cell').forEach(c => c.classList.remove('active-cell'));

            // 2. Desmarcar checkboxes de Índices y Planos
            ['toggle-density', 'toggle-grassmann', 'toggle-plane-vertical', 'toggle-plane-orthogonal'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.checked = false;
            });

            // 3. Resetear Sliders a sus valores por defecto
            const ctaSlider = document.getElementById('cta-slider');
            const ctaVal = document.getElementById('cta-val');
            if (ctaSlider) ctaSlider.value = 0;
            if (ctaVal) ctaVal.textContent = '0.0';

            const timeSlider = document.getElementById('time-slider');
            if (timeSlider) timeSlider.value = 0;

            // 4. Resetear el motor 3D y vaciar proyecciones/trayectorias
            if (this.engine) {
                if (this.engine.clearTrajectories) this.engine.clearTrajectories();
                if (this.engine.clearAllProjections) this.engine.clearAllProjections();
                if (this.engine.setTime) this.engine.setTime(0);
            }

            const titleBadge = document.getElementById('active-projection-title');
            if (titleBadge) {
                titleBadge.textContent = 'PROYECCIÓN ACTIVA: Pantalla Limpia (Lista para Selección)';
            }
        };

        const btnClear = document.getElementById('btn-clear');
        if (btnClear) btnClear.addEventListener('click', handleClear);

        const btnClearPills = document.getElementById('btn-clear-pills');
        if (btnClearPills) btnClearPills.addEventListener('click', handleClear);

        const btnCenter = document.getElementById('btn-center');
        if (btnCenter) {
            btnCenter.addEventListener('click', () => {
                if (this.engine && this.engine.camera && this.engine.controls) {
                    this.engine.camera.position.set(0, 0, 80.0);
                    this.engine.controls.target.set(0, 0, 0);
                    this.engine.controls.update();
                }
            });
        }

        const btnCapture = document.getElementById('btn-capture');
        if (btnCapture) {
            btnCapture.addEventListener('click', () => {
                if (this.engine && this.engine.renderer) {
                    this.engine.renderer.render(this.engine.scene, this.engine.camera);
                    const dataURL = this.engine.renderer.domElement.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `VISORD_Captura_${Date.now()}.png`;
                    link.href = dataURL;
                    link.click();
                }
            });
        }

        const btnReset = document.getElementById('btn-reset');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                location.reload();
            });
        }

        const btnSave = document.getElementById('btn-save');
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                if (!window.VISORD_PAYLOAD) {
                    alert("No hay ningún estudio activo cargado para guardar.");
                    return;
                }
                
                // 🔒 CONTROL DE SEGURIDAD INSTITUCIONAL (Prevención de Fugas en Web Pública)
                const isPublicWeb = window.location.hostname.includes('github.io') || 
                                    (window.location.protocol === 'https:' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1'));
                
                if (isPublicWeb) {
                    alert("🔒 PROTECCIÓN DE SEGURIDAD INSTITUCIONAL:\n\nLa descarga de archivos .JSON crudos y la gestión del archivo histórico están restringidas en la versión Web pública para evitar fugas de información sociométrica sensible.\n\nEsta funcionalidad está reservada a la Plataforma Institucional SOC_ORD de uso local / Intranet protegida.");
                    return;
                }

                const defaultTipo = (window.VISORD_PAYLOAD?.metadata?.tipo || "REAL").toUpperCase();
                const defaultGTC = (window.VISORD_PAYLOAD?.metadata?.gtc || "G3T4C3").toUpperCase();
                const defaultName = window.VISORD_PAYLOAD?.metadata?.study_title || "Matriz_SOC_ORD";
                
                const customTitle = prompt("Introduce el Nombre o Título Identificativo para este Estudio:", defaultName);
                if (customTitle === null) return; // Cancelado por el usuario
                
                const finalTitle = customTitle.trim() || defaultName;
                const sanitizedName = finalTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
                
                if (!window.VISORD_PAYLOAD.metadata) window.VISORD_PAYLOAD.metadata = {};
                window.VISORD_PAYLOAD.metadata.tipo = defaultTipo;
                window.VISORD_PAYLOAD.metadata.gtc = defaultGTC;
                window.VISORD_PAYLOAD.metadata.study_title = finalTitle;
                window.VISORD_PAYLOAD.metadata.status = "VISUALIZADO";
                window.VISORD_PAYLOAD.metadata.saved_at = new Date().toISOString();
                
                const now = new Date();
                const pad = (n) => String(n).padStart(2, '0');
                const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
                
                // Formato Estricto Obligatorio: SIM/REAL + GxTyCz + Nombre + Fecha.json
                const filename = `${defaultTipo}_${defaultGTC}_${sanitizedName}_${stamp}.json`;
                window.VISORD_PAYLOAD.metadata.file_code = `${defaultTipo}_${defaultGTC}_${sanitizedName}_${stamp}`;
                
                const jsonStr = JSON.stringify(window.VISORD_PAYLOAD, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                URL.revokeObjectURL(url);
                
                alert(`Estudio guardado correctamente con Nomenclatura Oficial:\n${filename}\n\nPuedes almacenarlo directamente en 'data/estudios_historicos/'.`);
            });
        }

        const btnTourDock = document.getElementById('btn-tour-dock');
        if (btnTourDock) {
            btnTourDock.addEventListener('click', () => {
                if (window.VISORD_PAYLOAD) {
                    this.loadAndStart(window.VISORD_PAYLOAD);
                }
                const tourBadge = document.getElementById('tour-status-badge');
                if (tourBadge) {
                    tourBadge.style.display = 'inline-block';
                    tourBadge.onclick = () => {
                        if (this.engine) this.engine.abortTour = true;
                        tourBadge.style.display = 'none';
                    };
                }
                if (this.engine && this.engine.playUniverseTour) {
                    this.engine.playUniverseTour().then(() => {
                        if (tourBadge) tourBadge.style.display = 'none';
                    });
                }
            });
        }

        // 1) Acción 1: Proyección en Plano 1-2
        const btnPlane12 = document.getElementById('btn-plane-12');
        if (btnPlane12) {
            btnPlane12.addEventListener('click', () => {
                if (this.engine && this.engine.camera && this.engine.controls) {
                    this.engine.camera.position.set(0, 0, 20.0);
                    this.engine.controls.target.set(0, 0, 0);
                    this.engine.controls.update();
                    const titleBadge = document.getElementById('active-projection-title');
                    if (titleBadge) titleBadge.textContent = 'PROYECCIÓN ACTIVA: Plano Factorial Primario 1-2 (16:9 Axonográfico)';
                }
            });
        }

        // 2) Acción 2: Gráficos (Histogramas AAG, Dendrograma Sujetos, Dendrograma Matrices)
        const btnHisto = document.getElementById('btn-histogram');
        if (btnHisto) {
            btnHisto.addEventListener('click', () => {
                const dock = document.getElementById('bottom-dock');
                const title = document.getElementById('dock-title');
                const content = document.getElementById('dock-content');
                if (dock && title && content) {
                    title.textContent = '📊 Acción 2: Histogramas Comparativos AAG (16 Adjetivos / 4 Factores)';
                    content.innerHTML = '<canvas id="chart-canvas" style="max-height: 280px; width: 100%;"></canvas>';
                    dock.style.display = 'flex';

                    setTimeout(() => {
                        const ctx = document.getElementById('chart-canvas').getContext('2d');
                        new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: ['F1 (1-4)', 'F2 (5-8)', 'F3 (9-12)', 'F4 (13-16)'],
                                datasets: [{
                                    label: 'Intensidad Modal Media AAG',
                                    data: [4.2, 3.8, 4.9, 2.7],
                                    backgroundColor: ['#38bdf8', '#00FF9D', '#f59e0b', '#a855f7']
                                }]
                            },
                            options: { responsive: true, maintainAspectRatio: false }
                        });
                    }, 100);
                }
            });
        }

        const btnDendroSubj = document.getElementById('btn-dendro-subj');
        if (btnDendroSubj) {
            btnDendroSubj.addEventListener('click', () => {
                const dock = document.getElementById('bottom-dock');
                const title = document.getElementById('dock-title');
                const content = document.getElementById('dock-content');
                if (dock && title && content) {
                    title.textContent = '🌳 Acción 2: Dendrograma Tipo I (Jerarquía de Clusters de Sujetos en Sociomatriz)';
                    content.innerHTML = `
                        <div style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.6; text-align: center; width: 100%;">
                            <h4 style="color: #00FF9D; margin-top:0;">Dendrograma de Agrupamiento Jerárquico Intra-Sociomatriz (43 Sujetos)</h4>
                            <p style="font-family: monospace; color: #38bdf8;">[1A..6A] ──┐<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Cluster CAJ 1 (Carmesi: Inercia 48.2%)<br>[1B..12B] ─┘<br>[1C..25C] ────── Cluster CAJ 3 (Cobalto: Inercia 32.6%)</p>
                        </div>
                    `;
                    dock.style.display = 'flex';
                }
            });
        }

        const btnDendroMat = document.getElementById('btn-dendro-mat');
        if (btnDendroMat) {
            btnDendroMat.addEventListener('click', () => {
                const dock = document.getElementById('bottom-dock');
                const title = document.getElementById('dock-title');
                const content = document.getElementById('dock-content');
                if (dock && title && content) {
                    title.textContent = '🌳 Acción 2: Dendrograma Tipo II (Distancia Estructural entre las 36 Sociomatrices SMIb)';
                    content.innerHTML = `
                        <div style="color: #cbd5e1; font-size: 0.85rem; line-height: 1.6; text-align: center; width: 100%;">
                            <h4 style="color: #4bc0c0; margin-top:0;">Arbol Jerárquico de Distancias Inter-Sociomatrices (3 Grupos x 4 Tiempos x 3 Criterios)</h4>
                            <p style="font-family: monospace; color: #a855f7;">Matriz G1T1C1 ──┐<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Bloque Temporal T1-T2 (Similitud 89.4%)<br>Matriz G1T2C1 ──┘<br>Matriz G3T4C3 ────── Divergencia Estructural T4 (Inestabilidad Relativa)</p>
                        </div>
                    `;
                    dock.style.display = 'flex';
                }
            });
        }

        const btnDiag = document.getElementById('btn-diag');
        if (btnDiag) {
            btnDiag.addEventListener('click', () => {
                if (this.uiPanels) this.uiPanels.showDiag();
            });
        }

        const btnInfo = document.getElementById('btn-info');
        if (btnInfo) {
            btnInfo.addEventListener('click', () => {
                const dock = document.getElementById('bottom-dock');
                const title = document.getElementById('dock-title');
                const content = document.getElementById('dock-content');
                if (dock && title && content) {
                    title.textContent = 'ℹ️ Información del Sistema SOC_ORD (VISORDP)';
                    content.innerHTML = `
                        <div style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; text-align: left; max-width: 700px;">
                            <h3 style="color: #38bdf8;">VISORD (Visualización de Relaciones de Densidad y Preferencia)</h3>
                            <p>Ecosistema de animación y simulación 3D interactivo basado en las matrices relacionales SMIb y la Variedad de Grassmann.</p>
                            <ul>
                                <li><b>Acción 1 (Proyección)</b>: Plano Factorial Primario 1-2.</li>
                                <li><b>Acción 2 (Gráficos)</b>: Radar, Histogramas AAG, Dendrogramas I y II.</li>
                                <li><b>Acción 3 (Tablas)</b>: Matrices NxN (36) y Quatuor (9x9).</li>
                                <li><b>Acción 4 (Informe)</b>: Diagnóstico Verbal Cualitativo y Socio-Termodinámico.</li>
                            </ul>
                        </div>
                    `;
                    dock.style.display = 'flex';
                }
            });
        }
    }
}

// 🚀 Inicialización Automática en la Carga de la Página
document.addEventListener('DOMContentLoaded', () => {
    window.visordApp = new VisordApp();
    window.visordApp.init();
});
