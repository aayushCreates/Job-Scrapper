// import * as cheerio from "cheerio";

// export const findJobContainer = (completeHTML: any, position: string) => {
//   const $ = cheerio.load(completeHTML);
//   const selectors = [
//     `[class*=${position}]`,
//     `[id*=${position}]`,
//     '[class*="job"]',
//     '[id*="job"]',
//     '[class*="career"]',
//     '[id*="career"]',
//     '[class*="opening"]',
//     '[class*="vacancy"]',
//   ];
//   let results: string[] = [];

//   selectors.forEach((s) => {
//     $(s).each((_, el) => {
//       const text = $(el).text().trim();

//       if (text.length > 50) {
//         results.push($.html(el)!);
//       }
//     });
//   });

//   console.log("totalJOBS FOUND: ", results);

//   const uniqueJobs = Array.from(new Set(results));  // array <- array like OBJECT.
  
//   return uniqueJobs;
// };

import * as cheerio from "cheerio";

export function JobContainer(html: string) {
  try {
    const $ = cheerio.load(html);
    const probableContainers: any[] = [];

    $("div, section, ul, article").each((_, el) => {
      const attr = ($(el).attr("class") || "") + ($(el).attr("id") || "");
      const text = $(el).text().trim().toLowerCase();

      // Detect job-like containers either by attribute or visible text
      if (
        /job|career|opening|position|vacancy|role|opportunit|hiring/i.test(attr) ||
        (/apply/i.test(text) && /developer|engineer|manager|intern|designer|sales|marketing/.test(text))
      ) {
        const childCount = $(el).children().length;
        const textLen = text.length;
        probableContainers.push({
          tag: el.tagName,
          class: $(el).attr("class"),
          id: $(el).attr("id"),
          childCount,
          textLen,
          html: $.html(el),
        });
      }
    });

    probableContainers.sort((a, b) => {
      // Sort by both text length and child count
      return b.textLen - a.textLen || b.childCount - a.childCount;
    });

    console.log(`🔍 Found ${probableContainers.length} potential job containers`);

    // Return top few probable HTML blocks
    return probableContainers.slice(0, 3);
  } catch (err) {
    console.error("Error parsing job container:", err);
    return [];
  }
}

