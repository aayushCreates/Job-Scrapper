import axios from "axios";

export const findCareerPage = async (companyName: string) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY!;
  const cx = process.env.GOOGLE_CX_ID!;

  const query = `${companyName} careers OR jobs site:${companyName.toLowerCase().replace(/\s+/g, '')}.com`;

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

  const { data } = await axios.get(url);
  const items = data.items || [];

  // Find the best match — prioritize URLs containing "career" or "job"
  const bestMatch = items.find((item: any) =>
    /(career|careers|job|join-us)/i.test(item.link)
  );

  // If none found, fallback to first result
  const selected = bestMatch || items[0];

  return {
    company: companyName,
    title: selected?.title,
    link: selected?.link,
    snippet: selected?.snippet,
  };
  } catch(err) {
    console.log("Error in google search api code: ", err);
    return null;
  }
};
