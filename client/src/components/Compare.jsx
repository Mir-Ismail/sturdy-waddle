import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiShoppingCart, FiEye } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const Compare = () => {
  const [compareItems, setCompareItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const state = location.state;
    if (state?.productToCompare) {
      setCompareItems([state.productToCompare]);
    }
  }, [location]);

  const getProductImage = (product) =>
    product.images && product.images[0]
      ? product.images[0]
      : "https://via.placeholder.com/300x200?text=No+Image";

  const addToCompare = (product) => {
    if (compareItems.length >= 3) {
      alert("You can compare up to 3 products at a time");
      return;
    }
    if (compareItems.find((item) => item._id === product._id)) return;
    setCompareItems((prev) => [...prev, product]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeFromCompare = (id) =>
    setCompareItems((prev) => prev.filter((item) => item._id !== id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r bg-[#3498DB] h-3/3 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Smartphone Comparison
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Compare the Best Smartphones
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Find your perfect device with our comprehensive comparison tool.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search Box */}
        <div className="bg-white shadow rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Search Products to Compare
          </h2>
          <div className="relative max-w-xl mx-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow mt-2 z-10 max-h-60 overflow-y-auto">
                {searchResults.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => addToCompare(p)}
                  >
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      className="w-12 h-12 rounded object-cover mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{p.name}</p>
                      <p className="text-sm text-green-600 font-semibold">
                        PKR {p.price}
                      </p>
                    </div>
                    <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compare Section */}
        <div className="bg-white shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Comparing {compareItems.length} Product
              {compareItems.length !== 1 ? "s" : ""}
            </h2>
            {compareItems.length > 0 && (
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                onClick={() => setCompareItems([])}
              >
                Clear All
              </button>
            )}
          </div>

          {compareItems.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FiSearch className="mx-auto text-5xl mb-3 text-gray-400" />
              <h3 className="text-lg font-semibold">No products to compare</h3>
              <p>Search above to start comparing.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {compareItems.map((p) => (
                <div
                  key={p._id}
                  className="relative border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <button
                    onClick={() => removeFromCompare(p._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <FiX />
                  </button>
                  <img
                    src={getProductImage(p)}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {p.name}
                  </h3>
                  <p className="text-green-600 font-bold text-xl mb-2">
                    PKR {p.price}
                  </p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {p.category}
                    </p>
                    <p>
                      <span className="font-medium">Stock:</span>{" "}
                      {p.quantity > 0 ? `${p.quantity} available` : "Out"}
                    </p>
                    {p.brand && (
                      <p>
                        <span className="font-medium">Brand:</span> {p.brand}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2">
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <Link
                      to={`/product/${p._id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <FiEye /> View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Compare;
