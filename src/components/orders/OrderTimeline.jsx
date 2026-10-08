import React from 'react';
import { CheckCircle2, Clock, Circle, XCircle } from 'lucide-react';

export default function OrderTimeline({ timeline = [], currentStatus }) {
  if (!timeline || timeline.length === 0) return null;

  const isCancelled = currentStatus === 'CANCELLED';

  return (
    <div style={{ margin: '24px 0' }}>
      <h4
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '18px',
          color: 'var(--text-main)',
          marginBottom: '20px',
        }}
      >
        Order Lifecycle &amp; White-Glove Tracking
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {timeline.map((stage, idx) => {
          const isDone = stage.completed;
          const isLast = idx === timeline.length - 1;

          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              {/* Status Icon */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: stage.status === 'CANCELLED'
                      ? 'rgba(239, 68, 68, 0.15)'
                      : isDone
                      ? 'rgba(212, 175, 55, 0.15)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${
                      stage.status === 'CANCELLED'
                        ? '#ef4444'
                        : isDone
                        ? 'var(--gold-primary)'
                        : 'var(--border-subtle)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {stage.status === 'CANCELLED' ? (
                    <XCircle size={16} color="#ef4444" />
                  ) : isDone ? (
                    <CheckCircle2 size={16} color="var(--gold-primary)" />
                  ) : (
                    <Circle size={12} color="var(--text-dim)" />
                  )}
                </div>

                {!isLast && (
                  <div
                    style={{
                      width: '2px',
                      height: '28px',
                      backgroundColor: isDone
                        ? 'rgba(212, 175, 55, 0.4)'
                        : 'rgba(255, 255, 255, 0.08)',
                      margin: '4px 0',
                    }}
                  />
                )}
              </div>

              {/* Status Details */}
              <div style={{ flex: 1, paddingTop: '4px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: isDone ? 600 : 400,
                      color: stage.status === 'CANCELLED'
                        ? '#ef4444'
                        : isDone
                        ? 'var(--text-main)'
                        : 'var(--text-muted)',
                    }}
                  >
                    {stage.label || stage.status}
                  </span>
                  {stage.timestamp && (
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                      {stage.timestamp}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
