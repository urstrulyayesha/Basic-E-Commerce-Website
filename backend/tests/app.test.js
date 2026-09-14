const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const connectDB = require('../config/db');

jest.setTimeout(120000);

let token;
let userId;
let productA;

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});

  const user = await User.create({
    name: 'Demo User',
    email: 'user@example.com',
    password: 'password123',
  });
  userId = user._id;

  const product = await Product.create({
    name: 'Headphones',
    description: 'Quality sound',
    price: 1999,
    category: 'Electronics',
    image: 'https://example.com/headphones.jpg',
    stock: 5,
  });
  productA = product;

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@example.com', password: 'password123' });

  token = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (global.__MONGO_MEMORY_SERVER__) {
    await global.__MONGO_MEMORY_SERVER__.stop();
  }
});

describe('Authentication', () => {
  it('logs in successfully with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeTruthy();
  });

  it('rejects invalid login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'wrong' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });
});

describe('Products', () => {
  it('gets all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  it('gets product by ID', async () => {
    const response = await request(app)
      .get(`/api/products/${productA._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.product.name).toBe('Headphones');
  });

  it('searches products by name', async () => {
    const response = await request(app)
      .get('/api/products?search=head')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.products.some((p) => p.name.toLowerCase().includes('head'))).toBe(true);
  });
});

describe('Cart', () => {
  it('adds product to cart', async () => {
    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: productA._id.toString(), quantity: 2 });

    expect(response.status).toBe(200);
    expect(response.body.cart.items[0].quantity).toBe(2);
  });

  it('updates quantity', async () => {
    const response = await request(app)
      .put(`/api/cart/${productA._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 });

    expect(response.status).toBe(200);
    expect(response.body.cart.items[0].quantity).toBe(3);
  });

  it('prevents quantity greater than stock', async () => {
    const response = await request(app)
      .put(`/api/cart/${productA._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 99 });

    expect(response.status).toBe(400);
  });

  it('removes product from cart', async () => {
    const response = await request(app)
      .delete(`/api/cart/${productA._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe('Orders', () => {
  it('rejects empty cart', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Cart is empty');
  });

  it('places a successful order and reduces stock and clears cart', async () => {
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: productA._id.toString(), quantity: 2 });

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.order.totalAmount).toBe(productA.price * 2);

    const updatedProduct = await Product.findById(productA._id);
    expect(updatedProduct.stock).toBe(3);

    const cartAfterOrder = await Cart.findOne({ userId });
    expect(cartAfterOrder.items).toHaveLength(0);
  });

  it('rejects insufficient stock', async () => {
    const product = await Product.create({
      name: 'Keyboard',
      description: 'Gaming keyboard',
      price: 1299,
      category: 'Accessories',
      image: 'https://example.com/keyboard.jpg',
      stock: 1,
    });

    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id.toString(), quantity: 2 });

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
