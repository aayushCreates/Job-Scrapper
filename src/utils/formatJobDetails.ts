import OpenAI from "openai";

export const formattedJobDetails = async (jobDetailsHtml: any) => {
  const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const prompt = `You are a strict formatter assistant.
    And your job is to make the given raw scrapped html content of the job into proper json format given below
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
    
    if you find that a particular key data is not present then treat as empty or according to the dataType. and also if you find that same position or title are present more than once then according to the post data give me different different json formatted data for job title or position.

    ### Rules:
        - Normalize \`requiredSkills\` to an array (e.g. split on commas).
        - Keep \`salary\` as a string (e.g. "₹5–8 LPA", "Not disclosed").
        - Ensure all date fields are ISO strings (e.g. "2025-10-20T00:00:00Z").
        - Return only the JSON array. No markdown, no explanation.

        Here is the data:
        ${JSON.stringify(jobDetailsHtml)}
    `;

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt
  })

  const textOutput = response.output_text || "";
  try {
    const parsed = JSON.parse(textOutput);
    return parsed;
  } catch (err) {
    console.error("Failed to parse formatted job JSON:", err);
    console.log("Raw output:", textOutput);
    return null;
  }
};
