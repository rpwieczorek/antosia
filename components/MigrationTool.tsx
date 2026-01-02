import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { Post } from '../types';

interface MigrationToolProps {
  onAddPost: (post: Post) => void;
}

const MigrationTool: React.FC<MigrationToolProps> = ({ onAddPost }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [pubDate, setPubDate] = useState(new Date().toISOString().split('T')[0]);
  const [htmlCode, setHtmlCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [migratedData, setMigratedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const extractSlugFromUrl = (url: string) => {
    try {
      const path = new URL(url).pathname;
      const parts = path.split('/').filter(Boolean);
      return parts[parts.length - 1] || 'nowy-wpis';
    } catch {
      return url.split('/').filter(Boolean).pop() || 'nowy-wpis';
    }
  };

  const handleMigrate = async () => {
    if (!htmlCode.trim()) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await geminiService.migratePostContent(htmlCode);
      setMigratedData(result);
    } catch (err: any) {
      setError("Błąd analizy HTML. Spróbuj wkleić kod jeszcze raz.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!migratedData) return;

    const slug = extractSlugFromUrl(originalUrl);
    const newPost: Post = {
      id: Date.now().toString(),
      slug: slug,
      title: migratedData.title,
      excerpt: migratedData.seoDescription,
      content: migratedData.cleanMarkdown,
      date: pubDate,
      category: 'Rehabilitacja',
      // Jeśli AI nie znalazło zdjęć, ustawiamy null/pusty string, by pokazać estetyczny placeholder
      image: migratedData.images?.[0] || '',
      seo: {
        metaTitle: `${migratedData.title} | Antosia Wieczorek`,
        metaDescription: migratedData.seoDescription
      }
    };

    onAddPost(newPost);
    // Reset
    setHtmlCode('');
    setOriginalUrl('');
    setMigratedData(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Kolumna Lewa: Dane wejściowe */}
          <div className="p-10 bg-gray-50/50 border-r border-gray-100 space-y-8">
            <div>
              <h3 className="text-2xl serif mb-6">Importuj wpis</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-8">Krok 1: Informacje podstawowe</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Oryginalny adres URL (dla zachowania linków):</label>
                <input 
                  type="text"
                  placeholder="https://antoninawieczorek.pl/moj-stary-wpis"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Oryginalna data publikacji:</label>
                <input 
                  type="date"
                  value={pubDate}
                  onChange={(e) => setPubDate(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-100 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Kod HTML ze starego WordPressa:</label>
                <textarea 
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="Wklej tutaj zawartość pola tekstowego z edytora WP..."
                  className="w-full h-48 px-5 py-4 bg-white border border-gray-200 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-red-100 outline-none shadow-sm resize-none"
                />
              </div>

              <button
                onClick={handleMigrate}
                disabled={isProcessing || !htmlCode || !originalUrl}
                className="w-full bg-gray-900 text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-20 shadow-lg"
              >
                {isProcessing ? 'Analizowanie treści...' : 'Przetwórz i wkomponuj zdjęcia'}
              </button>

              {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-tight">{error}</p>}
            </div>
          </div>

          {/* Kolumna Prawa: Podgląd i Meta */}
          <div className="p-10 flex flex-col justify-center bg-white relative">
            {!migratedData && !isProcessing && (
              <div className="text-center space-y-4 opacity-30">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center text-2xl">✨</div>
                <p className="text-xs uppercase tracking-widest font-bold">Podgląd wygeneruje się tutaj</p>
              </div>
            )}

            {isProcessing && (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">AI czyści treść i szuka zdjęć...</p>
              </div>
            )}

            {migratedData && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-md">
                   {migratedData.images?.[0] ? (
                     <img 
                      src={migratedData.images[0]} 
                      alt="Miniaturka" 
                      className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Brak obrazu głównego</span>
                     </div>
                   )}
                   <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-[8px] px-3 py-1 rounded-full uppercase font-bold tracking-widest">
                     Ustawione jako okładka
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Slug:</span>
                    <span className="text-[10px] font-mono text-gray-400">/{extractSlugFromUrl(originalUrl)}</span>
                  </div>
                  <h4 className="text-3xl serif leading-tight">{migratedData.title}</h4>
                  <p className="text-sm text-gray-500 italic">"{migratedData.seoDescription}..."</p>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <button
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl"
                  >
                    Dodaj do dziennika z datą {new Date(pubDate).toLocaleDateString('pl-PL')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center text-[10px] text-gray-300 uppercase tracking-[0.3em] font-medium">
        System migracji bezstratnej dla Google (SEO Ready)
      </div>
    </div>
  );
};

export default MigrationTool;