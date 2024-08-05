import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { promisify } from 'util';

dotenv.config();

const writeFileAsync = promisify(fs.writeFile);

interface LinkInfo {
  text: string;
  url: string;
}

const lightOrange = (text: string) => `\u001b[38;5;214m${text}\u001b[39m`;
const lightRed = (text: string) => `\u001b[38;5;203m${text}\u001b[39m`;

const loadJSON = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

const saveJSON = async (filePath: string, data: any): Promise<void> => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
  } catch (error) {
    // Log the error to a file in the logs directory
    const logDirectory =
      './src/core/carriers/create-by-steps/new/dev-get-req-via-doc/automated-system/logs/errors/3-scrape-links';
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true });
    }
    const logFilePath = path.join(
      logDirectory,
      `${sanitizeUrl(filePath)}_error.log`,
    );
    await writeFileAsync(logFilePath, JSON.stringify(error, null, 2), 'utf-8');
    console.error(lightRed(`Error saving JSON file at ${filePath}`));
    console.error(lightOrange(`Error logged, continuing with the process...`));
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

function sanitizeUrl(url: string): string {
  return url.replace(/[\/\\:*\?"<>|]/g, '_');
}

export const scrapeLinks = async (
  serviceName: string,
  contentKeywords: string[],
  concurrency: number = 5,
): Promise<void> => {
  const serviceDir = path.join(
    './src/core/carriers/create-by-steps/new/dev-get-req-via-doc/automated-system/3-scrape-links/scraped-links/',
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
    const inputLinksFilePath = `./src/core/carriers/create-by-steps/new/dev-get-req-via-doc/automated-system/2-filter-scraped-site/filtered-links/filtered_links_${serviceName
      .toLowerCase()
      .replace(/\s+/g, '_')}.json`;

    if (!fs.existsSync(inputLinksFilePath)) {
      throw new Error(`Links file does not exist at ${inputLinksFilePath}`);
    }

    const links: LinkInfo[] = loadJSON(inputLinksFilePath).slice(0, 200);

    const processLink = async (link: LinkInfo) => {
      const page: Page = await browser.newPage();
      try {
        if (!link.url) {
          throw new Error(`Invalid URL for link: ${link.text}`);
        }

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
          link.text
            .replace(/\s+/g, '_')
            .replace(/[\/\\:*\?"<>|]/g, '_')
            .toLowerCase() || 'default';
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
        // Log the error to a file in the logs directory
        const logDirectory =
          './src/core/carriers/create-by-steps/new/dev-get-req-via-doc/automated-system/logs/errors/3-scrape-links';
        if (!fs.existsSync(logDirectory)) {
          fs.mkdirSync(logDirectory, { recursive: true });
        }
        const logFilePath = path.join(
          logDirectory,
          `${sanitizeUrl(link.url)}_error.log`,
        );
        await writeFileAsync(
          logFilePath,
          JSON.stringify(error, null, 2),
          'utf-8',
        );

        console.error(lightRed(`Error visiting ${link.url}`));
        console.error(
          lightOrange(`Error logged, continuing with the process...`),
        );
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
