import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getSmartDestinationSuggestion = async (query: string): Promise<string[]> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini. Returning mock suggestions.");
    return [
      "The Coffee Bean - 12 Main St",
      "Starbucks Reserve - 45 Broad Ave",
      "Joe's Local Brew - 88 Market St"
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Suggest 3 realistic, specific location names with addresses for a ride-hailing app based on this user query: "${query}". Return only the list of locations separated by newlines, no other text.`,
    });
    
    const text = response.text || '';
    return text.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["Error fetching suggestions"];
  }
};
