const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const cors = require('cors');
const app = express();

const filePath = 'data.json';

const readData = () => {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
};

const writeData = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Tüm originlere izin veren basit yapılandırma
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const data = readData();
  res.status(200).json(data);
});

app.post('/', (req, res) => {
  const newUser = { id: Math.random(), ...req.body };
  let users = readData();
  users = [...users, newUser];

  writeData(users);
  res.json(users);
});

/* app.put('/', (req, res) => {
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
 */

app.put('/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  const { email } = req.body;

  let users = readData();

  const findUser = users.find((user) => user.id === userId);

  if (findUser) {
    users = users.map((user) => {
      if (user.id === userId) {
        return { ...user, email };
      }

      return user;
    });
    writeData(users);
    res.json({ success: true, users });
  } else {
    res.json({ success: false, message: 'Kullanıcı bulunamadı!' });
  }
});

app.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  let users = readData();

  users = users.filter((user) => user.id !== Number(userId));
  writeData(users);
  res.status(204).json(users);
});

app.post('/submit', (req, res) => {
  console.log(req.body);
  console.log(req.body.username);
  console.log(req.body.email);

  res.send('Veriler başarıyla alındı!');
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
