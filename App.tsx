import React, { useState, useEffect } from 'react';
import { View, Post } from './types';
import { MOCK_POSTS } from './constants';
import Navbar from './components/Navbar';
import PostGrid from './components/PostGrid';
import MigrationTool from './components/MigrationTool';
import CookieConsent from './components/CookieConsent';

const POSTS_PER_PAGE = 6;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showExportCode, setShowExportCode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('antosia_posts');
    if (savedPosts) {
      try {
        const parsed = JSON.parse(savedPosts);
        const combined = [...parsed];
        MOCK_POSTS.forEach(mock => {
          if (!combined.find(p => p.id === mock.id)) {
            combined.push(mock);
          }
        });
        return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } catch (e) {
        return MOCK_POSTS;
      }
    }
    return MOCK_POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  const DONATION_URL = "https://www.rownymkrokiem.pl/antoninawieczorek/";
  const KRS_NUMBER = "0000645714";
  const SPECIFIC_PURPOSE = "Antonina Wieczorek";

  useEffect(() => {
    localStorage.setItem('antosia_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, currentPage]);

  const handleDonationClick = () => {
    window.open(DONATION_URL, '_blank', 'noopener,noreferrer');
  };

  const navigateToPost = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('post');
  };

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentPage(1);
    setCurrentView('journal');
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten wpis?")) {
      setPosts(prevPosts => prevPosts.filter(p => p.id !== id));
    }
  };

  const generateConstantsCode = () => {
    return `import { Post } from './types';\n\nexport const MOCK_POSTS: Post[] = ${JSON.stringify(posts, null, 2)};`;
  };

  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const fixedContent = content.replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\n\n+/g, '\n\n').trim();
    const blocks = fixedContent.split('\n').map(b => b.trim()).filter(b => b.length > 0);
    
    return blocks.map((block, i) => {
      const imgRegex = /!\[(.*?)\]\((.*?)\)/;
      const imgMatch = block.match(imgRegex);
      if (imgMatch) {
        const [_, alt, url] = imgMatch;
        return (
          <figure key={i} className="my-16 -mx-4 md:-mx-12 lg:-mx-20">
            <img src={url} alt={alt} className="w-full rounded-[2.5rem] shadow-2xl border border-gray-100" />
            {alt && alt.length > 2 && <figcaption className="text-center text-xs text-gray-400 mt-6 italic">{alt}</figcaption>}
          </figure>
        );
      }
      if (block.startsWith('###')) {
        return (
          <h3 key={i} className="text-2xl serif text-red-500 mt-16 mb-8 font-bold flex items-center gap-6">
            <span className="h-px flex-grow bg-red-100"></span>
            <span className="shrink-0">{block.replace('###', '').trim()}</span>
            <span className="h-px flex-grow bg-red-100"></span>
          </h3>
        );
      }
      return <p key={i} className="mb-8 text-gray-700 leading-relaxed font-light text-xl">{block}</p>;
    });
  };

  const HelpWidget = () => (
    <div className="help-card p-8 md:p-14 rounded-[4rem] shadow-sm border border-red-100 max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
        <div className="flex-grow space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
            Zmień świat Antosi
          </div>
          <h3 className="text-3xl md:text-5xl serif font-bold text-red-600 leading-tight">Podaruj Antosi <span className="italic">sprawność</span></h3>
          <p className="text-gray-500 text-lg md:text-xl font-light leading-relaxed max-w-xl">
            Każdy przekazany 1.5% podatku lub darowizna to realna pomoc w opłaceniu kolejnych operacji i tysięcy godzin rehabilitacji.
          </p>
        </div>
        <div className="w-full lg:w-96 shrink-0 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-red-50 space-y-6 shadow-inner text-center">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-2">KRS dla 1.5%:</p>
              <p className="text-4xl font-mono font-bold text-gray-800 tracking-tighter">{KRS_NUMBER}</p>
            </div>
            <div className="pt-4 border-t border-red-50/50">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-2">Cel szczegółowy:</p>
              <p className="text-sm font-bold text-gray-700">{SPECIFIC_PURPOSE}</p>
            </div>
          </div>
          <button 
            onClick={handleDonationClick} 
            className="block w-full text-center btn-donate text-white py-6 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl transition-all"
          >
            Wpłać teraz online
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-24 pb-20">
            <section className="max-w-7xl mx-auto px-4 pt-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-7 space-y-8 order-2 lg:order-1 text-center lg:text-left">
                  <h1 className="text-5xl md:text-7xl serif leading-tight text-gray-900">Jestem <span className="text-red-500 italic">Antosia</span></h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">Każdego dnia udowadniam, że niemożliwe nie istnieje. Poznaj moją historię i zobacz, jak walczę o marzenia.</p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <button onClick={() => setCurrentView('history')} className="px-8 py-4 bg-gray-900 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-700 transition-all">Poznaj moją historię</button>
                    <button onClick={() => setCurrentView('passions')} className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Moje pasje</button>
                  </div>
                </div>
                <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
                  <div className="relative w-full max-w-md aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-3 border-8 border-white">
                    <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800" alt="Antosia" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between items-end mb-12"><h2 className="text-4xl serif">Co u nas słychać?</h2><button onClick={() => {setCurrentPage(1); setCurrentView('journal');}} className="text-sm font-bold text-red-500 border-b-2 border-red-500 pb-1">Wszystkie wpisy</button></div>
              <PostGrid posts={posts.slice(0, 3)} onPostClick={navigateToPost} />
            </section>
            <section className="max-w-7xl mx-auto px-4"><HelpWidget /></section>
          </div>
        );
      case 'history':
        return (
          <div className="max-w-4xl mx-auto px-4 py-24 animate-in fade-in duration-700">
            <header className="text-center mb-16 space-y-6">
              <h1 className="text-5xl md:text-7xl serif leading-tight">Moja <span className="italic text-red-500">historia</span></h1>
              <div className="h-1 bg-red-500 w-24 mx-auto rounded-full"></div>
            </header>
            
            <div className="prose-content space-y-8 text-xl font-light text-gray-700 leading-relaxed">
              <p>Antosia przyszła na świat 23 marca 2012 roku. Od pierwszych chwil życia musieliśmy mierzyć się z diagnozą, która dla wielu brzmiała jak wyrok – <span className="font-bold text-gray-900">obustronna hemimelia strzałkowa (fibular hemimelia)</span>. Oznaczało to brak kości strzałkowych w obu nóżkach oraz szereg innych wad towarzyszących.</p>
              
              <p>W Polsce proponowano nam jedynie amputację obu nóżek i naukę chodzenia na protezach. Nie pogodziliśmy się z tym. Rozpoczęliśmy walkę o sprawność Antosi, która zaprowadziła nas do USA, do kliniki dr. Drora Paleya – wybitnego chirurga, który daje dzieciom takim jak Antosia szansę na własne nogi.</p>

              <div className="my-16 -mx-4 md:-mx-12 lg:-mx-24 overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white relative">
                 <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=1200" alt="Antosia w dzieciństwie" className="w-full grayscale hover:grayscale-0 transition-all duration-1000" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>

              <h2 className="text-3xl serif text-red-500 pt-8">Lata walki i tysiące godzin rehabilitacji</h2>
              <p>Dzięki wsparciu tysięcy ludzi dobrej woli, Antosia przeszła już wiele skomplikowanych operacji rekonstrukcyjnych i wydłużających. Każda z nich wiązała się z bólem, miesiącami w gipsach i aparatach zewnętrznych. Jednak determinacja naszej córki jest silniejsza niż jakiekolwiek przeszkody.</p>
              
              <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100 italic text-2xl text-gray-600 font-serif leading-relaxed">
                "Wiedzieliśmy, że droga będzie długa i kręta, ale każdy krok Antosi na własnych nogach jest dla nas najpiękniejszą nagrodą za ten trud."
              </div>

              <p>Dziś Antosia jest aktywną, uśmiechniętą dziewczynką. Chodzi do szkoły, bawi się z rówieśnikami i uprawia sporty, o których kiedyś mogliśmy tylko marzyć. Ale to nie koniec drogi. Wraz ze wzrostem, nogi Antosi wymagają kolejnych korekt i nieustannej, kosztownej rehabilitacji, by mogła cieszyć się sprawnością również jako osoba dorosła.</p>
              
              <p className="text-gray-900 font-medium">Wasza pomoc pozwala nam opłacać turnusy rehabilitacyjne, wizyty u specjalistów i kolejne etapy leczenia. Dziękujemy, że jesteście z nami!</p>
            </div>

            <div className="mt-20 pt-20 border-t border-gray-100">
               <HelpWidget />
            </div>
          </div>
        );
      case 'passions':
        return (
          <div className="max-w-6xl mx-auto px-4 py-24 space-y-24 animate-in fade-in duration-1000">
            <header className="text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-7xl serif">Moje <span className="italic text-red-500">pasje</span></h2>
              <p className="text-xl text-gray-500 font-light leading-relaxed">Rehabilitacja to nasza codzienność, ale to pasje dają Antosi siłę do pokonywania kolejnych barier. Zobacz, co sprawia jej największą radość!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { 
                  title: 'Szachy', 
                  desc: 'Skupienie i strategia. Szachy uczą Antosię cierpliwości i tego, że każdy problem ma rozwiązanie – wystarczy je tylko dostrzec.', 
                  img: 'https://antoninawieczorek.pl/szachy.jpg',
                  color: 'border-red-100'
                },
                { 
                  title: 'Pływanie', 
                  desc: 'Woda to żywioł, w którym ograniczenia ruchowe przestają istnieć. To tutaj Antosia buduje siłę mięśni i poczucie wolności.', 
                  img: 'https://antoninawieczorek.pl/plywanie.jpg',
                  color: 'border-blue-100'
                },
                { 
                  title: 'Narty', 
                  desc: 'Zima to czas szaleństwa na stoku. Jazda na nartach to dla nas dowód, że niemożliwe nie istnieje.', 
                  img: 'https://antoninawieczorek.pl/narty.jpg',
                  color: 'border-pink-100'
                }
              ].map((p, idx) => (
                <div key={idx} className="group flex flex-col items-center text-center space-y-8">
                  <div className={`relative w-full aspect-[4/5] rounded-[3.5rem] overflow-hidden border-8 ${p.color} shadow-xl group-hover:scale-[1.03] transition-all duration-700`}>
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="px-6 space-y-4">
                    <h3 className="text-3xl serif">{p.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#FAF7F2] p-12 md:p-24 rounded-[4rem] text-center text-gray-900 space-y-8 shadow-sm border border-orange-50/50">
               <h3 className="text-4xl md:text-6xl serif italic">Dołącz do nas!</h3>
               <p className="text-gray-600 text-lg max-w-xl mx-auto font-light">Codziennie udowadniamy, że mimo trudności można żyć pełnią życia. Śledź nasze postępy na Instagramie.</p>
               <a 
                href="https://instagram.com/antosia_wieczorek" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all"
               >
                 <span>Profil na Instagramie</span>
               </a>
            </div>
            
            <div className="max-w-7xl mx-auto"><HelpWidget /></div>
          </div>
        );
      case 'support':
        return (
          <div className="max-w-5xl mx-auto px-4 py-24 space-y-20 animate-in fade-in duration-700">
            <header className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl serif">Jak możesz <span className="text-red-500 italic">pomóc?</span></h2>
              <p className="text-xl text-gray-500 font-light">Każda złotówka to cegiełka do sprawności Antosi.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-8 flex flex-col justify-between items-center text-center">
                <div>
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-3xl mb-8 mx-auto">♥</div>
                  <h3 className="text-3xl serif font-bold mb-4">Przekaż 1.5% Podatku</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">W swoim rocznym rozliczeniu PIT wpisz numer KRS oraz cel szczegółowy. To nic Cię nie kosztuje, a dla nas jest ogromnym wsparciem.</p>
                </div>
                <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-4 w-full">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-center">Numer KRS:</p>
                    <p className="text-3xl font-mono font-bold text-gray-900 text-center">{KRS_NUMBER}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1 text-center">Cel szczegółowy:</p>
                    <p className="text-lg font-bold text-gray-700 text-center">{SPECIFIC_PURPOSE}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-sm space-y-8 flex flex-col justify-between items-center text-center">
                <div>
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center text-3xl mb-8 mx-auto">💳</div>
                  <h3 className="text-3xl serif font-bold mb-4">Wpłata Darowizny</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">Możesz wesprzeć nas w każdej chwili za pomocą szybkich płatności online bezpośrednio na subkonto fundacji.</p>
                </div>
                <div className="space-y-6 w-full">
                  <button 
                    onClick={handleDonationClick}
                    className="w-full py-6 bg-gray-900 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl"
                  >
                    Wpłać teraz online
                  </button>
                  <p className="text-center text-[10px] text-gray-300 uppercase tracking-widest">Płatności obsługuje Fundacja „Równym Krokiem”</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'journal':
        const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const currentPosts = posts.slice(startIndex, startIndex + POSTS_PER_PAGE);

        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-5xl md:text-7xl serif text-center mb-16">Dziennik <span className="italic text-red-500">Antosi</span></h2>
            <PostGrid posts={currentPosts} onPostClick={navigateToPost} />
            
            {totalPages > 1 && (
              <div className="mt-20 flex flex-col items-center gap-8">
                <div className="flex items-center gap-3">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-0"
                  >
                    ←
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-14 h-14 rounded-full text-[10px] font-bold tracking-widest transition-all ${
                        currentPage === i + 1 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all disabled:opacity-0"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'post':
        if (!selectedPost) return null;
        return (
          <article className="max-w-3xl mx-auto px-4 py-24 animate-in fade-in duration-700">
            <button onClick={() => setCurrentView('journal')} className="mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 flex items-center group"><span className="group-hover:-translate-x-1 transition-transform mr-3">←</span> Powrót do dziennika</button>
            <div className="flex items-center gap-6 mb-8"><span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedPost.category}</span><time className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">{new Date(selectedPost.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</time></div>
            <h1 className="text-4xl md:text-7xl serif mb-12 leading-[1.1]">{selectedPost.title}</h1>
            <div className="mb-16 -mx-4 md:-mx-12">
              {selectedPost.image ? (
                <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-auto rounded-[2.5rem] shadow-2xl border border-gray-100" />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2.5rem] flex items-center justify-center border border-gray-100 shadow-sm">
                  <div className="text-center opacity-10"><div className="text-8xl">♥</div><p className="text-xs font-bold uppercase tracking-widest mt-4 italic">Antosia Wieczorek</p></div>
                </div>
              )}
            </div>
            <div className="prose-content">{renderFormattedContent(selectedPost.content)}</div>
            <div className="mt-32 pt-20 border-t border-gray-100"><HelpWidget /></div>
          </article>
        );
      case 'migration':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20 space-y-20">
            <header className="text-center space-y-6">
               <h1 className="text-6xl serif">Panel Administracyjny</h1>
               <div className="flex justify-center gap-4">
                 <button onClick={() => setShowExportCode(!showExportCode)} className="px-6 py-2 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{showExportCode ? 'Ukryj kod' : 'Eksportuj do constants.tsx'}</button>
                 <button onClick={() => {if(window.confirm("Zresetować wszystko do stanu z kodu?")){localStorage.removeItem('antosia_posts');window.location.reload();}}} className="px-6 py-2 bg-red-50 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Resetuj pamięć</button>
               </div>
            </header>
            {showExportCode && (
              <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl">
                <button onClick={() => {navigator.clipboard.writeText(generateConstantsCode());alert("Skopiowano!");}} className="text-white text-[10px] bg-white/10 px-4 py-2 rounded-lg mb-4">Kopiuj kod</button>
                <pre className="text-gray-300 text-[10px] font-mono overflow-auto max-h-[400px]">{generateConstantsCode()}</pre>
              </div>
            )}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
               <div className="xl:col-span-2"><MigrationTool onAddPost={handleAddPost} /></div>
               <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <h3 className="text-xl serif mb-6">Zarządzaj wpisami ({posts.length})</h3>
                 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                   {posts.map(post => (
                     <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                       <div className="min-w-0 flex-grow mr-4">
                         <p className="text-xs font-bold truncate">{post.title}</p>
                         <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{post.date}</p>
                       </div>
                       <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-300 hover:text-red-500 transition-colors" title="Usuń">✕</button>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFBF9]">
      <Navbar currentView={currentView} setView={(v) => {setCurrentView(v); setCurrentPage(1);}} />
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-white border-t border-gray-100 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl serif font-bold">Antosia Wieczorek</h2>
            <div className="h-px bg-red-100 w-12 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mama Antosi - Liliana</p>
              <a href="mailto:l.krol.wieczorek@gmail.com" className="text-gray-600 hover:text-red-500 transition-colors">l.krol.wieczorek@gmail.com</a>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tata Antosi - Radek</p>
              <a href="mailto:radek@antoninawieczorek.pl" className="text-gray-600 hover:text-red-500 transition-colors">radek@antoninawieczorek.pl</a>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Kontakt telefoniczny</p>
              <a href="tel:+48500131987" className="text-gray-600 hover:text-red-500 transition-colors font-mono">+48 500 131 987</a>
            </div>
          </div>

          <div className="pt-8">
            <button onClick={() => setCurrentView('migration')} className="text-[8px] uppercase tracking-[0.4em] font-bold text-gray-300 hover:text-gray-900 transition-all">Panel administracyjny</button>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default App;