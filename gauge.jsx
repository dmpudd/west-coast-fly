// gauge.jsx — Live river gauge readings via ECCC MSC GeoMet real-time hydrometric API
const GAUGE_CACHE_MS = 15 * 60 * 1000; // refetch at most every 15 min

async function fetchGaugeReading(stationId) {
  const cacheKey = `gauge_${stationId}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (cached && Date.now() - cached.fetchedAt < GAUGE_CACHE_MS) return cached;
  } catch (e) {}

  const url = `https://api.weather.gc.ca/collections/hydrometric-realtime/items?STATION_NUMBER=${stationId}&f=json&sortby=-DATETIME&limit=8`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('gauge fetch failed');
  const json = await res.json();
  const rows = (json.features || [])
    .map(f => f.properties)
    .filter(p => p.DATETIME)
    .sort((a, b) => new Date(b.DATETIME) - new Date(a.DATETIME));
  if (!rows.length) throw new Error('no gauge data');

  const latest = rows[0];
  const metricOf = r => r.DISCHARGE != null ? r.DISCHARGE : r.LEVEL;
  const latestMetric = metricOf(latest);
  const prior = rows.find(r => metricOf(r) != null && latestMetric != null && r.DATETIME !== latest.DATETIME);
  let trend = 'steady';
  if (prior && latestMetric != null) {
    const priorMetric = metricOf(prior);
    const delta = latestMetric - priorMetric;
    if (Math.abs(delta) / (priorMetric || 1) > 0.02) trend = delta > 0 ? 'rising' : 'falling';
  }
  const history = rows.slice(0, 6).reverse().map(r => ({ datetime: r.DATETIME, level: r.LEVEL ?? null, discharge: r.DISCHARGE ?? null }));
  const result = {
    discharge: latest.DISCHARGE ?? null,
    level: latest.LEVEL ?? null,
    datetime: latest.DATETIME,
    trend,
    history,
    fetchedAt: Date.now(),
  };
  try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (e) {}
  return result;
}

function GaugeTrendIcon({ trend }) {
  if (trend === 'rising') return <span style={{ color: '#C0604A' }} title="Rising">▲</span>;
  if (trend === 'falling') return <span style={{ color: '#2E7D6B' }} title="Falling">▼</span>;
  return <span style={{ color: '#999' }} title="Steady">■</span>;
}

// Horizontal bar showing current reading against a known ideal fishing range
function GaugeRangeBar({ value, low, high, unit }) {
  if (value == null || low == null || high == null) return null;
  const span = Math.max(high - low, 0.01);
  const domainLow = Math.max(0, low - span * 0.7);
  const domainHigh = high + span * 1.8;
  const pct = v => Math.min(100, Math.max(0, ((v - domainLow) / (domainHigh - domainLow)) * 100));
  const lowPct = pct(low), highPct = pct(high), valPct = pct(value);

  let status = 'good', label = 'Prime range';
  if (value < low) { status = 'low'; label = value < low - span ? 'Too low' : 'Low'; }
  else if (value > high) { status = 'high'; label = value > high + span ? 'Blown out' : 'High'; }
  const color = status === 'good' ? '#2E7D6B' : '#C0604A';
  const unitLabel = unit === 'discharge' ? 'm³/s' : 'm';

  return (
    <div className="mt-1.5">
      <div className="relative h-1.5 rounded-full" style={{ background: '#e8e4dc' }}>
        <div className="absolute top-0 h-1.5 rounded-full" style={{ left: lowPct + '%', width: (highPct - lowPct) + '%', background: '#cfe3da' }} />
        <div className="absolute rounded-full border-2 border-white" style={{ top: '-3px', left: `calc(${valPct}% - 4.5px)`, width: 9, height: 9, background: color, boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }} />
      </div>
      <div className="flex items-center justify-between mt-1 text-[10px]">
        <span style={{ color }} className="font-medium">{label}</span>
        <span className="text-ink2">Ideal {low}–{high}{unitLabel}</span>
      </div>
    </div>
  );
}

