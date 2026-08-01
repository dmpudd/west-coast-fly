// interiorlakes.jsx — Interior Lakes hub
function InteriorLakesView({ isMobile }) {
  const [bug, setBug] = useState('chironomid');
  const bugData = DATA.entomology.find(e => e.id === bug);

  const iceOffOrder = [...DATA.interiorLakes].sort((a, b) => a.elevation.localeCompare(b.elevation));

  return (
    <div className="pb-4">
      <section className="px-5 md:px-10 pt-8 md:pt-12 pb-8 max-w-5xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-salmon mb-3">Special section</div>
        <h1 className="text-navy font-medium text-[28px] md:text-[40px] leading-tight">Interior Lakes</h1>
        <p className="text-teal text-[14px] md:text-[16px] mt-2 max-w-2xl">
          BC's stillwater heartland — Kamloops, Nicola and Cariboo lakes built on chironomids, scuds and a season-long parade of hatches.
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:overflow-visible overflow-x-auto no-scrollbar">
          {[
            { k: DATA.interiorLakes.length + '+', v: 'named lakes profiled here' },
            { k: '6',                              v: 'core stillwater insect groups' },
            { k: 'Late Mar–May', v: 'ice-off window, low to high elevation' },
            { k: '54–60°F', v: 'prime chironomid water temperature' },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-line rounded-xl p-4 min-w-[180px]">
              <div className="text-[18px] md:text-[22px] font-medium text-navy leading-tight">{f.k}</div>
              <div className="text-[12px] text-ink2 mt-1.5 leading-snug">{f.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ice-off tracker */}
      <section className="px-5 md:px-10 pb-10 max-w-5xl mx-auto">
        <SectionTitle kicker="Season start" title="Ice-off tracker" sub="Lower elevation lakes open first — plan a circuit from valley to plateau as spring advances." />
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          {iceOffOrder.map((l, i) => (
            <div key={l.name} className={`grid grid-cols-[1fr_90px_140px] md:grid-cols-[1fr_100px_160px] gap-3 px-4 py-3 items-center ${i ? 'border-t border-line' : ''}`}>
              <div>
                <div className="text-[13.5px] font-medium text-navy">{l.name}</div>
                <div className="text-[11.5px] text-ink2">{l.region}</div>
              </div>
              <div className="text-[12px] text-ink2 text-right md:text-left whitespace-nowrap">{l.elevation}</div>
              <div className="text-[12.5px] text-teal font-medium text-right">{l.iceOff}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Thermocline */}
      <section className="px-5 md:px-10 pb-10 max-w-5xl mx-auto">
        <SectionTitle kicker="Structure" title="Read the thermocline" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5 items-start">
          <p className="text-[14px] text-ink leading-relaxed">
            By mid-summer most Interior lakes stratify: a warm surface layer, a sharp thermocline, and cold oxygenated water below. Trout — and their food — concentrate at or just above the thermocline. Use a thermometer or electronics to find it, then fish your chironomid or leech pattern at that depth rather than a fixed distance off bottom.
          </p>
          <div className="bg-white border border-line rounded-xl overflow-hidden">
            <ThermoclineDiagram />
          </div>
        </div>
      </section>

      {/* Entomology tabs */}
      <section className="px-5 md:px-10 pb-10 max-w-5xl mx-auto">
        <SectionTitle kicker="Entomology" title="Six insects that run the calendar" />
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="flex border-b border-line overflow-x-auto no-scrollbar">
            {DATA.entomology.map(e => (
              <button
                key={e.id}
                onClick={() => setBug(e.id)}
                className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  bug === e.id ? 'border-teal text-navy bg-softblue/60' : 'border-transparent text-ink2 hover:text-navy'
                }`}
              >
                <EntomologyIcon id={e.id} size={16} color={bug === e.id ? '#2E7D6B' : '#888'} />
                {e.name}
              </button>
            ))}
          </div>
          {bugData && (
            <div className="p-5">
              <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
                <div className="text-[15px] font-medium text-navy italic">{bugData.latin}</div>
                <MiniSeasonBar season={{ peak: bugData.months, active: [], light: [], off: [] }} height={6} />
              </div>

              <div className="mb-3">
                <div className="text-[11px] uppercase tracking-wider text-ink2 font-semibold mb-1.5">Life stages</div>
                <ol className="space-y-1.5">
                  {bugData.stages.map((s, i) => (
                    <li key={i} className="text-[13px] text-ink leading-relaxed flex gap-2.5">
                      <span className="shrink-0 w-4 text-teal font-semibold">{i + 1}</span>{s}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="border border-line rounded-lg p-3">
                  <div className="text-[11px] uppercase tracking-wider text-ink2 font-semibold mb-1">What to imitate</div>
                  <div className="text-[13px] text-ink leading-relaxed">{bugData.imitates}</div>
                </div>
                <div className="border border-line rounded-lg p-3">
                  <div className="text-[11px] uppercase tracking-wider text-ink2 font-semibold mb-1">Depth</div>
                  <div className="text-[13px] text-ink leading-relaxed">{bugData.depth}</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[11px] uppercase tracking-wider text-ink2 font-semibold mb-1.5">Key flies</div>
                <div className="flex flex-wrap gap-1.5">
                  {bugData.keyFlies.map(fl => (
                    <span key={fl} className="text-[12px] text-navy bg-softblue rounded-full px-2.5 py-1">{fl}</span>
                  ))}
                </div>
              </div>

              <p className="text-[13px] text-ink leading-relaxed mt-4 border-t border-line pt-3">{bugData.notes}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lakes profiles */}
      <section className="px-5 md:px-10 pb-12 max-w-5xl mx-auto">
        <SectionTitle kicker="Where" title="Ten Interior lakes worth knowing" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DATA.interiorLakes.map(l => (
            <Card key={l.name} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[15px] font-medium text-navy leading-tight">{l.name}</div>
                <TypeIcon type="lake" size={14} color="#1B3A5C" />
              </div>
              <div className="text-[12px] text-teal mt-0.5">{l.region} · {l.elevation} elevation</div>
              <p className="text-[13px] text-ink mt-2.5 leading-relaxed">{l.profile}</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px] text-ink2 uppercase tracking-wider font-medium mr-0.5">Ice-off</span>
                <span className="text-[12px] text-navy font-medium">{l.iceOff}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {l.entomology.map(id => {
                  const e = DATA.entomology.find(x => x.id === id);
                  return <span key={id} className="inline-flex items-center gap-1 text-[11px] text-ink2 bg-[#EFEEE8] rounded-full px-2 py-1"><EntomologyIcon id={id} size={12} color="#666" />{e?.name.split(' ')[0]}</span>;
                })}
              </div>
              {l.access && (
                <div className="mt-3 pt-3 border-t border-line grid grid-cols-1 gap-2">
                  <div className="flex gap-2"><Icon name="boat" size={13} color="#666" /><div className="text-[12px] text-ink leading-snug"><span className="text-ink2 uppercase tracking-wider text-[10px] font-semibold mr-1">Launch</span>{l.access.launch}</div></div>
                  <div className="flex gap-2"><Icon name="pin" size={13} color="#666" /><div className="text-[12px] text-ink leading-snug"><span className="text-ink2 uppercase tracking-wider text-[10px] font-semibold mr-1">Dock</span>{l.access.dock}</div></div>
                  <div className="flex gap-2"><Icon name="gauge" size={13} color="#666" /><div className="text-[12px] text-ink leading-snug"><span className="text-ink2 uppercase tracking-wider text-[10px] font-semibold mr-1">Shore</span>{l.access.shore}</div></div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

window.InteriorLakesView = InteriorLakesView;
