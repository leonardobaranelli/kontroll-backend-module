import * as fs from 'fs';
import * as path from 'path';
import 'colors';

const directoryPath = path.join(
  __dirname,
  '../../src/storage/carriers/new/dev-get-req-via-doc/data-on-steps',
);

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory: '.red + err);
  }

  files.forEach((file) => {
    if (
      path.extname(file) === '.json' &&
      path.basename(file) !== 'dhl-g-f-example.json'
    ) {
      fs.unlink(path.join(directoryPath, file), (err) => {
        if (err) {
          console.error('Failed to delete file:'.red, file, err);
        } else {
          console.log('Successfully deleted file:'.green, file);
        }
      });
    }
  });
});
