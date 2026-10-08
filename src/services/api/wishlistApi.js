import { apiClient } from './client';
import { storage } from '../../utils/storage';
import { MOCK_PRODUCTS } from './mockData';

const LOCAL_WISHLIST_KEY = 'saajnika_wishlist';

export const wishlistApi = {
  async getWishlist() {
    try {
      const data = await apiClient.get('/wishlist/');
      return data?.results || data;
    } catch {
      const ids = storage.get(LOCAL_WISHLIST_KEY, [101, 102]);
      return MOCK_PRODUCTS.filter((p) => ids.includes(p.id));
    }
  },

  async toggleWishlist(productId) {
    try {
      return await apiClient.post('/wishlist/toggle/', { product_id: productId });
    } catch {
      const ids = storage.get(LOCAL_WISHLIST_KEY, [101, 102]);
      let updated;
      if (ids.includes(productId)) {
        updated = ids.filter((id) => id !== productId);
      } else {
        updated = [...ids, productId];
      }
      storage.set(LOCAL_WISHLIST_KEY, updated);
      return { in_wishlist: updated.includes(productId), count: updated.length };
    }
  },

  async removeFromWishlist(productId) {
    try {
      return await apiClient.delete(`/wishlist/${productId}/`);
    } catch {
      const ids = storage.get(LOCAL_WISHLIST_KEY, [101, 102]);
      const updated = ids.filter((id) => id !== productId);
      storage.set(LOCAL_WISHLIST_KEY, updated);
      return { success: true };
    }
  },
};
