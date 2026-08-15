const Iyzipay = require('iyzipay');
const iyzipay = require('../config/iyzico.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');
const Order = require('../models/Order.js');

const initializeCheckout = (request) =>
  new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

const retrieveCheckout = (request) =>
  new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(request, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });

const getFrontendUrl = (path, orderId) => {
  const base = process.env.IYZICO_FRONTEND_URL || 'http://localhost:3000';
  return `${base}${path}?orderId=${orderId}`;
};

const checkout = async (req, res) => {
  try {
    const { productId, surname, identityNumber, gsmNumber, address } = req.body;

    const product = await Product.findById(productId).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: 'Ürün stokta yok' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    const order = await Order.create({
      user: user._id,
      product: product._id,
      price: product.price,
      conversationId: 'pending',
    });
    order.conversationId = String(order._id);
    await order.save();

    const price = Number(product.price).toFixed(2);
    const contactName = `${user.name} ${surname}`.trim();
    const city = user.city || 'Istanbul';
    const categoryName = product.category?.name || 'Genel';

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: order.conversationId,
      price,
      paidPrice: price,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: String(order._id),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: process.env.IYZICO_CALLBACK_URL,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: String(user._id),
        name: user.name,
        surname,
        gsmNumber,
        email: user.email,
        identityNumber,
        registrationAddress: address,
        city,
        country: 'Turkey',
        ip: req.ip,
      },
      shippingAddress: {
        contactName,
        city,
        country: 'Turkey',
        address,
      },
      billingAddress: {
        contactName,
        city,
        country: 'Turkey',
        address,
      },
      basketItems: [
        {
          id: String(product._id),
          name: product.name,
          category1: categoryName,
          itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
          price,
        },
      ],
    };

    const result = await initializeCheckout(request);

    if (result.status !== 'success') {
      order.status = 'failed';
      await order.save();
      return res.status(400).json({
        message: result.errorMessage || 'Ödeme formu başlatılamadı',
      });
    }

    order.token = result.token;
    await order.save();

    res.status(200).json({
      paymentPageUrl: result.paymentPageUrl,
      token: result.token,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const callback = async (req, res) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(400).json({ message: 'Token gerekli' });
    }

    const result = await retrieveCheckout({
      locale: Iyzipay.LOCALE.TR,
      token,
    });

    const order = await Order.findOne({
      $or: [{ token }, { conversationId: result.conversationId }],
    });

    if (!order) {
      return res.redirect(getFrontendUrl('/payment/fail', ''));
    }

    if (order.status === 'paid') {
      return res.redirect(getFrontendUrl('/payment/success', order._id));
    }

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      order.status = 'paid';
      order.paymentId = result.paymentId;
      await order.save();

      await Product.findOneAndUpdate(
        { _id: order.product, stock: { $gt: 0 } },
        { $inc: { stock: -1 } },
      );

      return res.redirect(getFrontendUrl('/payment/success', order._id));
    }

    order.status = 'failed';
    await order.save();
    return res.redirect(getFrontendUrl('/payment/fail', order._id));
  } catch (error) {
    return res.redirect(getFrontendUrl('/payment/fail', ''));
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product')
      .populate('user', '-password');

    if (!order) {
      return res.status(404).json({ message: 'Sipariş bulunamadı' });
    }

    if (String(order.user._id) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  checkout,
  callback,
  getOrder,
};
