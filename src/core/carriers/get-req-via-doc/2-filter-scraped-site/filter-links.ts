import fs from 'fs';
import { URL } from 'url';
import { ignoreExtensions } from '../utils/ignore-extensions.util';

// Define the interface for the links
interface LinkInfo {
  text: string;
  url: string;
}

// Load the JSON file containing the links
const loadLinks = (filePath: string): LinkInfo[] => {
  const rawData = fs.readFileSync(filePath, 'utf8');
  const links = JSON.parse(rawData);
  return links.map((link: any) => {
    const cleanText = link.text
      ? link.text.toLowerCase().replace(/\n|\t/g, '').trim()
      : '';
    let url = link.siteUrl;

    if (link.href) {
      // If href is an absolute URL, use it directly
      if (link.href.startsWith('http')) {
        url = link.href;
      } else {
        try {
          // Combine siteUrl and href to form a proper URL
          const combinedUrl = new URL(link.href, link.siteUrl);
          url = combinedUrl.href;
        } catch (error) {
          console.error(
            `Error forming URL for siteUrl: ${link.siteUrl} and href: ${link.href}`,
            error,
          );
        }
      }
    }

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

const isIgnoredExtension = (url: string): boolean => {
  return ignoreExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

// Filter links based on keywords
const _filterLinks = (links: LinkInfo[], keywords: string[]): LinkInfo[] => {
  return links.filter((link) => {
    const combinedText = (link.url + ' ' + link.text).toLowerCase();
    if (isIgnoredExtension(combinedText)) {
      return;
    }
    return keywords.some((keyword) =>
      combinedText.includes(keyword.toLowerCase()),
    );
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
export const filterLinks = (
  serviceName: string,
  linksKeywords: string[],
): void => {
  // Load links from JSON file
  const formattedServiceName = serviceName.toLowerCase().replace(/\s+/g, '_');
  const linksFilePath = `./src/core/carriers/get-req-via-doc/1-scrape-site/links/all_links_${formattedServiceName}.json`;
  const outputFilePath = `./src/core/carriers/get-req-via-doc/2-filter-scraped-site/filtered-links/filtered_links_${formattedServiceName}.json`;

  const links = loadLinks(linksFilePath);

  // Add the service name as a keyword for filtering
  const keywords = [...linksKeywords, serviceName.toLowerCase()];

  // Filter links related to service documentation
  let filteredLinks = _filterLinks(links, keywords);

  // Remove duplicate links
  filteredLinks = removeDuplicates(filteredLinks);

  // Save filtered links to a new JSON file
  saveFilteredLinks(outputFilePath, filteredLinks);

  // Print the number of filtered links
  console.log(`Number of filtered links: ${filteredLinks.length}`);
};
