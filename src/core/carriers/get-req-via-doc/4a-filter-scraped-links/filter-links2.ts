import fs from 'fs';
import path from 'path';

// Define the interface for links
interface LinkInfo {
  text: string;
  url: string;
}

// Define the interface for the JSON file content
interface PageData {
  link: LinkInfo;
  content: string;
  requirements: Record<string, any>;
  pageLinks: LinkInfo[];
}

// Load the JSON file containing the links
const loadLinks = (folderPath: string): LinkInfo[] => {
  const files = fs.readdirSync(folderPath);

  let allLinks: LinkInfo[] = [];
  const linkSet = new Set<string>();

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(folderPath, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const jsonData: PageData = JSON.parse(rawData);

      jsonData.pageLinks.forEach((link) => {
        const linkString = JSON.stringify(link);
        if (!linkSet.has(linkString)) {
          linkSet.add(linkString);
          allLinks.push(link);
        }
      });
    }
  });

  return allLinks.map((link) => {
    const cleanText = link.text
      ? link.text.toLowerCase().replace(/\n|\t/g, '').trim()
      : '';
    let url = link.url;

    return {
      text: cleanText,
      url: url,
    };
  }) as LinkInfo[];
};

// Save filtered links to a JSON file
const saveFilteredLinks = (filePath: string, links: LinkInfo[]): void => {
  const jsonData = JSON.stringify(links, null, 2);
  fs.writeFileSync(filePath, jsonData);
};

// Filter links based on keywords and relevance
const filterLinks = (
  links: LinkInfo[],
  linksKeywords: string[],
): LinkInfo[] => {
  return links.filter((link) => {
    if (!link.url || !link.text) {
      return false;
    }
    const combinedText = (link.url + ' ' + link.text).toLowerCase();
    const isMatch = linksKeywords.some((keyword) =>
      combinedText.includes(keyword.toLowerCase()),
    );

    return isMatch;
  });
};

// Remove duplicate links based on URL
const removeDuplicates = (links: LinkInfo[]): LinkInfo[] => {
  const seenUrls = new Set<string>();
  return links.filter((link) => {
    if (seenUrls.has(link.url)) {
      return false;
    } else {
      seenUrls.add(link.url);
      return true;
    }
  });
};

// Main
export const filterLinks2 = (
  serviceName: string,
  linksKeywords: string[],
): void => {
  // Load links from JSON file
  const formattedServiceName = serviceName.toLowerCase().replace(/\s+/g, '_');
  const linksDirPath = `./src/core/carriers/get-req-via-doc/3-scrape-links/scraped-links/${formattedServiceName}`;
  const outputDirPath = `./src/core/carriers/get-req-via-doc/4a-filter-scraped-links/filtered-links/${formattedServiceName}`;
  const outputFilePath = path.join(
    outputDirPath,
    `${formattedServiceName}_filtered_links.json`,
  );

  // Ensure the output directory exists
  if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath, { recursive: true });
  }

  const links = loadLinks(linksDirPath);

  // Add the service name as a keyword for filtering
  const keywords = [...linksKeywords, serviceName.toLowerCase()];

  // Filter links related to service documentation
  let filteredLinks = filterLinks(links, keywords);

  // Remove duplicate links
  filteredLinks = removeDuplicates(filteredLinks);

  // Save filtered links to a new JSON file
  saveFilteredLinks(outputFilePath, filteredLinks);
};
