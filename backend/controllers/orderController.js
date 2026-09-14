const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const errorResponse = require('../utils/errorResponse');

const placeOrder = async (req, res) => {
  const session = await mongoose.startSession();
  let order = null;

  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).session(session);

    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 400, 'Cart is empty');
    }

    const productUpdates = [];
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        return errorResponse(res, 404, 'Product not found');
      }

      if (item.quantity > product.stock) {
        return errorResponse(res, 400, `Only ${product.stock} ${product.name} are available.`);
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      productUpdates.push({
        productId: product._id,
        newStock: product.stock - item.quantity,
      });
    }

    const finalizeOrder = async () => {
      const [createdOrder] = await Order.create([
        {
          userId,
          items: orderItems,
          totalAmount,
          status: 'PLACED',
          createdAt: new Date(),
        },
      ], { session });

      order = createdOrder;

      for (const update of productUpdates) {
        await Product.findByIdAndUpdate(update.productId, { $set: { stock: update.newStock } }, { session, new: true });
      }

      await Cart.findOneAndUpdate({ userId }, { items: [] }, { session, new: true });
    };

    try {
      await session.withTransaction(async () => {
        await finalizeOrder();
      });
    } catch (transactionError) {
      if (transactionError.code === 20 || (transactionError.message && transactionError.message.includes('Transaction numbers'))) {
        await finalizeOrder();
      } else {
        throw transactionError;
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    console.error('Order placement error:', error);
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Unable to place order';
    return errorResponse(res, statusCode, message);
  } finally {
    session.endSession();
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return errorResponse(res, 500, 'Something went wrong. Please try again.');
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    return errorResponse(res, 400, 'Invalid order ID');
  }
};

module.exports = { placeOrder, getOrders, getOrderById };
