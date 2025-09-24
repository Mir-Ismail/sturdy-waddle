import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ProductList.css";

const ProductList = forwardRef(({ onAddProduct }, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/vendor/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchProducts,
  }));

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/vendor/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Remove from local state
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const saveEdit = async (productId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/vendor/products/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) =>
          product._id === productId ? updatedProduct.product : product
        )
      );
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Removed product click functionality - vendors should not navigate to product details
  // This functionality is for customers only

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="empty-state">
          <FiEye size={48} />
          <p>No products yet</p>
          <p>Start by adding your first product</p>
          {onAddProduct && (
            <button className="btn" onClick={onAddProduct} style={{ marginTop: '0.75rem' }}>
              <FiPlus /> Add Product
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.images && product.images[0] ? (
                  <img
                    className="object-fit-cover"
                    src={product.images[0]}
                    alt={product.name}
                  />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
                <div className="product-status">
                  <span className={`status-badge ${product.status}`}>
                    {product.status}
                  </span>
                </div>
              </div>

              {editingProduct && editingProduct._id === product._id ? (
                <ProductEditForm
                  product={product}
                  onSave={saveEdit}
                  onCancel={cancelEdit}
                />
              ) : (
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <div className="product-info">
                    <p className="price">PKR {product.price}</p>
                    <p className="quantity">Stock: {product.quantity}</p>
                  </div>

                  <div className="product-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => startEdit(product)}
                    >
                      <FiEdit /> Edit
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => deleteProduct(product._id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Product Edit Form Component
const ProductEditForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    category: product.category || "",
    brand: product.brand || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(product._id, formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="product-edit-form">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Product name"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Product description"
        required
      />
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleChange}
        placeholder="Price in PKR"
        step="0.01"
        required
      />
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
        required
      />
      <input
        type="text"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        placeholder="Brand"
      />
      <div className="form-actions">
        <button type="submit" className="btn">
          Save Changes
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

ProductList.displayName = "ProductList";

export default ProductList;
