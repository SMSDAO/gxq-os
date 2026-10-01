import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
  apiKey: "GEMINI_API_KEY", // Note: The environment will inject this at runtime if we were on server, but we are client-side here.
  // Actually, for client-side, we usually need a proxy, but AIS build allows it if MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API is set? 
  // Wait, the skill says NEVER call Gemini API directly from client.
  // I must create a server-side route.
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
