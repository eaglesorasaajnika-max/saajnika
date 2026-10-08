import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api/orderApi';
import { shippingApi } from '../services/api/shippingApi';
import OrderCard from '../components/orders/OrderCard';
import Modal from '../components/common/Modal';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { useNotification } from '../hooks/useNotification';
import { ShoppingBag, Truck, MapPin } from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const { showSuccess, showError } = useNotification();

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (e) {
      console.warn('Failed to load orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleTrack = async (trackingNumber) => {
    try {
      const info = await shippingApi.trackShipment(trackingNumber);
      setTrackingInfo(info);
      setIsTrackingModalOpen(true);
    } catch (e) {
      showError('Unable to contact Shiprocket logistics proxy.');
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you certain you wish to recall this bespoke order?')) return;
    try {
      await orderApi.cancelOrder(orderId, 'Client requested cancellation via private portal');
      showSuccess(`Order ${orderId} has been cancelled.`);
      await loadOrders();
    } catch (err) {
      showError(err.message || 'Failed to cancel order.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '34px',
            color: 'var(--text-main)',
            letterSpacing: '0.02em',
          }}
        >
          My Orders &amp; Heirloom Deliveries
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Inspect live artisan production progress and insured transit milestones.
        </p>
      </div>

      {isLoading ? (
        <div style={{ padding: '80px', textAlign: 'center' }}>
          <Spinner size={32} label="Retrieving order archives..." />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No Past Orders on Record"
          message="You have not yet commissioned any haute-couture garments from the Saajnika atelier."
          actionLabel="Discover Haute Couture"
          onAction={() => navigate('/catalog')}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={(id) => navigate(`/orders/${id}`)}
              onTrack={handleTrack}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Tracking Modal */}
      <Modal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        title="Live White-Glove Dispatch Status"
        subtitle={`Consignment Number: ${trackingInfo?.tracking_number}`}
      >
        {trackingInfo && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
              }}
            >
              <Truck size={20} color="var(--gold-primary)" />
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--gold-light)' }}>
                  {trackingInfo.current_status.replace(/_/g, ' ')}
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Location: {trackingInfo.current_location} ({trackingInfo.courier})
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              {trackingInfo.checkpoints?.map((chk, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px' }}>
                  <MapPin size={16} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {chk.status}
                    </span>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{chk.location}</p>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                      {chk.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
