
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a more user-friendly error.
  // For this environment, we assume API_KEY is set.
  console.warn("API_KEY not found in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateSpeech = async (text: string): Promise<{ audioBase64: string; duration: number }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say in a cheerful, friendly, and slightly playful kid's voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const audioPart = response.candidates?.[0]?.content?.parts?.[0];

    if (audioPart && audioPart.inlineData) {
        const audioBase64 = audioPart.inlineData.data;
        // Estimate duration. A more accurate method would be to decode and get buffer length,
        // but for syncing animations, this rough estimate is often sufficient.
        // Assuming ~150 words per minute and average 5 chars per word.
        const estimatedDuration = (text.length / 5) * (60 / 150) * 1000;
        return { audioBase64, duration: estimatedDuration };
    } else {
        throw new Error("No audio data received from API.");
    }
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Failed to generate speech.");
  }
};
