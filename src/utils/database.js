
import { openDB } from 'idb';

const DB_NAME = 'EyeCareManager';
const DB_VERSION = 1;
const STORE_NAME = 'users';

let db = null;

// Initialize the database
export const initDB = async () => {
  try {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create users store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
            autoIncrement: true
          });
          
          // Create indexes for searching
          store.createIndex('clientCode', 'clientCode', { unique: true });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('mobile', 'mobile', { unique: false });
          store.createIndex('email', 'email', { unique: false });
        }
      },
    });
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Get database instance
const getDB = async () => {
  if (!db) {
    await initDB();
  }
  return db;
};

// Save a user (create or update)
export const saveUser = async (userData) => {
  try {
    const database = await getDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const result = await store.put(userData);
    await tx.complete;
    
    console.log('User saved successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to save user:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const database = await getDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const users = await store.getAll();
    await tx.complete;
    
    // Sort by name
    return users.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Failed to get users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const database = await getDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const user = await store.get(id);
    await tx.complete;
    
    return user;
  } catch (error) {
    console.error('Failed to get user:', error);
    throw error;
  }
};

// Get user by client code
export const getUserByClientCode = async (clientCode) => {
  try {
    const database = await getDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('clientCode');
    
    const user = await index.get(clientCode);
    await tx.complete;
    
    return user;
  } catch (error) {
    console.error('Failed to get user by client code:', error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const database = await getDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await store.delete(id);
    await tx.complete;
    
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

// Search users
export const searchUsers = async (searchTerm, field = 'all') => {
  try {
    const allUsers = await getAllUsers();
    
    if (!searchTerm) {
      return allUsers;
    }
    
    const term = searchTerm.toLowerCase();
    
    return allUsers.filter(user => {
      switch (field) {
        case 'name':
          return user.name.toLowerCase().includes(term);
        case 'mobile':
          return user.mobile.includes(term);
        case 'clientCode':
          return user.clientCode.toLowerCase().includes(term);
        case 'email':
          return user.email?.toLowerCase().includes(term);
        default:
          return (
            user.name.toLowerCase().includes(term) ||
            user.mobile.includes(term) ||
            user.clientCode.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
          );
      }
    });
  } catch (error) {
    console.error('Failed to search users:', error);
    throw error;
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    const database = await getDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await store.clear();
    await tx.complete;
    
    console.log('All data cleared successfully');
  } catch (error) {
    console.error('Failed to clear data:', error);
    throw error;
  }
};

// Import users (for backup restore)
export const importUsers = async (users) => {
  try {
    const database = await getDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Add each user
    for (const user of users) {
      await store.put(user);
    }
    
    await tx.complete;
    console.log('Users imported successfully');
  } catch (error) {
    console.error('Failed to import users:', error);
    throw error;
  }
};
