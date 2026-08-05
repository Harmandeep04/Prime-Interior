import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Check, X, Pencil, Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_API || 'http://localhost:5555';

const HOMEPAGE_OPTIONS = [
  { label: '— Not on Homepage —', value: 'none'      },
  { label: 'Our Picks For You',   value: 'ourPicks'  },
  { label: 'Top Sellers',         value: 'topSeller' },
  { label: 'Both Sections',       value: 'both'      },
];

const SERVICE_OPTIONS = [
  { label: '— None —',             value: 'none'                 },
  { label: 'Living Room',          value: 'Living Room'          },
  { label: 'Modular Kitchen',      value: 'Modular Kitchen'      },
  { label: 'Bedroom Design',       value: 'Bedroom Design'       },
  { label: 'Home Office',          value: 'Home Office'          },
  { label: 'Garden & Landscape',   value: 'Garden & Landscape'   },
  { label: 'Terrace Design',       value: 'Terrace Design'       },
  { label: 'Balcony Makeover',     value: 'Balcony Makeover'     },
  { label: 'Exterior Elevation',   value: 'Exterior Elevation'   },
  { label: 'Full Home Renovation', value: 'Full Home Renovation' },
  { label: 'Commercial Design',    value: 'Commercial Design'    },
  { label: 'Color Consultation',   value: 'Color Consultation'   },
];

const CATEGORY_OPTIONS = [
  'Office Chairs','Storage Solutions','Lighting',
  'Accessories','Desks','Stands',
];

const EMPTY_FORM = {
  name: '', description: '', price: '', discount: '0',
  image: '', hoverImage: '', category: 'Office Chairs',
  colors: '', homepageSection: 'none', servicePage: 'none',
};

