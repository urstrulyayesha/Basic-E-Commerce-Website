import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = Number(localStorage.getItem('cartCount') || 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={isAuthenticated ? '/products' : '/login'}>E-Shop</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item"><NavLink className="nav-link" to="/products">Home / Products</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/cart">Cart ({cartCount})</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/orders">Orders</NavLink></li>
              </ul>
              <div className="d-flex align-items-center gap-3">
                <span className="text-light">{user?.name || 'User'}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
