
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async migratePostContent(rawHtml: string) {
    const ai = this.getAI();
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Jesteś narzędziem do czyszczenia kodu HTML. Przekonwertuj poniższy kod z WordPressa na czysty tekst Markdown.
      
      ZASADY BEZWZGLĘDNE:
      1. NIE ZMIENIAJ TREŚCI. Nie poprawiaj błędów, nie skracaj, nie redaguj. Tekst musi być identyczny 1:1.
      2. Wyciągnij Tytuł, Sugerowany Slug (końcówka adresu) oraz czystą treść.
      3. Znajdź linki do obrazków (tagi <img>) i umieść je w tablicy images.
      4. POSZUKAJ DATY PUBLIKACJI (np. w tagach <time>, meta property="article:published_time" lub klasach CSS "entry-date"). Zwróć ją w formacie YYYY-MM-DD. Jeśli nie znajdziesz, zostaw puste.
      
      KOD HTML DO PRZETWORZENIA:
      ${rawHtml}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slug: { type: Type.STRING },
            cleanMarkdown: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            seoTitle: { type: Type.STRING },
            seoDescription: { type: Type.STRING },
            date: { type: Type.STRING, description: "Format YYYY-MM-DD" },
            images: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "slug", "cleanMarkdown", "seoTitle"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Błąd komunikacji z AI");
    
    return JSON.parse(text);
  }
}

export const geminiService = new GeminiService();
