import React, { useState, useEffect } from "react";
import { deleteUser, markUserAsCompleted } from "../utils/database";

const UserList = ({ users, onEdit, onRefresh, onAddUser }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [completeConfirm, setCompleteConfirm] = useState(null);

  // Filter only active users
  const activeUsers = users.filter(
    (user) => (user.status || "active") === "active"
  );

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      onRefresh();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const handleComplete = async (userId) => {
    try {
      await markUserAsCompleted(userId);
      onRefresh();
      setCompleteConfirm(null);
    } catch (error) {
      console.error("Failed to mark user as completed:", error);
      alert("Failed to mark user as completed. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrescription = (eye) => {
    const parts = [];
    if (eye.spherical) parts.push(`SPH: ${eye.spherical}`);
    if (eye.cylindrical) parts.push(`CYL: ${eye.cylindrical}`);
    if (eye.axis) parts.push(`AXIS: ${eye.axis}°`);
    if (eye.addPower) parts.push(`ADD: ${eye.addPower}`);
    return parts.length > 0 ? parts.join(", ") : "No prescription data";
  };

  if (activeUsers.length === 0) {
    return (
      <div className="user-list empty">
        <div className="empty-state">
          <h2>👓 No Users Found</h2>
          <p>Start by adding your first eyeglasses prescription</p>
          <button onClick={onAddUser} className="btn-primary">
            ➕ Add New User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="list-header">
        <h2>📋 Active Users ({activeUsers.length})</h2>
        <button onClick={onAddUser} className="btn-primary">
          ➕ Add User
        </button>
      </div>

      <div className="users-grid">
        {activeUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <h3>{user.name}</h3>
              <span className="client-code">#{user.clientCode}</span>
            </div>

            <div className="user-contact">
              <p>📱 {user.mobile}</p>
              {user.email && <p>📧 {user.email}</p>}
            </div>

            <div className="prescription-summary">
              <div className="eye-data">
                <strong>Left Eye:</strong>
                <span>{formatPrescription(user.leftEye)}</span>
              </div>
              <div className="eye-data">
                <strong>Right Eye:</strong>
                <span>{formatPrescription(user.rightEye)}</span>
              </div>
              {user.pupilDistance && (
                <div className="eye-data">
                  <strong>PD:</strong>
                  <span>{user.pupilDistance}mm</span>
                </div>
              )}
            </div>

            {user.frameOption && (
              <p>
                <strong>Frame:</strong> {user.frameOption}
              </p>
            )}

            {/* ========================= */}
            {/* 🔹 Add billing details */}
            {(user.totalAmount || user.advance || user.due) && (
              <div className="billing-info">
                {user.totalAmount && (
                  <p>
                    <strong>Total:</strong> ₹{user.totalAmount}
                  </p>
                )}
                {user.advance && (
                  <p>
                    <strong>Advance:</strong> ₹{user.advance}
                  </p>
                )}
                {user.due && (
                  <p>
                    <strong>Due:</strong> ₹{user.due}
                  </p>
                )}
              </div>
            )}

            {/* ========================= */}

            {user.notes && (
              <div className="user-notes">
                <strong>Notes:</strong>
                <p>{user.notes}</p>
              </div>
            )}

            <div className="user-meta">
              <small>Created: {formatDate(user.createdAt)}</small>
              {user.updatedAt !== user.createdAt && (
                <small>Updated: {formatDate(user.updatedAt)}</small>
              )}
            </div>

            <div className="user-actions">
              <button onClick={() => onEdit(user)} className="btn-secondary">
                ✏️ Edit
              </button>
              <button
                onClick={() => setCompleteConfirm(user.id)}
                className="btn-primary"
                title="Mark as completed/delivered"
              >
                ✅ Complete
              </button>
              <button
                onClick={() => setDeleteConfirm(user.id)}
                className="btn-danger"
              >
                🗑️ Delete
              </button>
            </div>

            {/* Complete Task Confirmation Modal */}
            {completeConfirm === user.id && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>✅ Mark as Completed</h3>
                  <p>
                    Mark <strong>{user.name}</strong>'s order as
                    completed/delivered?
                  </p>
                  <p>
                    This will move the user to "Completed Tasks" and make it
                    read-only.
                  </p>
                  <div className="modal-actions">
                    <button
                      onClick={() => setCompleteConfirm(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleComplete(user.id)}
                      className="btn-primary"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm === user.id && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>⚠️ Confirm Delete</h3>
                  <p>
                    Are you sure you want to delete <strong>{user.name}</strong>
                    ?
                  </p>
                  <p>This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
