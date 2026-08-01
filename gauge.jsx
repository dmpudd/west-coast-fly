// gauge.jsx — Live river gauge readings via ECCC MSC GeoMet real-time hydrometric API
const GAUGE_CACHE_MS = 15 * 60 * 1000; // refetch at most every 15 min

async function fetchGaugeReading(stationId) {
  const cacheKey = `gauge_${stationId}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
    if (cached && Date.now() - cached.fetchedAt < GAUGE_CACHE_MS) return cached;
  } catch (e) {}

  const url = `https://api.weather.gc.ca/collections/hydrometric-realtime/items?STATION_NUMBER=${stationId}&f=json&sortby=-DATETIME&limit=6`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('gauge fetch failed');
  const json = await res.json();
  const rows = (json.features || [])
    .map(f => f.properties)
    .filter(p => p.DATETIME)
    .sort((a, b) => new Date(b.DATETIME) - new Date(a.DATETIME));
  if (!rows.length) throw new Error('no gauge data');

  const latest = rows[0];
  const prior = rows.find(r => r.DISCHARGE != null && latest.DISCHARGE != null && r.DATETIME !== latest.DATETIME);
  let trend = 'steady';
  if (prior && latest.DISCHARGE != null && prior.DISCHARGE != null) {
    const delta = latest.DISCHARGE - prior.DISCHARGE;
    if (Math.abs(delta) / (prior.DISCHARGE || 1) > 0.02) trend = delta > 0 ? 'rising' : 'falling';
  }
  const result = {
    discharge: latest.DISCHARGE ?? null,
    level: latest.LEVEL ?? null,
    datetime: latest.DATETIME,
    trend,
    fetchedAt: Date.now(),
  };
  try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch (e) {}
  return result;
}

function GaugeTrendIcon({ trend }) {
  if (trend === 'rising') return <span style={{ color: '#C0604A' }}>▲</span>;
  if (trend === 'falling') return <span style={{ color: '#2E7D6B' }}>▼</span>;
  return <span style={{ color: '#999' }}>■</span>;
}

// f: fishery object with optional gaugeStation ("08MH001") and gaugeWindow (fallback text)
function LiveGauge({ f }) {
  const [state, setState] = React.useState({ status: f.gaugeStation ? 'loading' : 'none' });

  React.useEffect(() => {
    if (!f.gaugeStation) return;
    let cancelled = false;
    fetchGaugeReading(f.gaugeStation)
      .then(r => { if (!cancelled) setState({ status: 'ok', ...r }); })
      .catch(() => { if (!cancelled) setState({ status: 'error' }); });
    return () => { cancelled = true; };
  }, [f.gaugeStation]);

  const officialLink = f.gaugeStation ? `https://wateroffice.ec.gc.ca/report/real_time_e.html?stn=${f.gaugeStation}` : null;

  if (state.status === 'ok') {
    const timeStr = new Date(state.datetime).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    return (
      <div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          {state.discharge != null && <span className="font-semibold tabular-nums">{state.discharge.toFixed(1)} m³/s</span>}
          {state.level != null && <span className="text-[11px] text-ink2 tabular-nums">({state.level.toFixed(2)}m)</span>}
          <GaugeTrendIcon trend={state.trend} />
        </div>
        {f.gaugeWindow && <div className="text-[11px] text-ink2 mt-0.5 leading-snug">{f.gaugeWindow}</div>}
        <div className="text-[10px] text-ink2 mt-1">Live · as of {timeStr}</div>
        <a href={officialLink} target="_blank" rel="noopener" className="text-[10px] text-teal underline underline-offset-2">WSC station {f.gaugeStation} →</a>
      </div>
    );
  }

  // loading, error, or no station configured — fall back to static text
  return (
    <div>
      <div className="leading-snug">{f.gaugeWindow || '—'}</div>
      {f.gaugeStation && state.status === 'loading' && <div className="text-[10px] text-ink2 mt-1">Loading live reading…</div>}
      {f.gaugeStation && state.status === 'error' && (
        <a href={officialLink} target="_blank" rel="noopener" className="text-[10px] text-teal underline underline-offset-2">Check live gauge {f.gaugeStation} →</a>
      )}
    </div>
  );
}

window.LiveGauge = LiveGauge;
