
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const parseScheduleFile = async (base64Data: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Extract subjects from this registration card or timetable image. Return a JSON array of objects with keys: code, name, prof, room. Only provide the JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              name: { type: Type.STRING },
              prof: { type: Type.STRING },
              room: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Error parsing schedule file:", error);
    return [];
  }
};

export const generateTimetableThemes = async (customPrompt?: string) => {
  const basePrompt = "Generate 6 unique and aesthetic color themes for a school timetable. Each theme should include a name, primaryColor, secondaryColor, textColor, accentColor, borderRadius (e.g. '0.5rem'), background, and a web-safe fontFamily.";
  const prompt = customPrompt ? `${basePrompt} Additionally, follow these custom instructions: ${customPrompt}` : basePrompt;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              textColor: { type: Type.STRING },
              accentColor: { type: Type.STRING },
              borderRadius: { type: Type.STRING },
              background: { type: Type.STRING },
              fontFamily: { type: Type.STRING }
            },
            required: ["id", "name", "primaryColor", "secondaryColor", "textColor", "accentColor", "borderRadius", "background", "fontFamily"]
          }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Error generating themes:", error);
    return [];
  }
};
