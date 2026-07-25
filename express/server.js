const express = require('express');
const path = require('path');
const app = express();

const customers = [
  {
    id: 1,
    firstName: 'Emin',
    lastName: 'Başbayan',
  },
];

function isLogin(req, res, next) {
  if (req.isAuth) {
    next();
  } else {
    res.status(401).send('Lütfen giriş yapın!');
  }
}

function isAdmin(req, res, next) {
  if (req.role === 'admin') {
    next();
  } else {
    res.status(401).send('Kullanıcı yetkisi yok!');
  }
}

app.get('/', (req, res) => {
  /*   res.send("Hello World!") */
  res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/products-page', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views', 'products.html'));
});

app.get('/admin-dashboard', isLogin, isAdmin, (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/admin-customers', isAdmin, (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views', 'customers.html'));
});

function sendCustomers(req, res) {
  // db bağlantısı yapıp datayı çekebiliriz = customers

  res.status(200).json(customers);
}
app.get('/api/customers', sendCustomers);

app.get('/new-page', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page', (req, res) => {
  res.redirect(301, '/new-page');
});

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
