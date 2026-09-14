import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.cart || { items: [] });
      const count = (response.data.cart?.items || []).reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem('cartCount', String(count));
      window.dispatchEvent(new Event('cart:update'));
    } catch (err) {
      setError(err.message || 'Unable to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(
    () => (cart.items || []).reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0),
    [cart],
  );

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      await api.put(`/cart/${productId}`, { quantity });
      fetchCart();
    } catch (err) {
      setError(err.message || 'Unable to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      fetchCart();
    } catch (err) {
      setError(err.message || 'Unable to remove item');
    }
  };

  const placeOrder = async () => {
    try {
      setPlacingOrder(true);
      const response = await api.post('/orders');
      setError('');
      alert(response.data.message || 'Order placed successfully');
      fetchCart();
    } catch (err) {
      setError(err.message || 'Unable to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading cart..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Your Cart</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {(cart.items || []).length === 0 ? (
        <EmptyState title="Your cart is empty" message="Add products to get started." />
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            {(cart.items || []).map((item) => (
              <div key={item.productId?._id || item.productId} className="card shadow-sm mb-3 border-0">
                <div className="card-body d-flex flex-column flex-md-row align-items-center gap-3">
                  <img src={item.productId?.image} alt={item.productId?.name} className="cart-image" />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{item.productId?.name}</h5>
                    <div className="text-primary fw-bold">₹{item.productId?.price}</div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)}>-</button>
                      <span className="fw-semibold">{item.quantity}</span>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">Subtotal: ₹{(item.productId?.price || 0) * item.quantity}</div>
                    <button className="btn btn-link text-danger mt-2" onClick={() => removeItem(item.productId?._id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm border-0 position-sticky top-5">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Cart Summary</h4>
                <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="d-flex justify-content-between mb-3 fw-bold"><span>Total</span><span>₹{subtotal}</span></div>
                <button className="btn btn-primary w-100" onClick={placeOrder} disabled={placingOrder}>
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
