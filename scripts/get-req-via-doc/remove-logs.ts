import * as fs from 'fs';
import * as path from 'path';
import 'colors';

const baseDirectoryPath = path.join(
  __dirname,
  '../../src/core/carriers/create-by-steps/new/dev-get-req-via-doc/automated-system/logs/errors',
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

const deleteLogFiles = (directoryPath: string) => {
  fs.readdir(directoryPath, (err, items) => {
    if (err) {
      return console.error(
        `Unable to scan directory ${directoryPath}: `.red,
        err,
      );
    }

    items.forEach((item) => {
      const itemPath = path.join(directoryPath, item);
      fs.stat(itemPath, (err, stats) => {
        if (err) {
          return console.error(`Failed to get stats of ${itemPath}: `.red, err);
        }

        if (stats.isFile() && path.extname(item) === '.log') {
          fs.unlink(itemPath, (err) => {
            if (err) {
              console.error(`Failed to delete file ${itemPath}: `.red, err);
            } else {
              console.log(`Successfully deleted file ${itemPath}\n`.green);
            }
          });
        } else if (stats.isDirectory()) {
          deleteLogFiles(itemPath);
        }
      });
    });
  });
};

subfolders.forEach((subfolder) => {
  const directoryPath = path.join(baseDirectoryPath, subfolder);

  fs.access(directoryPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Directory ${subfolder} does not exist.`.red);
    } else {
      deleteLogFiles(directoryPath);
    }
  });
});
