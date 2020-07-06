import * as fs from 'fs';

export const writeToFile = async (path, data) => {
  return fs.writeFileSync(path, JSON.stringify(data));
};
