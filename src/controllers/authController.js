const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwtConfig.js');

const registerUser = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;
    console.log(password, otherData);

    // Password hash'leme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    const newUser = { id: Date.now(), password: hashedPassword, ...otherData };

    const usersFilePath = path.join(__dirname, '..', './data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    // Email kontrolü
    const existingUser = users.find((user) => user.email === newUser.email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Bu email adresi zaten kayıtlı.' });
    }
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usersFilePath = path.join(__dirname, '..', './data', 'users.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    // Kullanıcı doğrulama
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Email veya şifre.' });
    }

    // Parola kontrolü
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn,
    });

    res.status(200).json({ message: 'Giriş başarılı!', user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
