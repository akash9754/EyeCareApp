
import React, { useState, useEffect } from 'react';
import { saveUser } from '../utils/database';
import { generateClientCode } from '../utils/helpers';

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    clientCode: '',
    name: '',
    mobile: '',
    email: '',
    leftEye: {
      spherical: '',
      cylindrical: '',
      axis: '',
      addPower: ''
    },
    rightEye: {
      spherical: '',
      cylindrical: '',
      axis: '',
      addPower: ''
    },
    pupilDistance: '',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData(prev => ({
        ...prev,
        clientCode: generateClientCode()
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number format';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [eye, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [eye]: {
          ...prev[eye],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        ...formData,
        updatedAt: new Date().toISOString()
      };
      
      if (!user) {
        dataToSave.createdAt = new Date().toISOString();
      }
      
      await saveUser(dataToSave);
      onSave();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert('Failed to save user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-form">
      <h2>{user ? '✏️ Edit User' : '➕ Add New User'}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <section className="form-section">
          <h3>📝 Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="clientCode">Client Code</label>
            <input
              type="text"
              id="clientCode"
              name="clientCode"
              value={formData.clientCode}
              disabled
              className="readonly"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className={errors.mobile ? 'error' : ''}
              required
            />
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </section>

        {/* Prescription Data */}
        <section className="form-section">
          <h3>👁️ Prescription Data</h3>
          
          {/* Left Eye */}
          <div className="eye-section">
            <h4>Left Eye (OS)</h4>
            <div className="eye-fields">
              <div className="form-group">
                <label htmlFor="leftEye.spherical">Spherical (SPH)</label>
                <input
                  type="number"
                  step="0.25"
                  id="leftEye.spherical"
                  name="leftEye.spherical"
                  value={formData.leftEye.spherical}
                  onChange={handleInputChange}
                  placeholder="e.g., -2.50"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="leftEye.cylindrical">Cylindrical (CYL)</label>
                <input
                  type="number"
                  step="0.25"
                  id="leftEye.cylindrical"
                  name="leftEye.cylindrical"
                  value={formData.leftEye.cylindrical}
                  onChange={handleInputChange}
                  placeholder="e.g., -1.00"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="leftEye.axis">Axis</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  id="leftEye.axis"
                  name="leftEye.axis"
                  value={formData.leftEye.axis}
                  onChange={handleInputChange}
                  placeholder="1-180°"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="leftEye.addPower">Add Power</label>
                <input
                  type="number"
                  step="0.25"
                  id="leftEye.addPower"
                  name="leftEye.addPower"
                  value={formData.leftEye.addPower}
                  onChange={handleInputChange}
                  placeholder="e.g., +2.00"
                />
              </div>
            </div>
          </div>

          {/* Right Eye */}
          <div className="eye-section">
            <h4>Right Eye (OD)</h4>
            <div className="eye-fields">
              <div className="form-group">
                <label htmlFor="rightEye.spherical">Spherical (SPH)</label>
                <input
                  type="number"
                  step="0.25"
                  id="rightEye.spherical"
                  name="rightEye.spherical"
                  value={formData.rightEye.spherical}
                  onChange={handleInputChange}
                  placeholder="e.g., -2.50"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rightEye.cylindrical">Cylindrical (CYL)</label>
                <input
                  type="number"
                  step="0.25"
                  id="rightEye.cylindrical"
                  name="rightEye.cylindrical"
                  value={formData.rightEye.cylindrical}
                  onChange={handleInputChange}
                  placeholder="e.g., -1.00"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rightEye.axis">Axis</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  id="rightEye.axis"
                  name="rightEye.axis"
                  value={formData.rightEye.axis}
                  onChange={handleInputChange}
                  placeholder="1-180°"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="rightEye.addPower">Add Power</label>
                <input
                  type="number"
                  step="0.25"
                  id="rightEye.addPower"
                  name="rightEye.addPower"
                  value={formData.rightEye.addPower}
                  onChange={handleInputChange}
                  placeholder="e.g., +2.00"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pupilDistance">Pupil Distance (PD)</label>
            <input
              type="number"
              step="0.5"
              id="pupilDistance"
              name="pupilDistance"
              value={formData.pupilDistance}
              onChange={handleInputChange}
              placeholder="e.g., 62.0mm"
            />
          </div>
        </section>

        {/* Additional Notes */}
        <section className="form-section">
          <h3>📄 Additional Notes</h3>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Any additional notes or comments..."
            />
          </div>
        </section>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (user ? 'Update User' : 'Add User')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
