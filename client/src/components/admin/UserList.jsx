import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiMail,
  FiCalendar,
  FiSearch,
  FiEye,
  FiEdit,
  FiPause,
  FiPlay,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status || "active",
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSuspendUser = async (userId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/suspend`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to suspend user");
      }

      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}/activate`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to activate user");
      }

      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
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
        throw new Error("Failed to update user");
      }

      await fetchUsers(); // Refresh the list
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
        `http://localhost:5000/api/admin/users/${selectedUser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers(); // Refresh the list
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

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-list">
      <div className="list-header">
        <h2>User Management</h2>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-item">
          <FiUsers />
          <span>Total Users: {users.length}</span>
        </div>
        <div className="stat-item">
          <span>
            Active: {users.filter((u) => u.status !== "suspended").length}
          </span>
        </div>
        <div className="stat-item">
          <span>
            Suspended: {users.filter((u) => u.status === "suspended").length}
          </span>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <FiUsers size={48} />
          <p>No users found</p>
          {searchTerm && <p>Try adjusting your search terms</p>}
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className={user.status === "suspended" ? "suspended" : ""}
                >
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <FiMail />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status || "active"}`}>
                      {user.status || "active"}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <FiCalendar />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => handleViewUser(user)}
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button
                        className="btn"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        <FiEdit />
                      </button>
                      {user.status === "suspended" ? (
                        <button
                          className="btn-success"
                          onClick={() => handleActivateUser(user._id)}
                          disabled={actionLoading}
                          title="Activate User"
                        >
                          <FiPlay />
                        </button>
                      ) : (
                        <button
                          className="btn-warning"
                          onClick={() => handleSuspendUser(user._id)}
                          disabled={actionLoading}
                          title="Suspend User"
                        >
                          <FiPause />
                        </button>
                      )}
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>User Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowViewModal(false)}
              >
                <FiX />
              </button>
            </div>
            <div className="modal-content">
              <div className="user-detail">
                <label>Username:</label>
                <span>{selectedUser.username}</span>
              </div>
              <div className="user-detail">
                <label>Email:</label>
                <span>{selectedUser.email}</span>
              </div>
              <div className="user-detail">
                <label>Role:</label>
                <span className={`role-badge ${selectedUser.role}`}>
                  {selectedUser.role}
                </span>
              </div>
              <div className="user-detail">
                <label>Status:</label>
                <span
                  className={`status-badge ${selectedUser.status || "active"}`}
                >
                  {selectedUser.status || "active"}
                </span>
              </div>
              <div className="user-detail">
                <label>Joined Date:</label>
                <span>{formatDate(selectedUser.createdAt)}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowViewModal(false);
                  handleEditUser(selectedUser);
                }}
              >
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit User</h3>
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
                <label>Role:</label>
                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
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
                className="btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleUpdateUser}
                disabled={actionLoading}
              >
                {actionLoading ? "Updating..." : "Update User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete User</h3>
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
                <strong>{selectedUser.username}</strong>?
              </p>
              <p>This action cannot be undone.</p>
              {selectedUser.role === "vendor" && (
                <p className="warning">
                  ⚠️ This will also delete all products associated with this
                  vendor.
                </p>
              )}
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
              >
                {actionLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
