const express = require('express');
const { getProducts, getProductById } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getProducts);
router.get('/:id', protect, getProductById);

module.exports = router;
