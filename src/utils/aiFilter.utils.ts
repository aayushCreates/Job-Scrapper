import { GoogleGenAI } from "@google/genai";

export const aiFilteration = async (chunkedData: any) => {
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `
You are a strict formatter assistant.

Your job is to take an array of **raw, scraped job objects** and clean/normalize them to fit the following exact schema:

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
    model: 'gemini-2.0-pro',
    contents: prompt
  })

  let raw = result?.text?.trim();

  // Strip markdown code block (if AI returns it)
  if (raw?.startsWith("```json")) {
    raw = raw
      .replace(/```json\s*/i, "")
      .replace(/```$/, "")
      .trim();
  }

  let formattedJobs;
  try {
    formattedJobs = JSON.parse(raw as string);
    console.log("✅ Cleaned jobs:", formattedJobs);
  } catch (err) {
    console.error("❌ JSON parsing failed:", raw);
  }
};
