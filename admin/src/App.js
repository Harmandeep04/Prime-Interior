import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from './AdminPanel';

const ProtectedAdmin = () => {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    // ✅ URL toh auth params read karo (prime toh redirect hoke aaya)
    const params    = new URLSearchParams(window.location.search);
    const authParam = params.get('auth');

    if (authParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(authParam));
        localStorage.setItem('userEmail', userData.email    || '');
        localStorage.setItem('userRole',  userData.role     || '');
        localStorage.setItem('firstName', userData.firstName|| '');
        localStorage.setItem('lastName',  userData.lastName || '');
        // ✅ URL clean karo
        window.history.replaceState({}, '', '/');
      } catch(e) {
        console.error('Auth param error:', e);
      }
    }

    // ✅ localStorage check
    const email = (localStorage.getItem('userEmail') || '').trim().toLowerCase();

    if (email === 'primeinterior101@gmail.com') {
      setStatus('allowed');
    } else {
      setStatus('denied');
      setTimeout(() => {
        window.location.href = 'http://localhost:3001/login';
      }, 1000);
    }
  }, []);

  if (status === 'checking') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#fef9f2', flexDirection: 'column', gap: '12px'
      }}>
        <p style={{ color: '#876445', fontWeight: '600', fontSize: '1rem' }}>
          Verifying admin access...
        </p>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#fef9f2', flexDirection: 'column', gap: '12px'
      }}>
        <p style={{ color: '#e53e3e', fontWeight: '600', fontSize: '1rem' }}>
          Access Denied! Redirecting to login...
        </p>
      </div>
    );
  }

  return <AdminPanel />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/*" element={<ProtectedAdmin />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;