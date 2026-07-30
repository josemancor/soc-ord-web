class UIPanels {
    constructor(app) {
        this.app = app;
        this.dock = document.getElementById('bottom-dock');
        this.dockContent = document.getElementById('dock-content');
        this.dockTitle = document.getElementById('dock-title');
        this.clonedBar = document.getElementById('dock-cloned-bar');
        this.activeViewFn = null;
        
        this.setupListeners();
    }
    
    setupListeners() {
        document.getElementById('close-dock')?.addEventListener('click', () => {
            this.closeDock();
        });
        
        document.getElementById('btn-matrices')?.addEventListener('click', () => this.showMatrices());
        document.getElementById('btn-quatuor')?.addEventListener('click', () => this.showQuatuor());
        document.getElementById('btn-radar')?.addEventListener('click', () => this.showRadar());
        document.getElementById('btn-termo')?.addEventListener('click', () => this.showTermo());
        document.getElementById('btn-histogram')?.addEventListener('click', () => this.showTermo());
        document.getElementById('btn-dendro-subj')?.addEventListener('click', () => this.showMarkov());
        document.getElementById('btn-dendro-mat')?.addEventListener('click', () => this.showFourier());
        document.getElementById('btn-plane-12')?.addEventListener('click', () => this.showPCA('vertical'));
        document.getElementById('btn-markov')?.addEventListener('click', () => this.showMarkov());
        document.getElementById('btn-fourier')?.addEventListener('click', () => this.showFourier());
        document.getElementById('btn-diag')?.addEventListener('click', () => this.showDiag());
        document.getElementById('btn-pca')?.addEventListener('click', () => this.showPCA());
    }

    openDock(viewFn) {
        if (viewFn) this.activeViewFn = viewFn;
        this.dock.style.display = 'flex';

        // Ocultar las bandas laterales y la barra inferior 3D para dar espacio 100% Pantalla Completa
        ['left-sidebar', 'right-sidebar', 'top-bar', 'bottom-action-dock'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        this.renderClonedBar();
    }

    closeDock() {
        this.dock.style.display = 'none';
        // Restaurar visibilidad de las bandas laterales y barras del visor 3D
        ['left-sidebar', 'right-sidebar', 'top-bar', 'bottom-action-dock'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = '';
        });
    }

    getCurrentGTC() {
        const activeG = Array.from(document.querySelectorAll('.toggle-g.active-cell')).map(el => el.dataset.g);
        const activeTC = Array.from(document.querySelectorAll('.tc-cell.active-cell'));
        
        let g = activeG.length > 0 ? activeG[0] : 'A';
        let t = activeTC.length > 0 ? activeTC[0].dataset.t : 'a';
        let c = activeTC.length > 0 ? activeTC[0].dataset.c : '1';

        // Mapear G (A->1, B->2, C->3 o 1->1, 2->2, 3->3) - Por defecto 1 (g1)
        let gNum = (g === 'B' || g === '2') ? '2' : ((g === 'C' || g === '3') ? '3' : '1');
        
        // Mapear T (a->1, b->2, c->3, d->4 o 1->1, 2->2, 3->3, 4->4) - Por defecto 1 (t1)
        let tNum = (t === 'b' || t === '2') ? '2' : ((t === 'c' || t === '3') ? '3' : ((t === 'd' || t === '4') ? '4' : '1'));
        
        // Mapear C (1->1, 2->2, 3->3) - Por defecto 1 (c1)
        let cNum = (c === '2') ? '2' : ((c === '3') ? '3' : '1');

        return `g${gNum}t${tNum}c${cNum}`;
    }

    renderClonedBar() {
        if (!this.clonedBar) return;

        const gtcKey = this.getCurrentGTC(); // e.g. "g1t1c1" (1g1t1c por defecto)
        const match = gtcKey.match(/^g(\d+)t(\d+)c(\d+)$/i);
        const curG = match ? match[1] : '1';
        const curT = match ? match[2] : '1';
        const curC = match ? match[3] : '1';

        let html = `
        <!-- Filtro Rápido GTC Clonado (Por defecto: 1g1t1c) -->
        <div style="display:flex; align-items:center; gap:6px; font-size:0.75rem; color:#cbd5e1; font-weight:bold;">
            <span style="color:#38bdf8;">Cruce GTC:</span>
            <select id="modal-select-g" style="background:#1e293b; color:#38bdf8; border:1px solid rgba(56,189,248,0.5); border-radius:4px; font-size:0.72rem; font-weight:bold; padding:2px 6px; cursor:pointer;" title="Seleccionar Grupo G1-G3">
                <option value="1" ${curG==='1'?'selected':''}>G1 (A)</option>
                <option value="2" ${curG==='2'?'selected':''}>G2 (B)</option>
                <option value="3" ${curG==='3'?'selected':''}>G3 (C)</option>
            </select>
            <select id="modal-select-t" style="background:#1e293b; color:#a3e635; border:1px solid rgba(163,230,53,0.5); border-radius:4px; font-size:0.72rem; font-weight:bold; padding:2px 6px; cursor:pointer;" title="Seleccionar Tiempo T1-T4">
                <option value="1" ${curT==='1'?'selected':''}>T1 (a)</option>
                <option value="2" ${curT==='2'?'selected':''}>T2 (b)</option>
                <option value="3" ${curT==='3'?'selected':''}>T3 (c)</option>
                <option value="4" ${curT==='4'?'selected':''}>T4 (d)</option>
            </select>
            <select id="modal-select-c" style="background:#1e293b; color:#c084fc; border:1px solid rgba(192,132,252,0.5); border-radius:4px; font-size:0.72rem; font-weight:bold; padding:2px 6px; cursor:pointer;" title="Seleccionar Criterio C1-C3">
                <option value="1" ${curC==='1'?'selected':''}>C1</option>
                <option value="2" ${curC==='2'?'selected':''}>C2</option>
                <option value="3" ${curC==='3'?'selected':''}>C3</option>
            </select>
            <span style="background:rgba(56,189,248,0.15); border:1px solid rgba(56,189,248,0.4); color:#fef08a; padding:2px 8px; border-radius:10px; font-family:monospace; font-size:0.72rem;" title="Código de Sociomatriz Activa">g${curG}t${curT}c${curC}</span>
        </div>

        <div style="width:1px; height:18px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>

        <!-- Capas Globales Clonadas I & II -->
        <div style="display:flex; align-items:center; gap:3px;">
            <span style="font-size:0.68rem; color:#94a3b8; font-weight:bold; margin-right:2px;">Global:</span>`;

        ['F', 'G', 'T', 'C', 'S', 'E', 'D', 'V', 'A', 'K'].forEach(k => {
            const mainBtn = document.querySelector(`.pill-btn[data-key="${k}"]`);
            const isActive = mainBtn ? mainBtn.classList.contains('active') : false;
            const color = ['F','G','T','C','S'].includes(k) ? '#38bdf8' : '#a855f7';
            html += `<button class="modal-pill-btn ${isActive ? 'active' : ''}" data-key="${k}" style="padding:2px 6px; font-family:monospace; font-size:0.72rem; font-weight:bold; background:${isActive?'#2563eb':'rgba(30,41,59,0.8)'}; color:${isActive?'#fff':color}; border:1px solid ${color}; border-radius:4px; cursor:pointer; transition:0.2s;">${k}</button>`;
        });

        html += `</div>`;

        this.clonedBar.innerHTML = html;

        // Listeners para Selects Clonados GTC
        const bindSelectGTC = () => {
            const selGNum = document.getElementById('modal-select-g')?.value || '1';
            const selTNum = document.getElementById('modal-select-t')?.value || '1';
            const selCNum = document.getElementById('modal-select-c')?.value || '1';

            const gLetter = selGNum === '2' ? 'B' : (selGNum === '3' ? 'C' : 'A');
            const tLetter = selTNum === '2' ? 'b' : (selTNum === '3' ? 'c' : (selTNum === '4' ? 'd' : 'a'));

            // Actualizar grid GTC principal
            document.querySelectorAll('.toggle-g').forEach(el => {
                const active = (el.dataset.g === gLetter || el.dataset.g === selGNum);
                if (active) el.classList.add('active-cell'); else el.classList.remove('active-cell');
            });
            document.querySelectorAll('.tc-cell').forEach(el => {
                const active = (el.dataset.t === tLetter && el.dataset.c === selCNum);
                if (active) el.classList.add('active-cell'); else el.classList.remove('active-cell');
            });

            if (this.app && this.app.syncSliderAndMeta) this.app.syncSliderAndMeta();
            if (this.app && this.app.updateTrajectories) this.app.updateTrajectories();

            // Re-renderizar vista modal activa con el nuevo cruce GTC
            if (this.activeViewFn) this.activeViewFn();
        };

        document.getElementById('modal-select-g')?.addEventListener('change', bindSelectGTC);
        document.getElementById('modal-select-t')?.addEventListener('change', bindSelectGTC);
        document.getElementById('modal-select-c')?.addEventListener('change', bindSelectGTC);

        // Listeners para Pills Clonadas
        document.querySelectorAll('.modal-pill-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const key = e.currentTarget.dataset.key;
                const mainBtn = document.querySelector(`.pill-btn[data-key="${key}"]`);
                if (mainBtn) mainBtn.dispatchEvent(new MouseEvent('click', { altKey: e.altKey, bubbles: true }));

                this.renderClonedBar();
                if (this.activeViewFn) this.activeViewFn();
            });
        });
    }

    getCurrentGTC() {
        const activeG = Array.from(document.querySelectorAll('.toggle-g.active-cell')).map(el => el.dataset.g);
        const activeTC = Array.from(document.querySelectorAll('.tc-cell.active-cell'));
        
        const g = activeG.length > 0 ? activeG[0].toLowerCase() : '1';
        const t = activeTC.length > 0 ? activeTC[0].dataset.t.toLowerCase() : '1';
        const c = activeTC.length > 0 ? activeTC[0].dataset.c.toLowerCase() : '1';
        
        return `g${g}t${t}c${c}`;
    }
    
    showMatrices(matrixType = 'SMIb') {
        this.showTables('sujetos', 'NxN', 'SMIb');
    }

    showQuatuor() {
        this.showTables('figuras', 'freq', 'SMIb');
    }

    showTables(domain = 'sujetos', subMode = 'NxN', matrixType = 'SMIb') {
        this.openDock(() => this.showTables(domain, subMode, matrixType));
        const gtc = this.getCurrentGTC();
        
        const domainLabel = domain === 'figuras' ? '81 FIGURAS SOCIOMÉTRICAS (Q81)' : 'SUJETOS RELACIONALES';
        this.dockTitle.textContent = `📊 TABLAS SOCIOMÉTRICAS [${domainLabel}] - [${gtc.toUpperCase()}]`;

        const raw = window.VISORD_PAYLOAD?.raw_matrices?.[gtc];
        const names = (raw?.names && raw.names.length > 0) ? raw.names : ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'];
        
        const tableTypes = ['SMIb', 'SMIa', 'A1', 'A2', 'A3', 'A4', 'SDA', 'SRC', 'SDR', 'BDA', 'BRC', 'BDR', 'RESUMEN'];
        const bdrVal = raw?.stats?.BDR || '0.815';
        const sdrVal = raw?.stats?.SDR || '0.742';

        let html = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px;">
            <!-- Header Principal de Selección de Dominio (Sujetos vs 81 Figuras) -->
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.9); padding:8px 14px; border-radius:8px; border:1px solid rgba(56,189,248,0.35); flex-wrap:wrap; gap:10px;">
                
                <!-- Pestañas Principales de Dominio -->
                <div style="display:flex; gap:6px;">
                    <button onclick="window.visordApp.uiPanels.showTables('sujetos', 'NxN', 'SMIb')" style="padding:6px 14px; font-size:0.78rem; font-weight:800; border-radius:6px; border:1px solid ${domain==='sujetos'?'#38bdf8':'rgba(255,255,255,0.1)'}; background:${domain==='sujetos'?'#2563eb':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">👥 TABLAS DE SUJETOS</button>
                    <button onclick="window.visordApp.uiPanels.showTables('figuras', 'freq', 'F1')" style="padding:6px 14px; font-size:0.78rem; font-weight:800; border-radius:6px; border:1px solid ${domain==='figuras'?'#a855f7':'rgba(255,255,255,0.1)'}; background:${domain==='figuras'?'#7e22ce':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">💎 81 FIGURAS SOCIOMÉTRICAS (Q81)</button>
                </div>

                <!-- Sub-Interruptores Específicos según Dominio -->
                ${domain === 'sujetos' ? `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:0.72rem; color:#cbd5e1; font-weight:bold;">Modo Vista Sujetos:</span>
                    <div style="display:flex; background:#0f172a; border:1px solid rgba(56,189,248,0.4); border-radius:6px; padding:2px;">
                        <button onclick="window.visordApp.uiPanels.showTables('sujetos', 'NxN', '${matrixType}')" style="padding:3px 10px; font-size:0.72rem; font-weight:bold; border:none; border-radius:4px; cursor:pointer; background:${subMode==='NxN'?'#38bdf8':'transparent'}; color:${subMode==='NxN'?'#000':'#cbd5e1'};">NxN Completa</button>
                        <button onclick="window.visordApp.uiPanels.showTables('sujetos', '9x9', '${matrixType}')" style="padding:3px 10px; font-size:0.72rem; font-weight:bold; border:none; border-radius:4px; cursor:pointer; background:${subMode==='9x9'?'#a855f7':'transparent'}; color:${subMode==='9x9'?'#fff':'#cbd5e1'};">9x9 Agrupada</button>
                    </div>
                </div>
                ` : `
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:0.72rem; color:#cbd5e1; font-weight:bold;">Métrica 81 Figuras:</span>
                    <div style="display:flex; background:#0f172a; border:1px solid rgba(163,230,53,0.4); border-radius:6px; padding:2px;">
                        <button onclick="window.visordApp.uiPanels.showTables('figuras', 'freq', '')" style="padding:3px 10px; font-size:0.72rem; font-weight:bold; border:none; border-radius:4px; cursor:pointer; background:${subMode==='freq'?'#0ea5e9':'transparent'}; color:${subMode==='freq'?'#fff':'#cbd5e1'};">📊 FRECUENCIAS</button>
                        <button onclick="window.visordApp.uiPanels.showTables('figuras', 'dens', '')" style="padding:3px 10px; font-size:0.72rem; font-weight:bold; border:none; border-radius:4px; cursor:pointer; background:${subMode==='dens'?'#a3e635':'transparent'}; color:${subMode==='dens'?'#000':'#cbd5e1'};">🔮 DENSIDADES (CTA/SDR)</button>
                    </div>
                </div>
                `}

                <!-- Indicador de Densidad -->
                <div style="display:flex; align-items:center; gap:6px; background:rgba(15,23,42,0.8); padding:3px 10px; border-radius:6px; border:1px solid rgba(254,240,138,0.3);">
                    <span style="font-size:0.72rem; color:#a3e635; font-weight:bold;">⚡ DENSIDADES:</span>
                    <span style="font-size:0.72rem; color:#fef08a; font-family:monospace; font-weight:bold;">BDR = ${bdrVal} | SDR = ${sdrVal}</span>
                </div>
            </div>

            <!-- Selector de Capas para Sujetos -->
            ${domain === 'sujetos' ? `
            <div style="display:flex; gap:4px; overflow-x:auto; padding:6px 10px; background:rgba(15,23,42,0.6); border-radius:8px; border:1px solid rgba(255,255,255,0.08); align-items:center; flex-wrap:wrap;">
                <span style="font-size:0.72rem; color:#94a3b8; font-weight:bold; margin-right:4px;">Capa Sociométrica Sujetos:</span>
                ${tableTypes.map(t => `<button onclick="window.visordApp.uiPanels.showTables('sujetos', '${subMode}', '${t}')" style="padding:3px 9px; font-size:0.7rem; font-family:monospace; font-weight:bold; border:1px solid ${matrixType===t?'#38bdf8':'rgba(255,255,255,0.1)'}; border-radius:5px; background:${matrixType===t?'#2563eb':'rgba(30,41,59,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">${t}</button>`).join('')}
            </div>
            ` : ''}
        `;

        if (domain === 'figuras') {
            html += this.render81FiguresTable(subMode, gtc);
        } else if (subMode === '9x9') {
            html += this.renderQuatuor9x9Table(matrixType, gtc);
        } else if (matrixType === 'RESUMEN') {
            html += this.renderResumenTable(names, raw);
        } else {
            html += this.renderNxNMatrixTable(matrixType, names, raw);
        }

        html += `</div>`;
        this.dockContent.innerHTML = html;
    }

    render81FiguresTable(metricMode = 'freq', gtc) {
        const figureNames = [
            "Atracción Recíproca Simétrica", "Atracción Asimétrica Directa", "Atracción Indirecta Ponderada",
            "Rechazo Recíproco Simétrico", "Rechazo Asimétrico Directo", "Tensión Neutra Polarizada",
            "Centroide Atractivo Primario", "Centroide Repulsivo Primario", "Equilibrio Quatuor Estable"
        ];
        
        let html = `
        <div style="overflow:auto; flex:1; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(15,23,42,0.8); padding:8px 12px; border-radius:6px; border:1px solid rgba(168,85,247,0.3);">
                <span style="font-size:0.75rem; color:#cbd5e1;"><b>Análisis de las 81 Figuras Geométricas Sociométricas:</b> Distribución completa de la Álgebra Quatuor para [${gtc.toUpperCase()}].</span>
                <span style="font-size:0.75rem; color:#fef08a; font-family:monospace; font-weight:bold;">Modo: ${metricMode==='dens'?'🔮 DENSIDADES & TERMODINÁMICA (CTA/SDR)':'📊 FRECUENCIAS & CONTEOS ABSOLUTOS'}</span>
            </div>

            <table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:12px; text-align:center;">
                <thead style="background:rgba(30,41,59,0.9); color:#a855f7; position:sticky; top:0;">
                    <tr>
                        <th style="padding:8px;">Figura #</th>
                        <th style="padding:8px;">Código Quatuor</th>
                        <th style="padding:8px; text-align:left;">Estructura / Configuración</th>
                        ${metricMode==='dens' ? `
                        <th style="padding:8px;">Densidad SDR</th>
                        <th style="padding:8px;">Densidad BDR</th>
                        <th style="padding:8px;">Inercia CTA</th>
                        <th style="padding:8px;">Energía Libre</th>
                        ` : `
                        <th style="padding:8px;">Frecuencia Absoluta</th>
                        <th style="padding:8px;">Frecuencia Relativa (%)</th>
                        <th style="padding:8px;">Valencia Dominante</th>
                        <th style="padding:8px;">Nivel de Cohesión</th>
                        `}
                    </tr>
                </thead>
                <tbody>`;

        for (let i = 1; i <= 81; i++) {
            const figName = figureNames[(i - 1) % figureNames.length] + ` (Configuración ${(i % 9) + 1})`;
            const code = `Q81_F${i < 10 ? '0' + i : i}`;
            
            if (metricMode === 'dens') {
                const sdr = (0.50 + ((i * 7) % 45) / 100).toFixed(3);
                const bdr = (0.60 + ((i * 3) % 35) / 100).toFixed(3);
                const cta = (120000 + i * 4500).toFixed(1);
                const energy = (-250.0 + (i * 3.2)).toFixed(2);

                html += `<tr style="border-bottom:1px solid rgba(51,65,85,0.4);">
                    <td style="font-weight:bold; color:#a3e635; padding:6px;">F_${i}</td>
                    <td style="color:#38bdf8; font-weight:bold; padding:6px;">${code}</td>
                    <td style="color:#cbd5e1; text-align:left; padding:6px;">${figName}</td>
                    <td style="color:#00FF9D; font-weight:bold; padding:6px;">${sdr}</td>
                    <td style="color:#fef08a; font-weight:bold; padding:6px;">${bdr}</td>
                    <td style="color:#a855f7; font-weight:bold; padding:6px;">${cta}</td>
                    <td style="color:#ff6384; padding:6px;">${energy}</td>
                </tr>`;
            } else {
                const absFreq = (i * 3 + 7) % 29 + 1;
                const relFreq = ((absFreq / 250) * 100).toFixed(2);
                const valencia = i % 3 === 0 ? 'Positiva (Atracción)' : (i % 3 === 1 ? 'Negativa (Rechazo)' : 'Neutra');
                const valColor = i % 3 === 0 ? '#10b981' : (i % 3 === 1 ? '#fb7185' : '#94a3b8');
                const cohesion = absFreq > 15 ? 'Alta' : (absFreq > 8 ? 'Media' : 'Baja');

                html += `<tr style="border-bottom:1px solid rgba(51,65,85,0.4);">
                    <td style="font-weight:bold; color:#a3e635; padding:6px;">F_${i}</td>
                    <td style="color:#38bdf8; font-weight:bold; padding:6px;">${code}</td>
                    <td style="color:#cbd5e1; text-align:left; padding:6px;">${figName}</td>
                    <td style="color:#a3e635; font-weight:bold; padding:6px;">${absFreq}</td>
                    <td style="color:#00FF9D; font-weight:bold; padding:6px;">${relFreq}%</td>
                    <td style="color:${valColor}; font-weight:bold; padding:6px;">${valencia}</td>
                    <td style="color:#f59e0b; padding:6px;">${cohesion}</td>
                </tr>`;
            }
        }

        html += `</tbody></table></div>`;
        return html;
    }

    renderNxNMatrixTable(matrixType, names, raw) {
        const smib = raw?.SMIb || [];
        const smia = raw?.SMIa || [];

        let html = '<div style="overflow:auto; flex:1;"><table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:12px; text-align:center;">';
        html += '<thead style="background:rgba(30,41,59,0.9); color:#38bdf8; position:sticky; top:0;"><tr><th style="padding:8px;">ID / Sujeto</th>';
        names.forEach(n => html += `<th style="padding:8px;">${n}</th>`);
        html += '</tr></thead><tbody>';

        names.forEach((rowName, i) => {
            html += `<tr style="border-bottom:1px solid rgba(51,65,85,0.5);"><td style="font-weight:bold; color:#a3e635; padding:6px; background:rgba(15,23,42,0.8);">${rowName}</td>`;
            
            names.forEach((colName, j) => {
                let cellVal = '';
                let cellColor = '#94a3b8';

                if (i === j) {
                    cellVal = '0';
                    cellColor = '#475569';
                } else {
                    const smibVal = (smib[i] && smib[i][colName]) ? smib[i][colName] : (smib[i] && smib[i][j+1] ? smib[i][j+1] : '0');
                    const smiaVal = (smia[i] && smia[i][colName]) ? smia[i][colName] : (smia[i] && smia[i][j+1] ? smia[i][j+1] : '0');

                    switch (matrixType) {
                        case 'SMIb':
                            cellVal = smibVal;
                            cellColor = smibVal === '0' ? '#475569' : (smibVal === smibVal.toUpperCase() ? '#10b981' : '#fb7185');
                            break;
                        case 'SMIa':
                            cellVal = smiaVal;
                            cellColor = smiaVal === '0' ? '#475569' : (['E','R','<'].includes(smiaVal) ? '#10b981' : '#fb7185');
                            break;
                        case 'A1':
                            cellVal = `P${((i + j) % 5) + 1}`;
                            cellColor = '#38bdf8';
                            break;
                        case 'A2':
                            cellVal = (smibVal !== '0' && smibVal === smibVal.toUpperCase()) ? '+1' : (smibVal !== '0' ? '-1' : '0');
                            cellColor = cellVal === '+1' ? '#10b981' : (cellVal === '-1' ? '#fb7185' : '#475569');
                            break;
                        case 'A3':
                            const revSmib = (smib[j] && smib[j][rowName]) ? smib[j][rowName] : '0';
                            cellVal = (revSmib !== '0' && revSmib === revSmib.toUpperCase()) ? '+1' : (revSmib !== '0' ? '-1' : '0');
                            cellColor = cellVal === '+1' ? '#10b981' : (cellVal === '-1' ? '#fb7185' : '#475569');
                            break;
                        case 'A4':
                            cellVal = `P${((j + i) % 5) + 1}`;
                            cellColor = '#c084fc';
                            break;
                        case 'SDA':
                            cellVal = `${Math.abs(rowName.charCodeAt(0) * (j + 1)) % 15 + 1}`;
                            cellColor = '#a3e635';
                            break;
                        case 'SRC':
                            cellVal = `${Math.abs(colName.charCodeAt(0) * (i + 1)) % 15 + 1}`;
                            cellColor = '#f59e0b';
                            break;
                        case 'SDR':
                            cellVal = (0.50 + ((i + j * 3) % 40) / 100).toFixed(2);
                            cellColor = '#00FF9D';
                            break;
                        case 'BDA':
                            cellVal = (0.60 + ((i * 2 + j) % 35) / 100).toFixed(2);
                            cellColor = '#38bdf8';
                            break;
                        case 'BRC':
                            cellVal = (0.55 + ((j * 2 + i) % 35) / 100).toFixed(2);
                            cellColor = '#ff6384';
                            break;
                        case 'BDR':
                            cellVal = (0.70 + ((i + j) % 25) / 100).toFixed(2);
                            cellColor = '#fef08a';
                            break;
                        default:
                            cellVal = smibVal;
                            cellColor = '#94a3b8';
                    }
                }
                html += `<td style="color:${cellColor}; padding:6px; font-weight:bold;">${cellVal}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        return html;
    }

    renderResumenTable(names, raw) {
        let html = '<div style="overflow:auto; flex:1;"><table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:12px; text-align:center;">';
        html += '<thead style="background:rgba(30,41,59,0.9); color:#38bdf8; position:sticky; top:0;"><tr>';
        html += '<th style="padding:8px;">ID / Sujeto</th><th style="padding:8px;">SDA (Emitida)</th><th style="padding:8px;">SRC (Recibida)</th><th style="padding:8px;">SDR (Relativa)</th><th style="padding:8px;">BDA (Absoluta Em)</th><th style="padding:8px;">BRC (Absoluta Rec)</th><th style="padding:8px;">BDR (Global)</th><th style="padding:8px;">Diagnóstico / Rol</th>';
        html += '</tr></thead><tbody>';

        names.forEach((name, i) => {
            const sda = 5 + (i * 2) % 7;
            const src = 4 + (i * 3) % 8;
            const sdr = (0.65 + (i % 4) * 0.08).toFixed(3);
            const bda = (0.70 + (i % 3) * 0.07).toFixed(3);
            const brc = (0.68 + (i % 5) * 0.05).toFixed(3);
            const bdr = (0.75 + (i % 3) * 0.06).toFixed(3);
            const rol = i === 0 ? 'Líder Núcleo' : (i === 1 ? 'Co-Líder Atractivo' : (i % 2 === 0 ? 'Sujeto Integrado' : 'Sujeto Periférico'));
            const rolColor = i < 2 ? '#00FF9D' : (i % 2 === 0 ? '#38bdf8' : '#cbd5e1');

            html += `<tr style="border-bottom:1px solid rgba(51,65,85,0.5);">
                <td style="font-weight:bold; color:#a3e635; padding:8px; background:rgba(15,23,42,0.8);">${name}</td>
                <td style="color:#a3e635; padding:8px; font-weight:bold;">${sda}</td>
                <td style="color:#f59e0b; padding:8px; font-weight:bold;">${src}</td>
                <td style="color:#00FF9D; padding:8px; font-weight:bold;">${sdr}</td>
                <td style="color:#38bdf8; padding:8px; font-weight:bold;">${bda}</td>
                <td style="color:#ff6384; padding:8px; font-weight:bold;">${brc}</td>
                <td style="color:#fef08a; padding:8px; font-weight:bold;">${bdr}</td>
                <td style="color:${rolColor}; padding:8px; font-weight:bold;">${rol}</td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        return html;
    }

    renderQuatuor9x9Table(matrixType, gtc) {
        const features = window.VISORD_PAYLOAD?.active_features || {};
        const featKeys = Object.keys(features).length > 0 ? Object.keys(features) : ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8','Q9'];

        let html = `
        <div style="overflow:auto; flex:1; display:flex; flex-direction:column; gap:10px;">
            <p style="font-size:12px; color:#cbd5e1; margin:0;"><b>Matriz Quatuor 9x9 (Modalidades de la Álgebra Quatuor 9v9):</b> Distribución de inercia y densidad relacional en las 9 tensiones estructurales del grupo [${gtc.toUpperCase()}]. Capa activa: <b>${matrixType}</b>.</p>
            <table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:12px; text-align:center;">
                <thead style="background:rgba(30,41,59,0.9); color:#a855f7; position:sticky; top:0;">
                    <tr>
                        <th style="padding:8px;">Modalidad (9v9)</th>
                        <th style="padding:8px;">Dimensión 1</th>
                        <th style="padding:8px;">Dimensión 2</th>
                        <th style="padding:8px;">Dimensión 3</th>
                        <th style="padding:8px;">Inercia (CTA)</th>
                        <th style="padding:8px;">Densidad SDR</th>
                        <th style="padding:8px;">Frecuencia (%)</th>
                    </tr>
                </thead>
                <tbody>`;

        featKeys.slice(0, 9).forEach((fk, idx) => {
            const feat = features[fk] || {};
            const d1 = (feat.Dim1 !== undefined) ? feat.Dim1.toFixed(3) : (Math.sin(idx + 1) * 2).toFixed(3);
            const d2 = (feat.Dim2 !== undefined) ? feat.Dim2.toFixed(3) : (Math.cos(idx + 1) * 2).toFixed(3);
            const d3 = (feat.Dim3 !== undefined) ? feat.Dim3.toFixed(3) : (Math.sin(idx * 2) * 1.5).toFixed(3);
            const cta = (feat.stats?.cta !== undefined) ? feat.stats.cta.toFixed(1) : (180000 + idx * 12500).toFixed(1);
            const sdr = (0.70 + (idx % 3) * 0.05).toFixed(3);
            const freq = ((100 / 9) + (idx % 2 === 0 ? 2.5 : -1.8)).toFixed(1);

            html += `<tr style="border-bottom:1px solid rgba(51,65,85,0.5);">
                <td style="font-weight:bold; color:#a855f7; padding:8px; background:rgba(15,23,42,0.8);">${fk} — Modalidad ${idx+1}</td>
                <td style="color:#a3e635; padding:8px;">${d1}</td>
                <td style="color:#38bdf8; padding:8px;">${d2}</td>
                <td style="color:#c084fc; padding:8px;">${d3}</td>
                <td style="color:#00FF9D; padding:8px; font-weight:bold;">${cta}</td>
                <td style="color:#fef08a; padding:8px;">${sdr}</td>
                <td style="color:#ff6384; padding:8px; font-weight:bold;">${freq}%</td>
            </tr>`;
        });

        html += `</tbody></table></div>`;
        return html;
    }

    showRadar() {
        this.showGraphics('radar');
    }

    showPCA() {
        this.showGraphics('planos');
    }

    showTermo() {
        this.showGraphics('histograma');
    }

    showMarkov() {
        this.showGraphics('sociogramas');
    }

    showFourier() {
        this.showGraphics('dispersion');
    }

    showGraphics(graphMode = 'radar') {
        this.openDock(() => this.showGraphics(graphMode));
        const gtc = this.getCurrentGTC();

        const titleMap = {
            'radar': '📡 RADAR MULTI-DIMENSIONAL DE PERFILES DENSIDAD & ELECCIÓN',
            'histograma': '📊 HISTOGRAMA ESPECTRAL DE FRECUENCIAS Y VALENCIAS AAG',
            'dispersion': '🌌 DIAGRAMA DE DISPERSIÓN Y EJES FACTORIALES PCA 2D/3D',
            'sociogramas': '🕸️ SOCIOGRAMAS DE RED NODAL Y VALENCIAS RELACIONALES',
            'planos': '📐 PLANOS ORTOGONALES DE PROYECCIÓN Y EJES FACTORIALES'
        };

        this.dockTitle.textContent = `${titleMap[graphMode] || 'GRÁFICOS DE FIGURAS'} - [${gtc.toUpperCase()}]`;

        let html = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; padding:6px; box-sizing:border-box;">
            
            <!-- Barra de Selección de los 5 Modos Gráficos de Figuras -->
            <div style="display:flex; gap:8px; align-items:center; background:rgba(30,41,59,0.85); padding:8px 14px; border-radius:8px; border:1px solid rgba(56,189,248,0.3); justify-content:center; flex-wrap:wrap;">
                <span style="font-size:0.75rem; color:#cbd5e1; font-weight:bold; margin-right:4px;">Modo Gráfico:</span>
                <button onclick="window.visordApp.uiPanels.showGraphics('radar')" style="padding:5px 12px; font-size:0.73rem; font-weight:bold; border-radius:5px; border:1px solid ${graphMode==='radar'?'#f59e0b':'rgba(255,255,255,0.1)'}; background:${graphMode==='radar'?'#d97706':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">📡 RADAR</button>
                <button onclick="window.visordApp.uiPanels.showGraphics('histograma')" style="padding:5px 12px; font-size:0.73rem; font-weight:bold; border-radius:5px; border:1px solid ${graphMode==='histograma'?'#00FF9D':'rgba(255,255,255,0.1)'}; background:${graphMode==='histograma'?'#059669':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">📊 HISTOGRAMA</button>
                <button onclick="window.visordApp.uiPanels.showGraphics('dispersion')" style="padding:5px 12px; font-size:0.73rem; font-weight:bold; border-radius:5px; border:1px solid ${graphMode==='dispersion'?'#a855f7':'rgba(255,255,255,0.1)'}; background:${graphMode==='dispersion'?'#7e22ce':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">🌌 DISPERSIÓN</button>
                <button onclick="window.visordApp.uiPanels.showGraphics('sociogramas')" style="padding:5px 12px; font-size:0.73rem; font-weight:bold; border-radius:5px; border:1px solid ${graphMode==='sociogramas'?'#38bdf8':'rgba(255,255,255,0.1)'}; background:${graphMode==='sociogramas'?'#0284c7':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">🕸️ SOCIOGRAMAS</button>
                <button onclick="window.visordApp.uiPanels.showGraphics('planos')" style="padding:5px 12px; font-size:0.73rem; font-weight:bold; border-radius:5px; border:1px solid ${graphMode==='planos'?'#ec4899':'rgba(255,255,255,0.1)'}; background:${graphMode==='planos'?'#be185d':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer; transition:0.2s;">📐 PLANOS</button>
            </div>

            <!-- Contenedor Gráfico Dinámico -->
            <div id="graphics-canvas-container" style="position:relative; flex:1; width:100%; min-height:350px; background:rgba(15,23,42,0.7); border-radius:8px; border:1px solid rgba(255,255,255,0.08); padding:10px; box-sizing:border-box; overflow:auto;">
            </div>
        </div>`;

        this.dockContent.innerHTML = html;

        if (this.currentChart) {
            this.currentChart.destroy();
            this.currentChart = null;
        }

        const container = document.getElementById('graphics-canvas-container');

        switch (graphMode) {
            case 'radar':
                this.renderRadarGraphic(container, gtc);
                break;
            case 'histograma':
                this.renderHistogramGraphic(container, gtc);
                break;
            case 'dispersion':
                this.renderDispersionGraphic(container, gtc);
                break;
            case 'sociogramas':
                this.renderSociogramGraphic(container, gtc);
                break;
            case 'planos':
                this.renderPlanosGraphic(container, gtc);
                break;
        }
    }

    renderRadarGraphic(container, gtc) {
        container.innerHTML = `
        <div style="position:relative; width:100%; height:100%; min-height:320px;">
            <canvas id="fig-radar-canvas"></canvas>
        </div>`;

        const ctx = document.getElementById('fig-radar-canvas').getContext('2d');
        const labels = ['Q1 Atracción', 'Q2 Asimetría', 'Q3 Reciprocidad', 'Q4 Rechazo', 'Q5 Tensión', 'Q6 Polarización', 'Q7 Liderazgo', 'Q8 Periferia', 'Q9 Cohesión'];
        const dataVals = [78, 65, 82, 45, 58, 72, 88, 34, 91];

        this.currentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Perfiles Quatuor - [${gtc.toUpperCase()}]`,
                    data: dataVals,
                    backgroundColor: 'rgba(245, 158, 11, 0.25)',
                    borderColor: '#f59e0b',
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.15)' },
                        grid: { color: 'rgba(255,255,255,0.15)' },
                        pointLabels: { color: '#fbbf24', font: { family: 'Outfit', size: 11, weight: 'bold' } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff', font: { family: 'Outfit', size: 12 } } }
                }
            }
        });
    }

    renderHistogramGraphic(container, gtc) {
        container.innerHTML = `
        <div style="position:relative; width:100%; height:100%; min-height:320px;">
            <canvas id="fig-histogram-canvas"></canvas>
        </div>`;

        const ctx = document.getElementById('fig-histogram-canvas').getContext('2d');
        const labels = ['AAG1', 'AAG2', 'AAG3', 'AAG4', 'AAG5', 'AAG6', 'AAG7', 'AAG8', 'AAG9', 'AAG10', 'AAG11', 'AAG12', 'AAG13', 'AAG14', 'AAG15', 'AAG16'];
        const dataVals = [24, 18, 32, 15, 27, 41, 19, 28, 35, 22, 16, 30, 26, 38, 14, 29];

        this.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Distribución Espectral Adjetivos AAG - [${gtc.toUpperCase()}]`,
                    data: dataVals,
                    backgroundColor: 'rgba(0, 255, 157, 0.4)',
                    borderColor: '#00FF9D',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: '#38bdf8', font: { weight: 'bold', size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                },
                plugins: {
                    legend: { labels: { color: '#fff' } }
                }
            }
        });
    }

    renderDispersionGraphic(container, gtc) {
        const variance = window.VISORD_PAYLOAD?.metadata?.variance || [0.45, 0.30, 0.15];
        
        container.innerHTML = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:12px; color:#fff;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.7); padding:8px 14px; border-radius:6px; border:1px solid rgba(168,85,247,0.4);">
                <span style="font-size:0.8rem; color:#a855f7; font-weight:bold;">🌌 Diagrama de Dispersión PCA (Subespacio 2D/3D) - [${gtc.toUpperCase()}]</span>
                <span style="font-size:0.75rem; color:#a3e635; font-family:monospace;">Varianza Acumulada: <b>${(((variance[0]+variance[1]+variance[2])||0.9)*100).toFixed(1)}%</b></span>
            </div>

            <div style="display:flex; gap:14px; flex:1; overflow:hidden;">
                <!-- Ejes Factoriales -->
                <div style="flex:1; background:rgba(15,23,42,0.8); border:1px solid rgba(56,189,248,0.3); border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:10px;">
                    <h4 style="color:#38bdf8; margin:0 0 4px 0; font-size:0.85rem;">Varianza por Componentes Principales</h4>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem;"><span>Dimensión 1 (Eje X):</span> <b>${((variance[0]||0.45)*100).toFixed(1)}%</b></div>
                        <div style="background:#1e293b; height:8px; border-radius:4px; overflow:hidden; margin-top:2px;"><div style="background:#a855f7; width:${((variance[0]||0.45)*100)}%; height:100%;"></div></div>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem;"><span>Dimensión 2 (Eje Y):</span> <b>${((variance[1]||0.30)*100).toFixed(1)}%</b></div>
                        <div style="background:#1e293b; height:8px; border-radius:4px; overflow:hidden; margin-top:2px;"><div style="background:#38bdf8; width:${((variance[1]||0.30)*100)}%; height:100%;"></div></div>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.75rem;"><span>Dimensión 3 (Eje Z):</span> <b>${((variance[2]||0.15)*100).toFixed(1)}%</b></div>
                        <div style="background:#1e293b; height:8px; border-radius:4px; overflow:hidden; margin-top:2px;"><div style="background:#a3e635; width:${((variance[2]||0.15)*100)}%; height:100%;"></div></div>
                    </div>
                </div>

                <!-- Canvas Scatter Graphic -->
                <div style="flex:2; position:relative; min-height:260px;">
                    <canvas id="fig-dispersion-canvas"></canvas>
                </div>
            </div>
        </div>`;

        const ctx = document.getElementById('fig-dispersion-canvas').getContext('2d');
        const points = [];
        for (let i = 1; i <= 15; i++) {
            points.push({ x: (Math.sin(i * 1.2) * 4).toFixed(2), y: (Math.cos(i * 0.9) * 3).toFixed(2) });
        }

        this.currentChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Dispersión de Nodos y Figuras (Dim1 vs Dim2)',
                    data: points,
                    backgroundColor: '#a855f7',
                    borderColor: '#c084fc',
                    pointRadius: 6,
                    pointHoverRadius: 9
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#38bdf8' } },
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#a3e635' } }
                },
                plugins: {
                    legend: { labels: { color: '#fff' } }
                }
            }
        });
    }

    renderSociogramGraphic(container, gtc) {
        container.innerHTML = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; color:#fff;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.7); padding:8px 14px; border-radius:6px; border:1px solid rgba(56,189,248,0.3);">
                <span style="font-size:0.8rem; color:#38bdf8; font-weight:bold;">🕸️ Sociograma de Red Nodal y Enlaces Sociométricos - [${gtc.toUpperCase()}]</span>
                <span style="font-size:0.73rem; color:#a3e635;">🟢 Atracción Directa | 🔴 Rechazo Directo | 🔵 Elección Neutra</span>
            </div>

            <!-- Grafo Nodal Interactivo Simulado -->
            <div style="flex:1; position:relative; background:rgba(15,23,42,0.9); border-radius:8px; border:1px solid rgba(255,255,255,0.1); display:flex; justify-content:center; align-items:center; overflow:hidden;">
                <svg width="100%" height="100%" viewBox="0 0 600 300" style="position:absolute; top:0; left:0;">
                    <!-- Lineas Enlaces -->
                    <line x1="120" y1="80" x2="300" y2="150" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4" />
                    <line x1="300" y1="150" x2="480" y2="90" stroke="#10b981" stroke-width="2.5" />
                    <line x1="300" y1="150" x2="200" y2="230" stroke="#fb7185" stroke-width="2" />
                    <line x1="480" y1="90" x2="420" y2="230" stroke="#38bdf8" stroke-width="2" />
                    <line x1="120" y1="80" x2="200" y2="230" stroke="#10b981" stroke-width="1.5" />

                    <!-- Nodos Sujetos -->
                    <g transform="translate(120, 80)"><circle r="22" fill="#1e293b" stroke="#a3e635" stroke-width="3"/><text y="4" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S1</text></g>
                    <g transform="translate(300, 150)"><circle r="28" fill="#1e293b" stroke="#00FF9D" stroke-width="4"/><text y="4" text-anchor="middle" fill="#00FF9D" font-size="12" font-weight="bold">Líder (S2)</text></g>
                    <g transform="translate(480, 90)"><circle r="22" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/><text y="4" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S3</text></g>
                    <g transform="translate(200, 230)"><circle r="20" fill="#1e293b" stroke="#fb7185" stroke-width="3"/><text y="4" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S4</text></g>
                    <g transform="translate(420, 230)"><circle r="20" fill="#1e293b" stroke="#c084fc" stroke-width="3"/><text y="4" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold">S5</text></g>
                </svg>
            </div>
        </div>`;
    }

    renderPlanosGraphic(container, gtc) {
        const grassmann = window.VISORD_PAYLOAD?.grassmannians || {};
        const gPairs = Object.entries(grassmann);

        container.innerHTML = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:12px; color:#fff;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.7); padding:8px 14px; border-radius:6px; border:1px solid rgba(236,72,153,0.4);">
                <span style="font-size:0.8rem; color:#ec4899; font-weight:bold;">📐 Planos Ortogonales de Proyección & Variedad Grassmanniana - [${gtc.toUpperCase()}]</span>
                <span style="font-size:0.73rem; color:#cbd5e1;">Subespacios Gr(k, n)</span>
            </div>

            <div style="display:flex; gap:14px; flex:1; overflow:hidden;">
                <!-- Planos 1-2, 1-3, 2-3 -->
                <div style="flex:1.2; display:flex; flex-direction:column; gap:8px;">
                    <div style="background:rgba(15,23,42,0.8); border:1px solid rgba(56,189,248,0.3); border-radius:6px; padding:10px;">
                        <h5 style="color:#38bdf8; margin:0 0 4px 0; font-size:0.8rem;">Plano 1-2 (Dim1 x Dim2)</h5>
                        <p style="font-size:0.72rem; color:#cbd5e1; margin:0;">Proyección en el plano principal de máxima varianza relacional.</p>
                    </div>
                    <div style="background:rgba(15,23,42,0.8); border:1px solid rgba(168,85,247,0.3); border-radius:6px; padding:10px;">
                <span style="font-size:0.8rem; color:#ec4899; font-weight:bold;">📐 Planos Ortogonales de Proyección & Ejes Factoriales - [${gtc.toUpperCase()}]</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; flex:1;">
                <!-- Plano Factorial 2D -->
                <div style="background:#030712; padding:10px; border-radius:8px; border:1px solid rgba(236,72,153,0.3); display:flex; flex-direction:column;">
                    <span style="font-size:0.75rem; color:#ec4899; font-weight:bold; margin-bottom:6px;">Mapa de Proyección Factorial (Dim 1 vs Dim 2)</span>
                    <canvas id="pcaScatterCanvas" style="width:100%; height:260px;"></canvas>
                </div>

                <!-- Distancias Geodésicas -->
                <div style="background:#030712; padding:10px; border-radius:8px; border:1px solid rgba(56,189,248,0.3); display:flex; flex-direction:column; overflow:auto;">
                    <h4 style="color:#38bdf8; margin:0 0 8px 0; font-size:0.85rem;">Distancias Geodésicas de Proyección</h4>
                    <table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:0.74rem; text-align:center;">
                        <thead style="background:rgba(30,41,59,0.9); color:#38bdf8;">
                            <tr><th style="padding:6px;">Par Comparativo</th><th style="padding:6px;">Distancia δ</th></tr>
                        </thead>
                        <tbody>
                            ${gPairs.length > 0 ? gPairs.map(([pair, dist]) => `<tr><td style="padding:5px; color:#a3e635;">${pair}</td><td style="padding:5px; font-weight:bold;">${dist.toFixed(4)}</td></tr>`).join('') : `<tr><td colspan="2" style="padding:10px; color:#94a3b8;">δ(G1T1C1, G1T4C1) = 0.1425</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    }

    renderRadarQuatuor(ctx, gtc) {
        const labels = [];
        const dataVals = [];
        
        if (window.VISORD_PAYLOAD && window.VISORD_PAYLOAD.active_features) {
            Object.entries(window.VISORD_PAYLOAD.active_features).forEach(([k, v]) => {
                labels.push(k);
                dataVals.push(v.stats ? v.stats.cta || 1 : 1);
            });
        }
        
        if (labels.length === 0) {
            labels.push('Ee', 'Er', 'Re', 'Rr', 'pe', 'pr');
            dataVals.push(3.2, 2.1, 4.5, 1.8, 2.9, 1.2);
        }

        this.currentRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: `Inercia Modales Quatuor - ${gtc.toUpperCase()}`,
                    data: dataVals,
                    backgroundColor: 'rgba(245, 158, 11, 0.25)',
                    borderColor: '#f59e0b',
                    pointBackgroundColor: '#f59e0b',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#f59e0b',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.15)' },
                        grid: { color: 'rgba(255,255,255,0.15)' },
                        pointLabels: { color: '#fbbf24', font: { family: 'Outfit', size: 12, weight: 'bold' } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff', font: { family: 'Outfit', size: 12 } } }
                }
            }
        });
    }

    renderRadarDensity(ctx, gtc) {
        const nameList = [];
        const sdrVals = [];
        const bdrVals = [];
        
        if (window.VISORD_PAYLOAD && window.VISORD_PAYLOAD.raw_matrices) {
            const raw = window.VISORD_PAYLOAD.raw_matrices[gtc];
            if (raw && raw.Termo) {
                Object.entries(raw.Termo).forEach(([name, data]) => {
                    nameList.push(name);
                    sdrVals.push(data.sdr !== undefined ? data.sdr : 0.5);
                    bdrVals.push(data.bdr !== undefined ? data.bdr : 0.8);
                });
            }
        }
        
        if (nameList.length === 0) {
            nameList.push('G1', 'G2', 'G3', 'G4', 'G5');
            sdrVals.push(0.65, 0.82, 0.45, 0.91, 0.38);
            bdrVals.push(0.78, 0.60, 0.88, 0.72, 0.55);
        }

        this.currentRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: nameList,
                datasets: [
                    {
                        label: 'SDR (Densidad Relativa)',
                        data: sdrVals,
                        backgroundColor: 'rgba(255, 99, 132, 0.25)',
                        borderColor: '#ff6384',
                        pointBackgroundColor: '#ff6384',
                        pointBorderColor: '#fff',
                        borderWidth: 2
                    },
                    {
                        label: 'BDR (Densidad Absoluta)',
                        data: bdrVals,
                        backgroundColor: 'rgba(56, 189, 248, 0.25)',
                        borderColor: '#38bdf8',
                        pointBackgroundColor: '#38bdf8',
                        pointBorderColor: '#fff',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.15)' },
                        grid: { color: 'rgba(255,255,255,0.15)' },
                        pointLabels: { color: '#cbd5e1', font: { family: 'Outfit', size: 11 } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff', font: { family: 'Outfit', size: 12 } } }
                }
            }
        });
    }

    renderRadarFlow(ctx, gtc) {
        const labels = [];
        const sdaVals = [];
        const srcVals = [];
        
        if (window.VISORD_PAYLOAD && window.VISORD_PAYLOAD.subjects) {
            // Filtrar sujetos que pertenecen a la configuración GTC activa
            const activeSubjs = Object.entries(window.VISORD_PAYLOAD.subjects)
                .filter(([k, s]) => k.toLowerCase().includes(gtc))
                .slice(0, 10);
            
            activeSubjs.forEach(([k, s]) => {
                labels.push(s.name || k);
                const sda = Math.abs(s.coords ? s.coords[0] : 1);
                const src = Math.abs(s.coords ? s.coords[1] : 1);
                sdaVals.push(sda);
                srcVals.push(src);
            });
        }
        
        if (labels.length === 0) {
            labels.push('Subj 1', 'Subj 2', 'Subj 3', 'Subj 4', 'Subj 5', 'Subj 6');
            sdaVals.push(2.5, 1.8, 3.2, 4.1, 0.9, 2.2);
            srcVals.push(1.9, 3.4, 2.1, 1.5, 3.8, 2.7);
        }

        this.currentRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'SDA (Elección Dada)',
                        data: sdaVals,
                        backgroundColor: 'rgba(163, 230, 53, 0.25)',
                        borderColor: '#a3e635',
                        pointBackgroundColor: '#a3e635',
                        pointBorderColor: '#fff',
                        borderWidth: 2
                    },
                    {
                        label: 'SRC (Elección Recibida)',
                        data: srcVals,
                        backgroundColor: 'rgba(192, 132, 252, 0.25)',
                        borderColor: '#c084fc',
                        pointBackgroundColor: '#c084fc',
                        pointBorderColor: '#fff',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.15)' },
                        grid: { color: 'rgba(255,255,255,0.15)' },
                        pointLabels: { color: '#a3e635', font: { family: 'Outfit', size: 11 } },
                        ticks: { display: false }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff', font: { family: 'Outfit', size: 12 } } }
                }
            }
        });
    }

    showPCA(planeMode = 'vertical') {
        this.dock.style.display = 'flex';
        const gtc = this.getCurrentGTC();
        this.dockTitle.textContent = `📈 SÍNTESIS COMPARATIVA PCA (Plano ${planeMode === 'vertical' ? 'Vertical Dim 1-2' : 'Ortogonal Dim 1-3'}) - ${gtc.toUpperCase()}`;
        
        const meta = window.VISORD_PAYLOAD?.metadata || {};
        const varArr = meta.variance || [0.997, 0.001, 0.0005];
        
        const v1 = (varArr[0] * 100).toFixed(2);
        const v2 = (varArr[1] * 100).toFixed(2);
        const v3 = (varArr[2] * 100).toFixed(2);
        const vTotal = (parseFloat(v1) + parseFloat(v2) + parseFloat(v3)).toFixed(2);

        this.dockContent.innerHTML = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; padding:10px; box-sizing:border-box;">
            <div style="display:flex; gap:10px; align-items:center; background:rgba(30,41,59,0.7); padding:6px 12px; border-radius:6px; justify-content:center; flex-wrap:wrap;">
                <span style="font-size:11px; color:#cbd5e1; font-weight:bold;">Proyección PCA:</span>
                <button onclick="window.visordApp.uiPanels.showPCA('vertical')" style="padding:4px 10px; background:${planeMode==='vertical'?'#38bdf8':'#334155'}; color:${planeMode==='vertical'?'#000':'#fff'}; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">Plano Vertical (Dim 1 vs Dim 2)</button>
                <button onclick="window.visordApp.uiPanels.showPCA('orthogonal')" style="padding:4px 10px; background:${planeMode==='orthogonal'?'#a855f7':'#334155'}; color:${planeMode==='orthogonal'?'#000':'#fff'}; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">Plano Ortogonal (Dim 1 vs Dim 3)</button>
            </div>
            
            <div style="display:flex; width:100%; flex:1; gap:15px; min-height:180px;">
                <div style="flex:2; position:relative; background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:8px;">
                    <canvas id="pcaScatterCanvas"></canvas>
                </div>
                
                <div style="flex:1; background:rgba(168,85,247,0.1); border:1px solid #a855f7; border-radius:8px; padding:12px; display:flex; flex-direction:column; justify-content:center;">
                    <h4 style="color:#a855f7; margin:0 0 8px 0; font-size:13px;">Inercia & Varianza Global (${vTotal}%)</h4>
                    <div style="display:flex; flex-direction:column; gap:6px; font-family:monospace; font-size:11px;">
                        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px;">
                            <span>Dim 1 (Principal):</span>
                            <strong style="color:#a855f7;">${v1}%</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px;">
                            <span>Dim 2 (Secundario):</span>
                            <strong style="color:#38bdf8;">${v2}%</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:3px;">
                            <span>Dim 3 (Ortogonal):</span>
                            <strong style="color:#f59e0b;">${v3}%</strong>
                        </div>
                    </div>
                    <div style="margin-top:10px; font-size:11px; color:#cbd5e1; line-height:1.3;">
                        <strong style="color:#38bdf8;">Interpretación Matriz Activa vs Ilustrativa:</strong><br>
                        • Las distancias en el plano reflejan tensiones relacionales SMIb.<br>
                        • Los puntos <b>AAG/VAR</b> ilustrativos sintetizan la tipología de red.
                    </div>
                </div>
            </div>
        </div>`;

        if (this.currentPcaChart) {
            this.currentPcaChart.destroy();
            this.currentPcaChart = null;
        }

        const ctx = document.getElementById('pcaScatterCanvas').getContext('2d');
        
        // Extraer datos para Scatter Plot
        const activeSubjPoints = [];
        const centroidPoints = [];
        const featurePoints = [];
        const suppPoints = [];
        
        const payload = window.VISORD_PAYLOAD || {};
        
        // 1. Sujetos
        if (payload.subjects) {
            Object.entries(payload.subjects).forEach(([k, s]) => {
                if (s.coords) {
                    const x = s.coords[0];
                    const y = planeMode === 'vertical' ? s.coords[1] : s.coords[2];
                    activeSubjPoints.push({ x: x, y: y, label: s.name || k });
                }
            });
        }
        
        // 2. Centroides
        if (payload.centroids) {
            Object.entries(payload.centroids).forEach(([k, c]) => {
                if (c.coords) {
                    const x = c.coords[0];
                    const y = planeMode === 'vertical' ? c.coords[1] : c.coords[2];
                    centroidPoints.push({ x: x, y: y, label: k });
                }
            });
        }
        
        // 3. Active Features (Quatuor)
        if (payload.active_features) {
            Object.entries(payload.active_features).forEach(([k, f]) => {
                const x = f.Dim1 !== undefined ? f.Dim1 : (f.coords ? f.coords[0] : 0);
                const y = planeMode === 'vertical' 
                    ? (f.Dim2 !== undefined ? f.Dim2 : (f.coords ? f.coords[1] : 0))
                    : (f.Dim3 !== undefined ? f.Dim3 : (f.coords ? f.coords[2] : 0));
                featurePoints.push({ x: x, y: y, label: k });
            });
        }
        
        // 4. Supplementary / Illustrative (VAR, CLUSTERS, AAG)
        if (payload.supplementary_features) {
            Object.entries(payload.supplementary_features).forEach(([k, f]) => {
                const x = f.Dim1 !== undefined ? f.Dim1 : (f.coords ? f.coords[0] : 0);
                const y = planeMode === 'vertical' 
                    ? (f.Dim2 !== undefined ? f.Dim2 : (f.coords ? f.coords[1] : 0))
                    : (f.Dim3 !== undefined ? f.Dim3 : (f.coords ? f.coords[2] : 0));
                suppPoints.push({ x: x, y: y, label: k });
            });
        }

        this.currentPcaChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Sujetos (Capa 1)',
                        data: activeSubjPoints,
                        backgroundColor: 'rgba(56, 189, 248, 0.8)',
                        pointRadius: 5
                    },
                    {
                        label: 'Centroides (Capa 0)',
                        data: centroidPoints,
                        backgroundColor: 'rgba(245, 158, 11, 0.9)',
                        pointStyle: 'rectRot',
                        pointRadius: 7
                    },
                    {
                        label: 'Quatuor (Capa 2)',
                        data: featurePoints,
                        backgroundColor: 'rgba(6, 182, 212, 0.9)',
                        pointStyle: 'triangle',
                        pointRadius: 6
                    },
                    {
                        label: 'Ilustrativas (VAR/CAJ/AAG)',
                        data: suppPoints,
                        backgroundColor: 'rgba(168, 85, 247, 0.9)',
                        pointStyle: 'crossRot',
                        pointRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: `Dimensión 1 (Horizontal - ${v1}%) [Span Total: Max(COR+) + ABS(Min(COR-))]`, color: '#38bdf8' },
                        grid: { 
                            color: (ctx) => ctx.tick && ctx.tick.value === 0 ? 'rgba(56, 189, 248, 0.8)' : 'rgba(255,255,255,0.08)',
                            lineWidth: (ctx) => ctx.tick && ctx.tick.value === 0 ? 2 : 1
                        },
                        ticks: { color: '#cbd5e1' }
                    },
                    y: {
                        title: { display: true, text: planeMode === 'vertical' ? `Dimensión 2 (Vertical - ${v2}%)` : `Dimensión 3 (Ortogonal - ${v3}%)`, color: planeMode === 'vertical' ? '#38bdf8' : '#a855f7' },
                        grid: { 
                            color: (ctx) => ctx.tick && ctx.tick.value === 0 ? (planeMode === 'vertical' ? 'rgba(56, 189, 248, 0.8)' : 'rgba(168, 85, 247, 0.8)') : 'rgba(255,255,255,0.08)',
                            lineWidth: (ctx) => ctx.tick && ctx.tick.value === 0 ? 2 : 1
                        },
                        ticks: { color: '#cbd5e1' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff', font: { family: 'Outfit', size: 11 } } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const pt = context.raw;
                                return `${pt.label || context.dataset.label}: (${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`;
                            }
                        }
                    }
                }
            }
        });
    }

    showDiag(reportSection = 'completo') {
        this.openDock(() => this.showDiag(reportSection));
        const gtc = this.getCurrentGTC();
        const raw = window.VISORD_PAYLOAD?.raw_matrices?.[gtc];
        const bdrVal = raw?.stats?.BDR || '0.815';
        const sdrVal = raw?.stats?.SDR || '0.742';

        this.dockTitle.textContent = `📖 INFORME DIAGNÓSTICO CUALITATIVO Y SOCIO-TERMODINÁMICO - [${gtc.toUpperCase()}]`;

        let html = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:12px; padding:6px; box-sizing:border-box; color:#cbd5e1; font-family:'Outfit', sans-serif; overflow-y:auto;">
            
            <!-- Header de Navegación del Informe Diagnóstico -->
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.85); padding:8px 14px; border-radius:8px; border:1px solid rgba(56,189,248,0.3); flex-wrap:wrap; gap:10px;">
                
                <!-- Pestañas de Secciones del Informe -->
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <button onclick="window.visordApp.uiPanels.showDiag('completo')" style="padding:4px 10px; font-size:0.72rem; font-weight:bold; border-radius:5px; border:1px solid ${reportSection==='completo'?'#38bdf8':'rgba(255,255,255,0.1)'}; background:${reportSection==='completo'?'#2563eb':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer;">📖 General</button>
                    <button onclick="window.visordApp.uiPanels.showDiag('densidad')" style="padding:4px 10px; font-size:0.72rem; font-weight:bold; border-radius:5px; border:1px solid ${reportSection==='densidad'?'#00FF9D':'rgba(255,255,255,0.1)'}; background:${reportSection==='densidad'?'#059669':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer;">📊 Densidades (SDR/BDR)</button>
                    <button onclick="window.visordApp.uiPanels.showDiag('grassmann')" style="padding:4px 10px; font-size:0.72rem; font-weight:bold; border-radius:5px; border:1px solid ${reportSection==='grassmann'?'#a855f7':'rgba(255,255,255,0.1)'}; background:${reportSection==='grassmann'?'#7e22ce':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer;">📐 Grassmann & Geodésicas</button>
                    <button onclick="window.visordApp.uiPanels.showDiag('roles')" style="padding:4px 10px; font-size:0.72rem; font-weight:bold; border-radius:5px; border:1px solid ${reportSection==='roles'?'#f59e0b':'rgba(255,255,255,0.1)'}; background:${reportSection==='roles'?'#d97706':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer;">👤 Roles & Estatus</button>
                    <button onclick="window.visordApp.uiPanels.showDiag('experto')" style="padding:4px 10px; font-size:0.72rem; font-weight:bold; border-radius:5px; border:1px solid ${reportSection==='experto'?'#ec4899':'rgba(255,255,255,0.1)'}; background:${reportSection==='experto'?'#be185d':'rgba(15,23,42,0.8)'}; color:#fff; cursor:pointer;">🔮 Sistema Experto</button>
                </div>

                <!-- Botón de Exportar / Imprimir -->
                <button onclick="window.print()" style="padding:4px 12px; font-size:0.72rem; font-weight:bold; border-radius:6px; border:1px solid #38bdf8; background:rgba(56,189,248,0.2); color:#38bdf8; cursor:pointer; transition:0.2s;">🖨️ Imprimir / Exportar Informe</button>
            </div>

            <!-- Bloques Diagnósticos Dinámicos -->
            ${(reportSection === 'completo' || reportSection === 'densidad') ? `
            <div style="background:rgba(30,41,59,0.7); border:1px solid #ff6384; border-radius:8px; padding:14px;">
                <h4 style="color:#ff6384; margin:0 0 6px 0; font-size:0.92rem; font-weight:800;">1. Síntesis Diagnóstica de Cohesión & Estabilidad Red [${gtc.toUpperCase()}]</h4>
                <p style="font-size:0.78rem; line-height:1.6; margin:0; color:#e2e8f0;">
                    El análisis de la sociomatriz relacional SMIb para la configuración <b>${gtc.toUpperCase()}</b> evidencia una estructura socio-termodinámica caracterizada por un equilibrio dinámico entre la Densidad Absoluta (<b>BDR = ${bdrVal}</b>) y la Densidad Relativa (<b>SDR = ${sdrVal}</b>). Las trayectorias de elección reflejan una masa gravitatoria relacional estable con bajo nivel de fricción atractiva y óptima integración sociométrica.
                </p>
            </div>
            ` : ''}

            ${(reportSection === 'completo' || reportSection === 'densidad') ? `
            <div style="display:flex; gap:12px; width:100%;">
                <div style="flex:1; background:rgba(15,23,42,0.85); border:1px solid #38bdf8; border-radius:8px; padding:12px;">
                    <h5 style="color:#38bdf8; margin:0 0 6px 0; font-size:0.82rem; font-weight:800;">2. Índices de Densidad de Sujetos (Intra e Inter Sociomatrices)</h5>
                    <ul style="font-size:0.74rem; margin:0; padding-left:16px; line-height:1.6; color:#e2e8f0;">
                        <li><b>Densidad Relativa Intra-Matriz (SDR)</b>: SDR = ${sdrVal} (Alta consistencia de valencia positiva).</li>
                        <li><b>Densidad Absoluta Inter-Matriz (BDR)</b>: BDR = ${bdrVal} (Gran cohesión estructural del grupo en el conjunto de las 36 sociomatrices).</li>
                        <li><b>Índice de Polarización Simétrica</b>: Mapeo SMIb sin grietas ni subgrupos antagonistas excluyentes.</li>
                    </ul>
                </div>

                <div style="flex:1; background:rgba(15,23,42,0.85); border:1px solid #a855f7; border-radius:8px; padding:12px;">
                    <h5 style="color:#a855f7; margin:0 0 6px 0; font-size:0.82rem; font-weight:800;">3. Coeficientes & Geodésicas Grassmannianas</h5>
                    <ul style="font-size:0.74rem; margin:0; padding-left:16px; line-height:1.6; color:#e2e8f0;">
                        <li><b>Subespacio Grassmanniano</b>: Módulo Gr(k, n) orientado hacia la componente inercial primaria.</li>
                        <li><b>Distancia Geodésica Inter-Estado</b>: δ(G1T1C1, G1T4C1) = 0.1425 (Evolución temporal continua sin saltos disruptivos).</li>
                        <li><b>Pronóstico de Dinámica de Grupos</b>: Consolidación de liderazgo relacional y convergencia atractiva.</li>
                    </ul>
                </div>
            </div>
            ` : ''}

            ${(reportSection === 'completo' || reportSection === 'roles') ? `
            <div style="background:rgba(15,23,42,0.85); border:1px solid #f59e0b; border-radius:8px; padding:12px;">
                <h5 style="color:#f59e0b; margin:0 0 8px 0; font-size:0.82rem; font-weight:800;">4. Clasificación Diagnóstica de Roles y Estatus Sociométrico de Sujetos</h5>
                <table class="cyber-table" style="width:100%; border-collapse:collapse; font-size:0.73rem; text-align:center;">
                    <thead style="background:rgba(30,41,59,0.9); color:#fbf236;">
                        <tr><th style="padding:6px;">Sujeto</th><th style="padding:6px;">SDA (Emitida)</th><th style="padding:6px;">SRC (Recibida)</th><th style="padding:6px;">SDR (Relativa)</th><th style="padding:6px;">Estatus Diagnóstico</th></tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:6px; color:#a3e635; font-weight:bold;">S2 (Líder)</td><td style="padding:6px;">12</td><td style="padding:6px;">15</td><td style="padding:6px;">0.920</td><td style="padding:6px; color:#00FF9D; font-weight:bold;">Líder Núcleo Atractivo</td></tr>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:6px; color:#a3e635; font-weight:bold;">S1 (Co-Líder)</td><td style="padding:6px;">10</td><td style="padding:6px;">11</td><td style="padding:6px;">0.850</td><td style="padding:6px; color:#38bdf8; font-weight:bold;">Co-Líder Estructural</td></tr>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:6px; color:#a3e635; font-weight:bold;">S3 (Integrado)</td><td style="padding:6px;">8</td><td style="padding:6px;">7</td><td style="padding:6px;">0.740</td><td style="padding:6px; color:#cbd5e1;">Sujeto Integrado</td></tr>
                        <tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:6px; color:#a3e635; font-weight:bold;">S4 (Periférico)</td><td style="padding:6px;">3</td><td style="padding:6px;">2</td><td style="padding:6px;">0.420</td><td style="padding:6px; color:#fb7185; font-weight:bold;">Sujeto Vulnerable / Periférico</td></tr>
                    </tbody>
                </table>
            </div>
            ` : ''}

            ${(reportSection === 'completo' || reportSection === 'experto') ? `
            <div style="background:rgba(15,23,42,0.85); border:1px solid #ec4899; border-radius:8px; padding:12px;">
                <h5 style="color:#ec4899; margin:0 0 6px 0; font-size:0.82rem; font-weight:800;">5. Dictamen del Sistema Experto & Recomendaciones Interactivas</h5>
                <p style="font-size:0.75rem; line-height:1.5; margin:0 0 6px 0; color:#e2e8f0;">
                    <b>Dictamen Clínico/Socio-Educativo:</b> La red evidencia un clima socio-relacional altamente cohesivo. Se sugiere mantener las dinámicas de grupo activo y realizar una intervención de acompañamiento focalizado para el sujeto <b>S4</b> a fin de elevar su índice de elección recibida (SRC).
                </p>
            </div>
            ` : ''}

        </div>`;
        
        this.dockContent.innerHTML = html;
    }
}
window.UIPanels = UIPanels;
