// app.jsx — App shell, nav, view switcher
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const on = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return isMobile;
}

const TABS = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'explore',  label: 'Explore',  icon: 'search' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'flies',    label: 'Flies',    icon: 'fly' },
  { id: 'kokanee',  label: 'Kokanee',  icon: 'fish' },
  { id: 'lakes',    label: 'Interior Lakes', icon: 'lake' },
];

function App() {
  const isMobile = useIsMobile();
  const [view, setView] = useState('home');
  const [exploreState, setExploreState] = useState({});

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [view]);

  function goto(target, opts = {}) {
    if (target === 'explore') setExploreState(s => ({ ...s, ...opts }));
    setView(target);
  }

  return (
    <div className="min-h-screen pb-[88px] md:pb-0">
      {/* Desktop top nav */}
      {!isMobile && (
        <header className="sticky top-0 z-30 bg-white border-b border-line h-[56px]" data-screen-label="App nav">
          <div className="max-w-6xl mx-auto h-full px-6 flex items-center gap-6">
            <button onClick={() => goto('home')} className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-md bg-navy text-white flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 12c3-5 9-6 13-3l5-2-2 5 2 5-5-2c-4 3-10 2-13-3z" stroke="white" strokeWidth="1.7" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-[18px] font-bold text-navy">West Coast Fly</span>
            </button>
            <nav className="flex items-center gap-1 ml-4">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => goto(t.id)}
                  className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                    view === t.id ? 'text-navy bg-softblue' : 'text-ink2 hover:text-navy hover:bg-off'
                  } relative`}
                >
                  {t.label === 'Flies' ? 'Fly Patterns' : t.label}
                  {view === t.id && <span className="absolute -bottom-[10px] left-3 right-3 h-[2px] bg-teal rounded-full" />}
                </button>
              ))}
            </nav>
            <div className="flex-1" />
            <div className="text-[12px] text-ink2 hidden md:block">BC fishing reference</div>
          </div>
        </header>
      )}

      {/* Views */}
      <main data-screen-label={`view-${view}`}>
        {view === 'home'     && <HomeView     isMobile={isMobile} goto={goto} />}
        {view === 'explore'  && <ExploreView  isMobile={isMobile} initial={exploreState} />}
        {view === 'calendar' && <CalendarView isMobile={isMobile} goto={goto} />}
        {view === 'flies'    && <FliesView    isMobile={isMobile} />}
        {view === 'kokanee'  && <KokaneeView  isMobile={isMobile} />}
        {view === 'lakes'    && <InteriorLakesView isMobile={isMobile} />}
      </main>

      {/* Mobile bottom tab bar */}
      {isMobile && (
        <nav className="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-line" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex">
            {TABS.map(t => {
              const active = view === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => goto(t.id)}
                  className="flex-1 flex flex-col items-center justify-center py-2.5 relative"
                  style={{ minHeight: 56 }}
                >
                  <Icon name={t.icon} size={20} color={active ? '#2E7D6B' : '#888'} stroke={active ? 1.9 : 1.6} />
                  <span className={`text-[10.5px] mt-0.5 ${active ? 'text-teal font-semibold' : 'text-ink2'}`}>{t.label}</span>
                  {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-teal" />}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
