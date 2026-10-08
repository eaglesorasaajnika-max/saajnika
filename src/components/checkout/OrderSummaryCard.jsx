import React from 'react';
import { formatINR } from '../../utils/formatters';
import { ShieldCheck, Sparkles, Tag } from 'lucide-react';

export default function OrderSummaryCard({ cart }) {
  if (!cart) return null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          color: 'var(--text-main)',
          marginBottom: '20px',
          letterSpacing: '0.02em',
        }}
      >
        Haute Order Summary
      </h3>

      {/* Line Items Preview */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginBottom: '20px',
          maxHeight: '240px',
          overflowY: 'auto',
          paddingRight: '6px',
        }}
      >
        {cart.items?.map((item) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <img
              src={item.product?.primary_image?.url}
              alt={item.product?.title}
              style={{
                width: '54px',
                height: '68px',
                objectFit: 'cover',
                borderRadius: '8px',
                backgroundColor: '#111',
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.product?.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {item.variant?.size || 'Standard'} • Qty: {item.quantity}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--gold-light)',
                  marginTop: '2px',
                }}
              >
                {formatINR(item.unit_price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Financial Breakdown */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Garment Subtotal</span>
          <span>{formatINR(cart.subtotal)}</span>
        </div>

        {cart.discount_amount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={13} />
              Voucher Discount ({cart.applied_coupon?.code})
            </span>
            <span>- {formatINR(cart.discount_amount)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Luxury Textile GST (12%)</span>
          <span>{formatINR(cart.gst_amount)}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>White-Glove Insured Delivery</span>
          <span>
            {cart.shipping_fee === 0 ? (
              <strong style={{ color: 'var(--gold-light)' }}>Complimentary</strong>
            ) : (
              formatINR(cart.shipping_fee)
            )}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '14px',
            marginTop: '6px',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
            Authoritative Total
          </span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 600,
              color: 'var(--gold-primary)',
            }}
          >
            {formatINR(cart.total_amount)}
          </span>
        </div>
      </div>

      {/* Hallmark guarantee */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px',
          padding: '12px',
          borderRadius: '10px',
          backgroundColor: 'rgba(212, 175, 55, 0.05)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          fontSize: '12px',
          color: 'var(--gold-light)',
        }}
      >
        <ShieldCheck size={18} color="var(--gold-primary)" />
        <span>100% Certified Heirloom Silks &amp; Insured Transit</span>
      </div>
    </div>
  );
}
