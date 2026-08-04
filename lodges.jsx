// lodges.jsx — Fishing lodges & resorts directory
function LodgesView({ isMobile }) {
  const lodges = DATA.lodges || [];
  const regions = ['All', ...Array.from(new Set(lodges.map(l => l.region)))];
  const [region, setRegion] = useState('All');
  const shown = region === 'All' ? lodges : lodges.filter(l => l.region === region);

  return (
    <div className="pb-4">
      <section className="px-5 md:px-10 pt-8 md:pt-12 pb-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-salmon">Places to stay</span>
        </div>
        <h1 className="text-navy font-medium text-[28px] md:text-[40px] leading-tight">Fishing Lodges & Resorts</h1>
        <p className="text-teal text-[14px] md:text-[16px] mt-2 max-w-2xl">
          Lodges, cabins and resorts across BC's Cariboo Chilcotin Coast tourism region — Land of Hidden Waters, Cariboo Gold Rush, Highway 24, Chilcotin, and Great Bear Rainforest.
        </p>

        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
                region === r ? 'bg-navy text-white border-navy' : 'bg-white text-ink2 border-line hover:border-navy hover:text-navy'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-10 pb-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shown.map((l, i) => (
            <div key={i} className="bg-white border border-line rounded-xl p-4 flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-softblue flex items-center justify-center shrink-0">
                <Icon name="lodge" size={18} color="#1B3A5C" />
              </div>
              <div className="min-w-0">
                <div className="text-navy font-medium text-[15px] leading-snug">{l.name}</div>
                {l.location && <div className="text-[12px] text-ink2 mt-0.5">{l.location}</div>}
                <div className="mt-2 space-y-1 text-[13px] text-ink">
                  {l.url && <div><a href={l.url} target="_blank" rel="noopener noreferrer" className="text-teal hover:text-navy break-all">{l.url.replace(/^https?:\/\//, '')}</a></div>}
                  {l.phone && <div className="text-ink2">{l.phone}</div>}
                  {l.email && <div className="text-ink2 break-all">{l.email}</div>}
                  {l.price && <div className="text-navy font-medium">{l.price}</div>}
                  {l.minStay && <div className="text-ink2">Min stay: {l.minStay}</div>}
                  {!l.url && !l.phone && !l.email && <div className="text-ink2 text-[12px]">No contact info on file yet</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[12px] text-ink2 mt-4">Sources: BC's Land of Hidden Waters fishing resort directory; Cariboo Chilcotin Coast tourism region listings (Cariboo Gold Rush, Highway 24 "Fishing Highway", Chilcotin, Great Bear Rainforest). Contact each lodge directly for rates, availability and guided-trip options — website/phone/email not yet confirmed for every entry.</div>
      </section>
    </div>
  );
}

window.LodgesView = LodgesView;
