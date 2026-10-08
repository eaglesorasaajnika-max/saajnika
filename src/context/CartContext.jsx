import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../services/api/cartApi';
import { useNotification } from './NotificationContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount_amount: 0,
    applied_coupon: null,
    gst_amount: 0,
    shipping_fee: 0,
    shipping_threshold: 50000,
    free_shipping_progress: 0,
    total_amount: 0,
    item_count: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError, showInfo } = useNotification();

  const loadCart = useCallback(async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (e) {
      console.warn('Failed to load authoritative cart:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addItem = useCallback(
    async ({ productId, variantId, quantity = 1, productTitle = 'Garment' }) => {
      try {
        setIsLoading(true);
        const updated = await cartApi.addItem({ productId, variantId, quantity });
        setCart(updated);
        showSuccess(`${productTitle} placed into your Private Shopping Bag.`);
        setIsCartOpen(true);
        return updated;
      } catch (err) {
        showError(err.message || 'Unable to reserve garment stock.');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [showSuccess, showError]
  );

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      try {
        const updated = await cartApi.updateItem(itemId, quantity);
        setCart(updated);
        return updated;
      } catch (err) {
        showError(err.message || 'Stock allocation adjustment failed.');
        throw err;
      }
    },
    [showError]
  );

  const removeItem = useCallback(
    async (itemId, itemTitle = 'Garment') => {
      try {
        const updated = await cartApi.removeItem(itemId);
        setCart(updated);
        showInfo(`${itemTitle} removed from bag.`);
        return updated;
      } catch (err) {
        showError(err.message || 'Failed to remove item.');
        throw err;
      }
    },
    [showInfo, showError]
  );

  const applyCoupon = useCallback(
    async (code) => {
      try {
        const updated = await cartApi.applyCoupon(code);
        setCart(updated);
        showSuccess(`Promotional Voucher "${code.toUpperCase()}" applied.`);
        return updated;
      } catch (err) {
        showError(err.message || 'Invalid or expired promotional code.');
        throw err;
      }
    },
    [showSuccess, showError]
  );

  const removeCoupon = useCallback(async () => {
    try {
      const updated = await cartApi.removeCoupon();
      setCart(updated);
      showInfo('Promotional voucher removed.');
      return updated;
    } catch (err) {
      showError(err.message || 'Failed to remove voucher.');
      throw err;
    }
  }, [showInfo, showError]);

  const clearCart = useCallback(async () => {
    try {
      const empty = await cartApi.clearCart();
      setCart(empty);
      return empty;
    } catch (err) {
      console.warn('Failed to clear cart:', err);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart.item_count || 0,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
        isLoading,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
