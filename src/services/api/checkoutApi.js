import { apiClient } from './client';
import { cartApi } from './cartApi';

export const checkoutApi = {
  async getSummary(addressId) {
    try {
      return await apiClient.post('/checkout/summary/', { address_id: addressId });
    } catch {
      const cart = await cartApi.getCart();
      return {
        items: cart.items,
        subtotal: cart.subtotal,
        discount_amount: cart.discount_amount,
        applied_coupon: cart.applied_coupon?.code || null,
        gst_amount: cart.gst_amount,
        shipping_fee: cart.shipping_fee,
        total_amount: cart.total_amount,
      };
    }
  },
};
