import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { User, Phone, Mail, Save, Edit2 } from 'lucide-react';
import '../css/MyProfile.css';
const MyProfilee = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser(parsedUser);
                setFormData({
                    firstName: parsedUser.firstName || '',
                    lastName: parsedUser.lastName || '',
                    phone: parsedUser.phone || ''
                });
            } catch (err) {
                console.error("Localstorage parsing error", err);
            }
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!formData.firstName.trim()) {
            toast.error("First Name cannot be empty!");
            return;
        }

        setLoading(true);
        try {
            const userId = user?._id || user?.id; 

            // Tuhada Router setup `/user/updateuser` nu mapped hai
            const response = await axios.put("http://localhost:5555/user/updateuser", {
                userId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            });

            if (response.data.success) {
                toast.success("Profile changes saved! 🎉");
                
                const updatedData = response.data.body;
                
                // Login session data sync state
                localStorage.setItem("user", JSON.stringify(updatedData));
                setUser(updatedData);
                setIsEditing(false);

                // Global event dispatch taaki Navbar v bina reload refresh ho jave
                window.dispatchEvent(new Event("storage"));
            } else {
                toast.error(response.data.message || "Failed to update");
            }
        } catch (error) {
            console.error("Axios network write error:", error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>Please login first.</div>;
    }

    return (
        <div style={{ padding: '40px 5%', marginTop: '80px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 25px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                    <h2 style={{ fontSize: '1.8rem', margin: '0' }}>My Profile</h2>
                    <p style={{ color: '#777', margin: '4px 0 0' }}>Update your user data and phone info sync</p>
                </div>

                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}><User size={15} /> First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? '#fff' : '#f9f9f9', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}><User size={15} /> Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} disabled={!isEditing} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? '#fff' : '#f9f9f9', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}><Mail size={15} /> Email Address</label>
                        <input type="email" value={user.email || ''} disabled style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: '#f1f1f1', color: '#777', cursor: 'not-allowed', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}><Phone size={15} /> Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} placeholder="Enter your phone number" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: isEditing ? '#fff' : '#f9f9f9', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        {!isEditing ? (
                            <button type="button" onClick={() => setIsEditing(true)} style={{ background: '#111', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Edit2 size={15} /> Edit Profile</button>
                        ) : (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => { setIsEditing(false); setFormData({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' }); }} style={{ background: '#eee', color: '#333', border: 'none', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" disabled={loading} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Save size={15} /> {loading ? "Saving..." : "Save Changes"}</button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MyProfilee;