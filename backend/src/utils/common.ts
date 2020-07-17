import * as fs from 'fs';

export const writeToFile = async (path, data) => {
  const response = await fs.writeFileSync(path, JSON.stringify(data));
  console.log(`writeToFile -> response`, response);
};
