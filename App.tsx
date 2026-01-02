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
    if (!content) return null;

    // 1. GŁĘBOKIE CZYSZCZENIE: Naprawiamy znaki \n, które po wklejeniu do kodu stały się tekstem
    const fixedContent = content
      .replace(/\\n/g, '\n')      // Zamień tekstowe "\n" na prawdziwe entery
      .replace(/\\r/g, '')       // Usuń ewentualne powroty karetki
      .replace(/\n\n+/g, '\n\n') // Zredukuj wielokrotne entery do maksymalnie dwóch
      .trim();
    
    // 2. PODZIAŁ: Tniemy na bloki (akapity, nagłówki)
    const blocks = fixedContent.split('\n').map(b => b.trim()).filter(b => b.length > 0);
    
    return blocks.map((block, i) => {
      // Obsługa obrazka Markdown: ![alt](url)
      const imgRegex = /!\[(.*?)\]\((.*?)\)/;
      const imgMatch = block.match(imgRegex);
      if (imgMatch) {
        const [_, alt, url] = imgMatch;
        return (
          <figure key={i} className="my-16 -mx-4 md:-mx-12 lg:-mx-20 animate-in fade-in duration-1000">
            <img src={url} alt={alt} className="w-full rounded-[2.5rem] shadow-2xl border border-gray-100 bg-gray-50" />
            {alt && alt !== "." && alt.length > 2 && (
              <figcaption className="text-center text-xs text-gray-400 mt-6 italic font-medium tracking-wide">{alt}</figcaption>
            )}
          </figure>
        );
      }

      // Nagłówki Markdown (### Data)
      if (block.startsWith('###')) {
        return (
          <h3 key={i} className="text-2xl serif text-red-500 mt-16 mb-8 font-bold flex items-center gap-6">
            <span className="h-px flex-grow bg-red-100"></span>
            <span className="shrink-0">{block.replace('###', '').trim()}</span>
            <span className="h-px flex-grow bg-red-100"></span>
          </h3>
        );
      }

      // Wykrywanie daty na początku (np. "26.06.2012") jeśli AI nie dodało ###
      const dateRegex = /^(\d{2}\.\d{2}\.\d{4})/;
      const dateMatch = block.match(dateRegex);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const restOfText = block.replace(dateRegex, '').trim();
        return (
          <React.Fragment key={i}>
            <h3 className="text-2xl serif text-red-500 mt-16 mb-8 font-bold flex items-center gap-6">
              <span className="h-px flex-grow bg-red-100"></span>
              <span className="shrink-0">{dateStr}</span>
              <span className="h-px flex-grow bg-red-100"></span>
            </h3>
            {restOfText && <p className="mb-8 text-gray-700 leading-relaxed font-light text-xl">{restOfText}</p>}
          </React.Fragment>
        );
      }

      // Standardowy akapit z obsługą pogrubienia **tekst**
      const parts = block.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-8 text-gray-700 leading-relaxed font-light text-xl">
          {parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
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
              <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-red-100 flex flex-col justify-between space-y-8 hover:scale-[1.02] transition-transform duration-500">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl">📝</div>
                  <h3 className="text-3xl serif font-bold text-gray-900">1.5% Podatku</h3>
                  <p className="text-gray-500 leading-relaxed">Podczas rozliczania PIT wystarczy wpisać nasz numer KRS oraz cel szczegółowy. To nic nie kosztuje, a dla nas znaczy wszystko.</p>
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
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-12 rounded-[3.5rem] shadow-xl border border-orange-100 flex flex-col justify-between space-y-8 hover:scale-[1.02] transition-transform duration-500">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">💳</div>
                  <h3 className="text-3xl serif font-bold text-gray-900">Szybka Pomoc</h3>
                  <p className="text-gray-600 leading-relaxed">Możesz przekazać darowiznę bezpośrednio przez stronę fundacji. Środki trafiają na subkonto Antosi i są wykorzystywane na bieżące leczenie.</p>
                </div>
                <button onClick={handleDonationClick} className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-3">Przekaż darowiznę <span className="text-xl">→</span></button>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="animate-in fade-in duration-1000">
            <header className="bg-white py-20 px-4 text-center space-y-8">
              <h2 className="text-4xl md:text-6xl serif text-gray-900 leading-tight">Antosia Wieczorek. Nie mierz jej miarą diagnozy – mierz ją miarą jej pasji!</h2>
              <p className="text-2xl md:text-3xl text-red-500 italic serif">Wszyscy mówili: „Amputacja”. Ona odpowiedziała: „Szach i mat!”</p>
            </header>
            <div className="max-w-3xl mx-auto px-4 pb-24 space-y-16">
              <figure className="my-12 -mx-4 md:-mx-8">
                <img src="https://images.unsplash.com/photo-1544161515-436cefd54c37?auto=format&fit=crop&q=80&w=1200" alt="Antosia Wieczorek" className="w-full rounded-[2.5rem] shadow-2xl" />
              </figure>
              <div className="prose prose-xl prose-red mx-auto space-y-8 text-gray-700 font-light text-xl leading-relaxed">
                <p>Kiedy Antosia przyszła na świat, medyczne prognozy były bezlitosne. Obustronny brak kości strzałkowych miał oznaczać życie z ogromnymi ograniczeniami. Dziś Tosia to nastolatka, która nie tylko pewnie stoi na własnych nogach, ale z uśmiechem zdobywa szczyty.</p>
                <div className="mt-20"><HelpWidget /></div>
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
              <time className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">{new Date(selectedPost.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
            <h1 className="text-4xl md:text-7xl serif mb-16 leading-[1.1]">{selectedPost.title}</h1>
            <div className="prose-content">{renderFormattedContent(selectedPost.content)}</div>
            <div className="mt-32 pt-20 border-t border-gray-100"><HelpWidget /></div>
          </article>
        );
      case 'passions':
        return (
          <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">
            <h2 className="text-6xl serif text-center">Moje pasje</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="bg-white p-6 rounded-[3rem] text-center space-y-6 group hover:shadow-xl transition-all duration-500 border border-gray-50">
                <img src="https://images.unsplash.com/photo-1544161515-436cefd54c37?auto=format&fit=crop&q=80&w=800" className="rounded-[2rem] w-full" />
                <h3 className="text-3xl serif">Szachy</h3>
              </div>
            </div>
            <div className="max-w-2xl mx-auto pt-20"><HelpWidget /></div>
          </div>
        );
      case 'migration':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <header className="mb-20 text-center space-y-6">
               <h1 className="text-6xl serif">Panel Administracyjny</h1>
               <div className="flex justify-center gap-4">
                 <button onClick={() => setShowExportCode(!showExportCode)} className="px-6 py-2 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{showExportCode ? 'Ukryj kod' : 'Eksportuj do constants.tsx'}</button>
                 <button onClick={() => {if(window.confirm("Zresetować?")){localStorage.removeItem('antosia_posts');window.location.reload();}}} className="px-6 py-2 bg-red-50 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full">Resetuj pamięć</button>
               </div>
            </header>
            {showExportCode && (
              <div className="mb-12 bg-gray-900 p-8 rounded-[2rem] shadow-2xl">
                <button onClick={() => {navigator.clipboard.writeText(generateConstantsCode());alert("Skopiowano!");}} className="text-white text-[10px] bg-white/10 px-4 py-2 rounded-lg mb-4">Kopiuj kod</button>
                <pre className="text-gray-300 text-[10px] font-mono overflow-auto max-h-[400px]">{generateConstantsCode()}</pre>
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
      <main className="flex-grow">{renderContent()}</main>
      <footer className="bg-white border-t border-gray-100 py-16 px-4 text-center">
        <h2 className="text-2xl serif font-bold mb-8">Antosia Wieczorek</h2>
        <button onClick={() => setCurrentView('migration')} className="text-[8px] uppercase tracking-widest text-gray-300">Panel administracyjny</button>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default App;