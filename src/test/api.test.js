import { describe, it, expect } from 'vitest';
import { catalogApi } from '../services/api/catalogApi';
import { authApi } from '../services/api/authApi';
import { cartApi } from '../services/api/cartApi';
import { orderApi } from '../services/api/orderApi';
import { adminApi } from '../services/api/adminApi';

describe('API Services Mock Integration Layer', () => {
  it('catalogApi loads products and categories', async () => {
    const categories = await catalogApi.getCategories();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    const products = await catalogApi.getProducts({});
    expect(Array.isArray(products.results)).toBe(true);
    expect(products.results.length).toBeGreaterThan(0);
  });

  it('authApi requests OTP and returns simulated response', async () => {
    const res = await authApi.requestOtp('test.user@example.com');
    expect(res.success).toBe(true);
    expect(res.demo_hint).toBe('123456');

    const verified = await authApi.verifyOtp('test.user@example.com', '123456');
    expect(verified.tokens).toBeDefined();
    expect(verified.tokens.access).toBeTruthy();
  });

  it('cartApi retrieves cart object and supports line item calculations', async () => {
    const cart = await cartApi.getCart();
    expect(cart).toBeDefined();
    expect(cart.items).toBeDefined();
    const total = cart.total_amount ?? cart.final_total;
    expect(typeof total).toBe('number');
  });

  it('orderApi retrieves orders and order detail by ID', async () => {
    const orders = await orderApi.getOrders();
    expect(Array.isArray(orders)).toBe(true);
    expect(orders.length).toBeGreaterThan(0);

    const firstOrder = orders[0];
    const orderDetail = await orderApi.getOrderById(firstOrder.id);
    expect(orderDetail.id).toBe(firstOrder.id);
  });

  it('adminApi retrieves dashboard telemetry, inventory, and coupons', async () => {
    const stats = await adminApi.getDashboardStats();
    expect(stats.total_revenue).toBeGreaterThan(0);

    const inventory = await adminApi.getInventory();
    expect(Array.isArray(inventory)).toBe(true);

    const coupons = await adminApi.getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
  });
});
