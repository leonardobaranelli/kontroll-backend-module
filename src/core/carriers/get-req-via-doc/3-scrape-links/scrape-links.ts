import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface LinkInfo {
  text: string;
  url: string;
}

const loadJSON = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

const saveJSON = (filePath: string, data: any): void => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
  } catch (error) {
    console.error(`Error saving JSON file at ${filePath}:`, error);
  }
};

const extractServiceRequirements = (
  content: string,
  contentKeywords: string[],
): any => {
  const requirements: any = {};

  contentKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = content.match(regex);

    if (matches && matches.length > 0) {
      requirements[keyword] = matches.length;
    }
  });

  return requirements;
};

export const scrapeLinks = async (
  serviceName: string,
  contentKeywords: string[],
  concurrency: number = 5,
): Promise<void> => {
  const serviceDir = path.join(
    './src/core/carriers/get-req-via-doc/3-scrape-links/scraped-links/',
    serviceName.toLowerCase().replace(/\s+/g, '_'),
  );
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null,
    ignoreHTTPSErrors: true,
  });

  try {
    const inputLinksFilePath = `./src/core/carriers/get-req-via-doc/2-filter-scraped-site/filtered-links/filtered_links_${serviceName
      .toLowerCase()
      .replace(/\s+/g, '_')}.json`;

    if (!fs.existsSync(inputLinksFilePath)) {
      throw new Error(`Links file does not exist at ${inputLinksFilePath}`);
    }

    const links: LinkInfo[] = loadJSON(inputLinksFilePath).slice(0, 10);

    const processLink = async (link: LinkInfo) => {
      const page: Page = await browser.newPage();
      try {
        if (!link.url) {
          throw new Error(`Invalid URL for link: ${link.text}`);
        }

        console.log(`Processing link: ${link.url}`);

        await page.goto(link.url, {
          waitUntil: 'networkidle2',
          timeout: 180000,
        });

        const content = await page.evaluate(() => {
          return document.body.innerText;
        });

        const pageLinks: LinkInfo[] = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a'));
          return anchors.map((anchor) => ({
            text: anchor.textContent
              ? anchor.textContent.toLowerCase().replace(/\n|\t/g, '').trim()
              : '',
            url: anchor.href,
          }));
        });

        const requirements = extractServiceRequirements(
          content,
          contentKeywords,
        );

        const fileName =
          link.text.replace(/\s+/g, '_').toLowerCase() || 'default';
        const outputDirPath = path.join(serviceDir, `${fileName}.json`);

        const result = {
          link: {
            text: link.text,
            url: link.url,
          },
          content: content,
          requirements: requirements,
          pageLinks: pageLinks,
        };

        saveJSON(outputDirPath, result);
      } catch (error) {
        console.error(`Error visiting ${link.url}:`, error);
      } finally {
        await page.close();
      }
    };

    const chunks = [];
    for (let i = 0; i < links.length; i += concurrency) {
      chunks.push(links.slice(i, i + concurrency));
    }

    for (const chunk of chunks) {
      await Promise.all(chunk.map(processLink));
    }
  } catch (error) {
    console.error('Error during processing:', error);
  } finally {
    await browser.close();
  }
};
