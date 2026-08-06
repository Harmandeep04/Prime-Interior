import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://prime-interior-backend.onrender.com';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    const [loading, setLoading] = useState(() => {
        const storedEmail = localStorage.getItem("userEmail");
        return !!storedEmail;
    });

    const [userEmail, setUserEmail] = useState(() => {
        const storedEmail = localStorage.getItem("userEmail");
        return storedEmail ? String(storedEmail).trim().toLowerCase() : null;
    });

    // ✅ Server se wishlist load karna
    const fetchWishlist = useCallback(async () => {
        if (!userEmail) {
            setWishlistItems([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/wishlist?email=${userEmail}`);
            if (res.data.success && res.data.wishlist) {
                const mapped = res.data.wishlist.map(i => {
                    const actualId = String(i.id || i._id || '');
                    return {
                        id:       actualId,
                        _id:      actualId,
                        name:     i.name     || 'Unnamed Product',
                        price:    i.price    || 0,
                        // ✅ img + image dono handle karo
                        img:      i.img      || i.image || '',
                        image:    i.img      || i.image || '',
                        color:    i.color    || 'Gray',
                        size:     i.size     || 'Size C',
                        discount: i.discount || 0,
                    };
                });
                setWishlistItems(mapped);
            }
        } catch (err) {
            console.error('Fetch wishlist error:', err);
        } finally {
            setLoading(false);
        }
    }, [userEmail]);

    // ✅ Track login/logout
    useEffect(() => {
        const syncAuth = () => {
            const storedEmail = localStorage.getItem("userEmail");
            setUserEmail(storedEmail ? String(storedEmail).trim().toLowerCase() : null);
            if (storedEmail) setLoading(true);
        };
        window.addEventListener("storage",             syncAuth);
        window.addEventListener("local-storage-login", syncAuth);
        return () => {
            window.removeEventListener("storage",             syncAuth);
            window.removeEventListener("local-storage-login", syncAuth);
        };
    }, []);

    useEffect(() => {
        if (userEmail) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setLoading(false);
        }
    }, [userEmail, fetchWishlist]);

    // ✅ Check if item is wishlisted
    const isWishlisted = useCallback((id) => {
        if (!userEmail || !id) return false;
        const lookupId = String(id);
        return wishlistItems.some(
            item => String(item.id) === lookupId || String(item._id) === lookupId
        );
    }, [wishlistItems, userEmail]);

    // ✅ Toggle wishlist ON / OFF
    const toggleWishlist = useCallback(async (product) => {
        if (!userEmail) {
            window.location.href = '/login';
            return;
        }

        const productIdStr = String(product.id || product._id || '');
        if (!productIdStr) {
            console.error("Wishlist Error: Product does not have a valid id or _id!", product);
            return;
        }

        const isExisting = wishlistItems.some(
            i => String(i.id) === productIdStr || String(i._id) === productIdStr
        );

        // ✅ Optimistic update — img + image dono save karo
        const imgValue = product.img || product.image || '';

        if (isExisting) {
            setWishlistItems(prev =>
                prev.filter(i => String(i.id) !== productIdStr && String(i._id) !== productIdStr)
            );
        } else {
            setWishlistItems(prev => [...prev, {
                id:       productIdStr,
                _id:      productIdStr,
                name:     product.name     || 'Product',
                price:    product.price    || 0,
                img:      imgValue,           // ✅ Fixed
                image:    imgValue,           // ✅ Fixed
                color:    product.color    || 'Gray',
                size:     product.size     || 'Size C',
                discount: product.discount || 0,
            }]);
        }

        try {
            const res = await axios.post(`${BASE_URL}/api/wishlist/toggle`, {
                email: userEmail,
                product: {
                    id:       productIdStr,
                    name:     product.name     || 'Product',
                    price:    product.price    || 0,
                    img:      imgValue,        // ✅ Fixed — img + image dono bhejo
                    image:    imgValue,        // ✅ Fixed
                    color:    product.color    || 'Gray',
                    size:     product.size     || 'Size C',
                    discount: product.discount || 0,
                }
            });

            if (res.data.success && res.data.wishlist) {
                const refreshed = res.data.wishlist.map(i => {
                    const fallbackId  = String(i.id || i._id || '');
                    const fallbackImg = i.img || i.image || '';
                    return {
                        id:       fallbackId,
                        _id:      fallbackId,
                        name:     i.name,
                        price:    i.price,
                        img:      fallbackImg,  // ✅ Fixed
                        image:    fallbackImg,  // ✅ Fixed
                        color:    i.color,
                        size:     i.size,
                        discount: i.discount,
                    };
                });
                setWishlistItems(refreshed);
            }
        } catch (err) {
            console.error('Toggle wishlist error:', err);
            fetchWishlist(); // Rollback on error
        }
    }, [wishlistItems, userEmail, fetchWishlist]);

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            loading,
            toggleWishlist,
            fetchWishlist,
            isWishlisted,
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);