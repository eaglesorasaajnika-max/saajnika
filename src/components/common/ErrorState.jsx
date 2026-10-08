import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from '../Button';

export default function ErrorState({
  title = 'Atelier Synchronization Interrupted',
  message = 'We encountered an unexpected network disruption while retrieving your bespoke collection.',
  onRetry,
}) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '48px 32px',
        textAlign: 'center',
        borderRadius: '20px',
        margin: '32px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(239, 68, 68, 0.25)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={28} color="#ef4444" />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '24px',
          fontWeight: 500,
          color: '#ef4444',
          marginBottom: '8px',
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: '24px',
        }}
      >
        {message}
      </p>

      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RotateCcw size={14} style={{ marginRight: '8px' }} />
          Retry Request
        </Button>
      )}
    </div>
  );
}
