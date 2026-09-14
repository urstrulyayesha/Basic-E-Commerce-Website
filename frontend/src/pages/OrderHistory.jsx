import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <LoadingSpinner message="Loading orders..." />;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Order History</h2>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" message="Your order history will appear here once you place an order." />
      ) : (
        <div className="list-group">
          {orders.map((order) => (
            <div key={order._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <div className="fw-semibold">Order ID: {order._id}</div>
                  <div className="text-muted">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-end">
                  <div className="fw-bold">₹{order.totalAmount}</div>
                  <div className="text-muted">{order.status}</div>
                </div>
                <Link to={`/orders/${order._id}`} className="btn btn-primary btn-sm">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
