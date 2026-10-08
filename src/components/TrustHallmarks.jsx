import React from 'react';
import { Gem, ShieldCheck, Truck, Scissors, Clock } from 'lucide-react';

export default function TrustHallmarks() {
  const hallmarks = [
    {
      icon: Gem,
      title: '100% Mulberry Silk',
      subtitle: 'Silk Mark Certified with purity laboratory guarantee',
    },
    {
      icon: ShieldCheck,
      title: 'Hallmarked Zari',
      subtitle: 'Real electroplated silver & gold metallic threadwork',
    },
    {
      icon: Scissors,
      title: 'Bespoke Tailoring',
      subtitle: 'Complimentary blouse customization & bridal fittings',
    },
    {
      icon: Truck,
      title: 'White-Glove Delivery',
      subtitle: 'Tamper-proof insured shipping across India & globally',
    },
  ];

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
    }}>
      {hallmarks.map((h, idx) => {
        const IconComponent = h.icon;
        return (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '22px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              borderRadius: '12px',
              border: '1px solid var(--border-light)',
              transition: 'border-color 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-light)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(138, 110, 20, 0.1) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <IconComponent size={20} color="var(--gold-primary)" />
            </div>

            <div>
              <h4 className="font-serif" style={{ fontSize: '1.05rem', color: 'var(--gold-light)', marginBottom: '3px' }}>
                {h.title}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.4 }}>
                {h.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
