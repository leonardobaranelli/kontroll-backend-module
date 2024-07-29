import * as fs from 'fs';
import * as path from 'path';

const baseDirectoryPath = path.join(
  __dirname,
  '../../src/core/carriers/get-req-via-doc/',
);

const folders = [
  '1-scrape-site/links',
  '2-filter-scraped-site/filtered-links',
  '3-scrape-links/scraped-links',
  '4a-filter-scraped-links/filtered-links',
  '4b-process-links/1-extract-content-from-scraped-links/extracted-content',
  '4b-process-links/2-process-content/extracted-steps',
  '5-converge-steps',
];

folders.forEach((folder) => {
  const directoryPath = path.join(baseDirectoryPath, folder);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error(`Unable to scan directory ${folder}: ` + err);
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      if (path.extname(file) === '.json') {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file ${file} in ${folder}:`, err);
          } else {
            console.log(`Successfully deleted file ${file} in ${folder}`);
          }
        });
      } else if (
        folder === '3-scrape-links/scraped-links' ||
        '4a-filter-scraped-links/filtered-links' ||
        '4b-process-links/1-extract-content-from-scraped-links/extracted-content' ||
        '4b-process-links/2-process-content/extracted-steps'
      ) {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return console.error(`Failed to get stats of ${filePath}: ` + err);
          }

          if (stats.isDirectory()) {
            fs.rmdir(filePath, { recursive: true }, (err) => {
              if (err) {
                console.error(`Failed to delete directory ${filePath}: `, err);
              } else {
                console.log(`Successfully deleted directory ${filePath}`);
              }
            });
          }
        });
      }
    });
  });
});
