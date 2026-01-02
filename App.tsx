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
        // Łączymy zapisane posty z tymi z constants, unikając duplikatów po ID
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

  const handleDonationClick = () => {
    window.open(DONATION_URL, '_blank', 'noopener,noreferrer');
  };

  const navigateToPost = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('post');
  };

  const handleAddPost = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
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
      const dateRegex = /^(\d{2}\.\d{2}\.\d{4})/;
      const dateMatch = block.match(dateRegex);
      if (dateMatch) {
        return (
          <React.Fragment key={i}>
            <h3 className="text-2xl serif text-red-500 mt-16 mb-8 font-bold flex items-center gap-6">
              <span className="h-px flex-grow bg-red-100"></span>
              <span className="shrink-0">{dateMatch[1]}</span>
              <span className="h-px flex-grow bg-red-100"></span>
            </h3>
            <p className="mb-8 text-gray-700 leading-relaxed font-light text-xl">{block.replace(dateRegex, '').trim()}</p>
          </React.Fragment>
        );
      }
      return <p key={i} className="mb-8 text-gray-700 leading-relaxed font-light text-xl">{block}</p>;
    });
  };

  const HelpWidget = () => (
    <div className="help-card p-10 rounded-[3rem] shadow-sm border border-red-100 space-y-8 max-w-sm mx-auto text-center">
      <h3 className="text-2xl serif font-bold text-red-600">Pomóż Antosi</h3>
      <div className="bg-white p-6 rounded-3xl border border-red-50 space-y-4 shadow-inner">
        <div><p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-1">KRS dla 1.5%:</p><p className="text-3xl font-mono font-bold text-gray-800 tracking-tighter">{KRS_NUMBER}</p></div>
        <div><p className="text-[10px] uppercase tracking-widest font-bold text-gray-300 mb-1">Cel szczegółowy:</p><p className="text-sm font-bold text-gray-700">{SPECIFIC_PURPOSE}</p></div>
      </div>
      <button onClick={handleDonationClick} className="block w-full text-center btn-donate text-white py-5 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg transition-all">Szybka Wpłata</button>
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
              <div className="flex justify-between items-end mb-12"><h2 className="text-4xl serif">Co u nas słychać?</h2><button onClick={() => setCurrentView('journal')} className="text-sm font-bold text-red-500 border-b-2 border-red-500 pb-1">Wszystkie wpisy</button></div>
              <PostGrid posts={posts.slice(0, 3)} onPostClick={navigateToPost} />
            </section>
            <section className="max-w-4xl mx-auto px-4"><HelpWidget /></section>
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
            <button onClick={() => setCurrentView('journal')} className="mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 flex items-center group"><span className="group-hover:-translate-x-1 transition-transform mr-3">←</span> Powrót do dziennika</button>
            <div className="flex items-center gap-6 mb-8"><span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedPost.category}</span><time className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold">{new Date(selectedPost.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</time></div>
            <h1 className="text-4xl md:text-7xl serif mb-16 leading-[1.1]">{selectedPost.title}</h1>
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
               <div className="xl:col-span-2">
                 <MigrationTool onAddPost={handleAddPost} />
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                 <h3 className="text-xl serif mb-6">Zarządzaj wpisami ({posts.length})</h3>
                 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                   {posts.map(post => (
                     <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                       <div className="min-w-0 flex-grow mr-4">
                         <p className="text-xs font-bold truncate">{post.title}</p>
                         <p className="text-[9px] text-gray-400 uppercase tracking-tighter">{post.date}</p>
                       </div>
                       <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-300 hover:text-red-500 transition-colors"
                        title="Usuń"
                       >
                         ✕
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        );
      case 'passions':
        return (
          <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">
            <div className="text-center space-y-6">
              <h2 className="text-6xl serif">Moje pasje</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Rehabilitacja to nasza codzienność, ale w życiu Antosi jest miejsce na wielkie marzenia i sportowe emocje.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              {[
                { title: 'Szachy', desc: 'Skupienie i strategia. Szachy uczą Antosię, że każdy ruch ma znaczenie.', img: 'https://images.unsplash.com/photo-1544161515-436cefd54c37?auto=format&fit=crop&q=80&w=800', color: 'red' },
                { title: 'Pływanie', desc: 'Woda to wolność. W czerwonym czepku Antosia pokonuje kolejne baseny.', img: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&q=80&w=800', color: 'blue' },
                { title: 'Narty', desc: 'Radość na stoku! Antosia kocha prędkość i zimowe szaleństwo.', img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&q=80&w=800', color: 'pink' }
              ].map((p, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[3rem] shadow-sm border border-gray-50 text-center space-y-6 group hover:shadow-xl transition-all duration-500">
                  <div className={`overflow-hidden rounded-[2rem] border-4 border-${p.color}-50 group-hover:scale-[1.02] transition-transform duration-500`}>
                    <img src={p.img} alt={p.title} className="w-full h-auto object-cover" />
                  </div>
                  <div className="space-y-4 px-4">
                    <h3 className="text-3xl serif">{p.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-12">
               <a href="https://instagram.com/antosia_wieczorek" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
                 <span>Śledź nas na Instagramie</span>
               </a>
            </div>
            <div className="max-w-2xl mx-auto pt-20"><HelpWidget /></div>
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