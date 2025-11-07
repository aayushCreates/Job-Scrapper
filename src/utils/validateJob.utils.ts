import axios from "axios";

export const findCompanyWebsite = async (companyName: string) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY!;
    const cx = process.env.GOOGLE_CX_ID!;

    const query = encodeURIComponent(`${companyName} official site`);

    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${query}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data.items || data.items.length === 0) {
      console.log("No search results found.");
      return null;
    }

    // ✅ Extract the best possible website
    const website = extractOfficialWebsite(data, companyName);

    return website;
  } catch (err) {
    console.log("Error in validating Job by company");
  }
};

const extractOfficialWebsite = (data: any, companyName: string) => {
    const cleanName = companyName.toLowerCase().replace(/\s+/g, "");

    const candidates = data.items.filter((item: any)=> {
        return (
            item.displayLink?.toLowerCase().includes(cleanName)
        )
    })

    const preferred = candidates.find((item: any)=> (
        /\.com|\.in|\.org/i.test(item.displayLink) && !item.displayLink.includes("linkedin") && !item.displayLink.includes("wikipedia")
    ))
  
    const selected = preferred || data.items[0];
    return selected?.link || null;
  };