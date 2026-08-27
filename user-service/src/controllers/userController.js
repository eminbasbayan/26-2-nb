const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  return res.status(200).json(users);
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, city, role } = req.body;
    const user = await User.create({
      name,
      email,
      city,
      password: await bcrypt.hash(password, 10),
      role: role === 'admin' ? 'admin' : 'user',
    });
    const result = user.toObject();
    delete result.password;
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, city, role } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (email !== undefined) update.email = email;
    if (city !== undefined) update.city = city;
    if (['admin', 'user'].includes(role)) update.role = role;
    if (password) update.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select(
      '-password',
    );
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  return res.status(204).send();
};

const getInternalUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  return res.status(200).json(user);
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser, getInternalUser };
