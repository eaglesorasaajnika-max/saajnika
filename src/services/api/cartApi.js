import { apiClient } from './client';
import { storage } from '../../utils/storage';
import { MOCK_PRODUCTS, MOCK_COUPONS } from './mockData';

const LOCAL_CART_KEY = 'saajnika_offline_cart';

function getLocalCart() {
  const defaultCart = {
    items: [
      {
        id: 1,
        product: MOCK_PRODUCTS[0],
        variant: MOCK_PRODUCTS[0].variants[1],
        quantity: 1,
        unit_price: 185000,
        subtotal: 185000,
        available_stock: 4,
      },
    ],
    applied_coupon: null,
  };
  return storage.get(LOCAL_CART_KEY, defaultCart);
}

function calculateCartTotals(cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  
  let discount = 0;
  if (cart.applied_coupon) {
    if (cart.applied_coupon.discount_type === 'PERCENTAGE') {
      discount = Math.min(
        (subtotal * cart.applied_coupon.discount_value) / 100,
        cart.applied_coupon.max_discount || Infinity
      );
    } else {
      discount = cart.applied_coupon.discount_value;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const gst_amount = Math.round(taxableAmount * 0.12); // 12% Luxury Textile GST
  const shipping_threshold = 50000;
  const shipping_fee = taxableAmount >= shipping_threshold ? 0 : 2500;
  const total_amount = taxableAmount + gst_amount + shipping_fee;

  return {
    ...cart,
    subtotal,
    discount_amount: Math.round(discount),
    gst_amount,
    shipping_fee,
    shipping_threshold,
    free_shipping_progress: Math.min(100, Math.round((subtotal / shipping_threshold) * 100)),
    total_amount,
    item_count: cart.items.reduce((count, i) => count + i.quantity, 0),
  };
}

export const cartApi = {
  async getCart() {
    try {
      const data = await apiClient.get('/cart/');
      return data;
    } catch {
      const localCart = getLocalCart();
      return calculateCartTotals(localCart);
    }
  },

  async addItem({ productId, variantId, quantity = 1 }) {
    try {
      return await apiClient.post('/cart/items/', {
        product_id: productId,
        variant_id: variantId,
        quantity,
      });
    } catch {
      const cart = getLocalCart();
      const product = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
      const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];

      const existingIndex = cart.items.findIndex(
        (item) => item.product.id === productId && item.variant.id === variant.id
      );

      if (existingIndex > -1) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push({
          id: Date.now(),
          product,
          variant,
          quantity,
          unit_price: variant.price || product.price,
          subtotal: (variant.price || product.price) * quantity,
          available_stock: variant.stock || 5,
        });
      }

      storage.set(LOCAL_CART_KEY, cart);
      return calculateCartTotals(cart);
    }
  },

  async updateItem(itemId, quantity) {
    try {
      return await apiClient.patch(`/cart/items/${itemId}/`, { quantity });
    } catch {
      const cart = getLocalCart();
      const item = cart.items.find((i) => i.id === itemId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.available_stock || 10));
      }
      storage.set(LOCAL_CART_KEY, cart);
      return calculateCartTotals(cart);
    }
  },

  async removeItem(itemId) {
    try {
      return await apiClient.delete(`/cart/items/${itemId}/`);
    } catch {
      const cart = getLocalCart();
      cart.items = cart.items.filter((i) => i.id !== itemId);
      storage.set(LOCAL_CART_KEY, cart);
      return calculateCartTotals(cart);
    }
  },

  async applyCoupon(code) {
    try {
      return await apiClient.post('/cart/apply-coupon/', { code });
    } catch {
      const cart = getLocalCart();
      const found = MOCK_COUPONS.find(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase()
      );
      if (!found) {
        throw new Error('Voucher code is invalid or expired.');
      }
      cart.applied_coupon = found;
      storage.set(LOCAL_CART_KEY, cart);
      return calculateCartTotals(cart);
    }
  },

  async removeCoupon() {
    try {
      return await apiClient.delete('/cart/remove-coupon/');
    } catch {
      const cart = getLocalCart();
      cart.applied_coupon = null;
      storage.set(LOCAL_CART_KEY, cart);
      return calculateCartTotals(cart);
    }
  },

  async clearCart() {
    try {
      return await apiClient.delete('/cart/clear/');
    } catch {
      const empty = { items: [], applied_coupon: null };
      storage.set(LOCAL_CART_KEY, empty);
      return calculateCartTotals(empty);
    }
  },

  async mergeCart(sessionKey) {
    try {
      return await apiClient.post('/cart/merge/', { session_key: sessionKey });
    } catch {
      return this.getCart();
    }
  },
};
