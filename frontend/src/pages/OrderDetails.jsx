import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading order details..." />;
  if (!order) return <div className="container py-5"><div className="alert alert-danger">Order not found</div></div>;

  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="fw-bold mb-3">Order Details</h2>
          <div className="mb-4 text-muted">Order ID: {order._id}</div>
          <div className="row mb-3">
            <div className="col-md-4"><strong>Status:</strong> {order.status}</div>
            <div className="col-md-4"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</div>
            <div className="col-md-4"><strong>Total:</strong> ₹{order.totalAmount}</div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={`${order._id}-${item.productId}`}>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
