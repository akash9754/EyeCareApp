
import { getAllUsers, importUsers, clearAllData } from './database';
import { downloadFile, formatDate } from './helpers';

// Export all data to JSON file
export const exportToJSON = async (users = null) => {
  try {
    const data = users || await getAllUsers();
    
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      totalUsers: data.length,
      users: data
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const fileName = `eyecare_backup_${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(blob, fileName);
    
    console.log('Data exported successfully:', fileName);
    return true;
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
};

// Import data from JSON file
export const importFromJSON = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          
          // Validate JSON structure
          if (!jsonData.users || !Array.isArray(jsonData.users)) {
            throw new Error('Invalid backup file format');
          }
          
          // Validate user data structure
          const requiredFields = ['name', 'mobile', 'clientCode', 'leftEye', 'rightEye'];
          for (const user of jsonData.users) {
            for (const field of requiredFields) {
              if (!user[field]) {
                throw new Error(`Invalid user data: missing ${field}`);
              }
            }
          }
          
          // Import users
          await importUsers(jsonData.users);
          
          console.log(`Successfully imported ${jsonData.users.length} users`);
          resolve(jsonData.users.length);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Failed to import data:', error);
    throw error;
  }
};

// Create CSV export
export const exportToCSV = async (users = null) => {
  try {
    const data = users || await getAllUsers();
    
    if (data.length === 0) {
      throw new Error('No data to export');
    }
    
    // CSV headers
    const headers = [
      'Client Code',
      'Name',
      'Mobile',
      'Email',
      'Right Eye SPH',
      'Right Eye CYL',
      'Right Eye AXIS',
      'Right Eye ADD',
      'Left Eye SPH',
      'Left Eye CYL',
      'Left Eye AXIS',
      'Left Eye ADD',
      'Pupil Distance',
      'Notes',
      'Created Date',
      'Updated Date'
    ];
    
    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...data.map(user => [
        `"${user.clientCode}"`,
        `"${user.name}"`,
        `"${user.mobile}"`,
        `"${user.email || ''}"`,
        `"${user.rightEye.spherical || ''}"`,
        `"${user.rightEye.cylindrical || ''}"`,
        `"${user.rightEye.axis || ''}"`,
        `"${user.rightEye.addPower || ''}"`,
        `"${user.leftEye.spherical || ''}"`,
        `"${user.leftEye.cylindrical || ''}"`,
        `"${user.leftEye.axis || ''}"`,
        `"${user.leftEye.addPower || ''}"`,
        `"${user.pupilDistance || ''}"`,
        `"${user.notes || ''}"`,
        `"${formatDate(user.createdAt)}"`,
        `"${formatDate(user.updatedAt)}"`
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const fileName = `eyecare_data_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(blob, fileName);
    
    console.log('CSV exported successfully:', fileName);
    return true;
  } catch (error) {
    console.error('Failed to export CSV:', error);
    throw error;
  }
};

// Import from CSV (basic implementation)
export const importFromCSV = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const csvContent = e.target.result;
          const lines = csvContent.split('\n');
          
          if (lines.length < 2) {
            throw new Error('CSV file appears to be empty');
          }
          
          // Skip header row
          const dataLines = lines.slice(1).filter(line => line.trim());
          const users = [];
          
          for (const line of dataLines) {
            const columns = line.split(',').map(col => col.replace(/"/g, '').trim());
            
            if (columns.length < 6) {
              continue; // Skip invalid rows
            }
            
            const user = {
              clientCode: columns[0] || generateClientCode(),
              name: columns[1],
              mobile: columns[2],
              email: columns[3] || '',
              rightEye: {
                spherical: columns[4] || '',
                cylindrical: columns[5] || '',
                axis: columns[6] || '',
                addPower: columns[7] || ''
              },
              leftEye: {
                spherical: columns[8] || '',
                cylindrical: columns[9] || '',
                axis: columns[10] || '',
                addPower: columns[11] || ''
              },
              pupilDistance: columns[12] || '',
              notes: columns[13] || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            if (user.name && user.mobile) {
              users.push(user);
            }
          }
          
          if (users.length === 0) {
            throw new Error('No valid user data found in CSV');
          }
          
          await importUsers(users);
          
          console.log(`Successfully imported ${users.length} users from CSV`);
          resolve(users.length);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read CSV file'));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('Failed to import CSV:', error);
    throw error;
  }
};

// Clear all data with confirmation
export { clearAllData };

// Get storage statistics
export const getStorageStats = async () => {
  try {
    const users = await getAllUsers();
    const dataSize = JSON.stringify(users).length;
    
    return {
      totalUsers: users.length,
      dataSize: dataSize,
      dataSizeFormatted: `${Math.round(dataSize / 1024)} KB`,
      lastModified: users.length > 0 
        ? new Date(Math.max(...users.map(u => new Date(u.updatedAt))))
        : null
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return {
      totalUsers: 0,
      dataSize: 0,
      dataSizeFormatted: '0 KB',
      lastModified: null
    };
  }
};
