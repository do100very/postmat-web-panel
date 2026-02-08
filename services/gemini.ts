
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceEvent, TelemetryPoint, Incident } from '../types';

export const analyzePostomatStatus = async (
  events: DeviceEvent[],
  telemetry: TelemetryPoint[],
  incidents: Incident[]
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze the following data from a parcel locker (postomat) and provide a concise summary, 
    risk assessment (Low/Medium/High), and recommended actions.
    
    RECENT EVENTS:
    ${JSON.stringify(events.slice(0, 5))}
    
    TELEMETRY TRENDS (LAST 24H):
    ${JSON.stringify(telemetry.slice(-5))}
    
    ACTIVE INCIDENTS:
    ${JSON.stringify(incidents)}
    
    Provide output as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["summary", "riskLevel", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return null;
  }
};
