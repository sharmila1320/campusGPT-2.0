import { GoogleGenAI } from "@google/genai";
import { UserRole } from "../types";
import { MockDb } from "./mockDb";

const MODEL_NAME = "gemini-2.5-flash";

export const generateResponse = async (
  query: string,
  userRole: UserRole,
  history: { role: string; parts: { text: string }[] }[] = []
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 1. Retrieve relevant internal context (Simulated RAG)
  const context = MockDb.searchKnowledge(query, userRole);
  
  // 2. Construct System Instruction
  let systemInstruction = `
You are CampusGPT, an intelligent assistant for the Institute. 
Your goal is to help students, faculty, and visitors with accurate information.

CONTEXT FROM INTERNAL DATABASE:
${context ? context : "No specific internal documents found for this query."}

RULES:
1. If the user asks about institute-specific details (schedules, specific profs, local events) and the info is in the CONTEXT above, answer using that.
2. If the info is NOT in the CONTEXT, use your 'googleSearch' tool to find public information (news, general academic info, maps, weather).
3. If you cannot find the answer in CONTEXT or via Google Search (e.g., a very specific internal rumour or unpublished schedule), honestly say: "I don't have that information right now. Would you like to raise a ticket to the community?"
4. If the user is a 'guest' (external), do not reveal sensitive internal info even if it is in the context (though the context provider should filter this, double check).
5. Be polite, concise, and helpful.
6. If the user asks to "raise a ticket" or "ask the community", confirm that you can help them do that via the interface.

Current User Role: ${userRole}
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        ...history, // Past chat history
        { role: 'user', parts: [{ text: query }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }], // Enable Google Search grounding
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract sources
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    // Check if we should suggest a ticket
    // This is a heuristic check based on the model's text response. 
    // Ideally, we would use function calling or a structured classification, but text analysis works for this demo.
    const suggestTicket = text?.toLowerCase().includes("raise a ticket") || text?.toLowerCase().includes("ask the community");

    return {
      text: text || "I'm having trouble processing that request.",
      sources,
      suggestTicket
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I am experiencing connection issues. Please try again later.",
      sources: [],
      suggestTicket: false
    };
  }
};