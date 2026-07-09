const fs = require('node:fs');

// Senkron
const txtFile = fs.readFileSync('./file.txt', 'utf-8');
console.log(txtFile.length);

// Asenkron
fs.readFile('./file.txt', (err, data) => {
  if (err) {
    console.log('Dosya okunurken hata oluştu: ', err);
  } else {
    console.log(data.toString());
  }
});

// Senkron
fs.writeFileSync('./file2.txt', 'Hi Emin!');

// Asenkron
fs.writeFile('./file2.txt', 'Hi Emin Başbayan!', (err) => {
  if (err) {
    console.log('Dosya yazılırken hata oluştu: ', err);
  } else {
    console.log('Dosya başarıyla yazıldı!');
  }
});

fs.writeFile('./file2.txt', ' Hi Emin Başbayan!', { flag: 'a' }, (err) => {
  if (err) {
    console.log('Dosya yazılırken hata oluştu: ', err);
  } else {
    console.log('Dosya başarıyla yazıldı!');
  }
});
