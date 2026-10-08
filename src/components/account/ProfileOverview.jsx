import React, { useState } from 'react';
import { User, Sparkles, Scissors, Edit2, Check, Phone, Mail } from 'lucide-react';
import Button from '../Button';
import Badge from '../Badge';

export default function ProfileOverview({ user, onUpdateMeasurements }) {
  const [isEditingMeasurements, setIsEditingMeasurements] = useState(false);
  const [measurements, setMeasurements] = useState(user?.measurements || {});

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateMeasurements) {
      onUpdateMeasurements(measurements);
    }
    setIsEditingMeasurements(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Profile Card */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #f3e5ab 0%, #d4af37 60%, #8a6e14 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(212, 175, 55, 0.3)',
          }}
        >
          <Sparkles size={32} color="#08080a" />
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '26px',
                fontWeight: 400,
                color: 'var(--text-main)',
              }}
            >
              {user?.first_name} {user?.last_name}
            </h2>
            <Badge variant="gold">{user?.role || 'VIP Client'}</Badge>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '18px',
              fontSize: '13px',
              color: 'var(--text-muted)',
              flexWrap: 'wrap',
              marginTop: '6px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="var(--gold-primary)" /> {user?.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="var(--gold-primary)" /> +91 {user?.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Atelier Measurements Card */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scissors size={20} color="var(--gold-primary)" />
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-main)' }}>
                Bespoke Atelier Measurements
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Recorded measurements used by master cutters for custom silhouette sizing.
              </p>
            </div>
          </div>

          {!isEditingMeasurements ? (
            <Button
              variant="secondary"
              onClick={() => setIsEditingMeasurements(true)}
              style={{ padding: '6px 14px', fontSize: '12px', gap: '6px' }}
            >
              <Edit2 size={13} /> Update Measurements
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSave}
              style={{ padding: '6px 14px', fontSize: '12px', gap: '6px' }}
            >
              <Check size={13} /> Save Profile
            </Button>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
          }}
        >
          {[
            { key: 'bust', label: 'Bust' },
            { key: 'waist', label: 'Waist' },
            { key: 'hips', label: 'Hips' },
            { key: 'shoulder', label: 'Shoulder' },
            { key: 'blouse_length', label: 'Blouse Length' },
            { key: 'lehenga_length', label: 'Lehenga Length' },
          ].map(({ key, label }) => (
            <div
              key={key}
              style={{
                padding: '14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {label}
              </span>
              {isEditingMeasurements ? (
                <input
                  type="text"
                  value={measurements[key] || ''}
                  onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
                  style={{
                    width: '100%',
                    marginTop: '6px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(10, 10, 14, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '14px',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--gold-light)',
                    marginTop: '4px',
                  }}
                >
                  {measurements[key] || '—'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
