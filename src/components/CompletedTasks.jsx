
import React, { useState, useEffect } from 'react';
import { getUsersByStatus, reactivateUser } from '../utils/database';

const CompletedTasks = ({ onRefresh }) => {
  const [completedUsers, setCompletedUsers] = useState([]);
  const [reactivateConfirm, setReactivateConfirm] = useState(null);

  useEffect(() => {
    loadCompletedUsers();
  }, []);

  const loadCompletedUsers = async () => {
    try {
      const users = await getUsersByStatus('completed');
      setCompletedUsers(users);
    } catch (error) {
      console.error('Failed to load completed users:', error);
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await reactivateUser(userId);
      loadCompletedUsers();
      onRefresh();
      setReactivateConfirm(null);
    } catch (error) {
      console.error('Failed to reactivate user:', error);
      alert('Failed to reactivate user. Please try again.');
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
    return parts.length > 0 ? parts.join(', ') : 'No prescription data';
  };

  if (completedUsers.length === 0) {
    return (
      <div className="completed-tasks empty">
        <div className="empty-state">
          <h2>✅ No Completed Tasks</h2>
          <p>Completed orders will appear here</p>
          <p>Mark active users as completed to see them in this list</p>
        </div>
      </div>
    );
  }

  return (
    <div className="completed-tasks">
      <div className="list-header">
        <h2>✅ Completed Tasks ({completedUsers.length})</h2>
        <p className="completed-info">Read-only view of delivered/completed orders</p>
      </div>

      <div className="users-grid">
        {completedUsers.map(user => (
          <div key={user.id} className="user-card completed-card">
            <div className="completed-badge">✅ COMPLETED</div>
            
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

            {user.notes && (
              <div className="user-notes">
                <strong>Notes:</strong>
                <p>{user.notes}</p>
              </div>
            )}

            <div className="user-meta">
              <small>Created: {formatDate(user.createdAt)}</small>
              {user.completedAt && (
                <small>✅ Completed: {formatDate(user.completedAt)}</small>
              )}
            </div>

            <div className="user-actions">
              <button 
                onClick={() => setReactivateConfirm(user.id)}
                className="btn-secondary"
                title="Move back to active users"
              >
                🔄 Reactivate
              </button>
            </div>

            {/* Reactivate Confirmation Modal */}
            {reactivateConfirm === user.id && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>🔄 Reactivate User</h3>
                  <p>Move <strong>{user.name}</strong> back to active users?</p>
                  <p>This will allow editing and modifications again.</p>
                  <div className="modal-actions">
                    <button 
                      onClick={() => setReactivateConfirm(null)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleReactivate(user.id)}
                      className="btn-primary"
                    >
                      Reactivate
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

export default CompletedTasks;
