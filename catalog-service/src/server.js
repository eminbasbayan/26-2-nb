require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const port = Number(process.env.PORT || 3002);

const start = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error('MONGO_URI ve JWT_SECRET zorunludur');
  }
  await connectDB();
  app.listen(port, () => console.log(`catalog-service ${port} portunda çalışıyor`));
};

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
