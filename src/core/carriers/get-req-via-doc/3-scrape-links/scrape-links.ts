import puppeteer, { Browser, Page } from 'puppeteer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Define the structure of link information
interface LinkInfo {
  text: string;
  url: string;
}

// Function to load the content of a JSON file
const loadJSON = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// Function to save a JSON file
const saveJSON = (filePath: string, data: any): void => {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData);
  } catch (error) {
    console.error(`Error saving JSON file at ${filePath}:`, error);
  }
};

// Function to extract requirements from the content
const extractServiceRequirements = (
  content: string,
  contentKeywords: string[],
): any => {
  const requirements: any = {};

  contentKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi'); // Regular expression to search for the keyword as a whole word
    const matches = content.match(regex); // Search for all occurrences of the keyword

    if (matches && matches.length > 0) {
      requirements[keyword] = matches.length; // Store the number of occurrences found
    }
  });

  return requirements;
};

// Main function to process the links and extract relevant data
export const scrapeLinks = async (
  serviceName: string,
  contentKeywords: string[],
): Promise<void> => {
  // Create the service folder if it does not exist
  const serviceDir = path.join(
    './3-scrape-links/scraped-links/',
    serviceName.toLowerCase().replace(/\s+/g, '_'),
  );
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  // Configure Puppeteer
  const browser: Browser = await puppeteer.launch({
    headless: true, // Change to false for non-headless operation
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null,
    ignoreHTTPSErrors: true,
  });

  const page: Page = await browser.newPage();

  try {
    const inputLinksFilePath = `./2-filter-scraped-site/filtered-links/filtered_links_${serviceName
      .toLowerCase()
      .replace(/\s+/g, '_')}.json`;

    // Verify if the file exists before reading
    if (!fs.existsSync(inputLinksFilePath)) {
      throw new Error(`Links file does not exist at ${inputLinksFilePath}`);
    }

    const links: LinkInfo[] = loadJSON(inputLinksFilePath);

    for (const link of links) {
      try {
        // Ensure the link has a valid URL
        if (!link.url) {
          throw new Error(`Invalid URL for link: ${link.text}`);
        }

        console.log(`\nProcessing link: ${link.url}`);

        // Navigate to the URL
        await page.goto(link.url, {
          waitUntil: 'networkidle2',
          timeout: 180000,
        });

        // Extract text content (all text on the HTML body)
        const content = await page.evaluate(() => {
          return document.body.innerText;
        });

        // Extract all links from the page
        const pageLinks: LinkInfo[] = await page.evaluate(() => {
          const anchors = Array.from(document.querySelectorAll('a'));
          return anchors.map((anchor) => ({
            text: anchor.textContent
              ? anchor.textContent.toLowerCase().replace(/\n|\t/g, '').trim()
              : '',
            url: anchor.href,
          }));
        });

        // Extract and save specific requirements
        const requirements = extractServiceRequirements(
          content,
          contentKeywords,
        );

        // Create the JSON file name based on the link text
        const fileName =
          link.text.replace(/\s+/g, '_').toLowerCase() || 'default';
        const outputDirPath = path.join(serviceDir, `${fileName}.json`);

        // Save the extracted content, requirements, and links to a JSON file
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
        console.log(
          `Saved processed content and links from ${link.url} to ${outputDirPath}`,
        );
      } catch (error) {
        console.error(`Error visiting ${link.url}:`, error);
      }
    }
  } catch (error) {
    console.error('Error during processing:', error);
  } finally {
    await browser.close();
  }
};
