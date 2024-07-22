import { scrapeSite } from './1-scrape-site/scrape-site';
import { filterLinks } from './2-filter-scraped-site/filter-links';
import { scrapeLinks } from './3-scrape-links/scrape-links';
import { filterLinks2 } from './4a-filter-scraped-links/filter-links2';
import { extractContent } from './4b-process-links/1-extract-content-from-scraped-links/extract-content';
import { extractSteps } from './4b-process-links/2-process-content/extract-steps';
import { convergeSteps } from './5-converge-steps/converge-steps';

export const getReqViaDoc = async (
  serviceName: string,
  linksKeywords: string[],
  contentKeywords: string[],
) => {
  try {
    const { default: chalk } = await import('chalk');

    console.log(chalk.green('\nStarting site scraping...'));
    await scrapeSite(serviceName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log(chalk.green('\nFiltering links from scraped site...'));
    await filterLinks(serviceName, linksKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log(chalk.green('\nScraping links for content...'));
    await scrapeLinks(serviceName, contentKeywords, 10);
    await new Promise((resolve) => setTimeout(resolve, 200));

    await filterLinks2(serviceName, linksKeywords);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log(chalk.green('\nExtracting content from scraped links...'));
    await extractContent(serviceName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log(chalk.green('\nExtracting steps from content...'));
    await extractSteps(serviceName);
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log(chalk.green('\nConverging steps...'));
    await convergeSteps(serviceName);
  } catch (error) {
    console.error('Error in execution sequence:', error);
  }
};
