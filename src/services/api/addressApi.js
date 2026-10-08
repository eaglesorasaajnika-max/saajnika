import { apiClient } from './client';
import { storage } from '../../utils/storage';
import { MOCK_ADDRESSES } from './mockData';

const ADDRESS_STORAGE_KEY = 'saajnika_saved_addresses';

export const addressApi = {
  async getAddresses() {
    try {
      const data = await apiClient.get('/addresses/');
      return data?.results || data;
    } catch {
      return storage.get(ADDRESS_STORAGE_KEY, MOCK_ADDRESSES);
    }
  },

  async addAddress(addressData) {
    try {
      return await apiClient.post('/addresses/', addressData);
    } catch {
      const list = storage.get(ADDRESS_STORAGE_KEY, MOCK_ADDRESSES);
      const newAddress = {
        id: Date.now(),
        ...addressData,
        is_default: list.length === 0 || addressData.is_default,
      };
      if (newAddress.is_default) {
        list.forEach((a) => (a.is_default = false));
      }
      list.push(newAddress);
      storage.set(ADDRESS_STORAGE_KEY, list);
      return newAddress;
    }
  },

  async updateAddress(id, addressData) {
    try {
      return await apiClient.put(`/addresses/${id}/`, addressData);
    } catch {
      const list = storage.get(ADDRESS_STORAGE_KEY, MOCK_ADDRESSES);
      const index = list.findIndex((a) => a.id === id);
      if (index > -1) {
        if (addressData.is_default) {
          list.forEach((a) => (a.is_default = false));
        }
        list[index] = { ...list[index], ...addressData };
        storage.set(ADDRESS_STORAGE_KEY, list);
        return list[index];
      }
      throw new Error('Address not found');
    }
  },

  async deleteAddress(id) {
    try {
      return await apiClient.delete(`/addresses/${id}/`);
    } catch {
      const list = storage.get(ADDRESS_STORAGE_KEY, MOCK_ADDRESSES);
      const filtered = list.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.is_default)) {
        filtered[0].is_default = true;
      }
      storage.set(ADDRESS_STORAGE_KEY, filtered);
      return { success: true };
    }
  },
};
