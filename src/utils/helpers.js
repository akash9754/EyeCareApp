
import { v4 as uuidv4 } from 'uuid';

// Generate a unique client code
export const generateClientCode = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `EC-${timestamp}-${randomPart}`.toUpperCase();
};

// Generate UUID
export const generateUUID = () => {
  return uuidv4();
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format prescription data for display
export const formatPrescription = (eye) => {
  const parts = [];
  if (eye.spherical) parts.push(`SPH: ${eye.spherical}`);
  if (eye.cylindrical) parts.push(`CYL: ${eye.cylindrical}`);
  if (eye.axis) parts.push(`AXIS: ${eye.axis}°`);
  if (eye.addPower) parts.push(`ADD: ${eye.addPower}`);
  return parts.length > 0 ? parts.join(', ') : 'No prescription data';
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate mobile number format
export const isValidMobile = (mobile) => {
  const mobileRegex = /^\+?[\d\s-()]+$/;
  return mobileRegex.test(mobile);
};

// Format mobile number for display
export const formatMobile = (mobile) => {
  // Remove all non-digit characters except +
  const cleaned = mobile.replace(/[^\d+]/g, '');
  
  // Basic formatting for display
  if (cleaned.length >= 10) {
    const countryCode = cleaned.startsWith('+') ? cleaned.substring(0, cleaned.indexOf('+') + 3) : '';
    const number = cleaned.replace(countryCode, '');
    
    if (number.length === 10) {
      return `${countryCode}(${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`;
    }
  }
  
  return mobile; // Return original if formatting fails
};

// Sanitize string for file names
export const sanitizeFileName = (fileName) => {
  return fileName
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

// Calculate age from birth date
export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Convert bytes to human readable format
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Check if device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Get device type
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Download file from blob
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
