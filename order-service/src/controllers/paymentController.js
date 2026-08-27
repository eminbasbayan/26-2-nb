const Iyzipay = require('iyzipay');
const iyzipay = require('../config/iyzico');
const Order = require('../models/Order');
const userClient = require('../clients/userClient');
const catalogClient = require('../clients/catalogClient');

const initializeCheckout = (request) =>
  new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(request, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });

const retrieveCheckout = (request) =>
  new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(request, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });

const frontendUrl = (path, orderId = '') => {
  const base = process.env.IYZICO_FRONTEND_URL || 'http://localhost:3000';
  return `${base}${path}?orderId=${orderId}`;
};

const checkout = async (req, res) => {
  try {
    const { productId, surname, identityNumber, gsmNumber, address } = req.body;
    const [user, product] = await Promise.all([
      userClient.getUser(req.user.id),
      catalogClient.getProduct(productId),
    ]);

    if (product.stock < 1) {
      return res.status(400).json({ message: 'Ürün stokta yok' });
    }

    const categoryName = product.category?.name || 'Genel';
    const order = new Order({
      userId: String(user._id),
      productId: String(product._id),
      userSnapshot: { name: user.name, email: user.email, city: user.city },
      productSnapshot: { name: product.name, price: product.price, categoryName },
      price: product.price,
      conversationId: 'pending',
    });
    order.conversationId = String(order._id);
    await order.save();

    const price = Number(product.price).toFixed(2);
    const city = user.city || 'Istanbul';
    const contactName = `${user.name} ${surname}`.trim();
    const paymentRequest = {
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
      shippingAddress: { contactName, city, country: 'Turkey', address },
      billingAddress: { contactName, city, country: 'Turkey', address },
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

    const result = await initializeCheckout(paymentRequest);
    if (result.status !== 'success') {
      order.status = 'failed';
      order.failureReason = result.errorMessage || 'Ödeme formu başlatılamadı';
      await order.save();
      return res.status(400).json({ message: order.failureReason });
    }

    order.token = result.token;
    await order.save();
    return res.status(200).json({
      paymentPageUrl: result.paymentPageUrl,
      token: result.token,
      orderId: order._id,
    });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};

const callback = async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ message: 'Token gerekli' });

  try {
    const result = await retrieveCheckout({ locale: Iyzipay.LOCALE.TR, token });
    const order = await Order.findOne({
      $or: [{ token }, { conversationId: result.conversationId }],
    });

    if (!order) return res.redirect(frontendUrl('/payment/fail'));
    if (order.status === 'paid') {
      return res.redirect(frontendUrl('/payment/success', order._id));
    }

    if (result.status !== 'success' || result.paymentStatus !== 'SUCCESS') {
      order.status = 'failed';
      order.failureReason = result.errorMessage || 'Ödeme başarısız';
      await order.save();
      return res.redirect(frontendUrl('/payment/fail', order._id));
    }

    const claimedOrder = await Order.findOneAndUpdate(
      { _id: order._id, status: 'pending' },
      { $set: { status: 'processing' } },
      { new: true },
    );
    if (!claimedOrder) {
      const current = await Order.findById(order._id);
      const path = current?.status === 'paid' ? '/payment/success' : '/payment/fail';
      return res.redirect(frontendUrl(path, order._id));
    }

    try {
      await catalogClient.decrementStock(claimedOrder.productId);
    } catch (error) {
      claimedOrder.status = 'failed';
      claimedOrder.failureReason = error.message;
      await claimedOrder.save();
      return res.redirect(frontendUrl('/payment/fail', claimedOrder._id));
    }

    claimedOrder.status = 'paid';
    claimedOrder.paymentId = result.paymentId;
    await claimedOrder.save();
    return res.redirect(frontendUrl('/payment/success', claimedOrder._id));
  } catch (error) {
    return res.redirect(frontendUrl('/payment/fail'));
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Sipariş bulunamadı' });
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { checkout, callback, getOrder };
