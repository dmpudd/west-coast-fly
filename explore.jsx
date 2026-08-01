// explore.jsx — Explore view + detail panel
function ExploreView({ isMobile, initial, onSelect }) {
  const [month, setMonth]       = useState(initial?.month ?? 8); // Sep default
  const [typeF, setTypeF]       = useState(initial?.type ?? 'all');
  const [methodF, setMethodF]   = useState(initial?.method ?? 'all');
  const [regionF, setRegionF]   = useState(initial?.region ?? 'all');
  const [systemF, setSystemF]   = useState(initial?.system ?? 'all');
  const regions = useMemo(() => ['all', ...Array.from(new Set(DATA.fisheries.map(f => f.region)))], []);
  const systemOptions = useMemo(() => {
    const list = DATA.fisheries.filter(f => (typeF === 'all' || f.type === typeF) && (regionF === 'all' || f.region === regionF));
    return Array.from(new Set(list.map(f => f.system))).sort();
  }, [typeF, regionF]);

  useEffect(() => {
    if (systemF !== 'all' && !systemOptions.includes(systemF)) setSystemF('all');
  }, [systemOptions]);
  const [openId, setOpenId]     = useState(initial?.openId ?? null);
  const [scrolled, setScrolled] = useState(false);
  const stripRef = useRef(null);

  // Sync to external initial changes (route from home)
  useEffect(() => {
    if (initial?.month != null) setMonth(initial.month);
    if (initial?.type) setTypeF(initial.type);
    if (initial?.method) setMethodF(initial.method);
    if (initial?.region) setRegionF(initial.region);
    if (initial?.system) setSystemF(initial.system);
    if (initial?.openId) setOpenId(initial.openId);
  }, [initial?.month, initial?.type, initial?.method, initial?.region, initial?.system, initial?.openId]);

  // Center selected month pill on mobile
  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-month="${month}"]`);
    if (el && stripRef.current) {
      const parent = stripRef.current;
      parent.scrollTo({ left: el.offsetLeft - parent.clientWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' });
    }
  }, [month]);

  const monthCounts = useMemo(() => DATA.months.map((_, mi) => {
    const c = { peak: 0, active: 0, light: 0 };
    DATA.fisheries.forEach(f => {
      const k = getActivity(f.season, mi);
      if (k !== 'off') c[k] += 1;
    });
    return c;
  }), []);

  const isAllMonths = month === 'all';

  const filtered = useMemo(() => {
    const list = DATA.fisheries.filter(f => {
      if (!isAllMonths) {
        const k = getActivity(f.season, month);
        if (k === 'off') return false;
      }
      if (typeF !== 'all' && f.type !== typeF) return false;
      if (methodF !== 'all' && !f.method.includes(methodF)) return false;
      if (regionF !== 'all' && f.region !== regionF) return false;
      if (systemF !== 'all' && f.system !== systemF) return false;
      return true;
    });
    if (isAllMonths) return list.sort((a, b) => a.species.localeCompare(b.species));
    const order = { peak: 0, active: 1, light: 2 };
    return list.sort((a, b) => order[getActivity(a.season, month)] - order[getActivity(b.season, month)]);
  }, [month, typeF, methodF, regionF, systemF]);

  const activeFilters = [];
  activeFilters.push({ k: 'month', label: isAllMonths ? 'All months' : DATA.monthsLong[month] });
  if (typeF !== 'all')   activeFilters.push({ k: 'type',   label: TYPE_LABEL[typeF] });
  if (methodF !== 'all') activeFilters.push({ k: 'method', label: methodF === 'fly' ? 'Fly fishing' : 'Gear fishing' });
  if (regionF !== 'all') activeFilters.push({ k: 'region', label: regionF });
  if (systemF !== 'all') activeFilters.push({ k: 'system', label: systemF });

  const openFishery = filtered.find(f => f.id === openId) || DATA.fisheries.find(f => f.id === openId);

  return (
    <div className="pb-4">
      {/* Sticky filter bar */}
      <div
        className={`sticky top-0 md:top-[56px] z-20 bg-off/95 backdrop-blur border-b border-line transition-shadow ${scrolled ? 'shadow-card' : ''}`}
        onScroll={() => setScrolled(true)}
      >
        <div className="max-w-5xl mx-auto px-5 md:px-10 pt-4 pb-3">
          <div className="flex items-baseline justify-between mb-2">
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-salmon">Explore</div>
            <div className="text-[12px] text-ink2"><span className="text-navy font-medium">{filtered.length}</span> {filtered.length === 1 ? 'fishery' : 'fisheries'} match</div>
          </div>

          {/* Month strip */}
          <div ref={stripRef} className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-5 md:-mx-10 px-5 md:px-10 pb-1">
            <button
              data-month="all"
              onClick={() => setMonth('all')}
              className={`shrink-0 w-[60px] md:w-[68px] rounded-lg border px-1.5 py-2 text-center transition-colors ${
                isAllMonths ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-[#cfcfc4]'
              }`}
            >
              <div className="text-[12px] font-semibold tracking-wide">All</div>
              <div className="mt-1.5 h-[4px] rounded overflow-hidden" style={{ background: isAllMonths ? 'rgba(255,255,255,.35)' : '#EEEEEE' }} />
            </button>
            {DATA.months.map((m, i) => {
              const c = monthCounts[i];
              const sel = month === i;
              return (
                <button
                  key={m}
                  data-month={i}
                  onClick={() => setMonth(i)}
                  className={`shrink-0 w-[60px] md:w-[68px] rounded-lg border px-1.5 py-2 text-center transition-colors ${
                    sel ? 'border-navy bg-navy text-white' : 'border-line bg-white text-navy hover:border-[#cfcfc4]'
                  }`}
                >
                  <div className={`text-[12px] font-semibold tracking-wide`}>{m}</div>
                  <div className="flex gap-[2px] mt-1.5 h-[4px] rounded overflow-hidden">
                    {Array.from({ length: c.peak }).map((_, j) => <div key={'p'+j} className="flex-1" style={{ background: ACT.peak.bg }} />)}
                    {Array.from({ length: c.active }).map((_, j) => <div key={'a'+j} className="flex-1" style={{ background: ACT.active.bg }} />)}
                    {Array.from({ length: c.light }).map((_, j) => <div key={'l'+j} className="flex-1" style={{ background: ACT.light.bg }} />)}
                    {c.peak + c.active + c.light === 0 && <div className="flex-1" style={{ background: '#EEEEEE' }} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Type + method (mobile: combined scroll, desktop: two rows) */}
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-5 md:-mx-10 px-5 md:px-10 md:flex-wrap md:overflow-visible">
            {[
              { v: 'all',   l: 'All waters' },
              { v: 'river', l: 'River' },
              { v: 'ocean', l: 'Ocean' },
              { v: 'beach', l: 'Beach' },
              { v: 'lake',  l: 'Lake' },
            ].map(o => (
              <Pill key={o.v} size="sm" active={typeF === o.v} onClick={() => setTypeF(o.v)}>{o.l}</Pill>
            ))}
            <div className="hidden md:block w-px self-stretch bg-line mx-1" />
            {[
              { v: 'all',  l: 'All methods' },
              { v: 'fly',  l: 'Fly fishing' },
              { v: 'gear', l: 'Gear fishing' },
            ].map(o => (
              <Pill key={o.v} size="sm" active={methodF === o.v} onClick={() => setMethodF(o.v)}>{o.l}</Pill>
            ))}
          </div>

          {/* Region row */}
          <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar -mx-5 md:-mx-10 px-5 md:px-10">
            {regions.map(r => (
              <Pill key={r} size="sm" active={regionF === r} onClick={() => setRegionF(r)}>{r === 'all' ? 'All regions' : r}</Pill>
            ))}
          </div>

          {/* River / System dropdown */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-ink2 font-semibold shrink-0">River / system</span>
            <select
              value={systemF}
              onChange={e => setSystemF(e.target.value)}
              className="text-[13px] font-medium text-navy bg-white border border-line rounded-lg px-3 py-1.5 focus:outline-none focus:border-teal max-w-full"
            >
              <option value="all">All rivers / systems</option>
              {systemOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Active filter pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeFilters.map((f, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-white pill rounded-full text-[11px] text-navy px-2.5 py-1">
                {f.label}
                {f.k !== 'month' && (
                  <button onClick={() => f.k === 'type' ? setTypeF('all') : f.k === 'method' ? setMethodF('all') : f.k === 'region' ? setRegionF('all') : setSystemF('all')} className="text-ink2 hover:text-navy" aria-label={`Clear ${f.label}`}>×</button>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-5 md:px-10 pt-5">
        {filtered.length === 0 ? (
          <EmptyState onReset={() => { setTypeF('all'); setMethodF('all'); setRegionF('all'); setSystemF('all'); }} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(f => (
              <ResultCard key={f.id} f={f} month={isAllMonths ? null : month} onClick={() => setOpenId(f.id)} />
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      {openFishery && (
        <DetailPanel
          f={openFishery}
          month={isAllMonths ? null : month}
          isMobile={isMobile}
          onClose={() => setOpenId(null)}
          onOpenOther={(id) => setOpenId(id)}
        />
      )}
    </div>
  );
}

function ResultCard({ f, month, onClick }) {
  const k = getActivity(f.season, month);
  return (
    <Card onClick={onClick} className="p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink2 font-medium mb-1.5">
            <TypeIcon type={f.type} size={12} color="#666" /> {TYPE_LABEL[f.type]} · {f.region}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-[16px] font-medium text-navy leading-tight">{f.species}</div>
            {f.oddYear && <OddYearBadge />}
          </div>
          <div className="text-[13px] text-teal mt-0.5">{f.system}</div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <ActivityBadge kind={k} />
          <Icon name="chev" size={16} color="#999" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        {f.method.map(m => <MethodTag key={m} method={m} />)}
      </div>

      <p className="text-[13px] text-ink mt-3 leading-[1.45] line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {f.tagline}
      </p>

      <div className="mt-3">
        <MiniSeasonBar season={f.season} currentMonth={month} height={6} />
        <div className="flex w-full mt-1">
          {DATA.months.map((m, i) => (
            <div key={m} className="flex-1 text-center text-[9px]" style={{ color: month === i ? '#1B3A5C' : '#aaa', fontWeight: month === i ? 600 : 400 }}>{m[0]}</div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="text-center py-16">
      <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-4 opacity-50">
        <path d="M10 50 C 22 38, 34 38, 46 50 S 70 62, 78 50" stroke="#1B3A5C" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M40 12 L 40 38" stroke="#2E7D6B" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="40" cy="11" r="1.6" fill="#2E7D6B" />
        <path d="M40 38 Q 35 42, 38 46" stroke="#C0604A" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <div className="text-[15px] font-medium text-navy mb-1">No fisheries match these filters</div>
      <div className="text-[13px] text-ink2 mb-4">Try adjusting your month or removing a filter.</div>
      <button onClick={onReset} className="text-[13px] text-teal font-medium underline-offset-2 hover:underline">Reset filters →</button>
    </div>
  );
}

function DetailPanel({ f, month, onClose, isMobile, onOpenOther }) {
  const [tab, setTab] = useState(null);
  const tabs = [];
  if (f.flySetup)  tabs.push({ id: 'fly',   label: 'Fly setup' });
  if (f.gearSetup) tabs.push({ id: 'gear',  label: 'Gear setup' });
  if (f.access)    tabs.push({ id: 'details', label: 'Details' });
  if (f.yoy)       tabs.push({ id: 'years', label: 'Year notes' });
  const activeTab = tab || (tabs[0]?.id ?? null);

  const k = month != null ? getActivity(f.season, month) : null;

  // related: same month + within reasonable proximity (region or type); when no month is selected, just proximity
  const related = DATA.fisheries.filter(o => o.id !== f.id && (month == null || getActivity(o.season, month) !== 'off') && (o.region === f.region || o.type === f.type)).slice(0, 6);

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // animate slide-in
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShown(true), 10); return () => clearTimeout(t); }, []);

  const panelClasses = isMobile
    ? `fixed inset-x-0 bottom-0 top-[40px] z-50 bg-white rounded-t-2xl shadow-panel transition-transform duration-300 ${shown ? 'panel-shown' : 'panel-enter'}`
    : `fixed top-[56px] right-0 bottom-0 z-50 bg-white border-l border-line shadow-panel transition-transform duration-300`;

  const panelStyle = isMobile ? {} : { width: 'min(440px, 90vw)', transform: shown ? 'translateX(0)' : 'translateX(100%)' };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-navy/30 transition-opacity duration-300" style={{ opacity: shown ? 1 : 0 }} onClick={onClose} />

      <div className={panelClasses} style={panelStyle} role="dialog" aria-modal="true">
        {/* drag handle (mobile only) */}
        {isMobile && <div className="pt-2.5 pb-1 flex justify-center"><div className="w-10 h-1 rounded-full bg-line" /></div>}

        <div className="h-full overflow-y-auto pb-10">
          {/* Header */}
          <div className="px-5 md:px-6 pt-3 md:pt-5 pb-4 border-b border-line sticky top-0 bg-white z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink2 font-medium mb-1">
                  <TypeIcon type={f.type} size={12} color="#666" /> {TYPE_LABEL[f.type]} · {f.region}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[22px] font-medium text-navy leading-tight">{f.species}</div>
                  {f.oddYear && <OddYearBadge />}
                </div>
                <div className="text-[14px] text-teal mt-0.5">{f.system}</div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:bg-off shrink-0" aria-label="Close">
                <Icon name="close" size={16} color="#666" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {k && <ActivityBadge kind={k} />}
              <span className="text-[12px] text-ink2">{month != null ? `in ${DATA.monthsLong[month]}` : 'Full season overview'}</span>
              <div className="flex-1" />
              {f.method.map(m => <MethodTag key={m} method={m} />)}
            </div>

            <div className="mt-4">
              <MiniSeasonBar season={f.season} currentMonth={month} height={8} showLabels />
            </div>
          </div>

          {/* Body */}
          <div className="px-5 md:px-6 pt-4 space-y-5">
            <p className="text-[14px] text-ink leading-relaxed">{f.tagline}</p>

            {/* Quick facts */}
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-line rounded-lg p-2.5 bg-white">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink2 font-medium">
                  <Icon name="gauge" size={12} color="#666" /> Water/flow
                </div>
                <div className="text-[12.5px] text-navy mt-1 leading-snug">
                  {f.type === 'river' ? <LiveGauge f={f} /> : (f.gaugeWindow || '—')}
                </div>
              </div>
              <QuickFact icon="rules" label="Daily limit"    value={f.limit} />
              <QuickFact icon="pin"   label="Nearest town"   value={f.nearestTown} />
            </div>

            <div className="text-[11px] text-ink2 flex items-center gap-1.5 flex-wrap">
              <span>Limits last verified {new Date(DATA.regsInfo.verified + 'T00:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })} · {DATA.regsInfo.verifyFrequency}</span>
              <a href={f.type === 'river' || f.type === 'lake' ? (DATA.regsInfo.freshwaterByRegion[f.region] || DATA.regsInfo.freshwaterByRegion['Interior BC']) : DATA.regsInfo.tidalLink} target="_blank" rel="noopener" className="text-teal underline underline-offset-2">Check current regs →</a>
            </div>

            {/* Tabs */}
            {tabs.length > 0 && (
              <div>
                <div className="flex gap-1 border-b border-line">
                  {tabs.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`px-3 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                        activeTab === t.id ? 'border-teal text-navy' : 'border-transparent text-ink2 hover:text-navy'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="pt-4">
                  {activeTab === 'fly' && f.flySetup && (
                    <div className="border border-line rounded-lg overflow-hidden">
                      {[
                        ['Rod', f.flySetup.rod],
                        ['Line', f.flySetup.line],
                        ['Leader', f.flySetup.leader],
                        ['Technique', f.flySetup.technique],
                      ].map(([k, v], i) => (
                        <div key={k} className={`grid grid-cols-[88px_1fr] gap-3 px-3 py-2.5 ${i ? 'border-t border-line' : ''}`}>
                          <div className="text-[12px] uppercase tracking-wider text-ink2 font-medium pt-0.5">{k}</div>
                          <div className="text-[13px] text-ink leading-relaxed">{v}</div>
                        </div>
                      ))}
                      {f.flies?.length > 0 && (
                        <div className="border-t border-line px-3 py-2.5">
                          <div className="text-[12px] uppercase tracking-wider text-ink2 font-medium mb-1.5">Flies</div>
                          <div className="flex flex-wrap gap-1.5">
                            {f.flies.map(fly => (
                              <span key={fly} className="text-[12px] text-navy bg-softblue rounded-full px-2.5 py-1">{fly}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'gear' && f.gearSetup && (
                    <div className="border border-line rounded-lg p-3">
                      <p className="text-[13px] text-ink leading-relaxed">{f.gearSetup}</p>
                    </div>
                  )}

                  {activeTab === 'details' && f.access && (
                    <div className="border border-line rounded-lg overflow-hidden">
                      {[
                        ['Parking', f.access.parking],
                        ['Getting there', f.access.approach],
                        ['Popular spots', f.access.popularSpots],
                        ['Water type', f.access.waterType],
                      ].filter(([, v]) => v).map(([k, v], i) => (
                        <div key={k} className={`grid grid-cols-[96px_1fr] gap-3 px-3 py-2.5 ${i ? 'border-t border-line' : ''}`}>
                          <div className="text-[12px] uppercase tracking-wider text-ink2 font-medium pt-0.5">{k}</div>
                          <div className="text-[13px] text-ink leading-relaxed">{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'years' && f.yoy && (
                    <div className="border border-line rounded-lg overflow-hidden">
                      {Object.entries(f.yoy).map(([yr, note], i) => (
                        <div key={yr} className={`grid grid-cols-[64px_1fr] gap-3 px-3 py-2.5 ${i ? 'border-t border-line' : ''}`}>
                          <div className="text-[13px] text-navy font-semibold tabular-nums">{yr}</div>
                          <div className="text-[13px] text-ink leading-relaxed">{note}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Seasonal breakdown (if any) */}
            {f.seasonalBreakdown && (
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-teal mb-2">Season by season</div>
                <div className="border border-line rounded-lg divide-y divide-line">
                  {f.seasonalBreakdown.map((s, i) => (
                    <div key={i} className="px-3 py-3">
                      <div className="text-[13px] font-medium text-navy mb-1">{s.season}</div>
                      <p className="text-[13px] text-ink leading-relaxed">{s.tactics}</p>
                      {s.flies?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {s.flies.map(fl => <span key={fl} className="text-[11.5px] text-navy bg-softblue rounded-full px-2.5 py-1">{fl}</span>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Water conditions (if any) */}
            {f.waterConditions && (
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-teal mb-2">Water conditions</div>
                <div className="border border-line rounded-lg overflow-hidden">
                  {f.waterConditions.map((w, i) => (
                    <div key={i} className={`grid grid-cols-[88px_88px_1fr] gap-3 px-3 py-2.5 ${i ? 'border-t border-line' : ''}`}>
                      <div className="text-[13px] text-navy font-medium">{w.level}</div>
                      <div className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: w.condition === 'PRIME' ? '#2E7D6B' : w.condition.includes('Low') ? '#B8860B' : '#C0604A' }}>{w.condition}</div>
                      <div className="text-[13px] text-ink leading-relaxed">{w.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related */}
            {related.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-teal mb-2">{month != null ? `Also active in ${DATA.monthsLong[month]} nearby` : 'Also nearby'}</div>
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-5 md:-mx-6 px-5 md:px-6 pb-1">
                  {related.map(o => {
                    const ok = month != null ? getActivity(o.season, month) : null;
                    return (
                      <button key={o.id} onClick={() => onOpenOther(o.id)} className="shrink-0 w-[200px] text-left border border-line rounded-lg p-3 bg-white hover:border-teal transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-[10px] uppercase tracking-wider text-ink2 font-medium">{TYPE_LABEL[o.type]}</div>
                          {ok && <ActivityBadge kind={ok} />}
                        </div>
                        <div className="text-[13px] font-medium text-navy leading-tight">{o.species}</div>
                        <div className="text-[11px] text-teal mt-0.5">{o.system}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reg warning */}
            <div className="rounded-lg p-3 flex gap-3" style={{ background: '#FFF8E1', borderLeft: '3px solid #B8860B' }}>
              <Icon name="warning" size={18} color="#B8860B" />
              <div className="text-[12px] text-ink leading-relaxed">
                <span className="font-semibold text-navy">Always verify current DFO regulations</span> before fishing. This guide is for reference only — limits, openings and gear restrictions change throughout the season.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function OddYearBadge() {
  return <span className="shrink-0 text-[10px] uppercase tracking-wide font-semibold text-white rounded-full px-2 py-0.5" style={{ background: '#C0604A' }}>Odd years only</span>;
}

function QuickFact({ icon, label, value }) {
  return (
    <div className="border border-line rounded-lg p-2.5 bg-white">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-ink2 font-medium">
        <Icon name={icon} size={12} color="#666" /> {label}
      </div>
      <div className="text-[12.5px] text-navy mt-1 leading-snug">{value}</div>
    </div>
  );
}

window.ExploreView = ExploreView;
