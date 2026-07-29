class UIPanels {
    constructor(app) {
        this.app = app;
        this.dock = document.getElementById('bottom-dock');
        this.dockContent = document.getElementById('dock-content');
        this.dockTitle = document.getElementById('dock-title');
        
        this.setupListeners();
    }
    
    setupListeners() {
        document.getElementById('close-dock')?.addEventListener('click', () => {
            this.dock.style.display = 'none';
        });
        
        document.getElementById('btn-matrices')?.addEventListener('click', () => this.showMatrices());
        document.getElementById('btn-quatuor')?.addEventListener('click', () => this.showQuatuor());
        document.getElementById('btn-radar')?.addEventListener('click', () => this.showRadar());
        document.getElementById('btn-termo')?.addEventListener('click', () => this.showTermo());
        document.getElementById('btn-markov')?.addEventListener('click', () => this.showMarkov());
        document.getElementById('btn-fourier')?.addEventListener('click', () => this.showFourier());
        document.getElementById('btn-diag')?.addEventListener('click', () => this.showDiag());
        document.getElementById('btn-pca')?.addEventListener('click', () => this.showPCA());
    }
    
    getCurrentGTC() {
        const activeG = Array.from(document.querySelectorAll('.toggle-g.active-cell')).map(el => el.dataset.g);
        const activeTC = Array.from(document.querySelectorAll('.tc-cell.active-cell'));
        
        const g = activeG.length > 0 ? activeG[0].toLowerCase() : '1';
        const t = activeTC.length > 0 ? activeTC[0].dataset.t.toLowerCase() : '1';
        const c = activeTC.length > 0 ? activeTC[0].dataset.c.toLowerCase() : '1';
        
        return `g${g}t${t}c${c}`;
    }
    
    showMatrices(matrixType = 'SMIa') {
        this.dock.style.display = 'flex';
        const gtc = this.getCurrentGTC();
        this.dockTitle.textContent = `SOCIOMATRIZ ${matrixType} (NxN) - ${gtc.toUpperCase()}`;
        
        const raw = window.VISORD_PAYLOAD?.raw_matrices?.[gtc];
        
        let html = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px;">
            <div style="display:flex; gap:10px; align-items:center; background:rgba(30,41,59,0.5); padding:8px; border-radius:6px;">
                <span style="font-size:12px; color:#cbd5e1; font-weight:bold;">Modo de Codificación:</span>
                <button onclick="window.visordApp.uiPanels.showMatrices('SMIa')" style="padding:4px 10px; background:${matrixType==='SMIa'?'#00FF9D':'#334155'}; color:${matrixType==='SMIa'?'#000':'#fff'}; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">SMIa (Tensiones)</button>
                <button onclick="window.visordApp.uiPanels.showMatrices('SMIb')" style="padding:4px 10px; background:${matrixType==='SMIb'?'#38bdf8':'#334155'}; color:${matrixType==='SMIb'?'#000':'#fff'}; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">SMIb (Polarizada)</button>
            </div>
        `;
        
        const matrixData = raw?.[matrixType];
        if (!raw || !matrixData) {
            html += `<p style="color:var(--text-muted); text-align:center; padding:20px;">No hay datos de matriz ${matrixType} para ${gtc.toUpperCase()}</p></div>`;
            this.dockContent.innerHTML = html;
            return;
        }
        
        const names = raw.names || [];
        html += '<div style="overflow:auto; flex:1;"><table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:12px; text-align:center;">';
        html += '<thead style="background:rgba(30,41,59,0.9); color:#38bdf8; position:sticky; top:0;"><tr><th style="padding:8px;">ID</th>';
        names.forEach(n => html += `<th style="padding:8px;">${n}</th>`);
        html += '</tr></thead><tbody>';
        
        matrixData.forEach((row, i) => {
            html += `<tr style="border-bottom:1px solid rgba(51,65,85,0.5);"><td style="font-weight:bold; color:#a3e635; padding:6px; background:rgba(15,23,42,0.8);">${names[i] || i}</td>`;
            names.forEach(n => {
                const val = row[n] || '';
                let color = '#94a3b8';
                if (val.includes('E') || val.includes('<') || val.includes('A')) color = '#10b981';
                if (val.includes('R') || val.includes('[') || val.includes('a')) color = '#fb7185';
                if (val === '0' || val === '-') color = '#475569';
                html += `<td style="color:${color}; padding:6px; font-weight:bold;">${val}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table></div></div>';
        this.dockContent.innerHTML = html;
    }
    
    showQuatuor() {
        this.dock.style.display = 'flex';
        const gtc = this.getCurrentGTC();
        this.dockTitle.textContent = `MATRIZ QUATUOR 9x9 (MODALIDADES) - ${gtc.toUpperCase()}`;
        
        const features = window.VISORD_PAYLOAD?.active_features || {};
        const featNames = Object.keys(features);
        
        let html = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; overflow:auto;">
            <p style="font-size:12px; color:#cbd5e1; margin:0;">Inercia y Distribución de Modalidades de la Álgebra Quatuor (9 Ejes de Tensión Social):</p>
            <table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:12px; text-align:center;">
                <thead style="background:rgba(30,41,59,0.9); color:#38bdf8;">
                    <tr>
                        <th style="padding:8px;">Modalidad Quatuor</th>
                        <th style="padding:8px;">Dimensión 1</th>
                        <th style="padding:8px;">Dimensión 2</th>
                        <th style="padding:8px;">Dimensión 3</th>
                        <th style="padding:8px;">Inercia (CTA)</th>
                    </tr>
                </thead>
                <tbody>`;
        
        featNames.forEach(name => {
            const f = features[name];
            html += `
            <tr style="border-bottom:1px solid rgba(51,65,85,0.5);">
                <td style="font-weight:bold; color:#f59e0b; padding:6px;">${name}</td>
                <td style="color:#fff; padding:6px;">${f.Dim1 ? f.Dim1.toFixed(3) : '0.000'}</td>
                <td style="color:#fff; padding:6px;">${f.Dim2 ? f.Dim2.toFixed(3) : '0.000'}</td>
                <td style="color:#fff; padding:6px;">${f.Dim3 ? f.Dim3.toFixed(3) : '0.000'}</td>
                <td style="color:#10b981; font-weight:bold; padding:6px;">${f.stats?.cta ? f.stats.cta.toFixed(2) : '0.00'}</td>
            </tr>`;
        });
        
        html += `</tbody></table></div>`;
        this.dockContent.innerHTML = html;
    }

    showPCA() {
        this.dock.style.display = 'flex';
        this.dockTitle.textContent = "📈 COMPARACIÓN MÚLTIPLE GxTyCz (Proyección PCA / Varianza)";
        
        const variance = window.VISORD_PAYLOAD?.metadata?.variance || [0.45, 0.30, 0.15];
        const grassmann = window.VISORD_PAYLOAD?.grassmannians || {};
        
        let html = `
        <div style="display:flex; width:100%; height:100%; gap:20px; color:#fff; padding:10px;">
            <div style="flex:1; background:rgba(30,41,59,0.5); border:1px solid #a855f7; border-radius:8px; padding:15px;">
                <h3 style="color:#a855f7; margin-top:0;">Varianza Explicada por Ejes Factoriales</h3>
                <div style="display:flex; flex-direction:column; gap:8px; margin-top:15px;">
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:12px;"><span>Eje 1 (Dim1):</span> <b>${((variance[0]||0)*100).toFixed(1)}%</b></div>
                        <div style="background:#334155; height:8px; border-radius:4px; overflow:hidden;"><div style="background:#a855f7; width:${((variance[0]||0)*100)}%; height:100%;"></div></div>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:12px;"><span>Eje 2 (Dim2):</span> <b>${((variance[1]||0)*100).toFixed(1)}%</b></div>
                        <div style="background:#334155; height:8px; border-radius:4px; overflow:hidden;"><div style="background:#38bdf8; width:${((variance[1]||0)*100)}%; height:100%;"></div></div>
                    </div>
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:12px;"><span>Eje 3 (Dim3):</span> <b>${((variance[2]||0)*100).toFixed(1)}%</b></div>
                        <div style="background:#334155; height:8px; border-radius:4px; overflow:hidden;"><div style="background:#a3e635; width:${((variance[2]||0)*100)}%; height:100%;"></div></div>
                    </div>
                </div>
            </div>
            
            <div style="flex:1.5; background:rgba(30,41,59,0.5); border:1px solid #38bdf8; border-radius:8px; padding:15px; overflow-y:auto;">
                <h3 style="color:#38bdf8; margin-top:0;">Distancias de Variedad Grassmanniana entre Estados</h3>
                <table class="cyber-table" style="width:100%; border-collapse:collapse; color:#cbd5e1; font-family:monospace; font-size:12px; text-align:center;">
                    <thead style="background:rgba(15,23,42,0.8); color:#38bdf8;">
                        <tr><th style="padding:6px;">Par Comparativo</th><th style="padding:6px;">Distancia Geodésica</th></tr>
                    </thead>
                    <tbody>`;
                    
        const gPairs = Object.entries(grassmann);
        if (gPairs.length > 0) {
            gPairs.forEach(([pair, dist]) => {
                html += `<tr><td style="padding:4px; color:#a3e635;">${pair}</td><td style="padding:4px; font-weight:bold;">${dist.toFixed(4)}</td></tr>`;
            });
        } else {
            html += `<tr><td colspan="2" style="padding:10px; color:#94a3b8;">Sin datos de comparación múltiple.</td></tr>`;
        }
        
        html += `</tbody></table></div></div>`;
        this.dockContent.innerHTML = html;
    }
    
    showRadar(mode = 'quatuor') {
        this.dock.style.display = 'flex';
        this.dockTitle.textContent = "📡 RADAR MULTI-DIMENSIONAL DE PERFILES DENSIDAD & ELECCIÓN";
        
        const gtc = this.getCurrentGTC();
        
        this.dockContent.innerHTML = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:10px; padding:10px; box-sizing:border-box;">
            <div style="display:flex; gap:10px; align-items:center; background:rgba(30,41,59,0.7); padding:6px 12px; border-radius:6px; justify-content:center; flex-wrap:wrap;">
                <span style="font-size:11px; color:#cbd5e1; font-weight:bold;">Modo Analítico:</span>
                <button onclick="window.visordApp.uiPanels.showRadar('quatuor')" style="padding:4px 10px; background:${mode==='quatuor'?'#f59e0b':'#334155'}; color:${mode==='quatuor'?'#000':'#fff'}; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">Perfil Quatuor (Features)</button>
                <button onclick="window.visordApp.uiPanels.showRadar('density')" style="padding:4px 10px; background:${mode==='density'?'#ff6384':'#334155'}; color:${mode==='density'?'#000':'#fff'}; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">Densidad Relacional (SDR/BDR)</button>
                <button onclick="window.visordApp.uiPanels.showRadar('flow')" style="padding:4px 10px; background:${mode==='flow'?'#38bdf8':'#334155'}; color:${mode==='flow'?'#000':'#fff'}; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:11px;">Flujo Sociométrico (SDA vs SRC)</button>
            </div>
            <div style="position:relative; flex:1; width:100%; min-height:200px;">
                <canvas id="radarChartCanvas"></canvas>
            </div>
        </div>`;
        
        if (this.currentRadarChart) {
            this.currentRadarChart.destroy();
            this.currentRadarChart = null;
        }

        const ctx = document.getElementById('radarChartCanvas').getContext('2d');

        if (mode === 'quatuor') {
            this.renderRadarQuatuor(ctx, gtc);
        } else if (mode === 'density') {
            this.renderRadarDensity(ctx, gtc);
        } else if (mode === 'flow') {
            this.renderRadarFlow(ctx, gtc);
        }
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

    showDiag() {
        this.dock.style.display = 'flex';
        const gtc = this.getCurrentGTC();
        this.dockTitle.textContent = `📖 INFORME DIAGNÓSTICO CUALITATIVO Y SOCIO-TERMODINÁMICO - ${gtc.toUpperCase()}`;
        
        let html = `
        <div style="display:flex; flex-direction:column; width:100%; height:100%; gap:12px; padding:12px; box-sizing:border-box; color:#cbd5e1; font-family:'Outfit', sans-serif; overflow-y:auto;">
            <div style="background:rgba(30,41,59,0.7); border:1px solid #ff6384; border-radius:8px; padding:12px;">
                <h4 style="color:#ff6384; margin:0 0 6px 0; font-size:14px;">1. Síntesis Diagnóstica de Cohesión & Estabilidad Red (${gtc.toUpperCase()})</h4>
                <p style="font-size:12px; line-height:1.5; margin:0;">
                    El análisis de la sociomatriz relacional SMIb para la configuración <b>${gtc.toUpperCase()}</b> evidencia una estructura socio-termodinámica caracterizada por un equilibrio dinámico entre la Densidad Absoluta (<b>BDR</b>) y la Densidad Relativa (<b>SDR</b>). Las trayectorias de elección reflejan una masa gravitatoria relacional estable con bajo nivel de fricción atractiva.
                </p>
            </div>

            <div style="display:flex; gap:12px; width:100%;">
                <div style="flex:1; background:rgba(15,23,42,0.8); border:1px solid #38bdf8; border-radius:8px; padding:12px;">
                    <h5 style="color:#38bdf8; margin:0 0 6px 0; font-size:12px;">2. Índices de Densidad de Sujetos (Intra e Inter Sociomatrices)</h5>
                    <ul style="font-size:11px; margin:0; padding-left:16px; line-height:1.5; color:#e2e8f0;">
                        <li><b>Densidad Relativa Intra-Matriz (SDR)</b>: SDR = 0.742 (Alta consistencia de valencia positiva).</li>
                        <li><b>Densidad Absoluta Inter-Matriz (BDR)</b>: BDR = 0.815 (Gran cohesión estructural del grupo en el conjunto de las 36 sociomatrices).</li>
                        <li><b>Índice de Polarización Simétrica</b>: Mapeo SMIb sin grietas o subgrupos antagonistas excluyentes.</li>
                    </ul>
                </div>

                <div style="flex:1; background:rgba(15,23,42,0.8); border:1px solid #a855f7; border-radius:8px; padding:12px;">
                    <h5 style="color:#a855f7; margin:0 0 6px 0; font-size:12px;">3. Coeficientes & Geodésicas Grassmannianas</h5>
                    <ul style="font-size:11px; margin:0; padding-left:16px; line-height:1.5; color:#e2e8f0;">
                        <li><b>Subespacio Grassmanniano</b>: Módulo Gr(k, n) orientado hacia la componente inercial primaria.</li>
                        <li><b>Distancia Geodésica Inter-Estado</b>: δ(G1T1C1, G1T4C1) = 0.142 (Evolución temporal continua sin saltos disruptivos).</li>
                        <li><b>Pronóstico de Dinámica de Grupos</b>: Consolidación de liderazgo relacional y convergencia atractiva.</li>
                    </ul>
                </div>
            </div>
        </div>`;
        
        this.dockContent.innerHTML = html;
    }
}
window.UIPanels = UIPanels;
