const express = require('express');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // İzin verilen origins listesi
    const whiteList = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://www.google.com',
    ];

    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS politikası tarafından engellendiniz.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 saat
};

// Tüm originlere izin veren basit yapılandırma
app.use(cors(corsOptions));
// Request log middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res) => {
  res.status(404).send('Page not found!');
});

app.use(errorHandler);

module.exports = app;
