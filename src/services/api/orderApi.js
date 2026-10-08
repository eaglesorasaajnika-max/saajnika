import { apiClient } from './client';
import { storage } from '../../utils/storage';
import { MOCK_ORDERS } from './mockData';

const ORDERS_STORAGE_KEY = 'saajnika_orders_history';

export const orderApi = {
  async getOrders() {
    try {
      const data = await apiClient.get('/orders/');
      return data?.results || data;
    } catch {
      return storage.get(ORDERS_STORAGE_KEY, MOCK_ORDERS);
    }
  },

  async getOrderById(orderId) {
    try {
      return await apiClient.get(`/orders/${orderId}/`);
    } catch {
      const orders = storage.get(ORDERS_STORAGE_KEY, MOCK_ORDERS);
      const found = orders.find((o) => o.id === orderId);
      if (!found) throw new Error('Order not found');
      return found;
    }
  },

  async cancelOrder(orderId, reason = 'Customer requested cancellation') {
    try {
      return await apiClient.post(`/orders/${orderId}/cancel/`, { reason });
    } catch {
      const orders = storage.get(ORDERS_STORAGE_KEY, MOCK_ORDERS);
      const index = orders.findIndex((o) => o.id === orderId);
      if (index > -1) {
        orders[index].status = 'CANCELLED';
        orders[index].timeline.push({
          status: 'CANCELLED',
          label: `Order Cancelled (${reason})`,
          timestamp: new Date().toISOString(),
          completed: true,
        });
        storage.set(ORDERS_STORAGE_KEY, orders);
        return orders[index];
      }
      throw new Error('Order not found');
    }
  },

  async createOrder({ orderId, cart, address, paymentId }) {
    const orders = storage.get(ORDERS_STORAGE_KEY, MOCK_ORDERS);
    const newOrder = {
      id: orderId || 'SAAJ-ORD-' + Math.floor(10000 + Math.random() * 90000),
      created_at: new Date().toISOString(),
      status: 'PAID',
      payment_status: 'PAID',
      payment_method: 'Razorpay UPI / NetBanking',
      transaction_id: paymentId || 'pay_' + Date.now(),
      tracking_number: 'SR-DEL-' + Math.floor(10000000 + Math.random() * 90000000),
      courier_partner: 'Shiprocket White Glove Luxury Logistics',
      estimated_delivery: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      shipping_address: address,
      subtotal: cart.subtotal,
      discount_amount: cart.discount_amount || 0,
      applied_coupon: cart.applied_coupon?.code || null,
      gst_amount: cart.gst_amount,
      shipping_fee: cart.shipping_fee,
      total_amount: cart.total_amount,
      timeline: [
        { status: 'CREATED', label: 'Bespoke Order Placed', timestamp: new Date().toISOString(), completed: true },
        { status: 'PAID', label: 'Payment Authenticated', timestamp: new Date().toISOString(), completed: true },
        { status: 'PROCESSING', label: 'Artisan Garment Allocation', timestamp: null, completed: false },
        { status: 'PACKED', label: 'Atelier Velvet Packaging', timestamp: null, completed: false },
        { status: 'SHIPPED', label: 'Dispatched via White Glove Express', timestamp: null, completed: false },
        { status: 'DELIVERED', label: 'Delivered', timestamp: null, completed: false },
      ],
      items: cart.items.map((item, idx) => ({
        id: idx + 1,
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      })),
    };

    orders.unshift(newOrder);
    storage.set(ORDERS_STORAGE_KEY, orders);
    return newOrder;
  },
};
