import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Mail, ShieldAlert, LogOut, Key } from 'lucide-react';

const BASE_URL = 'https://prime-interior-backend.onrender.com';

const ProfileDetails = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('userEmail') || 'admin@prime.com';
  const [profile, setProfile] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: adminEmail,
    role: 'admin',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/user/users`);
        const users = res.data.body || [];
        const currentAdmin = users.find(
          (u) => String(u.email).toLowerCase() === adminEmail.toLowerCase()
        );
        if (currentAdmin) {
          setProfile({
            userId: currentAdmin._id,
            firstName: currentAdmin.firstName || '',
            lastName: currentAdmin.lastName || '',
            email: currentAdmin.email || adminEmail,
            role: currentAdmin.role || 'admin',
          });
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, [adminEmail]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profile.userId) {
      toast.error('Cannot update profile: User ID missing ❌');
      return;
    }
    try {
      setUpdating(true);
      const res = await axios.put(`${BASE_URL}/user/updateuser`, {
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      if (res.data.success) {
        toast.success('Admin Profile updated successfully! 👤');
        localStorage.setItem('firstName', profile.firstName);
        localStorage.setItem('lastName', profile.lastName);
      } else {
        toast.error(res.data.message || 'Update failed ⚠️');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Server error updating profile ❌');
    } finally {
      setUpdating(false);
    }
  };

  // ✅ stays in the SAME app, no separate-port redirect
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('adminLoggedIn');
    window.dispatchEvent(new Event('storage'));
    navigate('/login', { replace: true });
  };

  // ✅ the ONLY way to change the admin password:
  // redirect into the Forgot Password (OTP) flow. No inline password
  // fields exist anywhere in the admin panel on purpose.
  const handleResetPasswordRedirect = () => {
    navigate('/forgot-password', { state: { email: profile.email } });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
        Retrieving profile data...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>Administrative Profile Details</h3>
          <button
            className="btn-danger-icon"
            style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={handleLogout}
            title="Logout Session"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
        <form onSubmit={handleUpdateProfile} className="admin-modal-form" style={{ padding: 0 }}>
          <div className="form-group">
            <label>
              <User size={14} style={{ marginRight: '6px' }} /> First Name
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <User size={14} style={{ marginRight: '6px' }} /> Last Name
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <Mail size={14} style={{ marginRight: '6px' }} /> Email Address
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }}
            />
          </div>
          <div className="form-group">
            <label>
              <ShieldAlert size={14} style={{ marginRight: '6px' }} /> System Access Level
            </label>
            <input
              type="text"
              value={profile.role === 'admin' ? 'Administrator (Full Access)' : 'Customer'}
              disabled
              style={{
                backgroundColor: '#f1f5f9',
                cursor: 'not-allowed',
                color: '#64748b',
                fontWeight: '600',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={updating}
            >
              {updating ? 'Saving Profile...' : 'Save Profile Details'}
            </button>
          </div>

          {/* ✅ Reset Password: ONLY path to change the password */}
          <div style={{ marginTop: '12px' }}>
            <button
              type="button"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f59e0b',
              }}
              onClick={handleResetPasswordRedirect}
            >
              <Key size={16} style={{ marginRight: '8px' }} /> Reset Password
            </button>
          </div>

          <div style={{ marginTop: '12px' }}>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid var(--admin-border)',
                backgroundColor: '#f8fafc',
              }}
              onClick={() => setActiveTab('dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileDetails;