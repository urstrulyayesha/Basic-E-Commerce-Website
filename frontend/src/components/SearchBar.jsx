const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => (
  <div className="input-group input-group-lg shadow-sm search-wrapper">
    <span className="input-group-text bg-white border-end-0">🔎</span>
    <input
      type="text"
      className="form-control border-start-0"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default SearchBar;
