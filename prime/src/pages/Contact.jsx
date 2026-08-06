import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './css/Contact.css';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'https://prime-interior-backend.onrender.com';

const Contact = () => {
    const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' });
    const [saving, setSaving]   = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            toast.warn('Please fill all required fields ⚠️');
            return;
        }
        try {
            setSaving(true);
            await axios.post(`${BASE_URL}/api/consultations`, {
                name:    form.name.trim(),
                email:   form.email.trim(),
                phone:   form.phone.trim(),
                message: form.message.trim(),
            });
            toast.success("Message sent! We'll contact you soon 🎉");
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please try again ❌');
        } finally {
            setSaving(false);
        }
    };

    const details = [
        { icon: <MapPin  size={20} strokeWidth={1.4} />, label: 'Address',       value: 'Ludhiana, Punjab, India'     },
        { icon: <Phone   size={20} strokeWidth={1.4} />, label: 'Phone',         value: '+91 98765 43210'             },
        { icon: <Mail    size={20} strokeWidth={1.4} />, label: 'Email',         value: 'hello@primeinterior.in'      },
        { icon: <Clock   size={20} strokeWidth={1.4} />, label: 'Working Hours', value: 'Mon - Sat: 9AM - 7PM'        },
    ];

    return (
        <div className="contact-page">

            {/* ── Hero Banner ── */}
            <section className="contact-hero-banner">
                <img src="/images/background_1.jpg" alt="Contact Prime Interior" />
                <div className="contact-hero-overlay">
                    <p className="page-tag">GET IN TOUCH</p>
                    <h1>Let's Create Something <em>Beautiful</em></h1>
                    <p>Have a project in mind? We'd love to hear from you.</p>
                </div>
            </section>

            {/* ── Main ── */}
            <section className="contact-main">
                <div className="contact-info-side">
                    <h2>Contact Information</h2>
                    {details.map((d, i) => (
                        <div className="contact-detail" key={i}>
                            <div className="contact-icon">{d.icon}</div>
                            <div>
                                <h4>{d.label}</h4>
                                <p>{d.value}</p>
                            </div>
                        </div>
                    ))}
                    <div className="contact-social">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                        <a href="https://facebook.com"  target="_blank" rel="noreferrer">Facebook</a>
                        <a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
                    </div>
                </div>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <h2>Book A Consultation</h2>
                    <div className="form-row">
                        <input type="text"  placeholder="Your Name *"  value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })} required />
                        <input type="email" placeholder="Your Email *" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <input type="tel" placeholder="Phone Number" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <textarea placeholder="Tell us about your project... *" rows={6}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })} required />
                    <button type="submit" disabled={saving}>
                        {saving ? 'Sending...' : 'Book Consultation ↗'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Contact;