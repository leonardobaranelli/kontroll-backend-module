import * as fs from 'fs';
import * as path from 'path';
import 'colors';

const baseDirectoryPath = path.join(
  __dirname,
  '../../src/core/carriers/create-by-steps/new/dev-get-req-via-doc/automated-system/',
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
      return console.error(`Unable to scan directory ${folder}: `.red + err);
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      if (path.extname(file) === '.json') {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(
              `Failed to delete file ${file} in ${folder}:`.red,
              err,
            );
          } else {
            console.log(
              `Successfully deleted file ${file} in ${folder}\n`.green,
            );
          }
        });
      } else {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return console.error(
              `Failed to get stats of ${filePath}: `.red + err,
            );
          }

          if (stats.isDirectory()) {
            fs.rm(filePath, { recursive: true, force: true }, (err) => {
              if (err) {
                console.error(
                  `Failed to delete directory ${filePath}: `.red,
                  err,
                );
              } else {
                console.log(
                  `Successfully deleted directory ${filePath}\n`.green,
                );
              }
            });
          }
        });
      }
    });
  });
});
