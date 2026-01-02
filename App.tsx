
import React, { useState, useEffect } from 'react';
import { View, Post } from './types';
import { MOCK_POSTS } from './constants';
import Navbar from './components/Navbar';
import PostGrid from './components/PostGrid';
import MigrationTool from './components/MigrationTool';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const DONATION_URL = "https://www.rownymkrokiem.pl/antoninawieczorek/";
  const KRS_NUMBER = "0000645714";
  const SPECIFIC_PURPOSE = "Antonina Wieczorek";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const navigateToPost = (post: Post) => {
    setSelectedPost(post);
    setCurrentView('post');
  };

  const handleAddPost = (newPost: Post) => {
    setPosts([newPost, ...posts]);
    setCurrentView('journal');
  };

  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      // Wykrywanie formatu Markdown dla obrazu: ![alt](url)
      const imgRegex = /!\[(.*?)\]\((.*?)\)/;
      const match = line.match(imgRegex);

      if (match) {
        const [_, alt, url] = match;
        return (
          <figure key={i} className="my-12">
            <img 
              src={url} 
              alt={alt} 
              className="w-full rounded-[2rem] shadow-lg border border-gray-100 bg-gray-50" 
            />
            {alt && alt !== "." && (
              <figcaption className="text-center text-xs text-gray-400 mt-4 italic font-medium tracking-wide">
                {alt}
              </figcaption>
            )}
          </figure>
        );
      }
      
      return line.trim() ? (
        <p key={i} className="mb-6">{line}</p>
      ) : (
        <div key={i} className="h-4" />
      );
    });
  };

  const HelpWidget = () => (
    <div className="help-card p-8 rounded-3xl shadow-sm border border-red-100 space-y-6 max-w-sm mx-auto text-center">
      <h3 className="text-2xl serif font-bold text-red-600">Pomóż Antosi</h3>
      <div className="bg-white p-6 rounded-2xl border border-red-50 space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">KRS dla 1.5%:</p>
          <p className="text-2xl font-mono font-bold text-gray-800">{KRS_NUMBER}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Cel szczegółowy:</p>
          <p className="text-sm font-medium text-gray-700">{SPECIFIC_PURPOSE}</p>
        </div>
      </div>
      <a 
        href={DONATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center btn-donate text-white py-4 rounded-full text-sm font-bold uppercase tracking-widest shadow-lg transition-all"
      >
        Wpłata
      </a>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl serif leading-tight text-gray-900">
              Mała Antosia, <br />
              <span className="text-red-500 italic">Wielka Siła</span> Walki.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              To jest historia naszej córeczki, która każdego dnia udowadnia, że niemożliwe nie istnieje. 
              Zapraszamy Cię do naszego świata – pełnego trudów, ale i ogromnej radości z każdego małego sukcesu.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button onClick={() => setCurrentView('history')} className="px-8 py-4 bg-gray-900 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-700 transition-all">Poznaj naszą historię</button>
              <button onClick={() => setCurrentView('how-to-help')} className="px-8 py-4 border-2 border-red-500 text-red-500 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-red-50 transition-all">Jak możesz pomóc?</button>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-3 border-8 border-white">
              <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800" alt="Antosia uśmiechnięta" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Dni walki', val: '1240+' },
          { label: 'Godziny ćwiczeń', val: '3500+' },
          { label: 'Wspaniali Darczyńcy', val: '∞' },
        ].map((stat, i) => (
          <div key={i} className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-50">
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.val}</p>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-400">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
          <div>
            <h2 className="text-4xl serif">Co u nas słychać?</h2>
            <p className="text-gray-400 text-sm mt-2">Śledź postępy Antosi w jej dzienniku</p>
          </div>
          <button onClick={() => setCurrentView('journal')} className="text-sm font-bold text-red-500 border-b-2 border-red-500 pb-1">Wszystkie wpisy</button>
        </div>
        <PostGrid posts={posts.slice(0, 3)} onPostClick={navigateToPost} />
      </section>

      <section className="max-w-4xl mx-auto px-4">
        <HelpWidget />
      </section>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'home': return renderHome();
      case 'history':
        return (
          <div className="max-w-3xl mx-auto px-4 py-20 space-y-12">
            <h2 className="text-5xl serif text-center">Nasza Historia</h2>
            <div className="prose prose-lg text-gray-700 leading-loose space-y-6 text-center lg:text-left">
              <p>Wszystko zaczęło się w pewien deszczowy wtorek...</p>
              <p>Antosia urodziła się jako pozornie zdrowe dziecko. Jednak z czasem zauważyliśmy, że rozwija się inaczej niż rówieśnicy. Diagnoza spadła na nas jak grom z jasnego nieba.</p>
              <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200" className="rounded-3xl shadow-lg my-8 mx-auto" />
              <p>Od tego dnia nasze życie to ciągła walka – o każdy ruch, o każdy uśmiech, o przyszłość, w której Antosia będzie mogła być samodzielna.</p>
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
          <article className="max-w-3xl mx-auto px-4 py-20 animate-in fade-in duration-500">
            <button onClick={() => setCurrentView('journal')} className="mb-8 text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center group">
              <span className="group-hover:-translate-x-1 transition-transform mr-2">←</span> Powrót do dziennika
            </button>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{selectedPost.category}</span>
              <time className="text-[10px] uppercase tracking-widest text-gray-400">
                {new Date(selectedPost.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </div>
            <h1 className="text-4xl md:text-6xl serif mb-12 leading-tight">{selectedPost.title}</h1>
            <div className="text-gray-800 leading-relaxed font-light text-lg">
              {renderFormattedContent(selectedPost.content)}
            </div>
            <div className="mt-20">
               <HelpWidget />
            </div>
          </article>
        );
      case 'how-to-help':
        return (
          <div className="max-w-3xl mx-auto px-4 py-20 space-y-20">
            <h2 className="text-5xl serif text-center">Jak możesz pomóc?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center">
              <div className="p-10 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-6 max-w-xs mx-auto w-full">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-2xl">❤️</div>
                <h3 className="text-2xl serif">Wpłata bezpośrednia</h3>
                <p className="text-gray-500 text-sm">Każda złotówka to minuta rehabilitacji, która przybliża nas do celu.</p>
                <a 
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-red-500 text-white rounded-full font-bold transition-all hover:bg-red-600 shadow-md"
                >
                  Wpłata
                </a>
              </div>
              <div className="p-10 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-6 max-w-xs mx-auto w-full">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-2xl">📝</div>
                <h3 className="text-2xl serif">Twój 1.5%</h3>
                <p className="text-gray-500 text-sm">Podczas rozliczania PIT wpisz nasz numer KRS oraz cel szczegółowy.</p>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">KRS:</p>
                    <p className="font-mono font-bold text-gray-700 text-lg">{KRS_NUMBER}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Cel szczegółowy:</p>
                    <p className="font-bold text-gray-700 text-sm">{SPECIFIC_PURPOSE}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'migration':
        return (
          <div className="max-w-7xl mx-auto px-4 py-20">
            <header className="mb-12">
               <h1 className="text-4xl serif mb-2 text-center">System Odświeżania Treści</h1>
               <p className="text-center text-gray-400 text-sm">Przenoszenie historii Antosi ze starego WordPressa bez utraty pozycjonowania.</p>
            </header>
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
      <footer className="bg-white border-t border-gray-100 py-16 text-center space-y-8">
        <h2 className="text-2xl serif font-bold text-gray-900 tracking-tight">Antosia Wieczorek</h2>
        <div className="flex justify-center space-x-8 text-xs font-bold uppercase tracking-widest text-gray-400">
           <button onClick={() => setCurrentView('history')} className="hover:text-red-500">Historia</button>
           <button onClick={() => setCurrentView('journal')} className="hover:text-red-500">Dziennik</button>
           <button onClick={() => setCurrentView('how-to-help')} className="hover:text-red-500">Pomoc</button>
        </div>
        <p className="text-[10px] text-gray-300 uppercase tracking-widest px-4">© 2024 Razem dla Antosi. Wszystkie środki trafiają na leczenie.</p>
      </footer>
    </div>
  );
};

export default App;
