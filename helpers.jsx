// helpers.jsx — shared UI atoms and helpers
const { useState, useEffect, useMemo, useRef } = React;

// ── activity colour map ──────────────────────────────────────────────
const ACT = {
  peak:   { bg: '#C0604A', label: 'PEAK',   text: '#fff' },
  active: { bg: '#2E7D6B', label: 'ACTIVE', text: '#fff' },
  light:  { bg: '#B8860B', label: 'LIGHT',  text: '#fff' },
  off:    { bg: '#EEEEEE', label: 'OFF',    text: '#888' },
};

function getActivity(season, monthIdx) {
  if (season.peak.includes(monthIdx))   return 'peak';
  if (season.active.includes(monthIdx)) return 'active';
  if (season.light.includes(monthIdx))  return 'light';
  return 'off';
}

// ── Activity badge ───────────────────────────────────────────────────
function ActivityBadge({ kind, className = '' }) {
  const a = ACT[kind] || ACT.off;
  if (kind === 'off') return null;
  return (
    <span
      className={`inline-flex items-center text-[10px] font-semibold tracking-[0.08em] px-2 py-[3px] rounded ${className}`}
      style={{ background: a.bg, color: a.text }}
    >
      {a.label}
    </span>
  );
}

// ── 12-month mini bar ────────────────────────────────────────────────
function MiniSeasonBar({ season, currentMonth = null, height = 6, showLabels = false }) {
  return (
    <div>
      <div className="flex w-full overflow-hidden rounded" style={{ height }}>
        {Array.from({ length: 12 }, (_, i) => {
          const k = getActivity(season, i);
          const isCur = currentMonth === i;
          return (
            <div
              key={i}
              className="flex-1"
              title={`${DATA.months[i]} • ${ACT[k].label.toLowerCase()}`}
              style={{
                background: ACT[k].bg,
                boxShadow: isCur ? 'inset 0 0 0 1.5px #1B3A5C' : 'none',
              }}
            />
          );
        })}
      </div>
      {showLabels && (
        <div className="flex w-full mt-1">
          {DATA.months.map((m, i) => (
            <div key={m} className="flex-1 text-center text-[10px]" style={{ color: currentMonth === i ? '#1B3A5C' : '#888', fontWeight: currentMonth === i ? 600 : 400 }}>{m[0]}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Method pill ──────────────────────────────────────────────────────
function MethodTag({ method }) {
  const label = method === 'fly' ? 'Fly' : 'Gear';
  return (
    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EFEEE8] text-ink2 font-medium">
      {label}
    </span>
  );
}

// ── Type icon (simple SVG) ───────────────────────────────────────────
function TypeIcon({ type, size = 14, color = '#2E7D6B' }) {
  const s = { width: size, height: size };
  switch (type) {
    case 'river':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M3 8c3 0 3 2 6 2s3-2 6-2 3 2 6 2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M3 14c3 0 3 2 6 2s3-2 6-2 3 2 6 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity=".6"/>
        </svg>
      );
    case 'ocean':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M2 17c2 0 2-2 5-2s3 2 5 2 2-2 5-2 3 2 5 2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M2 12c2 0 2-2 5-2s3 2 5 2 2-2 5-2 3 2 5 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity=".55"/>
          <path d="M2 7c2 0 2-2 5-2s3 2 5 2 2-2 5-2 3 2 5 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity=".3"/>
        </svg>
      );
    case 'beach':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <path d="M2 18c3 0 3-1 6-1s3 1 6 1 3-1 6-1 2 1 2 1" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
          <circle cx="17" cy="9" r="3" stroke={color} strokeWidth="1.6"/>
          <path d="M17 12v3" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      );
    case 'lake':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="14" rx="9" ry="5" stroke={color} strokeWidth="1.6"/>
          <path d="M7 14c2-2 4-2 5-2s3 0 5 2" stroke={color} strokeWidth="1.4" opacity=".55"/>
        </svg>
      );
    default: return null;
  }
}
function EntomologyIcon({ id, size = 22, color = '#1B3A5C' }) {
  const s = { width: size, height: size };
  switch (id) {
    case 'chironomid':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M6 6l6 3-6 3M18 6l-6 3 6 3M6 15l6 3-6 3M18 15l-6 3 6 3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>;
    case 'mayfly':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="14" rx="2" ry="6" fill={color}/><path d="M12 8 L6 2M12 8 L18 2" stroke={color} strokeWidth="1.3" strokeLinecap="round"/><path d="M11 20l-2 3M13 20l2 3" stroke={color} strokeWidth="1.1" strokeLinecap="round"/></svg>;
    case 'damsel':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 2v14" stroke={color} strokeWidth="2" strokeLinecap="round"/><path d="M12 16l-4 6M12 16l4 6" stroke={color} strokeWidth="1.3" strokeLinecap="round"/><ellipse cx="8" cy="4" rx="2.4" ry="1.4" fill={color} opacity=".8"/><ellipse cx="16" cy="4" rx="2.4" ry="1.4" fill={color} opacity=".8"/></svg>;
    case 'dragonfly':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 2v18" stroke={color} strokeWidth="2.4" strokeLinecap="round"/><path d="M12 8 L2 5M12 8 L22 5M12 12 L3 12M12 12 L21 12" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity=".8"/></svg>;
    case 'caddis':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 14 C4 8 8 5 12 5 C16 5 20 8 20 14" stroke={color} strokeWidth="1.6"/><path d="M6 14h12" stroke={color} strokeWidth="1.6" strokeLinecap="round"/><path d="M9 5l3-3 3 3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>;
    case 'scud':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M5 12c0-5 4-8 9-7 4 .8 6 4 5 8-1 3-4 4-8 3-4-1-6-2-6-4z" stroke={color} strokeWidth="1.5"/><path d="M6 12l-3 1M7 15l-2 2" stroke={color} strokeWidth="1.2" strokeLinecap="round"/></svg>;
    default: return null;
  }
}

// ── Error boundary so one broken component can't blank the whole app ──
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('WCF render error:', error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, maxWidth: 560, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1B3A5C', marginBottom: 8 }}>Something went wrong loading this page.</div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 16, lineHeight: 1.5 }}>{String(this.state.error && this.state.error.message || this.state.error)}</div>
          <button onClick={() => this.setState({ error: null })} style={{ fontSize: 13, color: '#2E7D6B', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
window.ErrorBoundary = ErrorBoundary;

// ── Inline icons used by nav and entry buttons ──────────────────────
function Icon({ name, size = 20, color = 'currentColor', stroke = 1.7 }) {
  const s = { width: size, height: size };
  const c = color, w = stroke;
  switch (name) {
    case 'home':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 11l8-7 8 7v8a2 2 0 01-2 2h-3v-6h-6v6H6a2 2 0 01-2-2v-8z" stroke={c} strokeWidth={w} strokeLinejoin="round"/></svg>;
    case 'search':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke={c} strokeWidth={w}/><path d="M20 20l-3.5-3.5" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>;
    case 'calendar':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="2" stroke={c} strokeWidth={w}/><path d="M3.5 10h17M8 3v4M16 3v4" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>;
    case 'fly':
      // simple fishing hook
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3v10a5 5 0 11-5-5" stroke={c} strokeWidth={w} strokeLinecap="round"/><circle cx="12" cy="3.2" r="1.1" fill={c}/></svg>;
    case 'fish':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 12c3-5 9-6 13-3l5-2-2 5 2 5-5-2c-4 3-10 2-13-3z" stroke={c} strokeWidth={w} strokeLinejoin="round"/><circle cx="15" cy="11" r=".9" fill={c}/></svg>;
    case 'filter':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>;
    case 'pin':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z" stroke={c} strokeWidth={w}/><circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth={w}/></svg>;
    case 'gauge':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M4 16a8 8 0 1116 0" stroke={c} strokeWidth={w} strokeLinecap="round"/><path d="M12 16l4-5" stroke={c} strokeWidth={w} strokeLinecap="round"/><circle cx="12" cy="16" r="1.2" fill={c}/></svg>;
    case 'rules':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" stroke={c} strokeWidth={w} strokeLinejoin="round"/></svg>;
    case 'close':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>;
    case 'chev':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'warning':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l10 18H2L12 3z" stroke={c} strokeWidth={w} strokeLinejoin="round"/><path d="M12 10v5M12 18v.5" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>;
    case 'tide':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M2 14c2 0 2-2 5-2s3 2 5 2 2-2 5-2 3 2 5 2" stroke={c} strokeWidth={w} strokeLinecap="round"/><path d="M12 12V3M9 6l3-3 3 3" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'thermo':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="14" rx="3" stroke={c} strokeWidth={w}/><circle cx="12" cy="19" r="3" stroke={c} strokeWidth={w}/></svg>;
    case 'snow':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M12 3v18M4 7l16 10M4 17L20 7M7 5l5 3 5-3M7 19l5-3 5 3" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>;
    case 'boat':
      return <svg style={s} viewBox="0 0 24 24" fill="none"><path d="M3 17l1.5-4h15L21 17" stroke={c} strokeWidth={w} strokeLinejoin="round"/><path d="M12 13V4l6 9" stroke={c} strokeWidth={w} strokeLinejoin="round"/><path d="M3 19c2 1 2 1.5 4 1.5s2-1.5 5-1.5 3 1.5 5 1.5 2-.5 4-1.5" stroke={c} strokeWidth={w} strokeLinecap="round"/></svg>;
    default: return null;
  }
}

// ── Thermocline diagram (shared: Kokanee + Interior Lakes) ──────────
function ThermoclineDiagram() {
  return (
    <div>
      <div className="relative">
        <div className="px-4 py-5" style={{ background: 'linear-gradient(180deg,#C7DAE7,#A4BFD3)' }}>
          <div className="text-[11px] uppercase tracking-wider text-navy/70 font-semibold">Surface — warm</div>
          <div className="text-[12px] text-navy mt-0.5">Too warm for trout/kokanee June–Aug</div>
        </div>
        <div className="px-4 py-4 border-y-2" style={{ background: 'linear-gradient(180deg,#7396AE,#4F7D9A)', borderColor: '#C0604A' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-white/85 font-semibold">Thermocline</div>
              <div className="text-[13px] text-white font-medium mt-0.5">Find this layer</div>
            </div>
            <Icon name="thermo" size={20} color="#fff" />
          </div>
        </div>
        <div className="px-4 py-6" style={{ background: 'linear-gradient(180deg,#345E80,#1B3A5C)' }}>
          <div className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Cold oxygenated layer</div>
          <div className="text-[12px] text-white mt-0.5">Fish hold here</div>
          <div className="flex gap-3 mt-3 opacity-90">
            {[0,1,2].map(i => (
              <svg key={i} width="28" height="14" viewBox="0 0 28 14">
                <path d="M2 7 C 8 1, 18 1, 24 7 C 18 13, 8 13, 2 7Z" fill="#C0604A" />
                <path d="M24 7 L 28 3 L 28 11 Z" fill="#C0604A" />
                <circle cx="20" cy="6" r=".8" fill="#fff" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pill button (used everywhere) ────────────────────────────────────
function Pill({ active, onClick, children, size = 'md', className = '', ariaLabel }) {
  const padding = size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-3.5 py-2 text-[13px]';
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`${padding} rounded-full whitespace-nowrap transition-colors font-medium border ${
        active
          ? 'bg-teal text-white border-teal'
          : 'bg-white text-navy border-line hover:bg-[#F0F4F8]'
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ── Section heading ──────────────────────────────────────────────────
function SectionTitle({ kicker, title, sub, accent = '#2E7D6B' }) {
  return (
    <div className="mb-3">
      {kicker && (
        <div className="text-[11px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: accent }}>{kicker}</div>
      )}
      <div className="text-[18px] md:text-[22px] font-medium text-navy">{title}</div>
      {sub && <div className="text-[13px] text-ink2 mt-0.5">{sub}</div>}
    </div>
  );
}

// ── Card primitive ───────────────────────────────────────────────────
function Card({ children, className = '', onClick, role }) {
  return (
    <div
      role={role}
      onClick={onClick}
      className={`bg-white border border-line rounded-xl shadow-card ${onClick ? 'cursor-pointer hover:border-[#cfcfc4] transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ── Type → label ─────────────────────────────────────────────────────
const TYPE_LABEL = { river: 'River', ocean: 'Ocean', beach: 'Beach', lake: 'Lake' };

// expose to other files
Object.assign(window, {
  ACT, getActivity, ActivityBadge, MiniSeasonBar, MethodTag, TypeIcon, Icon, EntomologyIcon,
  Pill, SectionTitle, Card, TYPE_LABEL, ThermoclineDiagram,
});
