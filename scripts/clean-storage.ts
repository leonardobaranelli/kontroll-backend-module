import * as fs from 'fs';
import * as path from 'path';

const directoryPath = path.join(
  __dirname,
  '../src/storage/carriers/data-on-steps',
);

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory: ' + err);
  }

  files.forEach((file) => {
    if (path.extname(file) === '.json') {
      fs.unlink(path.join(directoryPath, file), (err) => {
        if (err) {
          console.error('Failed to delete file:', file, err);
        } else {
          console.log('Successfully deleted file:', file);
        }
      });
    }
  });
});