const FALLBACK_IMG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><rect width='48' height='48' fill='%23f3f4f6' rx='8'/><text x='50%' y='54%' font-size='10' fill='%23aaa' text-anchor='middle' dominant-baseline='middle'>No Img</text></svg>`;

// Helper: ensure absolute URL for images from backend (if needed)
// Since images are now in frontend public, we keep relative URLs as they are.
const toAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Relative URLs (e.g., /images/...) will be served by frontend dev server
  return url;
};

const HomepageBadge = ({ value }) => {
  if (!value || value === 'none') return <span style={{ color: '#aaa' }}>—</span>;
  const map = {
    ourPicks:  { label: 'Our Picks',  bg: '#059669' },
    topSeller: { label: 'Top Seller', bg: '#d97706' },
    both:      { label: 'Both',       bg: '#7c3aed' },
  };
  const item = map[value] || { label: value, bg: '#6b7280' };
  return (
    <span style={{ background: item.bg, color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {item.label}
    </span>
  );
};

const ServiceBadge = ({ value }) => {
  if (!value || value === 'none') return <span style={{ color: '#aaa' }}>—</span>;
  return (
    <span style={{ background: '#0ea5e9', color: '#fff', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
      {value}
    </span>
  );
};

const Field = ({ label, children, half }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: half ? '1 1 calc(50% - 6px)' : '1 1 100%' }}>
    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{label}</label>
    {React.cloneElement(children, {
      style: {
        padding: '9px 11px', borderRadius: 8, border: '1.5px solid #e2e8f0',
        fontSize: '0.88rem', backgroundColor: '#fff', width: '100%',
        boxSizing: 'border-box', outline: 'none', transition: 'border-color .2s',
        ...(children.props.style || {}),
      },
    })}
  </div>
);

const ProductImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMG);
  const absoluteSrc = toAbsoluteUrl(src);

  useEffect(() => {
    setImgSrc(absoluteSrc || FALLBACK_IMG);
  }, [absoluteSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', backgroundColor: '#f3f4f6' }}
      onError={() => setImgSrc(FALLBACK_IMG)}
    />
  );
};

const ImageUploadField = ({ label, value, onChange }) => {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${BASE_URL}/upload/image`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        // data.url is like "/images/product_xxx.jpg"
        onChange(data.url);
        toast.success('Image uploaded!');
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ flex: '1 1 100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Image URL or upload from computer"
          style={{ flex: 1, padding: '9px 11px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.88rem', backgroundColor: '#fff', outline: 'none', boxSizing: 'border-box' }}
        />
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          style={{
            padding: '9px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0',
            background: uploading ? '#f3f4f6' : '#f8fafc', cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem',
            fontWeight: 600, color: '#374151', whiteSpace: 'nowrap',
          }}
        >
          <Upload size={15} />
          {uploading ? 'Uploading...' : 'Browse'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {value && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Preview:</span>
          <ProductImage src={value} alt="preview" />
        </div>
      )}
    </div>
  );
};

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/user/all-products`);
      if (res.data.success) setProducts(res.data.body);
      else toast.warn('Could not load products');
    } catch {
      toast.error('Server error while loading products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleEdit = (prod) => {
    setEditId(prod._id || prod.id);
    setForm({
      name: prod.name || '',
      description: prod.description || '',
      price: prod.price || '',
      discount: prod.discount || '0',
      image: prod.image || '',
      hoverImage: prod.hoverImage || '',
      category: prod.category || 'Office Chairs',
      colors: Array.isArray(prod.colors) ? prod.colors.join(', ') : (prod.colors || ''),
      homepageSection: prod.homepageSection || 'none',
      servicePage: prod.servicePage || 'none',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    try {
      await axios.delete(`${BASE_URL}/user/api/products/${id}`);
      toast.success('Product deleted!');
    } catch {
      toast.info('Deleted locally.');
    }
  };

  const inp = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast.warn('Product Name and Price are required!');
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      discount: parseInt(form.discount || '0'),
      image: form.image.trim(),
      hoverImage: form.hoverImage.trim(),
      category: form.category,
      colors: form.colors ? form.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
      homepageSection: form.homepageSection,
      servicePage: form.servicePage,
    };
    try {
      setSaving(true);
      const url = editId ? `${BASE_URL}/user/api/products/${editId}` : `${BASE_URL}/user/api/products`;
      const res = editId ? await axios.put(url, payload) : await axios.post(url, payload);
      if (res.data.success) {
        toast.success(editId ? 'Product updated!' : 'Product added!');
        fetchProducts();
        closeModal();
      } else {
        toast.error('Failed to save product');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error');
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => { setIsModalOpen(false); setForm(EMPTY_FORM); setEditId(null); };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>Loading inventory...</div>;

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3>Inventory Control</h3>
        <button className="btn-primary" onClick={() => { setEditId(null); setForm(EMPTY_FORM); setIsModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Category</th><th>Price</th>
              <th>Discount</th><th>Homepage</th><th>Service Page</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#999', fontStyle: 'italic' }}>No products found.</td></tr>
            ) : products.map(prod => {
              const pid = prod._id || prod.id;
              return (
                <tr key={pid}>
                  <td><ProductImage src={prod.image || prod.img || ''} alt={prod.name} /></td>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td>{prod.category || '—'}</td>
                  <td>${(parseFloat(prod.price) || 0).toFixed(2)}</td>
                  <td>{parseInt(prod.discount) > 0 ? `${prod.discount}% Off` : '—'}</td>
                  <td><HomepageBadge value={prod.homepageSection} /></td>
                  <td><ServiceBadge value={prod.servicePage} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => handleEdit(prod)} style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#0369a1' }}>
                        <Pencil size={15} />
                      </button>
                      <button className="btn-danger-icon" onClick={() => handleDelete(pid, prod.name)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: '#fff', padding: '28px 28px 24px', borderRadius: 16, width: 540, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>{editId ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={20} color="#555" /></button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Field label="Product Name *">
                <input type="text" value={form.name} onChange={e => inp('name', e.target.value)} placeholder="e.g. Ergonomic Chair Pro" required />
              </Field>

              <Field label="Description">
                <textarea value={form.description} onChange={e => inp('description', e.target.value)} placeholder="Short product description..." rows={2} style={{ resize: 'vertical' }} />
              </Field>

              <Field label="Price ($) *" half>
                <input type="number" step="0.01" min="0" value={form.price} onChange={e => inp('price', e.target.value)} placeholder="89.99" required />
              </Field>

              <Field label="Discount (%)" half>
                <input type="number" min="0" max="100" value={form.discount} onChange={e => inp('discount', e.target.value)} placeholder="0" />
              </Field>

              <ImageUploadField label="Primary Image" value={form.image} onChange={val => inp('image', val)} />
              <ImageUploadField label="Hover Image" value={form.hoverImage} onChange={val => inp('hoverImage', val)} />

              <Field label="Category" half>
                <select value={form.category} onChange={e => inp('category', e.target.value)}>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Colors (comma separated)" half>
                <input type="text" value={form.colors} onChange={e => inp('colors', e.target.value)} placeholder="#c9b8a8, #888, #555" />
              </Field>

              <Field label="Homepage Section">
                <select value={form.homepageSection} onChange={e => inp('homepageSection', e.target.value)} style={{ borderColor: form.homepageSection !== 'none' ? '#059669' : '#e2e8f0' }}>
                  {HOMEPAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              <Field label="Service Page">
                <select value={form.servicePage} onChange={e => inp('servicePage', e.target.value)} style={{ borderColor: form.servicePage !== 'none' ? '#0ea5e9' : '#e2e8f0' }}>
                  {SERVICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              {(form.homepageSection !== 'none' || form.servicePage !== 'none') && (
                <div style={{ width: '100%', background: '#f8fafc', borderRadius: 10, padding: '10px 14px', border: '1px solid #e2e8f0', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Selected:</span>
                  <HomepageBadge value={form.homepageSection} />
                  <ServiceBadge value={form.servicePage} />
                </div>
              )}

              <div style={{ width: '100%', display: 'flex', gap: 12, marginTop: 8 }}>
                <button onClick={handleSave} disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', background: saving ? '#9ca3af' : '#876445', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontWeight: 700, fontSize: '0.92rem' }}>
                  <Check size={18} />
                  {saving ? 'Saving...' : (editId ? 'Update Product' : 'Save Product')}
                </button>
                <button onClick={closeModal} style={{ padding: '11px 22px', borderRadius: 10, cursor: 'pointer', border: '1.5px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: 600, fontSize: '0.92rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager;