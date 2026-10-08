import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../services/api/wishlistApi';
import { useNotification } from './NotificationContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showInfo } = useNotification();

  const loadWishlist = useCallback(async () => {
    try {
      const items = await wishlistApi.getWishlist();
      setWishlist(items);
    } catch (e) {
      console.warn('Failed to load wishlist:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product) => {
      const exists = wishlist.some((item) => item.id === product.id);
      if (exists) {
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        await wishlistApi.toggleWishlist(product.id);
        showInfo(`${product.title} removed from your Private Curation Salon.`);
      } else {
        setWishlist((prev) => [product, ...prev]);
        await wishlistApi.toggleWishlist(product.id);
        showSuccess(`${product.title} curated to your Private Salon.`);
      }
    },
    [wishlist, showInfo, showSuccess]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      await wishlistApi.removeFromWishlist(productId);
    },
    []
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlistOpen,
        setIsWishlistOpen,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        isLoading,
        refreshWishlist: loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
