
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async migratePostContent(rawHtml: string) {
    const ai = this.getAI();
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Jesteś zaawansowanym narzędziem do migracji treści z WordPressa. Przekonwertuj poniższy kod HTML na czysty tekst Markdown.
      
      ZASADY:
      1. Wyodrębnij TYTUŁ wpisu.
      2. Przekonwertuj treść na Markdown, zachowując strukturę akapitów.
      3. Znajdź wszystkie tagi <img>. Zwróć ich adresy URL w tablicy 'images' w kolejności występowania.
      4. Pierwsze zdjęcie w treści potraktuj jako główne.
      5. Przygotuj krótkie SEO Description (ok. 150 znaków) na podstawie treści.
      
      KOD HTML:
      ${rawHtml}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            cleanMarkdown: { type: Type.STRING },
            seoDescription: { type: Type.STRING },
            images: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "cleanMarkdown", "seoDescription", "images"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Błąd komunikacji z AI");
    
    return JSON.parse(text);
  }
}

export const geminiService = new GeminiService();
