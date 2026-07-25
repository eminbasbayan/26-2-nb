const express = require('express');
const path = require('path');
const app = express();

let users = [
  { id: 1, name: 'Ahmet', age: 25, email: 'ahmet@example.com' },
  { id: 2, name: 'Ayşe', age: 30, email: 'ayse@example.com' },
];

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json(users);
});

app.post('/', (req, res) => {
  const newUser = { id: Math.random(), ...req.body };

  users = [...users, newUser];

  res.json(users);
});

app.put('/', (req, res) => {
  const { userId, email } = req.body;

  const findUser = users.find((user) => user.id === userId);

  if (findUser) {
    users = users.map((user) => {
      if (user.id === userId) {
        return { ...user, email };
      }

      return user;
    });
    res.json({ success: true, users });
  } else {
    res.json({ success: false, message: 'Kullanıcı bulunamadı!' });
  }
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
