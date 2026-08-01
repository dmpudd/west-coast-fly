// home.jsx — Home view
function HomeView({ goto, isMobile }) {
  const currentMonth = new Date().getMonth();
  // Default to September per spec when there's no fishing right now
  const displayMonth = useMemo(() => {
    const anyPeak = DATA.fisheries.some(f => f.season.peak.includes(currentMonth));
    return anyPeak ? currentMonth : 8; // 8 = September
  }, [currentMonth]);

  const now = DATA.fisheries
    .map(f => ({ f, k: getActivity(f.season, displayMonth) }))
    .filter(x => x.k === 'peak' || x.k === 'active')
    .sort((a, b) => (a.k === 'peak' ? -1 : 1) - (b.k === 'peak' ? -1 : 1));

  const monthName = DATA.monthsLong[displayMonth];

  const entries = [
    { id: 'time',   label: 'By Time',     sub: 'Pick a month',          icon: 'calendar', tab: 'calendar' },
    { id: 'where',  label: 'By Fishery',  sub: 'River, ocean, lake',    icon: 'filter',   tab: 'explore' },
    { id: 'what',   label: 'By Species',  sub: 'Salmon, trout & more',  icon: 'fish',     tab: 'explore' },
  ];

  const tiles = [
    { id: 'rivers',  label: 'Rivers',          sub: '6 systems',  icon: 'river',  tab: 'explore', filter: { type: 'river' } },
    { id: 'ocean',   label: 'Ocean & Beach',   sub: '3 fisheries',icon: 'ocean',  tab: 'explore', filter: { type: 'ocean' } },
    { id: 'lakes',   label: 'Interior Lakes',  sub: 'Chironomids & kokanee', icon: 'lake', tab: 'explore', filter: { type: 'lake' } },
    { id: 'flies',   label: 'Fly Patterns',    sub: '16 patterns',icon: null,     tab: 'flies' },
  ];

  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="wave-bg px-5 md:px-10 pt-5 md:pt-7 pb-5 md:pb-7 border-b border-line">
        <div className="max-w-5xl mx-auto">
          <p className="text-teal text-[13px] md:text-[15px] max-w-xl">
            BC's most complete fishing guide — rivers, lakes, ocean & beaches.
          </p>

          {/* What's fishing now */}
          <div className="mt-4 md:mt-5">
            <div className="flex items-end justify-between mb-2">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-salmon">What's fishing now</div>
                <div className="text-[16px] md:text-[18px] font-medium text-navy mt-0.5">{monthName}</div>
              </div>
              <button onClick={() => goto('explore', { month: displayMonth })} className="text-[12px] text-teal font-medium underline-offset-2 hover:underline">See all →</button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 md:-mx-10 px-5 md:px-10 pb-1">
              {now.map(({ f, k }) => (
                <button
                  key={f.id}
                  onClick={() => goto('explore', { month: displayMonth, openId: f.id })}
                  className="shrink-0 w-[220px] md:w-[240px] text-left bg-white border border-line rounded-xl p-3 hover:border-[#cfcfc4] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink2 font-medium">
                      <TypeIcon type={f.type} size={13} color="#666" />
                      {TYPE_LABEL[f.type]}
                    </div>
                    <ActivityBadge kind={k} />
                  </div>
                  <div className="text-[14px] font-medium text-navy leading-tight">{f.species}</div>
                  <div className="text-[11px] text-teal mt-0.5">{f.system}</div>
                  <div className="mt-2"><MiniSeasonBar season={f.season} currentMonth={displayMonth} height={5} /></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Entry points */}
      <section className="px-5 md:px-10 py-4 md:py-5 max-w-5xl mx-auto w-full">
        <SectionTitle kicker="Start exploring" title="Find your next trip" sub="Three ways to slice the guide." />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {entries.map(e => (
            <button
              key={e.id}
              onClick={() => goto(e.tab, e.id === 'what' ? { groupBy: 'species' } : {})}
              className="bg-white border border-line rounded-xl p-3.5 text-left hover:border-teal hover:shadow-card transition-all group"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-1.5" style={{ background: '#F0F4F8' }}>
                <Icon name={e.icon} size={18} color="#1B3A5C" />
              </div>
              <div className="text-[14px] font-medium text-navy">{e.label}</div>
              <div className="text-[12px] text-ink2 mt-0.5">{e.sub}</div>
              <div className="text-teal text-[12px] mt-1.5 font-medium group-hover:underline">Open →</div>
            </button>
          ))}
        </div>
      </section>

      {/* Feature sections */}
      <section className="px-5 md:px-10 pb-10 max-w-5xl mx-auto w-full">
        <SectionTitle title="Browse by water" />
        <div className="grid grid-cols-2 gap-3">
          {tiles.map(t => (
            <button
              key={t.id}
              onClick={() => goto(t.tab, t.filter ? { type: t.filter.type } : {})}
              className="bg-white border border-line rounded-xl p-4 md:p-5 text-left hover:border-teal transition-colors flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#F0F4F8' }}>
                {t.icon ? <TypeIcon type={t.icon} size={20} color="#1B3A5C" /> : <Icon name="fly" size={20} color="#1B3A5C" />}
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-medium text-navy">{t.label}</div>
                <div className="text-[12px] text-ink2 mt-0.5">{t.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 md:px-10 py-6 border-t border-line bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-[12px] text-ink2">
            <span className="text-navy font-medium">westcoastfly.com</span> — BC fishing reference guide.
            Always verify regulations with <a className="text-teal underline" href="#">DFO</a> before fishing.
          </div>
        </div>
      </footer>
    </div>
  );
}

window.HomeView = HomeView;
