import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError(err.message || 'Unable to load product details');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setSubmitting(true);
      await api.post('/cart', { productId: product._id, quantity });
      const count = Number(localStorage.getItem('cartCount') || 0) + quantity;
      localStorage.setItem('cartCount', String(count));
      window.dispatchEvent(new Event('cart:update'));
      navigate('/cart');
    } catch (err) {
      setError(err.message || 'Unable to add to cart');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (!product) return <div className="container py-5"><div className="alert alert-danger">{error || 'Product not found'}</div></div>;

  return (
    <div className="container py-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4 align-items-center">
        <div className="col-lg-6">
          <img src={product.image} alt={product.name} className="img-fluid rounded shadow product-detail-image" />
        </div>
        <div className="col-lg-6">
          <span className="badge bg-primary-subtle text-primary mb-2">{product.category}</span>
          <h1 className="fw-bold mb-3">{product.name}</h1>
          <p className="lead text-muted">{product.description}</p>
          <h3 className="text-primary mb-3">₹{product.price}</h3>
          <p className="text-muted mb-4">Stock: {product.stock}</p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <label className="fw-semibold mb-0">Quantity</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, Number(e.target.value) || 1)))}
              className="form-control quantity-input"
            />
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={submitting || product.stock <= 0}>
            {submitting ? 'Adding to cart...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
