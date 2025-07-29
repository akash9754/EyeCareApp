
import React, { useState, useEffect } from 'react';

const UserSearch = ({ users, onSearch, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [results, setResults] = useState([]);

  useEffect(() => {
    performSearch();
  }, [searchTerm, searchField, users]);

  const performSearch = () => {
    if (!searchTerm.trim()) {
      setResults([]);
      onSearch([]);
      return;
    }

    const filtered = users.filter(user => {
      const term = searchTerm.toLowerCase();
      
      switch (searchField) {
        case 'name':
          return user.name.toLowerCase().includes(term);
        case 'mobile':
          return user.mobile.includes(term);
        case 'clientCode':
          return user.clientCode.toLowerCase().includes(term);
        case 'email':
          return user.email?.toLowerCase().includes(term);
        default: // 'all'
          return (
            user.name.toLowerCase().includes(term) ||
            user.mobile.includes(term) ||
            user.clientCode.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
          );
      }
    });

    setResults(filtered);
    onSearch(filtered);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    onSearch(users);
  };

  const formatPrescription = (eye) => {
    const parts = [];
    if (eye.spherical) parts.push(`SPH: ${eye.spherical}`);
    if (eye.cylindrical) parts.push(`CYL: ${eye.cylindrical}`);
    if (eye.axis) parts.push(`AXIS: ${eye.axis}°`);
    if (eye.addPower) parts.push(`ADD: ${eye.addPower}`);
    return parts.length > 0 ? parts.join(', ') : 'No prescription data';
  };

  return (
    <div className="user-search">
      <h2>🔍 Search Users</h2>
      
      <div className="search-controls">
        <div className="search-input-group">
          <select 
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            className="search-field-select"
          >
            <option value="all">All Fields</option>
            <option value="name">Name</option>
            <option value="mobile">Mobile</option>
            <option value="clientCode">Client Code</option>
            <option value="email">Email</option>
          </select>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by ${searchField === 'all' ? 'any field' : searchField}...`}
            className="search-input"
          />
          
          {searchTerm && (
            <button onClick={clearSearch} className="clear-search">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="search-results">
        {searchTerm && (
          <p className="search-info">
            {results.length} result(s) found for "{searchTerm}"
          </p>
        )}

        {searchTerm && results.length === 0 && (
          <div className="no-results">
            <h3>🔍 No Results Found</h3>
            <p>Try adjusting your search terms or search field</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="results-grid">
            {results.map(user => (
              <div key={user.id} className="result-card">
                <div className="result-header">
                  <h3>{user.name}</h3>
                  <span className="client-code">#{user.clientCode}</span>
                </div>
                
                <div className="result-contact">
                  <p>📱 {user.mobile}</p>
                  {user.email && <p>📧 {user.email}</p>}
                </div>

                <div className="result-prescription">
                  <div className="eye-summary">
                    <strong>Left:</strong> {formatPrescription(user.leftEye)}
                  </div>
                  <div className="eye-summary">
                    <strong>Right:</strong> {formatPrescription(user.rightEye)}
                  </div>
                  {user.pupilDistance && (
                    <div className="eye-summary">
                      <strong>PD:</strong> {user.pupilDistance}mm
                    </div>
                  )}
                </div>

                <div className="result-actions">
                  <button 
                    onClick={() => onEdit(user)}
                    className="btn-primary"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searchTerm && (
          <div className="search-help">
            <h3>💡 Search Tips</h3>
            <ul>
              <li>Search by name, mobile number, client code, or email</li>
              <li>Use the dropdown to search specific fields</li>
              <li>Search is case-insensitive</li>
              <li>Partial matches are supported</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
