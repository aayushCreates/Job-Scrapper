import { GoogleGenAI } from "@google/genai";

export const linkedinPostFilter = async (chunkedData: any[]) => {
  try {
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const processedResults: any[] = [];

    const promptBase = `
You are a strict data extraction assistant.

You will receive raw text from a scraped LinkedIn post.

Extract ONLY useful information needed by a college TPO.

Return a SINGLE JSON object in this schema:

{
  "nameOfPosted": string | null,
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
- Clean description completely (remove repeated headers, hashtags, "Feed post", "Follow", "…more", likes/comments, timestamps).
- Extract email, phone, WhatsApp, URLs.
- No guessing. Null if not found.
- Always return VALID JSON only.
- No markdown or code fences in the output.
`;

    // iterate chunkedData: supports array-of-arrays like [[post1, post2], [post3]]
    for (const cdArr of chunkedData) {
      for (const cd of cdArr) {
        // resolve post text whether cd is string or { text: '...' }
        const postText = typeof cd === "string" ? cd : cd?.text || String(cd);

        const prompt = `${promptBase}
          Here is the LinkedIn post between the markers. Extract only the JSON object:

          <<<POST_START>>>
          ${postText}
          <<<POST_END>>>
          `;

        try {
          const result = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
          });

          let raw = "";
          if (!result) {
            console.warn("⚠️ empty result from model");
            continue;
          }
          
          //  to remove the output format issue if happens
          if (typeof (result as any).text === "function") {
            raw = ((result as any).text() || "").trim();
          } else {
            raw = (result as any).text
              ? String((result as any).text).trim()
              : "";
          }

          if (!raw) {
            console.warn("⚠️ model returned empty text");
            continue;
          }

          raw = raw
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          // Gemini adds extra sentences
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            console.warn(
              "⚠️ No JSON object found in model output. Raw:",
              raw.slice(0, 400)
            );
            continue;
          }

          const jsonText = jsonMatch[0];

          let parsed: any;
          try {
            parsed = JSON.parse(jsonText);
          } catch (err) {
            console.warn("⚠️ JSON.parse failed. Attempting minor fixes...");

            const cleaned = jsonText
              .replace(/,\s*}/g, "}")
              .replace(/,\s*]}/g, "]}");
            try {
              parsed = JSON.parse(cleaned);
            } catch (err2) {
              console.error(
                "❌ JSON parse ultimately failed for post. Raw JSON:",
                jsonText.slice(0, 400)
              );
              continue;
            }
          }

          const now = new Date().toISOString();
          parsed.createdAt = parsed.createdAt || now;
          parsed.updatedAt = parsed.updatedAt || now;

          processedResults.push(parsed);
        } catch (err) {
          console.error("❌ Gemini processing error:", err);
          continue;
        }
      }
    }

    return processedResults;
  } catch (err) {
    console.error("Error in linkedin post filtration:", err);
    return [];
  }
};
