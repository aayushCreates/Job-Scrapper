import { GoogleGenAI } from "@google/genai";


export const aiFilteration = async (processedData: any)=> {
    const GEMINI_API_KEY = process.env.API_KEY;

    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY
    })

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: processedData
    })

    return response;
}


