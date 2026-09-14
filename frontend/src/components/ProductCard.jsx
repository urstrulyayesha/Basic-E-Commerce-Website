import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart, addingId }) => {
  return (
    <div className="card product-card h-100 shadow-sm border-0">
      <img src={product.image} className="card-img-top product-image" alt={product.name} />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{product.name}</h5>
          <span className="badge bg-light text-dark">{product.category}</span>
        </div>
        <p className="card-text text-muted small flex-grow-1">{product.description}</p>
        <div className="mb-3">
          <div className="fw-bold text-primary fs-5">₹{product.price}</div>
          <small className="text-muted">Stock: {product.stock}</small>
        </div>

        <div className="d-flex gap-2 mt-auto">
          <Link to={`/products/${product._id}`} className="btn btn-outline-primary flex-fill">View</Link>
          <button
            className="btn btn-primary flex-fill"
            onClick={() => onAddToCart(product._id)}
            disabled={addingId === product._id || product.stock <= 0}
          >
            {addingId === product._id ? 'Adding...' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
