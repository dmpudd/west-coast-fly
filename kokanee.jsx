// kokanee.jsx — Kokanee section
function KokaneeView({ isMobile }) {
  const [tab, setTab] = useState('trolling');

  const tabs = [
    { id: 'trolling', label: 'Open water trolling', icon: 'boat' },
    { id: 'spring',   label: 'Spring fly fishing',  icon: 'fly' },
    { id: 'ice',      label: 'Ice fishing',         icon: 'snow' },
  ];

  const content = {
    trolling: [
      'Speed: 1.2–1.4mph — slow troll',
      '3–5 inch dodger + 90cm leader + wedding band spinner + pink maggot sweetener',
      'Downrigger required from June onward as fish follow thermocline deeper',
      'Key colours: pink, UV finishes',
      'In Cariboo lakes fish often distribute throughout the column — multiple depths',
    ],
    spring: [
      'Spring only (April–May before thermocline sets up)',
      '5wt, 9–10ft single-hand rod with WF floating line and indicator',
      '4–6lb fluorocarbon leader — set indicator at varying depths',
      'Kokanee may feed as shallow as 3ft in early season',
      'Same chironomid tactics as rainbow trout: Black & Red, Chromie, Blob (chartreuse/pink)',
    ],
    ice: [
      'Small silver flasher + white ice jig + maggot',
      'Fish at 10–20ft depth on Monte Lake; deeper on big lakes',
      'On Monte the fish stack over 80ft of water with lures at ~15ft',
      'Tip jigs with single maggot — scent matters in cold water',
    ],
  };

  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="px-5 md:px-10 pt-8 md:pt-12 pb-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-salmon">Special section</span>
        </div>
        <h1 className="text-navy font-medium text-[28px] md:text-[40px] leading-tight">Kokanee Salmon</h1>
        <p className="text-teal text-[14px] md:text-[16px] mt-2 max-w-2xl">
          BC's landlocked sockeye — fighting spirit, world-class lakes, exceptional table fare.
        </p>

        {/* Quick facts */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:overflow-visible overflow-x-auto no-scrollbar">
          {[
            { k: '110+',          v: 'kokanee lakes in BC' },
            { k: '10–14"',        v: 'typical; up to 4lb+ in Cariboo trophy lakes' },
            { k: 'May–Aug',       v: 'open-water peak; year-round on ice' },
            { k: 'Excellent',     v: 'table quality — deep red flesh like ocean sockeye' },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-line rounded-xl p-4 min-w-[180px]">
              <div className="text-[18px] md:text-[22px] font-medium text-navy leading-tight">{f.k}</div>
              <div className="text-[12px] text-ink2 mt-1.5 leading-snug">{f.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Thermocline explainer */}
      <section className="px-5 md:px-10 pb-10 max-w-5xl mx-auto">
        <SectionTitle kicker="Thermocline" title="Find the layer, find the fish" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5 items-start">
          <p className="text-[14px] text-ink leading-relaxed">
            Kokanee are extremely temperature-sensitive. In summer, find the thermocline with electronics — fish will be in a tight band at this boundary. In Cariboo lakes (cooler water), fish distribute throughout the column. In Okanagan and Kootenay lakes the thermocline can be sharp and fish stack tight against it.
          </p>

          <div className="bg-white border border-line rounded-xl overflow-hidden">
            <ThermoclineDiagram />
          </div>
        </div>
      </section>

      {/* Method tabs */}
      <section className="px-5 md:px-10 pb-10 max-w-5xl mx-auto">
        <SectionTitle kicker="Tactics" title="Three ways to fish kokanee" />
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="flex border-b border-line overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-[13px] font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  tab === t.id ? 'border-teal text-navy bg-softblue/60' : 'border-transparent text-ink2 hover:text-navy'
                }`}
              >
                <Icon name={t.icon} size={16} color={tab === t.id ? '#2E7D6B' : '#888'} />
                {t.label}
              </button>
            ))}
          </div>
          <ul className="p-5 space-y-2">
            {content[tab].map((line, i) => (
              <li key={i} className="text-[14px] text-ink leading-relaxed flex gap-2.5">
                <span className="text-teal shrink-0 pt-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal" /></span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Lakes table */}
      <section className="px-5 md:px-10 pb-12 max-w-5xl mx-auto">
        <SectionTitle kicker="Where" title="BC kokanee lakes worth knowing" />
        <div className="bg-white border border-line rounded-xl overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-ink2 font-semibold bg-softblue/60">
                  <th className="text-left px-4 py-3">Lake</th>
                  <th className="text-left px-4 py-3">Region</th>
                  <th className="text-left px-4 py-3 whitespace-nowrap">Daily limit</th>
                  <th className="text-left px-4 py-3">Size</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Tactics & notes</th>
                </tr>
              </thead>
              <tbody>
                {DATA.kokanee.map((l, i) => {
                  const isWarn = /Kootenay/.test(l.lake);
                  return (
                    <tr key={l.lake} className={`border-t border-line ${isWarn ? 'bg-amber50/60' : ''}`}>
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-center gap-1.5">
                          {isWarn && <Icon name="warning" size={14} color="#B8860B" />}
                          <span className="text-navy font-medium">{l.lake}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-top text-ink2">{l.region}</td>
                      <td className="px-4 py-3 align-top text-ink whitespace-nowrap">{l.limit}</td>
                      <td className="px-4 py-3 align-top text-ink">{l.size}</td>
                      <td className="px-4 py-3 align-top text-ink hidden md:table-cell">{l.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-[12px] text-ink2 mt-2 flex items-center gap-1.5">
          <Icon name="warning" size={12} color="#B8860B" /> Kootenay Lake (West Arm) is open on restricted days only — check the BC Synopsis.
        </div>
      </section>
    </div>
  );
}

window.KokaneeView = KokaneeView;
