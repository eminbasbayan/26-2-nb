require('dotenv').config();
const app = require('./app.js');
const connectDB = require('./config/dbConfig.js');

const PORT = 3000;

connectDB()

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
