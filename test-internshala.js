const { chromium } = require('playwright');

async function testInternshala() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://internshala.com/internships/developer-internship/page-1', {
            waitUntil: 'networkidle'
        });
        
        // Wait for content to load
        await page.waitForTimeout(3000);
        
        // Get all job cards and find a real one (not promotional)
        const allJobs = await page.$$('.individual_internship');
        console.log(`Total job cards found: ${allJobs.length}`);
        
        let realJob = null;
        for (let i = 0; i < allJobs.length; i++) {
            const jobHtml = await allJobs[i].evaluate(el => el.outerHTML);
            // Skip promotional content (look for actual job titles)
            if (!jobHtml.includes('Get Internship and Job Preparation') && 
                !jobHtml.includes('OFFER') && 
                !jobHtml.includes('coupon')) {
                realJob = jobHtml;
                console.log(`Found real job at index ${i}`);
                break;
            }
        }
        
        if (realJob) {
            console.log('Real job HTML structure:');
            console.log(realJob.substring(0, 2000));
        } else {
            console.log('No real job found, showing first card:');
            const firstJob = await page.$eval('.individual_internship', (el) => el.outerHTML);
            console.log(firstJob.substring(0, 2000));
        }
        
        // Test current selectors
        const selectors = {
            title: '.heading_4_5 a',
            companyName: '.company_name a',
            location: '.location_link',
            description: '.internship_details .item_body',
            jobUrl: '.heading_4_5 a'
        };
        
        console.log('\nTesting current selectors:');
        for (const [key, selector] of Object.entries(selectors)) {
            const elements = await page.$$(selector);
            console.log(`${key}: ${elements.length} elements found`);
            if (elements.length > 0) {
                const text = await elements[0].textContent();
                console.log(`  First element text: "${text.trim()}"`);
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

testInternshala();
