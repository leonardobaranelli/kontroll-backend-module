import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

interface LinkInfo {
  siteUrl: string | null;
  href: string | null;
  text: string | null;
}

interface SearchResults {
  siteUrl: string;
  links: LinkInfo[];
}

async function searchGoogle(
  query: string,
  maxResults: number,
): Promise<SearchResults> {
  const searchUrl = `https://www.google.com/search?hl=en&q=${encodeURIComponent(
    query + ' developer',
  )}`;

  const browser: Browser = await puppeteer.launch({
    headless: true, // Set to true for headless operation
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null, // Use default viewport for more flexibility
    ignoreHTTPSErrors: true,
  });

  const page: Page = await browser.newPage();

  try {
    // Clear cookies and cache
    await page.goto('chrome://settings/clearBrowserData');
    await waitFor(2000); // Wait for the settings page to load
    await waitFor(3000); // Wait for cookies and cache to be cleared

    // Set HTTP headers and language settings
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9', // Prefer English
    });

    // Simulate a real browser with English settings
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    );

    // Navigate to the search URL
    await page.goto(searchUrl, {
      waitUntil: 'networkidle2',
      timeout: 180000,
    });

    // Wait for search results to load
    await page.waitForSelector('a', { timeout: 180000 });

    // Get the link of the first search result
    const firstResultLink: string | null = await page.evaluate(() => {
      const firstResult =
        document.querySelector<HTMLAnchorElement>('.tF2Cxc a'); // Selector for the first result in Google
      return firstResult?.getAttribute('href') || null;
    });

    if (firstResultLink) {
      // Navigate to the first search result
      await page.goto(firstResultLink, {
        waitUntil: 'networkidle2',
        timeout: 180000,
      });

      // Extract site URL
      const siteUrl = page.url();

      // Extract all links on the page
      const allLinks: LinkInfo[] = await page.evaluate((siteUrl) => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors.map((anchor) => ({
          siteUrl, // Include the site URL for each link
          href: anchor.getAttribute('href'),
          text: anchor.textContent,
        }));
      }, siteUrl);

      // Save all links to a JSON file
      const jsonFileName = `src/core/carriers/new/dev/get-req-via-doc/1-scrape-site/links/all_links_${query
        .replace(/\s+/g, '_')
        .toLowerCase()}.json`;
      fs.writeFileSync(jsonFileName, JSON.stringify(allLinks, null, 2));

      return {
        siteUrl,
        links: allLinks.slice(0, maxResults),
      };
    } else {
      throw new Error('No search results found');
    }
  } catch (error) {
    console.error('Error during search:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

async function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Main
export async function scrapeSite(serviceName: string): Promise<void> {
  const query = `${serviceName}`;
  const numberOfResults = 1;

  try {
    const results = await searchGoogle(query, numberOfResults);
    console.log(
      `Search for carrier ${serviceName} completed:`,
      results.siteUrl,
    );
  } catch (error) {
    console.error('Search failed:', error);
    throw error;
  }
}
