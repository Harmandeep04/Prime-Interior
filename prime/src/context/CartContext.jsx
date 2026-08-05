import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// ✅ FIX 1: Port 5555 (tera backend port)
const BASE_URL = 'http://localhost:5555';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    // ✅ Pehlan localStorage ton load karo (refresh te khali na dikhe)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cartItems');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [cartOpen, setCartOpen]   = useState(false);

    // ✅ FIX 2: localStorage ton email lo (token-based nahi, email-based hai tera system)
    const getEmail = () => localStorage.getItem('userEmail') || '';

    // ✅ Jadon vi cartItems change hove, localStorage ch v save karo
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // ── DB te save karo ──
    const syncCartToDB = useCallback(async (items) => {
        const email = getEmail();
        if (!email) return;
        try {
            // ✅ FIX 4: Sahi endpoint — POST /api/cart/sync
            await axios.post(`${BASE_URL}/api/cart/sync`, { email, items });
        } catch (err) {
            console.error('Cart sync error:', err);
        }
    }, []);

    const fetchCart = useCallback(async (email) => {
        try {
            // ✅ FIX 3: Sahi endpoint — GET /api/cart?email=...
            const res = await axios.get(`${BASE_URL}/api/cart?email=${email}`);
            if (res.data.success && Array.isArray(res.data.cart) && res.data.cart.length > 0) {
                setCartItems(res.data.cart);
            }
            // ❗ Agar DB cart khali aaya, local wala (localStorage) hi rakho — overwrite na karo
        } catch (err) {
            console.error('Cart fetch error:', err);
            // error aaye te v local cart wahi reh jaayega
        }
    }, []);

    // ── App khulne pe DB ton cart laao ──
    useEffect(() => {
        const email = getEmail();
        if (email) fetchCart(email);
    }, [fetchCart]);

    // ✅ MAIN FUNCTION: addToCart (Homepage ede nu call karda)
    const addToCart = useCallback((product) => {
        // 🔒 Double safety — bina login kuch nahi hoga
        if (!localStorage.getItem('userEmail')) return;

        setCartItems(prev => {
            const exists = prev.find(i => i.id === product.id);
            let updated;
            if (exists) {
                // Already hai → qty +1
                updated = prev.map(i =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            } else {
                // Nava item add karo
                updated = [...prev, {
                    id:       product.id,
                    name:     product.name,
                    price:    product.price,
                    img:      product.img || '',
                    color:    product.color || 'Gray',
                    size:     product.size  || 'Size C',
                    qty:      product.qty   || 1,
                    discount: product.discount || 0,
                }];
            }
            syncCartToDB(updated); // DB ch save karo
            return updated;
        });
        setCartOpen(true); // ✅ Sirf logged-in user layi sidebar kholo
    }, [syncCartToDB]);

    // ── Qty update ──
    const updateQty = useCallback((id, qty) => {
        if (qty < 1) return;
        setCartItems(prev => {
            const updated = prev.map(i => i.id === id ? { ...i, qty } : i);
            syncCartToDB(updated);
            return updated;
        });
    }, [syncCartToDB]);

    // ── Item hatao ──
    const removeItem = useCallback((id) => {
        setCartItems(prev => {
            const updated = prev.filter(i => i.id !== id);
            syncCartToDB(updated);
            return updated;
        });
    }, [syncCartToDB]);

    // ── Cart khaali karo (order baad) ──
    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        syncCartToDB([]);
    }, [syncCartToDB]);

    const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartOpen,
            setCartOpen,
            addToCart,    // ✅ Homepage ede nu use karda
            updateQty,
            removeItem,
            clearCart,
            totalItems,
            fetchCart,    // login baad manually call karo
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);