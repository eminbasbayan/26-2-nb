const express = require('express');
const path = require('path');
const app = express();

const users = [
  { id: 1, name: 'Ahmet', age: 25, email: 'ahmet@example.com' },
  { id: 2, name: 'Ayşe', age: 30, email: 'ayse@example.com' },
];

app.get('/', (req, res) => {
  res.status(200).json(users);
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
