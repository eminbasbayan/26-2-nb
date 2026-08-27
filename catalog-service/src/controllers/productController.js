const Product = require('../models/Product');
const Category = require('../models/Category');

const getAllProducts = async (req, res) => {
  const products = await Product.find().populate('category');
  return res.status(200).json(products);
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;
    if (!(await Category.findById(category))) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const product = await Product.create({ name, price, description, stock, category });
    await product.populate('category');
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  if (req.body.category && !(await Category.findById(req.body.category))) {
    return res.status(404).json({ message: 'Category not found' });
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate(
    'category',
  );
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.status(204).send();
};

const getInternalProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
  return res.status(200).json(product);
};

const decrementStock = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, stock: { $gt: 0 } },
    { $inc: { stock: -1 } },
    { new: true },
  );
  if (!product) {
    const exists = await Product.exists({ _id: req.params.id });
    return res.status(exists ? 409 : 404).json({
      message: exists ? 'Ürün stokta yok' : 'Ürün bulunamadı',
    });
  }
  return res.status(200).json({ productId: product.id, stock: product.stock });
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getInternalProduct,
  decrementStock,
};
