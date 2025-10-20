import { GoogleGenAI } from "@google/genai";

export const aiFilteration = async (processedData: any)=> {
    try {
        const GEMINI_API_KEY = process.env.API_KEY;
    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY
    })

    const prompt = `
    You are an assistant that takes an array of job objects which having scrapped data form the job-boards.
    **I want that you return a JSON array strictly matching schema: {title, description, companyName, location, minSalary, maxSalary, fixedSalary, eligibleYear, requiredExp, skills, jobUrl, postPlatform, aiScore, experienceLevel, position, postedAt, createdAt}.
Rules: ... (salary parsing, remove \n, etc.)**
        ${processedData}
    `

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt
    })

    return response;
    } catch(err) {
        console.log("Error in filtering the scrapped job from AI");
    }
}


