const fs = require('node:fs').promises;

/* fs.readFile('./file2.txt', 'utf-8')
  .then((data) => console.log(data))
  .catch((error) => console.log(err));
console.log("block"); */

async function readFileAsync() {
  try {
    const data = await fs.readFile('./file.txt', 'utf-8');

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

readFileAsync();
