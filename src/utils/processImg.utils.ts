import OpenAI from "openai";
import Tesseract from "tesseract.js";

export const extractJobDetailsFromImage = async (imgPath: string) => {
  const { data } = await Tesseract.recognize(imgPath, "eng");

    const prompt = `
    Extract structured job info from this text:
    ${data?.text}
  
    Return JSON with:
    { "companyName": "", "title": "", "jobType": "", "keywords": [] }
    `;

  try {
    const client = new OpenAI({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    let content = response?.choices[0]?.message?.content ?? "";

    content = content.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(content);

    return parsed;
  } catch (err) {
    console.error("❌ Error extracting job details:", err);
    return null;
  }
};
