import React, { useState } from 'react';
import { MapPin, Plus, CheckCircle2 } from 'lucide-react';
import Button from '../Button';
import Modal from '../common/Modal';

export default function AddressSelector({
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    type: 'Residence',
    is_default: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address_line_1 || !formData.pincode) {
      alert('Please fill in all mandatory address fields.');
      return;
    }
    onAddNewAddress(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
      type: 'Residence',
      is_default: false,
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            color: 'var(--text-main)',
            letterSpacing: '0.02em',
          }}
        >
          Delivery Destination
        </h3>
        <Button
          variant="secondary"
          onClick={() => setIsAddModalOpen(true)}
          style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
        >
          <Plus size={14} /> Add New Address
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <div
              key={addr.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '14px',
                cursor: 'pointer',
                border: isSelected
                  ? '1px solid var(--gold-primary)'
                  : '1px solid var(--border-subtle)',
                backgroundColor: isSelected
                  ? 'rgba(212, 175, 55, 0.05)'
                  : 'rgba(22, 22, 29, 0.6)',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onClick={() => onSelectAddress(addr.id)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--gold-primary)" />
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                    {addr.name}
                  </span>
                </div>
                {isSelected ? (
                  <CheckCircle2 size={18} color="var(--gold-primary)" />
                ) : (
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '1px solid var(--text-dim)',
                    }}
                  />
                )}
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {addr.address_line_1}
                {addr.address_line_2 && `, ${addr.address_line_2}`}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {addr.city}, {addr.state} — {addr.pincode}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--gold-light)',
                  marginTop: '8px',
                  fontFamily: 'monospace',
                }}
              >
                Ph: +91 {addr.phone}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="New Delivery Address"
        subtitle="Ensure postal details correspond to white-glove courier serviceability."
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Recipient Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Contact Phone (+91) *
              </label>
              <input
                type="tel"
                required
                maxLength="10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 10, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Pincode *
              </label>
              <input
                type="text"
                required
                maxLength="6"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 10, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Address Line 1 (Villa / Flat / Street) *
            </label>
            <input
              type="text"
              required
              value={formData.address_line_1}
              onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Address Line 2 (Area / Landmark)
            </label>
            <input
              type="text"
              value={formData.address_line_2}
              onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 10, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(10, 10, 14, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                }}
              />
            </div>
          </div>

          <Button variant="primary" type="submit" style={{ marginTop: '12px' }}>
            Save Address &amp; Continue
          </Button>
        </form>
      </Modal>
    </div>
  );
}
