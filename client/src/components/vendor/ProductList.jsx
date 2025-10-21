import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FiEdit, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import ProductEditForm from "./ProductEditForm";
import "./ProductList.css";
import PropTypes from "prop-types";

const ProductList = forwardRef(({ onAddProduct }, ref) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

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

ProductList.propTypes = {
  onAddProduct: PropTypes.func,
};

ProductList.displayName = "ProductList";

export default ProductList;