function Sparkline({ points }) {
  const valid = points.filter(p => p != null);
  if (valid.length < 2) return null;
  const min = Math.min(...valid), max = Math.max(...valid);
  const range = (max - min) || 1;
  const w = 72, h = 18;
  const step = w / (points.length - 1);
  let started = false;
  const d = points.map((p, i) => {
    if (p == null) return '';
    const x = (i * step).toFixed(1), y = (h - ((p - min) / range) * h).toFixed(1);
    const cmd = started ? 'L' : 'M';
    started = true;
    return `${cmd}${x},${y}`;
  }).join(' ');
  return <svg width={w} height={h} className="mt-1 block"><path d={d} fill="none" stroke="#2E7D6B" strokeWidth="1.5" /></svg>;
}

// f: fishery object with optional gaugeStation, gaugeName, gaugeWindow (fallback text),
// gaugeRangeLow/High/Unit ('level' | 'discharge') for the ideal-fishing-window indicator
function LiveGauge({ f }) {
  const [state, setState] = React.useState({ status: f.gaugeStation ? 'loading' : 'none' });
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!f.gaugeStation) return;
    let cancelled = false;
    fetchGaugeReading(f.gaugeStation)
      .then(r => { if (!cancelled) setState({ status: 'ok', ...r }); })
      .catch(() => { if (!cancelled) setState({ status: 'error' }); });
    return () => { cancelled = true; };
  }, [f.gaugeStation]);

  const officialLink = f.gaugeStation ? `https://wateroffice.ec.gc.ca/report/real_time_e.html?stn=${f.gaugeStation}` : null;
  const gaugeLabel = f.gaugeName || (f.gaugeStation ? `Station ${f.gaugeStation}` : null);

  if (state.status === 'ok') {
    const timeStr = new Date(state.datetime).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const rangeUnit = f.gaugeRangeUnit || 'level';
    const rangeValue = rangeUnit === 'discharge' ? state.discharge : state.level;
    const headline = state.level != null ? `${state.level.toFixed(2)}m` : (state.discharge != null ? `${state.discharge.toFixed(1)} m³/s` : null);

    return (
      <div>
        {headline && (
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-semibold text-[15px] tabular-nums">{headline}</span>
            <GaugeTrendIcon trend={state.trend} />
            {state.level != null && state.discharge != null && (
              <span className="text-[10.5px] text-ink2 tabular-nums">{state.discharge.toFixed(1)} m³/s</span>
            )}
          </div>
        )}
        <GaugeRangeBar value={rangeValue} low={f.gaugeRangeLow} high={f.gaugeRangeHigh} unit={rangeUnit} />
        {f.gaugeWindow && <div className="text-[11px] text-ink2 mt-1 leading-snug">{f.gaugeWindow}</div>}
        <div className="flex items-center gap-3 mt-1.5">
          {gaugeLabel && <a href={officialLink} target="_blank" rel="noopener" className="text-[10.5px] text-teal underline underline-offset-2">{gaugeLabel} →</a>}
          <button onClick={() => setOpen(o => !o)} className="text-[10.5px] text-ink2 underline underline-offset-2">{open ? 'less' : 'more'}</button>
        </div>
        {open && (
          <div className="mt-1.5 pt-1.5 border-t border-line text-[10px] text-ink2 space-y-1">
            <div>Station {f.gaugeStation} · updated {timeStr}</div>
            {state.level != null && <div>Level: {state.level.toFixed(2)}m</div>}
            {state.discharge != null && <div>Discharge: {state.discharge.toFixed(1)} m³/s</div>}
            {state.history && state.history.length > 1 && (
              <Sparkline points={state.history.map(h => rangeUnit === 'discharge' ? h.discharge : h.level)} />
            )}
          </div>
        )}
      </div>
    );
  }

  // loading, error, or no station configured — fall back to static text
  return (
    <div>
      <div className="leading-snug">{f.gaugeWindow || '—'}</div>
      {f.gaugeStation && state.status === 'loading' && <div className="text-[10px] text-ink2 mt-1">Loading live reading…</div>}
      {f.gaugeStation && state.status === 'error' && (
        <a href={officialLink} target="_blank" rel="noopener" className="text-[10px] text-teal underline underline-offset-2">Check live gauge{gaugeLabel ? ` — ${gaugeLabel}` : ''} →</a>
      )}
    </div>
  );
}

window.LiveGauge = LiveGauge;
