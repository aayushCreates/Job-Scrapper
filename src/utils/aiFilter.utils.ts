import { GoogleGenAI } from "@google/genai";

export const aiFilteration = async (chunkedData: any) => {
  const finalFormattedJsonArr: any = [];

  chunkedData.map(async (cd: any) => {
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
You are a strict formatter assistant.

Your job is to take an array of **chunked raw data, scraped job objects JSON** and clean/normalize them and also remove the /n and other unnecessary things so that it fits in the following exact schema:

{
  title: string,
  position: string,
  description: string,
  requiredSkills: string[],
  allowedYears: string,
  allowedBranches: string[],
  salary: string,
  jobUrl: string,
  companyName: string,
  postedAt: string (ISO 8601 format),
  createdAt: string (ISO 8601),
  updatedAt: string (ISO 8601)
}

### Rules:
- Normalize \`requiredSkills\` to an array (e.g. split on commas).
- Keep \`salary\` as a string (e.g. "₹5–8 LPA", "Not disclosed").
- Ensure all date fields are ISO strings (e.g. "2025-10-20T00:00:00Z").
- Return only the JSON array. No markdown, no explanation.

Here is the data:

${JSON.stringify(chunkedData)}
`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("result candidates: ", result.candidates);

    let raw = result?.text?.trim();

    // Strip markdown code block (if AI returns it)
    if (raw?.startsWith("```json")) {
      raw = raw
        .replace(/```json\s*/i, "")
        .replace(/```$/, "")
        .trim();
    }

    console.log("raw: ", raw);

    try {
      finalFormattedJsonArr.push(JSON.parse(raw as string));
    } catch (err) {
      console.error("❌ JSON parsing failed:", raw);
    }
  });

  return finalFormattedJsonArr;
};
