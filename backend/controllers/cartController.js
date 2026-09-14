const Cart = require('../models/Cart');
const Product = require('../models/Product');
const errorResponse = require('../utils/errorResponse');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart) {
      cart = { userId: req.user._id, items: [] };
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Something went wrong. Please try again.');
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return errorResponse(res, 400, 'Product ID is required');
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return errorResponse(res, 400, 'Quantity must be a positive integer');
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    if (product.stock <= 0) {
      return errorResponse(res, 400, 'Product is out of stock');
    }

    if (parsedQuantity > product.stock) {
      return errorResponse(res, 400, `Only ${product.stock} ${product.name} are available.`);
    }

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (existingItemIndex >= 0) {
      const newQuantity = cart.items[existingItemIndex].quantity + parsedQuantity;
      if (newQuantity > product.stock) {
        return errorResponse(res, 400, `Only ${product.stock} ${product.name} are available.`);
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ productId, quantity: parsedQuantity });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Something went wrong. Please try again.');
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId) {
      return errorResponse(res, 400, 'Invalid product ID');
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return errorResponse(res, 400, 'Quantity must be a positive integer');
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found');
    }

    const item = cart.items.find((entry) => entry.productId.toString() === productId);
    if (!item) {
      return errorResponse(res, 404, 'Product not found in cart');
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    if (parsedQuantity > product.stock) {
      return errorResponse(res, 400, `Only ${product.stock} ${product.name} are available.`);
    }

    item.quantity = parsedQuantity;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Something went wrong. Please try again.');
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return errorResponse(res, 404, 'Cart not found');
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Something went wrong. Please try again.');
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
