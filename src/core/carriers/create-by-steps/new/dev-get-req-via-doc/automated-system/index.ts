import 'colors';
import { scrapeSite } from './1-scrape-site/scrape-site';
import { filterLinks } from './2-filter-scraped-site/filter-links';
import { scrapeLinks } from './3-scrape-links/scrape-links';
import { filterLinks2 } from './4a-filter-scraped-links/filter-links2';
import { extractContent } from './4b-process-links/1-extract-content-from-scraped-links/extract-content';
import { extractSteps } from './4b-process-links/2-process-content/extract-steps';
import { convergeSteps } from './5-converge-steps/converge-steps';

export const getReqViaDoc = async (
  carrierName: string,
  linksKeywords: string[],
  contentKeywords: string[],
) => {
  try {
    console.log('\nStarting site scraping...'.cyan);
    await scrapeSite(carrierName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('Filtering links from scraped site...'.cyan);
    await filterLinks(carrierName, linksKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('Scraping links for content...'.cyan);
    await scrapeLinks(carrierName, contentKeywords, 40);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await filterLinks2(carrierName, linksKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('Extracting content from scraped links...'.cyan);
    await extractContent(carrierName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('Extracting steps from content...'.cyan);
    await extractSteps(carrierName, contentKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('Converging steps...'.cyan);
    await convergeSteps(carrierName);
  } catch (error) {
    console.error('Error in execution sequence:'.red, error);
  }
};
