// techniques.jsx — Techniques hub: general strategy + fly-specific tactics, filterable by water type
const ENV_FLY_CATEGORIES = {
  lake:  ['chironomid','leech','attractor','damsel','dragonfly','scud','water-boatman','mayfly','caddis','dry-fly'],
  river: ['nymph','dry-fly','streamer','steelhead-salmon','eggs'],
  ocean: [],
};

function AccordionItem({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border border-line rounded-xl bg-white overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left px-4 py-3 flex items-center justify-between gap-3">
        <span className="text-[14px] font-medium text-navy">{title}</span>
        <span className={`shrink-0 text-ink2 transition-transform ${open ? 'rotate-90' : ''}`}><Icon name="chev" size={14} color="#999" /></span>
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t border-line">{children}</div>}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-1.5">
      {items.map((t, i) => (
        <li key={i} className="text-[13px] text-ink leading-relaxed flex gap-2">
          <span className="text-teal shrink-0 pt-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal" /></span>
          {t}
        </li>
      ))}
    </ul>
  );
}

function TechniquesView({ isMobile }) {
  const [env, setEnv] = useState('all');

  const envs = [
    { v: 'all',   l: 'All' },
    { v: 'river', l: 'River' },
    { v: 'lake',  l: 'Lake' },
    { v: 'ocean', l: 'Ocean' },
  ];

  const strategySections = useMemo(() => {
    const keys = env === 'all' ? ['lake', 'river', 'ocean'] : [env];
    return keys.flatMap(k => DATA.techniques[k].map(s => ({ ...s, env: k })));
  }, [env]);

  const flyCategories = useMemo(() => {
    const keys = env === 'all' ? ['lake', 'river', 'ocean'] : [env];
    const set = new Set(keys.flatMap(k => ENV_FLY_CATEGORIES[k]));
    return Array.from(set).filter(c => DATA.flyTactics[c]);
  }, [env]);

  const ENV_TITLE = { lake: 'Lake', river: 'River', ocean: 'Ocean' };

  return (
    <div className="pb-4">
      <header className="px-5 md:px-10 pt-6 md:pt-10 pb-4 max-w-5xl mx-auto">
        <SectionTitle
          kicker="Reference"
          title="Techniques"
          sub="General strategy and fly-specific tactics — from reading water to setting an indicator depth."
        />
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-5 md:-mx-10 px-5 md:px-10">
          {envs.map(e => (
            <Pill key={e.v} size="sm" active={env === e.v} onClick={() => setEnv(e.v)}>{e.l}</Pill>
          ))}
        </div>
      </header>

      <div className="px-5 md:px-10 max-w-5xl mx-auto space-y-8">
        <section>
          <SectionTitle kicker="Strategy" title="General strategy" />
          <div className="space-y-2">
            {strategySections.map((s, i) => (
              <AccordionItem key={i} title={env === 'all' ? `${ENV_TITLE[s.env]} — ${s.title}` : s.title}>
                <BulletList items={s.items} />
              </AccordionItem>
            ))}
          </div>
        </section>

        {flyCategories.length > 0 && (
          <section>
            <SectionTitle kicker="Fly-specific" title="Tactics by fly type" />
            <div className="space-y-2">
              {flyCategories.map(c => (
                <AccordionItem key={c} title={CATEGORY_LABEL[c] || c}>
                  <BulletList items={DATA.flyTactics[c]} />
                </AccordionItem>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

window.TechniquesView = TechniquesView;
