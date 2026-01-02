import React, { useState, useEffect } from 'react';
import { View, Post } from './types';
import { MOCK_POSTS } from './constants';
import Navbar from './components/Navbar';
import PostGrid from './components/PostGrid';
import MigrationTool from './components/MigrationTool';
import CookieConsent from './components/CookieConsent';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showExportCode, setShowExportCode] = useState(false);
  
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
        return combined;
      } catch (e) {
        return MOCK_POSTS;
      }
    }
    return MOCK_POSTS;
  });

  const DONATION_URL = "https://www.rownymkrokiem.pl/antoninawieczorek/";
  const KRS_NUMBER = "0000645714";
  const SPECIFIC_PURPOSE = "Antonina Wieczorek";

  useEffect(() => {
    localStorage.setItem('antosia_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const trackEvent = (action: string, category: string, label: string) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        'event_category': category,
        'event_label': label,
      });
    }
  };

  const handleDonationClick = () => {
    trackEvent('donation_button_click', 'Engagement', 'Donation Page');
    window.open(DONATION_URL, '_blank', 'noopener,noreferrer');
  };

  const navigateToPost = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('post');
    trackEvent('view_post', 'Content', post.title);
  };

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setCurrentView('journal');
  };

  const generateConstantsCode = () => {
    const code = `import { Post } from './types';

export const MOCK_POSTS: Post[] = ${JSON.stringify(posts, null, 2)};`;
    return code;
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const imgRegex = /!\[(.*?)\]\((.*?)\)/;
      const match = line.match(imgRegex);

      if (match) {
        const [_, alt, url] = match;
        return (
          <figure key={i} className="my-16 -mx-4 md:-mx-12 lg:-mx-20 animate-in fade-in duration-700">
            <img 
              src={url} 
              alt={alt} 
              className="w-full rounded-[2.5rem] shadow-2xl border border-gray-100 bg-gray-50" 
            />
            {alt && alt !== "." && alt.length > 2 && (
              <figcaption className="text-center text-xs text-gray-400 mt-6 italic font-medium tracking-wide">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      }
      
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-6" />;
      
      return (
        <p key={i} className="mb-8 text-gray-700 leading-relaxed font-light text-xl">
          {trimmedLine}
        </p>
      );
    });
  };

  const HelpWidget = () => (
    <div className="help-card p-10 rounded-[3rem] shadow-sm border border-red-100 space-y-8 max-w-sm mx-auto text-center">
      <h3 className="text-2xl serif font-bold text-red-600">Pomóż Antosi</h3>
      <div className="bg-white p-6 rounded-3xl border border-red-50 space-y-4 shadow-inner">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-1">KRS dla 1.5%:</p>
          <p className="text-3xl font-mono font-bold text-gray-800 tracking-tighter">{KRS_NUMBER}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-1">Cel szczegółowy:</p>
          <p className="text-sm font-bold text-gray-700">{SPECIFIC_PURPOSE}</p>
        </div>
      </div>
      <button 
        onClick={handleDonationClick}
        className="block w-full text-center btn-donate text-white py-5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg transition-all"
      >
        Szybka Wpłata
      </button>
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
                  <h1 className="text-5xl md:text-7xl serif leading-tight text-gray-900">
                    Jestem <span className="text-red-500 italic">Antosia</span>
                  </h1>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Każdego dnia udowadniam, że niemożliwe nie istnieje. Poznaj moją historię i zobacz, jak walczę o marzenia.
                  </p>
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
              <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl serif">Co u nas słychać?</h2>
                <button onClick={() => setCurrentView('journal')} className="text-sm font-bold text-red-500 border-b-2 border-red-500 pb-1">Wszystkie wpisy</button>
              </div>
              <PostGrid posts={posts.slice(0, 3)} onPostClick={navigateToPost} />
            </section>
            <section className="max-w-4xl mx-auto px-4">
              <HelpWidget />
            </section>
          </div>
        );
      case 'support':
        return (
          <div className="max-w-7xl mx-auto px-4 py-24 animate-in fade-in duration-1000">
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-5xl md:text-7xl serif">Wesprzyj mnie</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                Każda złotówka to krok bliżej do pełnej sprawności. Twoje wsparcie pozwala nam finansować operacje i tysiące godzin rehabilitacji.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Box 1: 1.5% Podatku */}
              <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-red-100 flex flex-col justify-between space-y-8 hover:scale-[1.02] transition-transform duration-500">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl">📝</div>
                  <h3 className="text-3xl serif font-bold text-gray-900">1.5% Podatku</h3>
                  <p className="text-gray-500 leading-relaxed">
                    Podczas rozliczania PIT wystarczy wpisać nasz numer KRS oraz cel szczegółowy. To nic nie kosztuje, a dla nas znaczy wszystko.
                  </p>
                </div>
                <div className="bg-gray-50 p-8 rounded-3xl space-y-4 border border-gray-100">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Numer KRS:</p>
                    <p className="text-3xl font-mono font-bold text-red-500 tracking-tighter">{KRS_NUMBER}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Cel szczegółowy:</p>
                    <p className="text-sm font-bold text-gray-700">{SPECIFIC_PURPOSE}</p>
                  </div>
                </div>
              </div>

              {/* Box 2: Darowizna bezpośrednia */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-12 rounded-[3.5rem] shadow-xl border border-orange-100 flex flex-col justify-between space-y-8 hover:scale-[1.02] transition-transform duration-500">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">💳</div>
                  <h3 className="text-3xl serif font-bold text-gray-900">Szybka Pomoc</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Możesz przekazać darowiznę bezpośrednio przez stronę fundacji. Środki trafiają na subkonto Antosi i są wykorzystywane na bieżące leczenie.
                  </p>
                </div>
                <button 
                  onClick={handleDonationClick}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3"
                >
                  Przekaż darowiznę
                  <span className="text-xl">→</span>
                </button>
              </div>
            </div>

            <div className="mt-24 text-center">
               <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-8">Dziękujemy za każde okazane serce!</p>
               <div className="flex justify-center gap-12 opacity-40 grayscale">
                 <img src="https://via.placeholder.com/120x60?text=Fundacja" alt="Partnerzy" className="h-8" />
                 <img src="https://via.placeholder.com/120x60?text=Wsparcie" alt="Partnerzy" className="h-8" />
               </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="animate-in fade-in duration-1000">
            <header className="bg-white py-20 px-4">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-4xl md:text-6xl serif text-gray-900 leading-tight">
                  Antosia Wieczorek. Nie mierz jej miarą diagnozy – mierz ją miarą jej pasji!
                </h2>
                <p className="text-2xl md:text-3xl text-red-500 italic serif">
                  Wszyscy mówili: „Amputacja”. Ona odpowiedziała: „Szach i mat!”
                </p>
              </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 pb-24 space-y-16">
              <figure className="my-12 -mx-4 md:-mx-8">
                <img 
                  src="https://images.unsplash.com/photo-1544161515-436cefd54c37?auto=format&fit=crop&q=80&w=1200" 
                  alt="Antosia Wieczorek grająca w szachy" 
                  className="w-full rounded-[2.5rem] shadow-2xl"
                />
                <figcaption className="text-center text-sm text-gray-400 mt-4 italic">Antosia Wieczorek grająca w szachy</figcaption>
              </figure>

              <div className="prose prose-xl prose-red mx-auto space-y-8">
                <p className="text-gray-700 font-light text-xl leading-relaxed">
                  Kiedy Antosia przyszła na świat, medyczne prognozy były bezlitosne. Obustronny brak kości strzałkowych (bilateral Fibular Hemimelia) miał oznaczać życie z ogromnymi ograniczeniami. Ale my – rodzice i Wy – darczyńcy, wspólnie zmienielten zasady tej gry. Dziś Tosia to nastolatka, która nie tylko pewnie stoi na własnych nogach, ale z uśmiechem i determinacją zdobywa kolejne szczyty.
                </p>
                <p className="text-gray-700 font-light text-xl leading-relaxed">
                  Za sukcesami Antosi kryje się ogromny wysiłek. Przeszła już 14 skomplikowanych operacji oraz tysiące godzin rehabilitacji. Ponieważ Tosia intensywnie rośnie, her nogi wymagają stałego monitorowania i kolejnych rekonstrukcji. To ciągły proces, którego nie możemy przerwać.
                </p>

                <div className="py-12 border-y border-gray-100 space-y-12">
                  <h3 className="text-3xl serif text-gray-900 text-center">Więcej niż pacjentka – mistrzyni strategii!</h3>
                  <p className="text-gray-700 font-light text-xl leading-relaxed text-center">
                    Choć Antosia kocha ruch – basen, narty i jazdę na rowerze – to jej największą miłością i pasją są szachy.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="text-4xl mb-2 text-center md:text-left">♟</div>
                      <h4 className="text-xl font-bold uppercase tracking-widest text-gray-900">Królowa szachownicy</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Przy stole szachowym nie liczą się operacje czy blizny. Liczy się spryt, koncentracja i umiejętność przewidywania kilku ruchów do przodu. Szachy nauczyły Antosię, że każdą sytuację można rozegrać po mistrzowsku.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-4xl mb-2 text-center md:text-left">♟</div>
                      <h4 className="text-xl font-bold uppercase tracking-widest text-gray-900">Zawsze o krok do przodu</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Ta sama strategia, którą stosuje podczas partii szachów, towarzyszy jej w codziennej walce o sprawność. Antosia nie boi się wyzwań – ona je analizuje i pokonuje.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 text-center">
                  <h3 className="text-3xl serif text-gray-900">Sport i ruch to jej wolność</h3>
                  <p className="text-gray-700 font-light text-xl leading-relaxed">
                    Kiedy odchodzi od szachownicy, udowadnia, że stabilność nóg to kwestia wypracowanej siły i uporu. Narty i pływanie dają jej poczucie wolności, której nikt nie jest w stanie jej odebrać.
                  </p>
                </div>

                <div className="mt-20">
                  <HelpWidget />
                </div>
              </div>
            </div>
          </div>
        );
      case 'journal':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <h2 className="text-5xl serif text-center mb-16">Dziennik Antosi</h2>
            <PostGrid posts={posts} onPostClick={navigateToPost} />
          </div>
        );
      case 'post':
        if (!selectedPost) return null;
        return (
          <article className="max-w-3xl mx-auto px-4 py-24 animate-in fade-in duration-700">
            <button onClick={() => setCurrentView('journal')} className="mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 flex items-center group">
              <span className="group-hover:-translate-x-1 transition-transform mr-3">←</span> Powrót do dziennika
            </button>
            <div className="flex items-center gap-6 mb-8">
              <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedPost.category}</span>
              <time className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">
                {new Date(selectedPost.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h1 className="text-4xl md:text-7xl serif mb-16 leading-[1.1]">{selectedPost.title}</h1>
            <div>{renderFormattedContent(selectedPost.content)}</div>
            <div className="mt-32 pt-20 border-t border-gray-100">
               <HelpWidget />
            </div>
          </article>
        );
      case 'passions':
        return (
          <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">
            <div className="text-center space-y-6">
              <h2 className="text-6xl serif">Moje pasje</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Rehabilitacja to nasza codzienność, ale w życiu Antosi jest miejsce na wielkie marzenia i sportowe emocje.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-gray-50 text-center space-y-6 group hover:shadow-xl transition-all duration-500">
                <div className="overflow-hidden rounded-[2rem] border-4 border-red-50 group-hover:scale-[1.02] transition-transform duration-500">
                   <img src="./szachy.jpg" alt="Szachy" className="w-full h-auto object-cover" onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544161515-436cefd54c37?auto=format&fit=crop&q=80&w=800"} />
                </div>
                <div className="space-y-4 px-4">
                  <h3 className="text-3xl serif">Szachy</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Skupienie i strategia. Szachy uczą Antosię, że każdy ruch ma znaczenie.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-gray-50 text-center space-y-6 group hover:shadow-xl transition-all duration-500">
                <div className="overflow-hidden rounded-[2rem] border-4 border-blue-100 group-hover:scale-[1.02] transition-transform duration-500">
                   <img src="./plywanie.jpg" alt="Pływanie" className="w-full h-auto object-cover" onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&q=80&w=800"} />
                </div>
                <div className="space-y-4 px-4">
                  <h3 className="text-3xl serif">Pływanie</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Woda to wolność. W czerwonym czepku Antosia pokonuje kolejne baseny.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[3rem] shadow-sm border border-gray-50 text-center space-y-6 group hover:shadow-xl transition-all duration-500">
                <div className="overflow-hidden rounded-[2rem] border-4 border-pink-100 group-hover:scale-[1.02] transition-transform duration-500">
                   <img src="./narty.jpg" alt="Narty" className="w-full h-auto object-cover" onError={(e) => (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=800"} />
                </div>
                <div className="space-y-4 px-4">
                  <h3 className="text-3xl serif">Narty</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">Radość na stoku! W różowym stroju Antosia kocha prędkość i zimowe szaleństwo.</p>
                </div>
              </div>
            </div>

            <div className="text-center pt-12">
               <a 
                 href="https://instagram.com/antosia_wieczorek" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 onClick={() => trackEvent('instagram_click', 'Engagement', 'Passions Section')}
                 className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all"
               >
                 <span>Śledź nas na Instagramie</span>
               </a>
            </div>

            <div className="max-w-2xl mx-auto border-t border-gray-100 pt-20">
              <HelpWidget />
            </div>
          </div>
        );
      case 'migration':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <header className="mb-20 text-center space-y-6">
               <h1 className="text-6xl serif">Panel Administracyjny</h1>
               <div className="flex justify-center gap-4">
                 <button 
                  onClick={() => setShowExportCode(!showExportCode)}
                  className="px-6 py-2 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-blue-100 transition-all"
                 >
                   {showExportCode ? 'Ukryj kod źródłowy' : 'Generuj kod do constants.tsx'}
                 </button>
                 <button 
                   onClick={() => {
                     if (window.confirm("Zresetować posty?")) {
                       localStorage.removeItem('antosia_posts');
                       window.location.reload();
                     }
                   }}
                   className="px-6 py-2 bg-red-50 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-red-100 transition-all"
                 >
                   Zresetuj pamięć tymczasową
                 </button>
               </div>
            </header>

            {showExportCode && (
              <div className="mb-12 bg-gray-900 p-8 rounded-[2rem] shadow-2xl animate-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Kopiuj i wklej tę zawartość do pliku constants.tsx:</p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generateConstantsCode());
                      alert("Kod skopiowany!");
                    }}
                    className="text-white text-[10px] bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
                  >
                    Kopiuj kod
                  </button>
                </div>
                <pre className="text-gray-300 text-[10px] font-mono overflow-auto max-h-[400px] leading-relaxed">
                  {generateConstantsCode()}
                </pre>
              </div>
            )}

            <MigrationTool onAddPost={handleAddPost} />
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFBF9]">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl serif font-bold text-gray-900">Antosia Wieczorek</h2>
            <div className="flex justify-center space-x-8 text-xs font-bold uppercase tracking-widest text-gray-400">
               <button onClick={() => setCurrentView('history')} className="hover:text-red-500 transition-colors">Historia</button>
               <button onClick={() => setCurrentView('journal')} className="hover:text-red-500 transition-colors">Dziennik</button>
               <button onClick={() => setCurrentView('passions')} className="hover:text-red-500 transition-colors">Pasje</button>
            </div>
          </div>
          
          <div className="w-full max-w-xs border-t border-gray-50 pt-8 flex justify-between items-center opacity-30">
            <p className="text-[8px] uppercase tracking-widest font-medium text-gray-400">© {new Date().getFullYear()} Antosia Wieczorek</p>
            <button 
              onClick={() => setCurrentView('migration')}
              className="text-[8px] uppercase tracking-widest font-medium text-gray-300 hover:text-gray-900 transition-colors"
            >
              Panel administracyjny
            </button>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default App;