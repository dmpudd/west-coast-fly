// flies.jsx — Fly Pattern Library
const CATEGORY_MAP = {
  'chironomid': 'lake',
  'attractor':  'lake',
  'leech':      'lake',
  'scud':       'lake',
  'damsel':     'lake',
  'dragonfly':  'lake',
  'dry-fly':    'dry',
  'beach':      'beach',
  'steelhead-salmon': 'river',
  'eggs':       'river',
  'water-boatman': 'lake',
};

const CATEGORY_LABEL = {
  chironomid: 'Chironomids & bloodworms', leech: 'Leeches & buggers', attractor: 'Blobs, boobies & attractors',
  damsel: 'Damselflies', dragonfly: 'Dragonflies', scud: 'Shrimp (scuds)', 'water-boatman': 'Water boatmen & backswimmers',
  mayfly: 'Mayflies', caddis: 'Caddis (sedge)', 'dry-fly': 'Dry flies & emergers', nymph: 'Nymphs & wet flies',
  streamer: 'Streamers & baitfish', 'steelhead-salmon': 'Steelhead', eggs: 'Egg patterns', beach: 'Beach patterns',
};

function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

function FliesView({ isMobile }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  const cats = [
    { v: 'all',   l: 'All' },
    { v: 'river', l: 'River patterns' },
    { v: 'lake',  l: 'Lake patterns' },
    { v: 'beach', l: 'Beach patterns' },
    { v: 'dry',   l: 'Dry flies' },
    { v: 'attractor', l: 'Attractors' },
  ];

  const filtered = useMemo(() => {
    return DATA.flyPatterns.filter(p => {
      // category mapping — leech/eggs show in both
      if (cat !== 'all') {
        if (cat === 'attractor' && p.category !== 'attractor') return false;
        if (cat !== 'attractor') {
          // pattern can match through CATEGORY_MAP OR via environment list
          const mapped = CATEGORY_MAP[p.category];
          const inEnv = (cat === 'river' && p.environment.includes('river'))
                     || (cat === 'lake'  && p.environment.includes('lake'))
                     || (cat === 'beach' && p.environment.includes('beach'))
                     || (cat === 'dry'   && p.category === 'dry-fly');
          if (mapped !== cat && !inEnv) return false;
        }
      }
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, cat]);

  return (
    <div className="pb-4">
      <header className="px-5 md:px-10 pt-6 md:pt-10 pb-4 max-w-5xl mx-auto">
        <SectionTitle
          kicker="Reference"
          title="Fly Pattern Library"
          sub={`${DATA.flyPatterns.length} patterns — every fly worth tying for BC waters.`}
        />

        <div className="relative mt-4">
          <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icon name="search" size={16} color="#888" /></div>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by pattern name…"
            className="w-full bg-white border border-line rounded-lg pl-9 pr-3 py-2.5 text-[14px] text-navy placeholder:text-ink2 focus:outline-none focus:border-teal"
          />
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar -mx-5 md:-mx-10 px-5 md:px-10">
          {cats.map(c => (
            <Pill key={c.v} size="sm" active={cat === c.v} onClick={() => setCat(c.v)}>{c.l}</Pill>
          ))}
        </div>
      </header>

      <div className="px-5 md:px-10 max-w-5xl mx-auto">
        <div className="text-[12px] text-ink2 mb-3"><span className="text-navy font-medium">{filtered.length}</span> {filtered.length === 1 ? 'pattern' : 'patterns'}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((p, idx) => (
            <FlyCard key={p.name} p={p} open={expanded === p.name} onToggle={() => setExpanded(e => e === p.name ? null : p.name)} onEnlarge={(src) => setLightbox({ src, name: p.name })} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-ink2 text-[13px]">No patterns match "{q}".</div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-navy/80 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.name} className="max-w-full max-h-[80vh] rounded-lg object-contain bg-white" />
            <div className="flex items-center gap-4">
              <span className="text-white text-[14px] font-medium">{lightbox.name}</span>
              <button onClick={() => setLightbox(null)} className="text-white/80 hover:text-white text-[13px] underline underline-offset-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ENV_COLORS = {
  river: '#2E7D6B',
  lake:  '#1B3A5C',
  beach: '#C0604A',
};

function FlyCard({ p, open, onToggle, onEnlarge }) {
  const slotId = 'fly-' + slugify(p.name);
  function handleImageClick(e) {
    e.stopPropagation();
    const el = document.getElementById(slotId);
    if (el && el.hasAttribute('data-filled') && el.shadowRoot) {
      const img = el.shadowRoot.querySelector('.frame img');
      if (img && img.src) onEnlarge(img.src);
    }
  }
  return (
    <div className={`bg-white border rounded-xl transition-colors ${open ? 'border-teal' : 'border-line'}`}>
      <button onClick={onToggle} className="w-full text-left p-4 flex items-start gap-3">
        <div className="relative shrink-0 rounded-lg overflow-hidden" style={{ width: 110, height: 80 }} onClick={handleImageClick} title="Click to enlarge">
          <image-slot id={slotId} shape="rect" placeholder="Photo"></image-slot>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[14px] font-medium text-navy leading-tight">{p.name}</div>
            <div className={`shrink-0 text-ink2 transition-transform ${open ? 'rotate-90' : ''}`}><Icon name="chev" size={14} color="#999" /></div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {p.environment.map(e => (
              <span key={e} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded text-white font-medium" style={{ background: ENV_COLORS[e] || '#666' }}>
                {e}
              </span>
            ))}
            <span className="text-[11px] text-ink2">Hook {p.hookSize}</span>
          </div>
        </div>
      </button>
      <div className="overflow-hidden transition-all" style={{ maxHeight: open ? 400 : 0 }}>
        <div className="px-4 pb-4 pt-1 border-t border-line">
          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-wider text-ink2 font-semibold mb-1">Colours</div>
            <div className="text-[13px] text-ink leading-relaxed">{p.colours}</div>
          </div>
          <div className="mt-3">
            <div className="text-[11px] uppercase tracking-wider text-ink2 font-semibold mb-1">Technique</div>
            <div className="text-[13px] text-ink leading-relaxed">{p.technique}</div>
          </div>
          {DATA.flyTactics[p.category] && (
            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wider text-ink2 font-semibold mb-1">Field notes — {CATEGORY_LABEL[p.category] || p.category}</div>
              <ul className="space-y-1.5">
                {DATA.flyTactics[p.category].map((t, i) => (
                  <li key={i} className="text-[13px] text-ink leading-relaxed flex gap-2">
                    <span className="text-teal shrink-0 pt-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal" /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.FliesView = FliesView;
window.CATEGORY_MAP = CATEGORY_MAP;
window.CATEGORY_LABEL = CATEGORY_LABEL;
