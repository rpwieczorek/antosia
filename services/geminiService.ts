import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async migratePostContent(rawHtml: string) {
    const ai = this.getAI();
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Jesteś ekspertem od migracji treści z WordPress. Przekonwertuj HTML na czysty Markdown.
      
      ZASADY FORMATOWANIA:
      1. Tytuł: Wyodrębnij sensowny tytuł.
      2. Struktura: 
         - Każdą datę (np. 26.06.2012) zamień na nagłówek: ### 26.06.2012
         - Rozdzielaj akapity podwójnym znakiem nowej linii.
         - NIE używaj technicznych znaczników typu \\n, \\r, &nbsp; w tekście wynikowym.
      3. Zdjęcia: Wyłuskaj wszystkie URL obrazków.
      4. Opis: Krótkie streszczenie (SEO).
      
      KOD DO KONWERSJI:
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
    
    // Czyścimy tekst z ewentualnych pozostałości po parsowaniu JSON
    const data = JSON.parse(text);
    if (data.cleanMarkdown) {
      data.cleanMarkdown = data.cleanMarkdown
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/&nbsp;/g, ' ');
    }
    
    return data;
  }
}

export const geminiService = new GeminiService();