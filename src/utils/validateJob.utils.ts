import axios from "axios";

export const findCompanyWebsite = async (companyName: string)=> {
    try {
        const apiKey = process.env.GOOGLE_API_KEY!;
        const cx = process.env.GOOGLE_CX_ID!;

        const query = encodeURIComponent(`${companyName} official site`);

        const url = `https://www.googleapis.com/customsearch/v1??key=${apiKey}&cx=${cx}&q=${query}`;

        const response = await axios.get(url);
        if(response.data){
            console.log("Company not found from URL");
            return false;
        }
        const items = response.data.items;
        const website = items[0]?.link as string;

        return website;
    } catch(err) {
        console.log("Error in validating Job by company");
    }
}


