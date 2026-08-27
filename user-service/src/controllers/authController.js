const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, expiresIn } = require('../config/jwt');
const cookieConfig = require('../config/cookie');
const User = require('../models/User');

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  city: user.city,
  role: user.role,
});

const registerUser = async (req, res) => {
  try {
    const { password, name, email, city } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, city, password: hashedPassword });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
      expiresIn,
    });

    return res.status(201).json({
      message: 'Kullanıcı başarıyla oluşturuldu!',
      user: publicUser(user),
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secret, {
      expiresIn,
    });
    res.cookie('accessToken', token, cookieConfig.accessToken);
    return res.status(200).json({ message: 'Giriş başarılı!', user: publicUser(user), token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('accessToken', cookieConfig.accessToken);
  return res.status(200).json({ message: 'Çıkış yapıldı' });
};

module.exports = { registerUser, loginUser, logoutUser };
