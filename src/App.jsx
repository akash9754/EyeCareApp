
import React, { useState, useEffect } from 'react';
import './App.css';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import UserSearch from './components/UserSearch';
import ExportManager from './components/ExportManager';
import { initDB, getAllUsers } from './utils/database';
import { registerSW } from './utils/serviceWorker';

export default function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize database and service worker
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDB();
      await loadUsers();
      registerSW();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleUserSaved = () => {
    loadUsers();
    setActiveTab('list');
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setActiveTab('form');
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setActiveTab('form');
  };

  const handleSearch = (searchResults) => {
    setFilteredUsers(searchResults);
  };

  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading EyeCare Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>👓 EyeCare Manager</h1>
        <p>Manage eyeglasses prescriptions offline</p>
      </header>

      <nav className="app-nav">
        <button 
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          📋 Users
        </button>
        <button 
          className={activeTab === 'form' ? 'active' : ''}
          onClick={() => setActiveTab('form')}
        >
          ➕ Add User
        </button>
        <button 
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search
        </button>
        <button 
          className={activeTab === 'export' ? 'active' : ''}
          onClick={() => setActiveTab('export')}
        >
          📄 Export
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'list' && (
          <UserList 
            users={filteredUsers}
            onEdit={handleEditUser}
            onRefresh={loadUsers}
            onAddUser={handleAddUser}
          />
        )}
        
        {activeTab === 'form' && (
          <UserForm 
            user={selectedUser}
            onSave={handleUserSaved}
            onCancel={() => {
              setActiveTab('list');
              setSelectedUser(null);
            }}
          />
        )}
        
        {activeTab === 'search' && (
          <UserSearch 
            users={users}
            onSearch={handleSearch}
            onEdit={handleEditUser}
          />
        )}
        
        {activeTab === 'export' && (
          <ExportManager 
            users={users}
            onRefresh={loadUsers}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>EyeCare Manager - Works Offline 📱💻🖥️</p>
        <p>Total Users: {users.length}</p>
      </footer>
    </div>
  );
}
