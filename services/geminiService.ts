import { GoogleGenAI, Type } from "@google/genai";
import { FALLBACK_SECRETS } from "../constants";
import { SecretData, Language } from "../types";

export const generateSecretWord = async (
  topic: string = "",
  apiKey?: string,
  previousWords: string[] = [],
  language: Language = 'en'
): Promise<SecretData> => {
  const fallbackList = FALLBACK_SECRETS[language] || FALLBACK_SECRETS['en'];

  if (!apiKey) {
    // Fallback if no key is provided
    const available = fallbackList.filter(s => !previousWords.includes(s.word));
    const pool = available.length > 0 ? available : fallbackList;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const ai = new GoogleGenAI({ apiKey });

  const avoidList = previousWords.slice(0, 50).join(", ");
  const avoidClause = avoidList ? `DO NOT use these words: ${avoidList}.` : "";
  
  const langInstruction = language === 'cs' 
    ? "Output MUST be in Czech language (Čeština)." 
    : "Output MUST be in English language.";

  const prompt = topic
    ? `Generate a common, easy-to-guess object, place, or person related to the topic: "${topic}" for a party game like Spyfall. ${avoidClause} ${langInstruction} The word should be generally known. Also provide a category for it.`
    : `Generate a random, common, easy-to-guess object, place, person, animal, or concept for a party game like Spyfall. 
       It should be a very common everyday item or well-known concept suitable for casual players.
       Avoid obscure words or difficult concepts.
       Avoid common clichés like "Submarine", "Eiffel Tower", "Pizza", "Superman" unless necessary.
       ${avoidClause}
       Vary the category (e.g., household items, nature, transport, food, places).
       ${langInstruction}
       Also provide a broad category.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING, description: "The secret word" },
            category: { type: Type.STRING, description: "The category" },
          },
          required: ["word", "category"],
        },
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as SecretData;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini API Error:", error);
    const available = fallbackList.filter(s => !previousWords.includes(s.word));
    const pool = available.length > 0 ? available : fallbackList;
    return pool[Math.floor(Math.random() * pool.length)];
  }
};