import React, { useState, useEffect } from 'react';
import { getUsersByStatus, reactivateUser } from '../utils/database';

const CompletedTasks = ({ onRefresh }) => {
  const [completedUsers, setCompletedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [reactivateConfirm, setReactivateConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterByFrame, setFilterByFrame] = useState('all');

  useEffect(() => {
    loadCompletedUsers();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [completedUsers, searchTerm, sortBy, filterByFrame]);

  const loadCompletedUsers = async () => {
    try {
      const users = await getUsersByStatus('completed');
      setCompletedUsers(users);
    } catch (error) {
      console.error('Failed to load completed users:', error);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...completedUsers];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.mobile.includes(term) ||
        user.clientCode.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    }

    // Apply frame filter
    if (filterByFrame !== 'all') {
      filtered = filtered.filter(user => user.frameOption === filterByFrame);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt);
        case 'oldest':
          return new Date(a.completedAt || a.createdAt) - new Date(b.completedAt || b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'clientCode':
          return a.clientCode.localeCompare(b.clientCode);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const getUniqueFrameOptions = () => {
    const frames = completedUsers
      .filter(user => user.frameOption)
      .map(user => user.frameOption);
    return [...new Set(frames)].sort();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    setFilterByFrame('all');
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

      {/* Filter and Sort Controls */}
      <div className="completed-filters">
        <div className="filter-row">
          <div className="search-group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, mobile, client code, or email..."
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="clear-search">
                ✕
              </button>
            )}
          </div>

          <div className="filter-controls">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="clientCode">Client Code</option>
            </select>

            <select
              value={filterByFrame}
              onChange={(e) => setFilterByFrame(e.target.value)}
              className="frame-filter"
            >
              <option value="all">All Frames</option>
              {getUniqueFrameOptions().map(frame => (
                <option key={frame} value={frame}>{frame}</option>
              ))}
            </select>

            <button onClick={clearFilters} className="clear-filters">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="filter-results">
          <span>
            Showing {filteredUsers.length} of {completedUsers.length} completed tasks
            {searchTerm && ` for "${searchTerm}"`}
            {filterByFrame !== 'all' && ` with ${filterByFrame} frame`}
          </span>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map(user => (
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
            {user.frameOption && (
              <div className="eye-data">
                <strong>Frame:</strong>
                <span>{user.frameOption}</span>
              </div>
            )}

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