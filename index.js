const path = require('node:path');

console.log(__dirname);
console.log(__filename);

/* const filePath = path.join('uploads', 'images', 'photo.jpg'); */
const filePath = path.format({
  dir: '/uploads/images',
  name: 'photo',
  ext: '.jpg',
});
const fullPath = path.resolve('uploads', 'images', 'photo.jpg');

console.log('filePath: ', filePath);
console.log(fullPath);
console.log(path.basename(fullPath));
console.log(path.dirname(fullPath));
console.log(path.extname(filePath));
console.log(path.parse(fullPath));

const from = '/users/emin/project';
const to = '/users/emin/project/uploads/photo.png';
const relativePath = path.relative(from, to);
console.log('relativePath: ', relativePath);

const normalized = path.normalize('/users/emin/project/uploads/../photo.png');
console.log('normalized: ', normalized);

/* if (path.basename(fullPath) === 'images') {
  console.log('ekle');
} else {
  console.log('ekleme');
} */
