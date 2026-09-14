<<<<<<< HEAD
# E-Shop

A full-stack e-commerce application built with React, Express, MongoDB, and JWT authentication.

## Features
- Secure login and JWT-based auth
- Product listing and search
- Product details page
- Cart management with quantity validation
- Order placement and order history
- Stock validation and automatic stock reduction
- MongoDB-backed persistent data

## Tech Stack
- Frontend: React, Vite, React Router, Axios, Bootstrap
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT + bcryptjs
- Testing: Jest + Supertest

## Project Structure
- frontend/
- backend/

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas URI

## MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas.
2. Start MongoDB.
3. Create a database named `ecommerce` or update `MONGO_URI` in `.env`.

## Environment Variables
Create a `.env` file in the backend root with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your_secret_key
```

Create a `.env` file in the frontend root with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

```bash
cd backend
npm install
npm run seed
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

## Default Login Credentials
- Email: user@example.com
- Password: password123

## API Documentation
- POST /api/auth/login
- GET /api/products
- GET /api/products/:id
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:productId
- DELETE /api/cart/:productId
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id

## Testing

```bash
cd backend
npm test
```

## Screenshots
Add screenshots here after running the app locally.

## Future Enhancements
- Admin dashboard
- Payment integration
- Wishlist
- Reviews and ratings

## Author
Your Name
=======
# Basic-E-Commerce-Website
>>>>>>> 2a4f2be36855987a02530f6308be71d99868e59b
