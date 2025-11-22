import { GoogleGenAI } from "@google/genai";

export const linkedinPostFilter = async (chunkedData: any[]) => {
  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const processedResults: any[] = []; // final array

    const promptBase = `
You are a strict data extraction assistant.

You will receive raw text from a scraped LinkedIn post that includes noise (names, hashtags, “Follow”, “Feed post”, timestamps).

Extract ONLY useful information needed by a college TPO.

Return a SINGLE JSON object in this schema:

{
  "description": string | null,
  "batch": string | null,
  "location": string | null,
  "email": string | null,
  "phone": string | null,
  "whatsapp": string | null,
  "jobUrl": string | null,
  "googleFormUrl": string | null,
  "postedAt": string | null,
  "createdAt": string,
  "updatedAt": string
}

Rules:
- Clean description completely.
- Extract email, phone, WhatsApp, URLs.
- No guessing. Null if not found.
- Always return VALID JSON only.
- No markdown or code fences.
`;

    for (const cd of chunkedData) {
      const postText = typeof cd === "string" ? cd : cd.text || cd;

      const prompt = `${promptBase}\n\nRAW POST:\n${postText}`;

      try {
        const result = await client.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        let raw = result?.text?.trim() || "";

        // remove markdown fences
        raw = raw
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .replace(/^Here.*?\n/gi, "")  // remove "Here is your output"
          .trim();

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (err) {
          console.log("⚠️ JSON parse failed for chunk:", raw);
          continue;
        }

        // timestamps
        const now = new Date().toISOString();
        parsed.createdAt = parsed.createdAt || now;
        parsed.updatedAt = parsed.updatedAt || now;

        processedResults.push(parsed);
      } catch (err) {
        console.log("❌ Gemini processing error:", err);
        continue;
      }
    }

    return processedResults; // FINAL CLEAN ARRAY
  } catch (err) {
    console.log("Error in linkedin post filtration:", err);
    return [];
  }
};