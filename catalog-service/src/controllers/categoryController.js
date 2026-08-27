const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  return res.status(200).json(categories);
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      description: req.body.description,
    });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: 'Category not found' });
  return res.status(200).json(category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.categoryId);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  return res.status(204).send();
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
