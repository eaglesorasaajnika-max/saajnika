import React from 'react';
import { CreditCard, ShieldCheck, Smartphone, Landmark, CheckCircle2 } from 'lucide-react';

export default function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  totalAmount,
}) {
  const methods = [
    {
      id: 'RAZORPAY',
      title: 'Razorpay Instant Gateway',
      description: 'UPI (GPay / PhonePe / Paytm), Credit & Debit Cards, NetBanking with 256-bit encryption.',
      icon: CreditCard,
      badge: 'Recommended',
    },
    {
      id: 'NETBANKING',
      title: 'HDFC / ICICI Luxury Private Wealth Wire',
      description: 'Direct RTGS / NEFT authenticated bank wire with automated receipt reconciliation.',
      icon: Landmark,
      badge: totalAmount >= 100000 ? 'Concierge VIP' : null,
    },
  ];

  return (
    <div>
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '22px',
          color: 'var(--text-main)',
          marginBottom: '16px',
          letterSpacing: '0.02em',
        }}
      >
        Select Payment Gateway
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '14px',
                cursor: 'pointer',
                border: isSelected
                  ? '1px solid var(--gold-primary)'
                  : '1px solid var(--border-subtle)',
                backgroundColor: isSelected
                  ? 'rgba(212, 175, 55, 0.07)'
                  : 'rgba(22, 22, 29, 0.6)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                transition: 'all 0.2s ease',
              }}
              onClick={() => onSelectMethod(m.id)}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Icon size={20} color="var(--gold-primary)" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {m.title}
                  </h4>
                  {m.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        color: 'var(--gold-light)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                      }}
                    >
                      {m.badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {m.description}
                </p>
              </div>

              <div style={{ flexShrink: 0, marginTop: '4px' }}>
                {isSelected ? (
                  <CheckCircle2 size={20} color="var(--gold-primary)" />
                ) : (
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: '1px solid var(--text-dim)',
                      display: 'block',
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}
      >
        <ShieldCheck size={16} color="var(--gold-primary)" />
        <span>Authoritative server signature verification protects every transaction.</span>
      </div>
    </div>
  );
}
