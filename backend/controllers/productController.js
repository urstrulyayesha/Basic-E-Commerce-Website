const Product = require('../models/Product');
const errorResponse = require('../utils/errorResponse');

const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};
    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Something went wrong. Please try again.');
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return errorResponse(res, 400, 'Invalid product ID');
  }
};

module.exports = { getProducts, getProductById };
