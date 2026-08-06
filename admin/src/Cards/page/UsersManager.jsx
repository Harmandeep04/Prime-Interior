import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'https://prime-interior-backend.onrender.com';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/users`);
      if (res.data.success && res.data.body) {
        setUsers(res.data.body);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users from database ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id, name) => {
    setUsers(prevUsers => prevUsers.filter(u => u._id !== id && u.id !== id));
    try {
      const res = await axios.delete(`${BASE_URL}/user/deleteuser/${id}`);
      if (res.data.success) {
        toast.success(`User Account for ${name} removed successfully! 🗑️`);
        fetchUsers();
      } else {
        toast.error(res.data.message || 'Failed to remove user account ⚠️');
        fetchUsers();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Server error removing user account ❌');
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id, name, role) => {
    if (role === 'admin') {
      toast.error('Administrative accounts cannot be deleted! ❌');
      return;
    }

    toast(
      ({ closeToast }) => (
        <div>
          <p style={{ margin: '0 0 10px', fontWeight: 600 }}>
            Remove customer account for {name}?
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button
              onClick={closeToast}
              style={{
                padding: '6px 14px', borderRadius: '6px',
                border: '1.5px solid #e5e5e5', background: '#fff',
                color: '#555', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                closeToast();
                deleteUser(id, name);
              }}
              style={{
                padding: '6px 14px', borderRadius: '6px',
                border: 'none', background: '#ef4444',
                color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, closeButton: true }
    );
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>Loading accounts directory...</div>;
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header"><h3>User Accounts Directory</h3></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email Address</th><th>Authorization Role</th><th>Joined Date</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '16px' }}>No users found in database.</td></tr>
            ) : (
              users.map((u) => {
                const id = u._id || u.id;
                const fullName = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unnamed User';
                const joinedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : (u.joined || 'N/A');
                const userRole = u.role || 'user';
                return (
                  <tr key={id}>
                    <td style={{ fontWeight: '600' }}>{fullName}</td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${userRole === 'admin' ? 'admin' : 'user'}`}>{userRole === 'admin' ? 'Administrative' : 'Customer'}</span></td>
                    <td>{joinedDate}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-danger-icon" onClick={() => handleDeleteUser(id, fullName, userRole)}><Trash2 size={16} color="#ef4444" /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManager;