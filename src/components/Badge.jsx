import React from 'react';

export default function Badge({ children, variant = 'gold', size = 'md' }) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'in-stock':
        return {
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.35)',
        };
      case 'low-stock':
        return {
          background: 'rgba(245, 158, 11, 0.12)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.35)',
        };
      case 'out-of-stock':
        return {
          background: 'rgba(239, 68, 68, 0.12)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.35)',
        };
      case 'new-arrival':
        return {
          background: 'rgba(212, 175, 55, 0.95)',
          color: '#08080a',
          border: 'none',
          fontWeight: 700,
        };
      case 'best-seller':
        return {
          background: 'rgba(224, 168, 153, 0.95)',
          color: '#08080a',
          border: 'none',
          fontWeight: 700,
        };
      case 'gold':
      default:
        return {
          background: 'rgba(212, 175, 55, 0.12)',
          color: 'var(--gold-light)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '2px 8px', fontSize: '0.68rem', letterSpacing: '0.04em' };
      case 'lg':
        return { padding: '6px 14px', fontSize: '0.8rem', letterSpacing: '0.06em' };
      case 'md':
      default:
        return { padding: '4px 10px', fontSize: '0.72rem', letterSpacing: '0.05em' };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        borderRadius: '9999px',
        textTransform: 'uppercase',
        lineHeight: 1.2,
        ...getVariantStyles(),
        ...getSizeStyles(),
      }}
    >
      {children}
    </span>
  );
}
