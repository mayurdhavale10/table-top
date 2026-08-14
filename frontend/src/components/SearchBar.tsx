function SearchBar({ search, setSearch }) {
  return (
    <div style={{ margin: "20px 0" }}>
      <input
  type="text"
  placeholder="Search your favourite food..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
    </div>
  );
}

export default SearchBar;