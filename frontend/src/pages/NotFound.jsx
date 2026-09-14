import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container py-5 text-center">
    <h1 className="display-4 fw-bold">404</h1>
    <h3>Page not found</h3>
    <p className="text-muted">The page you requested does not exist.</p>
    <Link to="/products" className="btn btn-primary">Go to Products</Link>
  </div>
);

export default NotFound;
