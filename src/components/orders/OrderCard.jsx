import React from 'react';
import { formatINR, formatDate } from '../../utils/formatters';
import { Package, Truck, ExternalLink, ShieldCheck } from 'lucide-react';
import Badge from '../Badge';
import Button from '../Button';

export default function OrderCard({ order, onViewDetails, onTrack, onCancel }) {
  if (!order) return null;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'SHIPPED':
      case 'PACKED':
      case 'PROCESSING':
        return 'gold';
      case 'CANCELLED':
      case 'PAYMENT_FAILED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const canCancel = ['CREATED', 'PAID', 'PROCESSING'].includes(order.status);

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Order Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          paddingBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--gold-light)',
              }}
            >
              {order.id}
            </span>
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {order.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Ordered on {formatDate(order.created_at)} • Payment: {order.payment_status}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>
            Total Payable
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--gold-primary)',
            }}
          >
            {formatINR(order.total_amount)}
          </span>
        </div>
      </div>

      {/* Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {order.items?.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <img
              src={item.product?.primary_image?.url}
              alt={item.product?.title}
              style={{
                width: '64px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '8px',
                backgroundColor: '#111',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>
                {item.product?.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Variant: {item.variant?.size} ({item.variant?.color || 'Classic'}) • Qty: {item.quantity}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--gold-light)', fontWeight: 600, marginTop: '4px' }}>
                {formatINR(item.unit_price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {order.tracking_number && (
            <span>
              Tracking: <strong style={{ color: 'var(--text-main)' }}>{order.tracking_number}</strong>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {onTrack && order.tracking_number && (
            <Button
              variant="secondary"
              onClick={() => onTrack(order.tracking_number)}
              style={{ padding: '6px 14px', fontSize: '12px', gap: '6px' }}
            >
              <Truck size={14} /> Track Parcel
            </Button>
          )}

          {canCancel && onCancel && (
            <Button
              variant="outline"
              onClick={() => onCancel(order.id)}
              style={{ padding: '6px 14px', fontSize: '12px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            >
              Cancel Order
            </Button>
          )}

          {onViewDetails && (
            <Button
              variant="primary"
              onClick={() => onViewDetails(order.id)}
              style={{ padding: '6px 14px', fontSize: '12px', gap: '6px' }}
            >
              Order Details <ExternalLink size={13} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
