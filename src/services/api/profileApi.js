import { apiClient } from './client';
import { storage } from '../../utils/storage';
import { MOCK_USER } from './mockData';

export const profileApi = {
  async getProfile() {
    try {
      const data = await apiClient.get('/profile/');
      return data;
    } catch {
      return storage.get('saajnika_user', MOCK_USER);
    }
  },

  async updateProfile(updates) {
    try {
      return await apiClient.patch('/profile/', updates);
    } catch {
      const current = storage.get('saajnika_user', MOCK_USER);
      const updated = { ...current, ...updates };
      storage.set('saajnika_user', updated);
      return updated;
    }
  },
};
