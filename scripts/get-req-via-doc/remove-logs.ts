import * as fs from 'fs';
import * as path from 'path';

const baseDirectoryPath = path.join(
  __dirname,
  '../../src/core/carriers/new/dev/get-req-via-doc/logs/errors',
);

const subfolders = [
  '1-scrape-site',
  '2-filter-scraped-site',
  '3-scrape-links',
  '4a-filter-scraped-links',
  '4b-process-links/1-extract-content-from-scraped-links',
  '4b-process-links/2-process-content',
  '5-converge-steps',
];

subfolders.forEach((subfolder) => {
  const directoryPath = path.join(baseDirectoryPath, subfolder);

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error(`Unable to scan directory ${subfolder}: ` + err);
    }

    files.forEach((file) => {
      if (path.extname(file) === '.log') {
        fs.unlink(path.join(directoryPath, file), (err) => {
          if (err) {
            console.error(
              `Failed to delete file ${file} in ${subfolder}:`,
              err,
            );
          } else {
            console.log(`Successfully deleted file ${file} in ${subfolder}`);
          }
        });
      }
    });
  });
});
