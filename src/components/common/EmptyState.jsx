import React from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../Button';

export default function EmptyState({
  title = 'No Items Discovered',
  message = 'We could not find any items matching your criteria in the atelier.',
  actionLabel = 'Explore Collection',
  onAction,
  icon: Icon = Sparkles,
}) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '64px 32px',
        textAlign: 'center',
        borderRadius: '20px',
        margin: '32px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(212, 175, 55, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: '1px solid rgba(212, 175, 55, 0.25)',
        }}
      >
        <Icon size={28} color="var(--gold-primary)" />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '26px',
          fontWeight: 400,
          color: 'var(--text-main)',
          marginBottom: '8px',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          maxWidth: '440px',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}
      >
        {message}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
