import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Define the interface for page links
interface PageLink {
  text: string;
  url: string;
}

// Define the interface for link information
interface LinkInfo {
  link: {
    text: string;
    url: string;
  };
  content: string;
  requirements: any;
  pageLinks: PageLink[];
}

// Load JSON content from a file
const loadJSON = (filePath: string): any => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// Main
export const extractContent = async (serviceName: string): Promise<void> => {
  // Create the service folder if it does not exist
  const formattedServiceName = serviceName.toLowerCase().replace(/\s+/g, '_');
  const serviceDir = path.join(
    `./src/core/carriers/get-req-via-doc/3-scrape-links/scraped-links/${formattedServiceName}`,
  );
  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  const outputDir = `./src/core/carriers/get-req-via-doc/4b-process-links/1-extract-content-from-scraped-links/extracted-content/${formattedServiceName}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const jsonFiles = fs
      .readdirSync(serviceDir)
      .filter((file) => file.endsWith('.json'));

    for (const jsonFile of jsonFiles) {
      const linkFilePath = path.join(serviceDir, jsonFile);
      const linkInfo: LinkInfo = loadJSON(linkFilePath);

      const formattedContent = {
        link: linkInfo.link.url,
        content: linkInfo.content,
      };

      const outputFilePath = path.join(outputDir, jsonFile);
      fs.writeFileSync(
        outputFilePath,
        JSON.stringify(formattedContent, null, 2),
        'utf-8',
      );
    }
  } catch (error) {
    console.error('Error during processing:', error);
  }
};
