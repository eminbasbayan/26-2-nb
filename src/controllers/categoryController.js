const Category = require('../models/Category.js');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const savedCategory = await Category.create({ name, description });

    res.status(201).json(savedCategory);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await Category.findByIdAndDelete(categoryId);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
