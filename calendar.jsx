// calendar.jsx — Seasonal calendar matrix
function CalendarView({ goto, isMobile }) {
  const [hoverMonth, setHoverMonth] = useState(null);
  const [pickedMonth, setPickedMonth] = useState(null);

  const groups = [
    { type: 'river', label: 'Rivers' },
    { type: 'ocean', label: 'Ocean' },
    { type: 'beach', label: 'Beach' },
    { type: 'lake',  label: 'Interior lakes' },
  ];

  const monthForChips = pickedMonth ?? hoverMonth;

  return (
    <div className="pb-4">
      <header className="px-5 md:px-10 pt-6 md:pt-10 pb-4 max-w-6xl mx-auto">
        <SectionTitle
          kicker="Calendar"
          title="Seasonal Fishing Calendar"
          sub="When to fish what, across all BC systems."
          accent="#C0604A"
        />
      </header>

      <div className="px-5 md:px-10 max-w-6xl mx-auto">
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-[12px]" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th className="stickycol head text-left text-[11px] uppercase tracking-wider text-ink2 font-semibold px-3 py-2.5 border-b border-line min-w-[200px]">Fishery</th>
                  {DATA.months.map((m, i) => (
                    <th
                      key={m}
                      onMouseEnter={() => setHoverMonth(i)}
                      onMouseLeave={() => setHoverMonth(null)}
                      onClick={() => setPickedMonth(p => p === i ? null : i)}
                      className={`text-center text-[11px] uppercase tracking-wider font-semibold px-1 py-2.5 border-b border-line cursor-pointer transition-colors ${pickedMonth === i ? 'bg-navy text-white' : 'bg-softblue text-navy hover:bg-[#E5EBF2]'}`}
                      style={{ minWidth: 36 }}
                    >
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map(g => {
                  const rows = DATA.fisheries.filter(f => f.type === g.type);
                  if (!rows.length) return null;
                  return (
                    <React.Fragment key={g.type}>
                      <tr>
                        <td colSpan={13} className="bg-off px-3 py-2 text-[11px] uppercase tracking-[0.14em] font-semibold text-teal border-b border-line">
                          <div className="flex items-center gap-2">
                            <TypeIcon type={g.type} size={14} color="#2E7D6B" /> {g.label}
                          </div>
                        </td>
                      </tr>
                      {rows.map(f => (
                        <tr key={f.id} className="hover:bg-[#FAFAF6]">
                          <td className="stickycol border-b border-line px-3 py-2.5">
                            <button onClick={() => goto('explore', { openId: f.id })} className="text-left">
                              <div className="text-[13px] text-navy font-medium leading-tight">{f.species}</div>
                              <div className="text-[11px] text-teal mt-0.5">{f.system}</div>
                            </button>
                          </td>
                          {DATA.months.map((_, i) => {
                            const k = getActivity(f.season, i);
                            const isCol = monthForChips === i;
                            return (
                              <td key={i} className="border-b border-line p-[3px]" style={{ background: isCol ? 'rgba(46,125,107,0.06)' : 'transparent' }}>
                                <div className="w-full h-6 rounded-[3px]" style={{ background: ACT[k].bg }} title={`${DATA.monthsLong[i]} • ${ACT[k].label}`} />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[12px] text-ink2">
          {[
            { k: 'peak',   label: 'Peak season' },
            { k: 'active', label: 'Active' },
            { k: 'light',  label: 'Light' },
            { k: 'off',    label: 'Off-season' },
          ].map(o => (
            <div key={o.k} className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm" style={{ background: ACT[o.k].bg }} />
              <span>{o.label}</span>
            </div>
          ))}
          <div className="hidden md:block flex-1" />
          <div className="text-[12px] text-ink2 md:text-right">
            Click a month column for the highlights below ↓
          </div>
        </div>

        {/* Month at a glance */}
        <div className="mt-8">
          <SectionTitle title="Month at a glance" sub={pickedMonth != null ? `${DATA.monthsLong[pickedMonth]} — peak & active fisheries` : 'Click any month to see what\'s on.'} />
          {pickedMonth != null ? (
            <MonthGlance month={pickedMonth} goto={goto} />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {DATA.months.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setPickedMonth(i)}
                  className="border border-line rounded-lg bg-white px-3 py-3 hover:border-teal text-left"
                >
                  <div className="text-[13px] font-medium text-navy">{m}</div>
                  <MonthMiniSummary month={i} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthMiniSummary({ month }) {
  const peak = DATA.fisheries.filter(f => f.season.peak.includes(month)).length;
  const active = DATA.fisheries.filter(f => f.season.active.includes(month)).length;
  return (
    <div className="mt-1.5 text-[11px] text-ink2 flex items-center gap-2">
      <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: ACT.peak.bg }} />{peak}</span>
      <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: ACT.active.bg }} />{active}</span>
    </div>
  );
}

function MonthGlance({ month, goto }) {
  const peak = DATA.fisheries.filter(f => f.season.peak.includes(month));
  const active = DATA.fisheries.filter(f => f.season.active.includes(month));

  const block = (title, kind, list) => (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <ActivityBadge kind={kind} />
        <div className="text-[13px] text-ink2">{list.length} {list.length === 1 ? 'fishery' : 'fisheries'}</div>
      </div>
      {list.length === 0 ? (
        <div className="text-[13px] text-ink2 italic">Nothing in {kind === 'peak' ? 'peak' : 'active'} this month.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {list.map(f => (
            <button key={f.id} onClick={() => goto('explore', { month, openId: f.id })} className="text-left border border-line rounded-lg p-3 bg-white hover:border-teal">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-medium text-navy">{f.species}</div>
                <TypeIcon type={f.type} size={14} color="#666" />
              </div>
              <div className="text-[12px] text-teal mt-0.5">{f.system}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {block('Peak', 'peak', peak)}
      {block('Active', 'active', active)}
    </div>
  );
}

window.CalendarView = CalendarView;
