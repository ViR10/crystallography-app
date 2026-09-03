import React, { useState } from 'react';
import { CrystalCanvas } from '../3d/CrystalCanvas';
import { parseFrac, directionFromPoints, toFracStr } from '../../utils/mathUtils';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

interface ExpertSandboxProps {
  onBack?: () => void;
  track?: 'directions' | 'planes';
}

export const ExpertSandbox: React.FC<ExpertSandboxProps> = ({ onBack, track }) => {
  const [activeModule, setActiveModule] = useState<'planes' | 'directions'>(track || 'planes');
  
  // Planes state
  const [planeTab, setPlaneTab] = useState<'draw' | 'compute'>('draw');
  const [ph, setPh] = useState('0');
  const [pk, setPk] = useState('0');
  const [pl, setPl] = useState('1');
  const [pp, setPp] = useState('');
  const [pq, setPq] = useState('');
  const [pr, setPr] = useState('1');
  const [planeExplanation, setPlaneExplanation] = useState<string>('');

  // Directions state
  const [dirTab, setDirTab] = useState<'draw' | 'compute'>('draw');
  const [du, setDu] = useState('1');
  const [dv, setDv] = useState('1');
  const [dw, setDw] = useState('0');
  const [dox, setDox] = useState('');
  const [doy, setDoy] = useState('');
  const [doz, setDoz] = useState('');
  const [dirExplanation, setDirExplanation] = useState<string>('');
  const [animKey, setAnimKey] = useState<number>(0);

  // Compute direction state
  const [tx, setTx] = useState('');
  const [ty, setTy] = useState('');
  const [tz, setTz] = useState('');
  const [hx, setHx] = useState('');
  const [hy, setHy] = useState('');
  const [hz, setHz] = useState('');
  
  const [intMode, setIntMode] = useState<'tail' | 'head'>('tail');
  const [intTail, setIntTail] = useState<{ x: number, y: number, z: number } | null>(null);
  const [intHead, setIntHead] = useState<{ x: number, y: number, z: number } | null>(null);

  // General state
  const [rotY, setRotY] = useState(0);

  // Derived values for the canvas
  const displayH = parseFrac(ph) || 0;
  const displayK = parseFrac(pk) || 0;
  const displayL = parseFrac(pl) || 0;
  
  const displayU = parseFrac(du) || 0;
  const displayV = parseFrac(dv) || 0;
  const displayW = parseFrac(dw) || 0;
  
  const displayOx = dox.trim() ? (parseFrac(dox) || 0) : null;
  const displayOy = doy.trim() ? (parseFrac(doy) || 0) : null;
  const displayOz = doz.trim() ? (parseFrac(doz) || 0) : null;

  const [currentIntercepts, setCurrentIntercepts] = useState<string>('∞, ∞, 1');
  const [currentIndices, setCurrentIndices] = useState<string>('(001)');

  const handlePlaneDraw = () => {
    let h = parseFrac(ph) || 0;
    let k = parseFrac(pk) || 0;
    let l = parseFrac(pl) || 0;
    
    setPlaneExplanation(
      `<div class="step" data-step="1"><strong>Input:</strong> Miller indices (hkl) = (${h} ${k} ${l})</div>` +
      `<div class="step" data-step="2"><strong>Reciprocals (Intercepts):</strong> p = ${h===0 ? '∞' : '1/'+h}, q = ${k===0 ? '∞' : '1/'+k}, r = ${l===0 ? '∞' : '1/'+l}</div>` +
      `<div class="step" data-step="3"><strong>Action:</strong> Plotting intercepts on axes and connecting to form plane.</div>`
    );
  };

  const handlePlaneCompute = () => {
    let p = parseFrac(pp);
    let q = parseFrac(pq);
    let r = parseFrac(pr);

    if (isNaN(p) || pp === '' || pp.toLowerCase() === 'inf') p = Infinity;
    if (isNaN(q) || pq === '' || pq.toLowerCase() === 'inf') q = Infinity;
    if (isNaN(r) || pr === '' || pr.toLowerCase() === 'inf') r = Infinity;

    let h = p === Infinity || p === 0 ? 0 : 1 / p;
    let k = q === Infinity || q === 0 ? 0 : 1 / q;
    let l = r === Infinity || r === 0 ? 0 : 1 / r;

    // Clear fractions (simple implementation)
    const factor = 12; // A common multiple for standard inputs to make them integers
    h = Math.round(h * factor);
    k = Math.round(k * factor);
    l = Math.round(l * factor);
    
    // Reduce logic would go here
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const d1 = gcd(Math.abs(h), Math.abs(k));
    const d2 = gcd(d1, Math.abs(l));
    if (d2 > 0) {
      h /= d2; k /= d2; l /= d2;
    }

    setPh(h.toString());
    setPk(k.toString());
    setPl(l.toString());
    
    setPlaneExplanation(
      `<div class="step" data-step="1"><strong>Intercepts:</strong> p=${p===Infinity?'∞':p}, q=${q===Infinity?'∞':q}, r=${r===Infinity?'∞':r}</div>` +
      `<div class="step" data-step="2"><strong>Reciprocals:</strong> h'=${h===0?'0':(1/p).toFixed(2)}, k'=${k===0?'0':(1/q).toFixed(2)}, l'=${l===0?'0':(1/r).toFixed(2)}</div>` +
      `<div class="step" data-step="3"><strong>Clear Fractions:</strong> Multiplied to smallest integers -> (${h} ${k} ${l})</div>`
    );
  };

  const handleDirDraw = () => {
    let u = parseFrac(du) || 0;
    let v = parseFrac(dv) || 0;
    let w = parseFrac(dw) || 0;
    
    // Check for origin inputs
    const oxStr = dox.trim();
    const oyStr = doy.trim();
    const ozStr = doz.trim();
    const hasOx = oxStr !== '';
    const hasOy = oyStr !== '';
    const hasOz = ozStr !== '';
    
    let ox = hasOx ? parseFrac(dox) || 0 : null;
    let oy = hasOy ? parseFrac(doy) || 0 : null;
    let oz = hasOz ? parseFrac(doz) || 0 : null;

    if (u === 0 && v === 0 && w === 0) {
      setDirExplanation('<span style="color:var(--error)">Indices cannot all be zero.</span>');
      return;
    }
    
    // Determine coords exactly as drawingUtils does for text output
    let tail, head;
    if (ox !== null && oy !== null && oz !== null) {
      let dx = u, dy = v, dz = w;
      const maxAbs = Math.max(Math.abs(u), Math.abs(v), Math.abs(w));
      if (maxAbs > 0) {
        dx = u / maxAbs; dy = v / maxAbs; dz = w / maxAbs;
      }
      let t = 1.0;
      if (dx > 0 && ox + dx * t > 1) t = (1 - ox) / dx;
      if (dx < 0 && ox + dx * t < 0) t = (0 - ox) / dx;
      if (dy > 0 && oy + dy * t > 1) t = (1 - oy) / dy;
      if (dy < 0 && oy + dy * t < 0) t = (0 - oy) / dy;
      if (dz > 0 && oz + dz * t > 1) t = (1 - oz) / dz;
      if (dz < 0 && oz + dz * t < 0) t = (0 - oz) / dz;
      t = Math.max(0, t);
      
      tail = { x: ox, y: oy, z: oz };
      head = { x: ox + dx * t, y: oy + dy * t, z: oz + dz * t };
    } else {
      const maxAbs = Math.max(Math.abs(u), Math.abs(v), Math.abs(w));
      const dx = u / maxAbs, dy = v / maxAbs, dz = w / maxAbs;
      const tx = u < 0 ? 1 : 0, ty = v < 0 ? 1 : 0, tz = w < 0 ? 1 : 0;
      tail = { x: tx, y: ty, z: tz };
      head = { x: tx + dx, y: ty + dy, z: tz + dz };
    }

    const fmt = (val: number) => isNaN(val) ? "" : toFracStr(val);
    const formatUVW = (a: string, b: string, c: string) => `[${a} ${b} ${c}]`;
    
    setAnimKey(prev => prev + 1);
    setDirExplanation(
      `<div class="step" data-step="1">Given [uvw] = ${formatUVW(fmt(u), fmt(v), fmt(w))}</div>` +
      `<div class="step" data-step="2">Vector <strong>d</strong> = ${fmt(u)}<strong>x̂</strong> + ${fmt(v)}<strong>ŷ</strong> + ${fmt(w)}<strong>ẑ</strong></div>` +
      `<div class="step" data-step="3">Custom origin parsed and applied if provided.</div>` +
      `<div class="step" data-step="4">Tail at (${fmt(tail.x)}, ${fmt(tail.y)}, ${fmt(tail.z)}), Head at (${fmt(head.x)}, ${fmt(head.y)}, ${fmt(head.z)})</div>` +
      `<div class="step" data-step="5">The arrow represents the ${formatUVW(fmt(u), fmt(v), fmt(w))} direction</div>`
    );
  };

  const handleDirCompute = () => {
    const p1x = parseFrac(tx) || 0;
    const p1y = parseFrac(ty) || 0;
    const p1z = parseFrac(tz) || 0;
    const p2x = parseFrac(hx) || 0;
    const p2y = parseFrac(hy) || 0;
    const p2z = parseFrac(hz) || 0;
    
    const tail = { x: p1x, y: p1y, z: p1z };
    const head = { x: p2x, y: p2y, z: p2z };
    const result = directionFromPoints(tail, head);
    
    if (!result) {
      setDirExplanation('<div class="step" data-step="1"><strong>Error:</strong> Points are identical or invalid.</div>');
      return;
    }

    const { u, v, w } = result;
    
    const dx = p2x - p1x;
    const dy = p2y - p1y;
    const dz = p2z - p1z;
    
    // Exact explanation from snad.html
    const fmt = (val: number) => isNaN(val) ? "" : toFracStr(val);
    let expHTML = `
      <div class="step" data-step="1">Tail selected at (${fmt(p1x)}, ${fmt(p1y)}, ${fmt(p1z)})</div>
      <div class="step" data-step="2">Head selected at (${fmt(p2x)}, ${fmt(p2y)}, ${fmt(p2z)})</div>
      <div class="step" data-step="3">Vector components: Δx=${fmt(dx)}, Δy=${fmt(dy)}, Δz=${fmt(dz)}</div>
      <div class="step" data-step="4">Convert to fractions and clear denominators via LCM</div>
      <div class="step" data-step="5">Direction identified as <strong>[${u} ${v} ${w}]</strong></div>
    `;

    setDu(u.toString());
    setDv(v.toString());
    setDw(w.toString());
    setDox(p1x.toString());
    setDoy(p1y.toString());
    setDoz(p1z.toString());
    
    setIntTail({ x: p1x, y: p1y, z: p1z });
    setIntHead({ x: p2x, y: p2y, z: p2z });
    
    setDirExplanation(expHTML);
  };

  const resetComputeDir = () => {
    setTx(''); setTy(''); setTz('');
    setHx(''); setHy(''); setHz('');
    setIntTail(null);
    setIntHead(null);
    setIntMode('tail');
    setDirExplanation('');
  };

  const handlePointSelect = React.useCallback((p: { x: number, y: number, z: number }) => {
    if (activeModule !== 'directions' || dirTab !== 'compute') return;
    
    if (intMode === 'tail') {
      setTx(p.x.toString());
      setTy(p.y.toString());
      setTz(p.z.toString());
      setIntTail(p);
      setIntMode('head');
    } else {
      setHx(p.x.toString());
      setHy(p.y.toString());
      setHz(p.z.toString());
      setIntHead(p);
      setIntMode('tail');
    }
  }, [activeModule, dirTab, intMode]);

  const handlePlaneUpdateInfo = React.useCallback((hklStr: string, intStr: string) => {
    setCurrentIndices(prev => prev === hklStr ? prev : hklStr);
    setCurrentIntercepts(prev => prev === intStr ? prev : intStr);
  }, []);

  return (
    <div id="hub-sandbox" className="hub-sandbox" style={{ display: 'block', padding: '20px' }}>
      <SeoHead
        title={seoData.sandbox.title}
        description={seoData.sandbox.description}
        canonical={seoData.sandbox.canonical}
        keywords={seoData.sandbox.keywords}
        jsonLd={seoData.sandbox.jsonLd}
      />
      <div className="sandbox-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {onBack ? (
          <button className="back-btn" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to roadmap
          </button>
        ) : (
          <h2 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: '800' }}>Expert Sandbox</h2>
        )}
        <div className="hub-breadcrumb" id="sandbox-breadcrumb">Hub → {activeModule === 'planes' ? 'Planes' : 'Directions'} → Expert Sandbox</div>
      </div>

      <div className="page-header" style={{ marginTop: 0 }}>
        <div>
          <h1 className="page-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Expert Sandbox
          </h1>
        </div>
        <div className="module-switcher">
          <button className={`module-btn ${activeModule === 'planes' ? 'active' : ''}`} onClick={() => setActiveModule('planes')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            Planes (hkl)
          </button>
          <button className={`module-btn ${activeModule === 'directions' ? 'active' : ''}`} onClick={() => setActiveModule('directions')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Directions [uvw]
          </button>
        </div>
      </div>

      <div className="content-grid">
        <div className="canvas-panel">
          <div className="canvas-header">
            <h2 className="canvas-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              </svg>
              3D Crystal Visualization
            </h2>
            <div className="view-controls">
              <div className="control-group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 12" />
                </svg>
                <label>Rotate:</label>
                <input type="range" min="-45" max="45" value={rotY} onChange={(e) => setRotY(parseInt(e.target.value))} />
                <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={() => setRotY(0)} title="Reset rotation">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: 0 }}>
                    <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Preset Selector Bar */}
          <div className="sandbox-presets-bar" style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick Presets:
            </span>
            {activeModule === 'planes' ? (
              <>
                <button className="btn btn-xs" onClick={() => { setPh('1'); setPk('0'); setPl('0'); }}> (100) Face </button>
                <button className="btn btn-xs" onClick={() => { setPh('1'); setPk('1'); setPl('0'); }}> (110) Diagonal </button>
                <button className="btn btn-xs" onClick={() => { setPh('1'); setPk('1'); setPl('1'); }}> (111) Octahedral </button>
                <button className="btn btn-xs" onClick={() => { setPh('0'); setPk('0'); setPl('1'); }}> (001) Base </button>
              </>
            ) : (
              <>
                <button className="btn btn-xs" onClick={() => { setDu('1'); setDv('0'); setDw('0'); setDox(''); setDoy(''); setDoz(''); }}> [100] Axis </button>
                <button className="btn btn-xs" onClick={() => { setDu('1'); setDv('1'); setDw('0'); setDox(''); setDoy(''); setDoz(''); }}> [110] Face </button>
                <button className="btn btn-xs" onClick={() => { setDu('1'); setDv('1'); setDw('1'); setDox(''); setDoy(''); setDoz(''); }}> [111] Body </button>
                <button className="btn btn-xs" onClick={() => { setDu('-1'); setDv('1'); setDw('0'); setDox('1'); setDoy('0'); setDoz('0'); }}> [1̄10] Shifted </button>
              </>
            )}
          </div>
          
          <CrystalCanvas 
            module={activeModule}
            tab={activeModule === 'planes' ? (planeTab === 'draw' ? 0 : 1) : (dirTab === 'draw' ? 0 : 1)}
            h={displayH} k={displayK} l={displayL}
            u={displayU} v={displayV} w={displayW}
            originX={displayOx} originY={displayOy} originZ={displayOz}
            rotY={rotY}
            interactive={activeModule === 'directions' && dirTab === 'compute'}
            intMode={intMode}
            intTail={intTail}
            intHead={intHead}
            onSelectPoint={handlePointSelect}
            onUpdateInfo={handlePlaneUpdateInfo}
            isAnimated={activeModule === 'directions' && dirTab === 'draw'}
            animKey={animKey}
          />

          <div className="info-overlay" style={{ display: activeModule === 'planes' ? 'block' : 'none' }}>
            <div className="info-row"><span className="info-label">Current</span><span className="info-value">{currentIndices}</span></div>
            <div className="info-row"><span className="info-label">Intercepts</span><span className="info-value">{currentIntercepts}</span></div>
          </div>
          <div className="axis-legend">
            <div className="axis-item">
              <div className="axis-color axis-x"></div><span><strong>x-axis</strong> (bottom-left)</span>
            </div>
            <div className="axis-item">
              <div className="axis-color axis-y"></div><span><strong>y-axis</strong> (right)</span>
            </div>
            <div className="axis-item">
              <div className="axis-color axis-z"></div><span><strong>z-axis</strong> (up)</span>
            </div>
          </div>
        </div>

        <div className="controls-panel" id="controls-panel">
          {activeModule === 'planes' && (
            <div id="planes-controls">
              <div className="control-card">
                <div className="card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                  <h3 className="card-title">Plane Operations</h3>
                </div>
                <div className="card-body">
                  <div className="tabs-container">
                    <div className={`tab ${planeTab === 'draw' ? 'active' : ''}`} onClick={() => setPlaneTab('draw')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block', margin: '0 auto 5px' }}>
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 12 22 17" />
                        <polyline points="2 12 12 7 22 12" />
                      </svg>
                      Draw
                    </div>
                    <div className={`tab ${planeTab === 'compute' ? 'active' : ''}`} onClick={() => setPlaneTab('compute')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block', margin: '0 auto 5px' }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      Compute
                    </div>
                  </div>
                  
                  {planeTab === 'draw' && (
                    <div className="tab-content active">
                      <div className="form-section">
                        <label className="form-label">Enter Miller Indices (hkl)</label>
                        <div className="input-row">
                          <div className="input-group"><label>h:</label><input type="text" value={ph} onChange={e => setPh(e.target.value)} placeholder="e.g. 1" /></div>
                          <div className="input-group"><label>k:</label><input type="text" value={pk} onChange={e => setPk(e.target.value)} placeholder="e.g. 0" /></div>
                          <div className="input-group"><label>l:</label><input type="text" value={pl} onChange={e => setPl(e.target.value)} placeholder="e.g. 0" /></div>
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <button className="btn" onClick={handlePlaneDraw}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>Draw
                            </button>
                          </div>
                        </div>
                      </div>
                      {planeExplanation && <div className="explanation-box visible" dangerouslySetInnerHTML={{ __html: planeExplanation }}></div>}
                    </div>
                  )}

                  {planeTab === 'compute' && (
                    <div className="tab-content active">
                      <div className="form-section">
                        <label className="form-label">Enter Intercepts (p, q, r)</label>
                        <div className="input-row">
                          <div className="input-group"><label>p:</label><input type="text" value={pp} onChange={e => setPp(e.target.value)} placeholder="inf" /></div>
                          <div className="input-group"><label>q:</label><input type="text" value={pq} onChange={e => setPq(e.target.value)} placeholder="inf" /></div>
                          <div className="input-group"><label>r:</label><input type="text" value={pr} onChange={e => setPr(e.target.value)} placeholder="1" /></div>
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                          <button className="btn mt-20" onClick={handlePlaneCompute}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>Compute
                          </button>
                        </div>
                      </div>
                      {planeExplanation && <div className="explanation-box visible" dangerouslySetInnerHTML={{ __html: planeExplanation }}></div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeModule === 'directions' && (
            <div id="directions-controls">
              <div className="control-card">
                <div className="card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  <h3 className="card-title">Direction Operations</h3>
                </div>
                <div className="card-body">
                  <div className="tabs-container">
                    <div className={`tab ${dirTab === 'draw' ? 'active' : ''}`} onClick={() => setDirTab('draw')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block', margin: '0 auto 5px' }}>
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>Draw
                    </div>
                    <div className={`tab ${dirTab === 'compute' ? 'active' : ''}`} onClick={() => setDirTab('compute')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block', margin: '0 auto 5px' }}>
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>Compute
                    </div>
                  </div>

                  {dirTab === 'draw' && (
                    <div className="tab-content active">
                      <div className="form-section">
                        <label className="form-label">Enter Direction Indices [uvw]</label>
                        <div className="input-row">
                          <div className="input-group"><label>u:</label><input type="text" value={du} onChange={e => setDu(e.target.value)} placeholder="1" /></div>
                          <div className="input-group"><label>v:</label><input type="text" value={dv} onChange={e => setDv(e.target.value)} placeholder="1" /></div>
                          <div className="input-group"><label>w:</label><input type="text" value={dw} onChange={e => setDw(e.target.value)} placeholder="0" /></div>
                        </div>
                        <label className="form-label" style={{ marginTop: '15px' }}>Optional Custom Origin (Tail)</label>
                        <div className="input-row">
                          <div className="input-group"><label>x:</label><input type="text" value={dox} onChange={e => setDox(e.target.value)} placeholder="0" /></div>
                          <div className="input-group"><label>y:</label><input type="text" value={doy} onChange={e => setDoy(e.target.value)} placeholder="0" /></div>
                          <div className="input-group"><label>z:</label><input type="text" value={doz} onChange={e => setDoz(e.target.value)} placeholder="0" /></div>
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <button className="btn" onClick={handleDirDraw}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>Draw
                            </button>
                          </div>
                        </div>
                      </div>
                      {dirExplanation && <div className="explanation-box visible" dangerouslySetInnerHTML={{ __html: dirExplanation }}></div>}
                    </div>
                  )}

                  {dirTab === 'compute' && (
                    <div className="tab-content active">
                      <div className="interactive-status">
                        <div className="status-item">
                          <div className={`status-dot ${intMode === 'tail' ? 'active' : ''}`}></div>
                          <span><strong>Step 1:</strong> Click cube to set Tail (Red dot)</span>
                        </div>
                        <div className="status-item">
                          <div className={`status-dot ${intMode === 'head' ? 'active' : ''}`}></div>
                          <span><strong>Step 2:</strong> Click cube to set Head (Green dot)</span>
                        </div>
                      </div>
                      <div className="form-section" style={{ marginTop: '14px' }}>
                        <label className="form-label">Tail (Start Point)</label>
                        <div className="input-row">
                          <div className="input-group"><label>x₁:</label><input type="text" value={tx} onChange={e => setTx(e.target.value)} /></div>
                          <div className="input-group"><label>y₁:</label><input type="text" value={ty} onChange={e => setTy(e.target.value)} /></div>
                          <div className="input-group"><label>z₁:</label><input type="text" value={tz} onChange={e => setTz(e.target.value)} /></div>
                        </div>
                      </div>
                      <div className="form-section">
                        <label className="form-label">Head (End Point)</label>
                        <div className="input-row">
                          <div className="input-group"><label>x₂:</label><input type="text" value={hx} onChange={e => setHx(e.target.value)} placeholder="1" /></div>
                          <div className="input-group"><label>y₂:</label><input type="text" value={hy} onChange={e => setHy(e.target.value)} placeholder="1" /></div>
                          <div className="input-group"><label>z₂:</label><input type="text" value={hz} onChange={e => setHz(e.target.value)} placeholder="0" /></div>
                        </div>
                      </div>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                        <button className="btn btn-secondary" onClick={resetComputeDir}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                          </svg>Reset
                        </button>
                        <button className="btn" onClick={handleDirCompute}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>Compute
                        </button>
                      </div>
                      {dirExplanation && <div className="explanation-box visible" dangerouslySetInnerHTML={{ __html: dirExplanation }}></div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
