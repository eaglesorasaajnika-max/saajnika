import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../services/api/orderApi';
import { formatINR, formatDate } from '../utils/formatters';
import OrderTimeline from '../components/orders/OrderTimeline';
import Spinner from '../components/common/Spinner';
import ErrorState from '../components/common/ErrorState';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { ArrowLeft, MapPin, ShieldCheck, Printer } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      try {
        const data = await orderApi.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Order could not be retrieved');
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ padding: '120px', textAlign: 'center' }}>
        <Spinner size={32} label="Retrieving order ledger..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ maxWidth: '720px', margin: '60px auto', padding: '0 24px' }}>
        <ErrorState message={error || 'Order not found'} onRetry={() => navigate('/orders')} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button
            onClick={() => navigate('/orders')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              marginBottom: '8px',
            }}
          >
            <ArrowLeft size={14} /> Back to Orders
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', color: 'var(--text-main)' }}>
              Order {order.id}
            </h1>
            <Badge variant="gold">{order.status}</Badge>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Placed on {formatDate(order.created_at)} • Transaction ID: {order.transaction_id}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => window.print()}
          style={{ padding: '8px 16px', fontSize: '13px', gap: '6px' }}
        >
          <Printer size={14} /> Print Bespoke Invoice
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Left Column: Items & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Items Card */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-main)', marginBottom: '16px' }}>
              Garments in Consignment
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img
                    src={item.product?.primary_image?.url}
                    alt={item.product?.title}
                    style={{ width: '70px', height: '90px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#111' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {item.product?.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Size: {item.variant?.size} • Color: {item.variant?.color || 'Classic'} • Qty: {item.quantity}
                    </p>
                    <p style={{ fontSize: '14px', color: 'var(--gold-light)', fontWeight: 600, marginTop: '4px' }}>
                      {formatINR(item.unit_price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Card */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
          </div>
        </div>

        {/* Right Column: Address & Financials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Shipping Address */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={18} color="var(--gold-primary)" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-main)' }}>
                Delivery Destination
              </h3>
            </div>
            {order.shipping_address ? (
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-main)', display: 'block' }}>
                  {order.shipping_address.name}
                </strong>
                <p>{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} —{' '}
                  {order.shipping_address.pincode}
                </p>
                <p style={{ color: 'var(--gold-light)', marginTop: '6px', fontFamily: 'monospace' }}>
                  Ph: +91 {order.shipping_address.phone}
                </p>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Flagship Boutique Delivery</p>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-main)', marginBottom: '16px' }}>
              Financial Settlement
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>

              {order.discount_amount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Voucher Discount ({order.applied_coupon})</span>
                  <span>- {formatINR(order.discount_amount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Luxury Textile GST (12%)</span>
                <span>{formatINR(order.gst_amount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>White-Glove Insured Delivery</span>
                <span>{order.shipping_fee === 0 ? 'Complimentary' : formatINR(order.shipping_fee)}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  marginTop: '6px',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--gold-primary)',
                }}
              >
                <span>Total Settled</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px' }}>
                  {formatINR(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
