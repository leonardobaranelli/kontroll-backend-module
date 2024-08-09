import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'mapping_dictionary.json');

export function saveMappingDictionary(
  mapping: Array<{ key: string; value: string }>,
) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(mapping, null, 2));
}

export function loadMappingDictionary(): Record<string, string> {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}
