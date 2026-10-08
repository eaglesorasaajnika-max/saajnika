import React from 'react';
import { ShieldCheck, User } from 'lucide-react';
import Badge from '../Badge';

export default function AdminHeader({ title, user, subtitle }) {
  return (
    <header
      style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(8, 8, 10, 0.7)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}
    >
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            color: 'var(--text-main)',
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
          }}
        >
          <ShieldCheck size={14} color="var(--gold-primary)" />
          <span style={{ fontSize: '12px', color: 'var(--gold-light)', fontWeight: 600 }}>
            Superuser Mode
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} color="var(--text-main)" />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>
            {user?.first_name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
}
