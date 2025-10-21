import { useState, useEffect } from "react";
import {
  FiPackage,
  FiMail,
  FiCalendar,
  FiSearch,
  FiEye,
  FiEdit,
  FiPause,
  FiPlay,
  FiTrash2,
  FiX,
  FiShoppingCart,
} from "react-icons/fi";

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    status: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/vendors", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data = await response.json();
      setVendors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewVendor = async (vendor) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/vendors/${vendor._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch vendor details");
      }

      setSelectedVendor({ vendor, products: [] });
      setShowViewModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor({ vendor, products: [] });
    setEditForm({
      username: vendor.username,
      email: vendor.email,
      status: vendor.status || "active",
    });
    setShowEditModal(true);
  };

  const handleDeleteVendor = (vendor) => {
    setSelectedVendor({ vendor, products: [] });
    setShowDeleteModal(true);
  };

  const handleSuspendVendor = async (vendorId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/vendors/${vendorId}/suspend`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to suspend vendor");
      }

      await fetchVendors(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateVendor = async (vendorId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/vendors/${vendorId}/activate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to activate vendor");
      }

      await fetchVendors(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateVendor = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/vendors/${selectedVendor.vendor._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update vendor");
      }

      await fetchVendors(); // Refresh the list
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/vendors/${selectedVendor.vendor._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete vendor");
      }

      await fetchVendors(); // Refresh the list
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading vendors...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="vendor-list">
      <div className="list-header">
        <h2>Vendor Management</h2>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <FiPackage />
          <span>Total Vendors: {vendors.length}</span>
        </div>
        <div className="stat-item">
          <span>
            Active: {vendors.filter((v) => v.status !== "suspended").length}
          </span>
        </div>
        <div className="stat-item">
          <span>
            Suspended: {vendors.filter((v) => v.status === "suspended").length}
          </span>
        </div>
      </div>

      {filteredVendors.length === 0 ? (
        <div className="empty-state">
          <FiPackage size={48} />
          <p>No vendors found</p>
          {searchTerm && <p>Try adjusting your search terms</p>}
        </div>
      ) : (
        <div className="vendors-table">
          <table>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  className={vendor.status === "suspended" ? "suspended" : ""}
                >
                  <td>
                    <div className="vendor-info">
                      <div className="vendor-avatar">
                        {vendor.username?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <span>{vendor.username}</span>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <FiMail />
                      <span>{vendor.email}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${vendor.status || "active"}`}
                    >
                      {vendor.status || "active"}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FiCalendar />
                      <span>{formatDate(vendor.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="performance-cell">
                      <FiShoppingCart />
                      <span>Products: {vendor.productCount || 0}</span>
                    </div>
                  </td>
                  <td>
                    <div className="vendor-actions">
                      <button
                        onClick={() => handleViewVendor(vendor)}
                        title="View Details"
                        className="p-2 sm:p-2.5 md:p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 
                 rounded-lg transition-all duration-200 flex items-center justify-center"
                      >
                        <FiEye className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={() => handleEditVendor(vendor)}
                        title="Edit User"
                        className="p-2 sm:p-2.5 md:p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 
                 rounded-lg transition-all duration-200 flex items-center justify-center"
                      >
                        <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      {vendor.status === "suspended" ? (
                        <button
                          onClick={() => handleActivateVendor(vendor._id)}
                          title="Activate Vendor"
                          disabled={actionLoading}
                          className="p-2 sm:p-2.5 md:p-3 bg-green-100 hover:bg-green-200 text-green-600 
                   rounded-lg transition-all duration-200 flex items-center justify-center 
                   disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <FiPlay className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      ) : (
                        <button
                          className="btn-warning"
                          onClick={() => handleSuspendVendor(vendor._id)}
                          disabled={actionLoading}
                          title="Suspend Vendor"
                        >
                          <FiPause />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteVendor(vendor)}
                        title="Delete Vendor"
                        className="p-2 sm:p-2.5 md:p-3 bg-red-100 hover:bg-red-200 text-red-600 
                 rounded-lg transition-all duration-200 flex items-center justify-center"
                      >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Vendor Modal */}
      {showViewModal && selectedVendor && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Vendor Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-content">
              <div className="vendor-detail">
                <label>Username:</label>
                <span>{selectedVendor.vendor.username}</span>
              </div>
              <div className="vendor-detail">
                <label>Email:</label>
                <span>{selectedVendor.vendor.email}</span>
              </div>
              <div className="vendor-detail">
                <label>Status:</label>
                <span
                  className={`status-badge ${selectedVendor.vendor.status || "active"
                    }`}
                >
                  {selectedVendor.vendor.status || "active"}
                </span>
              </div>
              <div className="vendor-detail">
                <label>Joined Date:</label>
                <span>{formatDate(selectedVendor.vendor.createdAt)}</span>
              </div>
              <div className="vendor-detail">
                <label>Total Products:</label>
                <span>{selectedVendor.products.length}</span>
              </div>

              {selectedVendor.products.length > 0 && (
                <div className="vendor-products">
                  <h4>Products</h4>
                  <div className="products-list">
                    {selectedVendor.products.slice(0, 5).map((product) => (
                      <div key={product._id} className="product-item">
                        <div className="product-image">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} />
                          ) : (
                            <div className="placeholder">No Image</div>
                          )}
                        </div>
                        <div className="product-info">
                          <h5>{product.name}</h5>
                          <p>PKR {product.price}</p>
                          <span className={`status-badge ${product.status}`}>
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {selectedVendor.products.length > 5 && (
                      <p className="more-products">
                        +{selectedVendor.products.length - 5} more products
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium 
               text-gray-700 bg-gray-100 hover:bg-gray-200 
               rounded-lg transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Close
              </button>
              <button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditVendor(selectedVendor.vendor);
                }}
              >
                Edit Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && selectedVendor && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Vendor</h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) =>
                    setEditForm({ ...editForm, username: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium 
               text-gray-700 bg-gray-100 hover:bg-gray-200 
               rounded-lg transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVendor}
                disabled={actionLoading}
                className="px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-medium 
               text-white bg-gradient-to-r from-blue-600 to-purple-600 
               hover:from-blue-700 hover:to-purple-700 
               rounded-lg transition-all duration-200 
               disabled:opacity-60 disabled:cursor-not-allowed
               focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {actionLoading ? "Updating..." : "Update User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedVendor && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Vendor</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-content">
              <p>
                Are you sure you want to delete{" "}
                <strong>{selectedVendor.vendor.username}</strong>?
              </p>
              <p>This action cannot be undone.</p>
              <p className="warning">
                ⚠️ This will also delete all products associated with this
                vendor.
              </p>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base font-medium 
               text-gray-700 bg-gray-100 hover:bg-gray-200 
               rounded-lg transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete Vendor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorList;
