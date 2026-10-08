import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  HeartHandshake 
} from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function ConciergeBookingModal({
  isOpen,
  onClose,
  stores = [],
  currentUser = null,
}) {
  const [clientName, setClientName] = useState(currentUser?.full_name || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState('+91 98200 12345');
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('MORNING');
  const [occasion, setOccasion] = useState('BRIDAL');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Set default store and tomorrow's date
  useEffect(() => {
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setAppointmentDate(`${yyyy}-${mm}-${dd}`);
  }, [stores]);

  useEffect(() => {
    if (currentUser) {
      if (!clientName) setClientName(currentUser.full_name || `${currentUser.first_name} ${currentUser.last_name}`.trim());
      if (!clientEmail) setClientEmail(currentUser.email);
    }
  }, [currentUser]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        store: selectedStoreId,
        appointment_date: appointmentDate,
        preferred_time_slot: timeSlot,
        occasion: occasion,
        notes: notes,
      };

      const res = await fetch('/api/catalog/appointments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorDetail = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
          .join(' | ');
        throw new Error(errorDetail || 'Failed to confirm styling appointment');
      }

      setConfirmedBooking(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={handleResetAndClose}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '720px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '36px',
          position: 'relative',
          border: '1px solid var(--gold-primary)',
          boxShadow: 'var(--shadow-modal)',
          backgroundColor: 'var(--bg-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            transition: 'all 0.2s ease',
          }}
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {confirmedBooking ? (
          /* Prestigious Confirmation Screen */
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '20px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #f3e5ab 0%, #d4af37 60%, #8a6e14 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.5)',
            }}>
              <CheckCircle2 size={36} color="#08080a" />
            </div>

            <div>
              <Badge variant="gold" size="sm" style={{ marginBottom: '8px' }}>Appointment Reserved</Badge>
              <h3 className="font-serif gold-gradient-text" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
                Private Styling Session Confirmed
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '480px', margin: '0 auto' }}>
                Our senior bridal concierge looks forward to welcoming you at our {confirmedBooking.store_city} salon.
              </p>
            </div>

            {/* Confirmation Certificate Card */}
            <div style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Royal Booking Reference:
                </span>
                <span style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: 'var(--gold-light)', fontWeight: 700 }}>
                  {confirmedBooking.booking_reference}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Client:</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{confirmedBooking.client_name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{confirmedBooking.client_phone}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Flagship Boutique:</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gold-light)', fontWeight: 600 }}>{confirmedBooking.store_name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{confirmedBooking.store_address}, {confirmedBooking.store_city}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Appointment Date:</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{confirmedBooking.appointment_date}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Private Time Slot:</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>{confirmedBooking.time_slot_display || confirmedBooking.preferred_time_slot}</p>
                </div>
              </div>

              <div style={{
                background: 'rgba(212, 175, 55, 0.08)',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}>
                ✦ A dedicated bridal stylist will contact you via WhatsApp / Phone to curate custom moodboards prior to your arrival.
              </div>
            </div>

            <Button variant="primary" onClick={handleResetAndClose} style={{ padding: '12px 32px' }}>
              Return to Haute Couture Discovery
            </Button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <HeartHandshake size={20} color="var(--gold-primary)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                VIP Private Styling Salon
              </span>
            </div>
            
            <h3 className="font-serif gold-gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>
              Reserve a Private Bridal Consultation
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Experience private atelier viewings, tailored measurements, and bespoke draping sessions with our master couture advisors at Saajnika flagship boutiques.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Row 1: Client Name & Phone */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Radhika Merchant"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.35)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.35)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Email & Boutique Location */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.35)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Flagship Boutique *
                  </label>
                  <select
                    value={selectedStoreId}
                    onChange={(e) => setSelectedStoreId(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  >
                    {stores.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.city} — {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Date & Preferred Time Slot */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.35)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Private Salon Time Slot *
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  >
                    <option value="MORNING">11:00 AM – 1:00 PM (Morning Private Salon)</option>
                    <option value="AFTERNOON">2:00 PM – 4:00 PM (Afternoon Styling)</option>
                    <option value="EVENING">5:00 PM – 7:30 PM (Evening Exclusive)</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Occasion */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Couture Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                >
                  <option value="BRIDAL">Bridal Trousseau & Wedding Day</option>
                  <option value="SANGEET">Sangeet & Mehendi Celebration</option>
                  <option value="RECEPTION">Grand Reception & Gala</option>
                  <option value="HERITAGE_COLLECTOR">Heritage Handloom Collector</option>
                  <option value="BESPOKE_FITTING">Bespoke Fit & Consultation</option>
                </select>
              </div>

              {/* Row 5: Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Bespoke Requests & Color Palette (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Interested in heavy Varanasi crimson sarees and velvet bridal lehengas."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.35)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.88rem',
                    resize: 'none',
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}>
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <Button
                variant="primary"
                type="submit"
                size="lg"
                loading={loading}
                icon={Sparkles}
                style={{ width: '100%', marginTop: '6px' }}
              >
                Confirm Private Appointment Reservation
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <ShieldCheck size={14} color="var(--gold-primary)" />
                <span>Complimentary VIP service • No consultation fee required</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
