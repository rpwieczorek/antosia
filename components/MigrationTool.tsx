
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Post } from '../types';

interface MigrationToolProps {
  onAddPost: (post: Post) => void;
}

const MigrationTool: React.FC<MigrationToolProps> = ({ onAddPost }) => {
  const [htmlCode, setHtmlCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [migratedData, setMigratedData] = useState<any>(null);
  const [manualDate, setManualDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (migratedData?.date) {
      setManualDate(migratedData.date);
    } else if (migratedData) {
      setManualDate(new Date().toISOString().split('T')[0]);
    }
  }, [migratedData]);

  const handleMigrate = async () => {
    if (!htmlCode.trim()) return;
    setIsProcessing(true);
    setMigratedData(null);
    setError(null);
    
    try {
      const result = await geminiService.migratePostContent(htmlCode);
      setMigratedData(result);
    } catch (err: any) {
      console.error(err);
      setError("Nie udało się przetworzyć kodu. Upewnij się, że wkleiłeś poprawny kod HTML posta.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!migratedData) return;

    const newPost: Post = {
      id: Date.now().toString(),
      slug: migratedData.slug,
      title: migratedData.title,
      excerpt: migratedData.excerpt || migratedData.cleanMarkdown.substring(0, 150) + "...",
      content: migratedData.cleanMarkdown,
      date: manualDate, // Używamy daty wybranej/potwierdzonej przez użytkownika
      category: 'Rehabilitacja',
      image: migratedData.images?.[0] || 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800',
      seo: {
        metaTitle: migratedData.seoTitle,
        metaDescription: migratedData.seoDescription
      }
    };

    onAddPost(newPost);
    setHtmlCode('');
    setMigratedData(null);
    setManualDate('');
  };

  return (
    <div className="space-y-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-3xl serif mb-4">Migracja z chronologią</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl text-[10px] text-gray-500 space-y-2">
              <p className="font-bold text-gray-700 uppercase">Instrukcja chronologii:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Skopiuj kod HTML posta ze starego WordPressa.</li>
                <li>Wklej poniżej i kliknij "Przetwórz".</li>
                <li><b>W podglądzie sprawdź datę</b> – AI spróbuje ją odczytać, ale możesz ją zmienić ręcznie.</li>
              </ol>
            </div>
            
            <textarea 
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              placeholder="Wklej kod HTML tutaj..."
              className="w-full h-64 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-100 transition-all text-xs font-mono"
            />
            
            <button
              onClick={handleMigrate}
              disabled={isProcessing || !htmlCode.trim()}
              className="w-full bg-gray-900 text-white py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-30"
            >
              {isProcessing ? 'Analiza kodu i daty...' : 'Przetwórz wpis'}
            </button>
            
            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase text-center">{error}</p>
            )}
          </div>

          <div className="space-y-6">
            {!migratedData && !isProcessing && (
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">Ważne dla Google (SEO)</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Aby nie stracić pozycjonowania, upewnij się, że:
                  <br /><br />
                  1. <b>Slug</b> (końcówka adresu) jest identyczny jak na starej stronie.
                  <br />
                  2. <b>Data</b> odpowiada dacie pierwszej publikacji – Google ceni historię i autentyczność wpisów.
                </p>
              </div>
            )}
            
            {migratedData && (
              <div className="bg-white p-8 rounded-2xl border-2 border-green-100 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-xs font-bold uppercase text-green-700">Weryfikacja wpisu</h4>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[8px] font-bold uppercase tracking-tighter">AI wyczyściło kod</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Data publikacji (bardzo ważne):</label>
                    <input 
                      type="date"
                      value={manualDate}
                      onChange={(e) => setManualDate(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Tytuł:</label>
                    <p className="text-lg serif font-bold text-gray-900">{migratedData.title}</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Fragment treści:</label>
                    <p className="text-xs text-gray-500 italic line-clamp-2 leading-relaxed">
                      "{migratedData.cleanMarkdown.substring(0, 150)}..."
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex gap-4">
                    <button
                      onClick={() => setMigratedData(null)}
                      className="flex-1 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-2 px-8 py-3 bg-green-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-green-700 transition-all shadow-md"
                    >
                      Zapisz z datą {new Date(manualDate).toLocaleDateString('pl-PL')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="h-full flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Analizuję chronologię...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationTool;
