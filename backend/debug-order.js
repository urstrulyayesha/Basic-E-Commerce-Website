const request = require('supertest');
const app = require('./server');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');

(async () => {
  await connectDB();
  await User.deleteMany({});
  await Product.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});

  const user = await User.create({ name: 'Demo User', email: 'user@example.com', password: 'password123' });
  const product = await Product.create({
    name: 'Headphones',
    description: 'Quality sound',
    price: 1999,
    category: 'Electronics',
    image: 'https://example.com/headphones.jpg',
    stock: 5,
  });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user@example.com', password: 'password123' });

  console.log('LOGIN', loginResponse.status, loginResponse.body);

  const token = loginResponse.body.token;

  const cartResponse = await request(app)
    .post('/api/cart')
    .set('Authorization', `Bearer ${token}`)
    .send({ productId: product._id.toString(), quantity: 2 });

  console.log('CART ADD', cartResponse.status, cartResponse.body);

  const orderResponse = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${token}`);

  console.log('ORDER', orderResponse.status, orderResponse.body);

  const cartAfter = await Cart.findOne({ userId: user._id });
  console.log('CART AFTER', cartAfter);
  const productAfter = await Product.findById(product._id);
  console.log('PRODUCT AFTER', productAfter);

  process.exit(0);
})();
