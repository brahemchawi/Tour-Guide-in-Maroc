import { GoogleGenAI, GenerateContentResponse, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { ChatMessage, LocationData, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (language: Language) => `
You are "Murshid", an expert, friendly, and enthusiastic AI tour guide. 
Your goal is to help users plan trips, find restaurants, discover historical sites, and navigate cities.

**LANGUAGE INSTRUCTION:**
You MUST reply in the user's preferred language, which is code: "${language}".
If the user speaks a different language in the message, adapt to that, but default to ${language}.

Guidelines:
1. Be helpful, concise, and culturally aware.
2. When suggesting places, you rely on the Google Maps tools provided to give accurate, real-world locations.
3. Use formatting (bolding, lists) to make itineraries easy to read.
4. If the user asks for "nearby" places, use the provided location context.

**RESTAURANT & CAFE LISTINGS:**
When the user asks for restaurants or cafes, you **MUST** provide a structured list.
For EACH recommendation, you **MUST** provide the following details if available (use Google Maps grounding to verify):
- **Name:** The name of the place.
- **Rating:** User rating (e.g., ⭐ 4.5).
- **Cuisine:** (e.g., Moroccan, Italian, Cafe).
- **Price:** (e.g., 💲 Moderate, 💲💲 High, 💲💲💲 Luxury).
- **Hours:** Opening/Closing times.
- **Description:** Brief description of the vibe or specialties.

**HOTEL & ACCOMMODATION LISTINGS:**
When the user asks for hotels or accommodation, you **MUST** provide a structured list containing specific details.
Use Google Maps grounding to find real places.
For EACH hotel, use this exact format:

1. **[Hotel Name]**
   - **Rating:** [Star Rating e.g., ⭐⭐⭐⭐⭐]
   - **Price:** [Price in Local Currency] /night (approx).
   - **Location:** [Neighborhood/Area] - (Mention proximity to landmarks).
   - **Key Features:** [List 3-4 key amenities, e.g., Pool, Free WiFi, Breakfast].

**CAR RENTAL (AGENCY) LISTINGS:**
When the user asks for car rentals (كراء السيارات), you **MUST** provide a structured list.
Use Google Maps grounding to find real agencies.
For EACH agency:
1. **[Agency Name]**
   - **Rating:** [User rating e.g., ⭐ 4.2]
   - **Location:** [Address/Area]
   - **Details:** [Car types if known, e.g., SUV, City Cars]
   - **Notes:** [Open hours or specific rental conditions if available]

Ensure the response is visually clean, using bullet points. If exact prices are not available via the tool, provide a realistic estimate based on the hotel/agency tier.
`;

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  userLocation?: LocationData,
  language: Language = 'ar'
): Promise<{ text: string; groundingChunks?: any[] }> => {
  
  try {
    const model = 'gemini-2.5-flash';
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: getSystemInstruction(language),
        tools: [{ googleMaps: {} }],
        toolConfig: userLocation ? {
          retrievalConfig: {
            latLng: {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude
            }
          }
        } : undefined,
        // Add Safety Settings to prevent blocking harmless travel requests (like bars/wineries or cultural sites)
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: newMessage
    });

    const text = result.text || "Sorry, I couldn't get information right now. Please try again.";
    
    // Extract grounding chunks if available (for maps)
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "Connection error. Please check your internet or try again later.", 
      groundingChunks: [] 
    };
  }
};