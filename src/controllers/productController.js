const Product = require('../models/Product.js');
const Category = require('../models/Category.js');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const savedProduct = await Product.create({
      name,
      price,
      description,
      stock,
      category,
    });

    const populatedProduct = await savedProduct.populate('category');
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { category } = req.body;

    if (category) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    ).populate('category');

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(productId);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
