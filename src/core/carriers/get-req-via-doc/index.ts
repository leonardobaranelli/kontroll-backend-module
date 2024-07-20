import { scrapeSite } from './1-scrape-site/scrape-site';
import { filterLinks } from './2-filter-scraped-site/filter-links';
import { scrapeLinks } from './3-scrape-links/scrape-links';
import { filterLinks2 } from './4a-filter-scraped-links/filter-links2';
import { extractContent } from './4b-process-links/1-extract-content-from-scraped-links/extract-content';
import { processContent } from './4b-process-links/2-process-content/process-content';
import { convergeSteps } from './5-converge-steps/converge-steps';

export const getReqViaDoc = async (
  serviceName: string,
  _linksKeywords: string[],
  _contentKeywords: string[],
) => {
  try {
    await scrapeSite(serviceName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await filterLinks(serviceName, linksKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await scrapeLinks(serviceName, contentKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await filterLinks2(serviceName, linksKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await extractContent(serviceName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await processContent(serviceName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await convergeSteps(serviceName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('\nAll secuence executed successfully');
  } catch (error) {
    console.error('Error in execution sequence:', error);
  }
};

const serviceName = 'DHL Global Forwarding';
const linksKeywords = ['forNowJustEmptyWithTheServiceNameOnly'];
const contentKeywords = [
  'api key',
  'auth',
  'account number',
  'client number',
  'credential',
];

getReqViaDoc(serviceName, linksKeywords, contentKeywords);
