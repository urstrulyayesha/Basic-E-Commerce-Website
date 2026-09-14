const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

dotenv.config();

const seedProducts = [
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with smooth tracking and a comfortable grip for long work sessions.',
    price: 799,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80',
    stock: 15,
  },
  {
    name: 'Keyboard',
    description: 'Slim mechanical-style keyboard with quiet keys and responsive performance for office and gaming use.',
    price: 1299,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    stock: 12,
  },
  {
    name: 'Headphones',
    description: 'High-quality wireless headphones with deep bass, clear vocals, and all-day comfort.',
    price: 1999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    stock: 10,
  },
  {
    name: 'T-Shirt',
    description: 'Premium cotton T-shirt designed for everyday comfort, softness, and a modern fit.',
    price: 599,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    stock: 20,
  },
  {
    name: 'Shoes',
    description: 'Lightweight sneakers built for comfort, durability, and everyday movement.',
    price: 2499,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    stock: 8,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Product.deleteMany({});

    await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: 'password123',
    });
    console.log('Default user created');

    await Product.insertMany(seedProducts);
    console.log('Seed data completed');

    const products = await Product.find({}).lean();
    console.log(`Products in DB: ${products.length}`);
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
