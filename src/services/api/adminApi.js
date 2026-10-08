import { apiClient } from './client';
import { storage } from '../../utils/storage';
import {
  MOCK_ADMIN_STATS,
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_ORDERS,
  MOCK_COUPONS,
} from './mockData';

const ADMIN_PRODUCTS_KEY = 'saajnika_admin_products';
const ADMIN_ORDERS_KEY = 'saajnika_admin_orders';
const ADMIN_COUPONS_KEY = 'saajnika_admin_coupons';
const ADMIN_AUDIT_KEY = 'saajnika_admin_audit';

export const adminApi = {
  async getDashboardStats() {
    try {
      return await apiClient.get('/admin/stats/');
    } catch {
      return MOCK_ADMIN_STATS;
    }
  },

  async getProducts() {
    try {
      const data = await apiClient.get('/admin/products/');
      return data?.results || data;
    } catch {
      return storage.get(ADMIN_PRODUCTS_KEY, MOCK_PRODUCTS);
    }
  },

  async createProduct(productData) {
    try {
      return await apiClient.post('/admin/products/', productData);
    } catch {
      const list = storage.get(ADMIN_PRODUCTS_KEY, MOCK_PRODUCTS);
      const newProduct = {
        id: Date.now(),
        ...productData,
        is_in_stock: true,
      };
      list.unshift(newProduct);
      storage.set(ADMIN_PRODUCTS_KEY, list);
      this.logAudit(`Created new couture product: ${productData.title}`);
      return newProduct;
    }
  },

  async updateProduct(id, productData) {
    try {
      return await apiClient.put(`/admin/products/${id}/`, productData);
    } catch {
      const list = storage.get(ADMIN_PRODUCTS_KEY, MOCK_PRODUCTS);
      const idx = list.findIndex((p) => p.id === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...productData };
        storage.set(ADMIN_PRODUCTS_KEY, list);
        this.logAudit(`Updated product: ${list[idx].title}`);
        return list[idx];
      }
      throw new Error('Product not found');
    }
  },

  async deleteProduct(id) {
    try {
      return await apiClient.delete(`/admin/products/${id}/`);
    } catch {
      const list = storage.get(ADMIN_PRODUCTS_KEY, MOCK_PRODUCTS);
      const filtered = list.filter((p) => p.id !== id);
      storage.set(ADMIN_PRODUCTS_KEY, filtered);
      this.logAudit(`Removed product ID: ${id}`);
      return { success: true };
    }
  },

  async getCategories() {
    try {
      return await apiClient.get('/admin/categories/');
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  async getOrders() {
    try {
      const data = await apiClient.get('/admin/orders/');
      return data?.results || data;
    } catch {
      return storage.get(ADMIN_ORDERS_KEY, MOCK_ORDERS);
    }
  },

  async updateOrderStatus(orderId, newStatus) {
    try {
      return await apiClient.patch(`/admin/orders/${orderId}/status/`, { status: newStatus });
    } catch {
      const orders = storage.get(ADMIN_ORDERS_KEY, MOCK_ORDERS);
      const idx = orders.findIndex((o) => o.id === orderId);
      if (idx > -1) {
        orders[idx].status = newStatus;
        orders[idx].timeline.push({
          status: newStatus,
          label: `Status updated to ${newStatus}`,
          timestamp: new Date().toISOString(),
          completed: true,
        });
        storage.set(ADMIN_ORDERS_KEY, orders);
        this.logAudit(`Order ${orderId} transitioned to ${newStatus}`);
        return orders[idx];
      }
      throw new Error('Order not found');
    }
  },

  async getInventory() {
    try {
      return await apiClient.get('/admin/inventory/');
    } catch {
      const products = storage.get(ADMIN_PRODUCTS_KEY, MOCK_PRODUCTS);
      const rows = [];
      products.forEach((p) => {
        (p.variants || []).forEach((v) => {
          rows.push({
            id: v.id,
            product_id: p.id,
            product_title: p.title,
            sku: v.sku || p.sku,
            size: v.size,
            color: v.color,
            stock: v.stock ?? 5,
            price: v.price || p.price,
            low_stock_threshold: 2,
            is_low_stock: (v.stock ?? 5) <= 2,
          });
        });
      });
      return rows;
    }
  },

  async updateStock(variantId, newStock) {
    try {
      return await apiClient.patch(`/admin/inventory/${variantId}/`, { stock: newStock });
    } catch {
      const products = storage.get(ADMIN_PRODUCTS_KEY, MOCK_PRODUCTS);
      products.forEach((p) => {
        const v = (p.variants || []).find((varItem) => varItem.id === variantId);
        if (v) {
          v.stock = Number(newStock);
        }
      });
      storage.set(ADMIN_PRODUCTS_KEY, products);
      this.logAudit(`Adjusted SKU variant ${variantId} stock to ${newStock}`);
      return { success: true, stock: newStock };
    }
  },

  async getCoupons() {
    try {
      return await apiClient.get('/admin/coupons/');
    } catch {
      return storage.get(ADMIN_COUPONS_KEY, MOCK_COUPONS);
    }
  },

  async createCoupon(couponData) {
    try {
      return await apiClient.post('/admin/coupons/', couponData);
    } catch {
      const list = storage.get(ADMIN_COUPONS_KEY, MOCK_COUPONS);
      list.push(couponData);
      storage.set(ADMIN_COUPONS_KEY, list);
      this.logAudit(`Issued new promotional voucher: ${couponData.code}`);
      return couponData;
    }
  },

  async getCustomers() {
    try {
      return await apiClient.get('/admin/customers/');
    } catch {
      return [
        { id: 1, name: 'Kavya Singhania', email: 'kavya.singhania@example.com', phone: '+91 98765 43210', orders_count: 2, spent: 257040, tier: 'VIP Haute Couture' },
        { id: 2, name: 'Ananya Birla', email: 'ananya.b@example.com', phone: '+91 98111 22334', orders_count: 5, spent: 684000, tier: 'Salon Member' },
        { id: 3, name: 'Rhea Kapoor', email: 'rhea.k@example.com', phone: '+91 99200 44556', orders_count: 3, spent: 412000, tier: 'VIP Bridal Tier' },
      ];
    }
  },

  async getBanners() {
    return [
      { id: 1, title: 'Autumn/Winter Haute Couture 2026', subtitle: 'The Royal Noor-e-Jahan Collection', link: '/catalog?category=haute-couture', is_active: true },
      { id: 2, title: 'Banarasi Heirlooms', subtitle: 'Masterpieces in Pure Silk & Gilded Zari', link: '/catalog?category=banarasi-heirlooms', is_active: true },
    ];
  },

  async getAuditLog() {
    return storage.get(ADMIN_AUDIT_KEY, [
      { id: 1, timestamp: new Date(Date.now() - 3600000).toLocaleString(), action: 'Inventory restocked for SAAJ-HC-001', user: 'Ops Lead' },
      { id: 2, timestamp: new Date(Date.now() - 7200000).toLocaleString(), action: 'Created promotional code COUTURE15', user: 'Marketing Admin' },
      { id: 3, timestamp: new Date(Date.now() - 14400000).toLocaleString(), action: 'Order #SAAJ-ORD-89421 dispatched', user: 'Logistics Supervisor' },
    ]);
  },

  logAudit(action) {
    const list = storage.get(ADMIN_AUDIT_KEY, []);
    list.unshift({
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      action,
      user: 'Super Admin',
    });
    storage.set(ADMIN_AUDIT_KEY, list.slice(0, 50));
  },
};
