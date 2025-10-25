import { useState, useRef, useEffect } from "react";
import { FiUpload, FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import "./ProductForm.css";

const ProductEditForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    quantity: product.quantity || "",
    category: product.category || "",
    brand: product.brand || "",
    images: product.images || [],
    specifications: product.specifications || [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(product.images || []);
  const fileInputRef = useRef(null);

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Garden",
    "Sports & Outdoors",
    "Books",
    "Automotive",
    "Health & Beauty",
    "Toys & Games",
    "Food & Beverages",
    "Other",
  ];

  useEffect(() => {
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      quantity: product.quantity || "",
      category: product.category || "",
      brand: product.brand || "",
      images: product.images || [],
      specifications: product.specifications || [],
    });
    setExistingImages(product.images || []);
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length + existingImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    const newImageFiles = [...imageFiles, ...validFiles];
    setImageFiles(newImageFiles);

    const imageUrls = validFiles.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));

    setError(null);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Product description is required");
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      setError("Valid price is required");
      return false;
    }
    if (!formData.quantity || formData.quantity < 0) {
      setError("Valid quantity is required");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert new images to base64
      const imagePromises = imageFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      // Combine existing images (URLs) with new base64 images
      const allImages = [...existingImages, ...base64Images];

      const updatedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        brand: formData.brand.trim(),
        images: allImages,
        specifications: formData.specifications.filter(
          (spec) => spec.key && spec.value
        ),
      };

      await onSave(product._id, updatedData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="product-edit-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="form-header">
        <h2>Edit Product</h2>
        <p>Update your product information</p>
      </div>

      {success && (
        <motion.div
          className="success-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiSave /> Product updated successfully!
        </motion.div>
      )}

      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiX /> {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter detailed product description"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (PKR) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Product Images</h3>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="existing-images">
              <h4>Current Images ({existingImages.length}):</h4>
              <div className="image-grid">
                {existingImages.map((image, index) => (
                  <motion.div
                    key={`existing-${index}`}
                    className="image-item existing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img src={image} alt={`Existing ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeExistingImage(index)}
                    >
                      <FiX />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div className="form-group">
            <label htmlFor="images">Add More Images (Max 5 total)</label>
            <div className="image-upload">
              <input
                ref={fileInputRef}
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
              <label htmlFor="images" className="upload-label">
                <FiUpload /> Choose Images
              </label>
              <p className="upload-hint">Maximum 5MB each</p>
            </div>
          </div>

          {/* New Image Previews */}
          {formData.images.length > existingImages.length && (
            <div className="image-preview">
              <h4>
                New Images ({formData.images.length - existingImages.length}):
              </h4>
              <div className="image-grid">
                {formData.images
                  .slice(existingImages.length)
                  .map((image, index) => (
                    <motion.div
                      key={`new-${index}`}
                      className="image-item new"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img src={image} alt={`New ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        <FiX />
                      </button>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Specifications (Optional)</h3>
          <div className="specifications">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="specification-row">
                <input
                  type="text"
                  placeholder="Specification name"
                  value={spec.key}
                  onChange={(e) =>
                    updateSpecification(index, "key", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) =>
                    updateSpecification(index, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="remove-spec"
                  onClick={() => removeSpecification(index)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="add-spec-btn"
              onClick={addSpecification}
            >
              <FiPlus /> Add Specification
            </button>
          </div>
        </div>

        <div className="form-actions flex items-center gap-4 mt-6">
          <motion.button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.03 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
          >
            {loading ? (
              <>
                <div className="animate-spin h-4 w-4 border-[3px] border-white border-t-transparent rounded-full"></div>
                Updating...
              </>
            ) : (
              <>
                <FiSave size={18} /> Update
              </>
            )}
          </motion.button>

          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all shadow-sm"
            onClick={onCancel}
          >
            <FiX size={18} /> Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

ProductEditForm.propTypes = {
  product: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ProductEditForm;
