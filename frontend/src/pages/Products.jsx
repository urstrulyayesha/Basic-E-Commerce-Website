import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState(null);

  const fetchProducts = async (searchTerm = '') => {
    try {
      setLoading(true);
      const response = await api.get('/products', { params: { search: searchTerm } });
      setProducts(response.data.products || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(search);
  }, [search]);

  const handleAddToCart = async (productId) => {
    try {
      setAddingId(productId);
      await api.post('/cart', { productId, quantity: 1 });
      const count = Number(localStorage.getItem('cartCount') || 0) + 1;
      localStorage.setItem('cartCount', String(count));
      window.dispatchEvent(new Event('cart:update'));
      alert('Product added to cart');
    } catch (err) {
      alert(err.message || 'Unable to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  const filteredProducts = useMemo(() => products, [products]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Shop All Products</h2>
          <p className="text-muted mb-0">Discover essentials for everyday life.</p>
        </div>
        <div className="w-100 w-md-50">
          <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <LoadingSpinner message="Loading products..." /> : null}

      {!loading && filteredProducts.length === 0 ? (
        <EmptyState title="No products found." message="Try a different search term." />
      ) : null}

      {!loading && (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col-md-6 col-xl-4">
              <ProductCard product={product} onAddToCart={handleAddToCart} addingId={addingId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
