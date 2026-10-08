import React from 'react';
import { MapPin, Trash2, Edit2, Star } from 'lucide-react';
import Button from '../Button';
import Badge from '../Badge';

export default function AddressBook({
  addresses = [],
  onDeleteAddress,
  onSetDefault,
  onOpenAddModal,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', color: 'var(--text-main)' }}>
            Saved Addresses
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Manage delivery destinations for seamless white-glove checkouts.
          </p>
        </div>

        {onOpenAddModal && (
          <Button variant="primary" onClick={onOpenAddModal} style={{ padding: '8px 16px', fontSize: '13px' }}>
            + Add New Address
          </Button>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '18px',
        }}
      >
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: '16px',
              border: addr.is_default ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--gold-primary)" />
                  <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{addr.name}</strong>
                </div>
                {addr.is_default && <Badge variant="gold">Default</Badge>}
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {addr.address_line_1}
                {addr.address_line_2 && `, ${addr.address_line_2}`}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {addr.city}, {addr.state} — {addr.pincode}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--gold-light)', marginTop: '8px', fontFamily: 'monospace' }}>
                Ph: +91 {addr.phone}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '14px',
                marginTop: '16px',
              }}
            >
              {!addr.is_default && onSetDefault ? (
                <button
                  onClick={() => onSetDefault(addr.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold-primary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Star size={13} /> Make Default
                </button>
              ) : (
                <span />
              )}

              {onDeleteAddress && (
                <button
                  onClick={() => onDeleteAddress(addr.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                  title="Delete address"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
