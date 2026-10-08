import React, { useState } from 'react';
import { Mail, Check, Sparkles } from 'lucide-react';
import Button from '../Button';
import { isValidEmail } from '../../utils/validators';
import { useNotification } from '../../context/NotificationContext';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess } = useNotification();

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please provide a valid private email address.');
      return;
    }

    setIsSubscribed(true);
    showSuccess('You have been inducted into the Saajnika Private Salon.');
  };

  return (
    <section
      className="glass-panel"
      style={{
        margin: '80px 0',
        padding: '56px 32px',
        borderRadius: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <div
        style={{
          maxWidth: '580px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '20px',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            marginBottom: '16px',
          }}
        >
          <Sparkles size={14} color="var(--gold-primary)" />
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--gold-light)',
            }}
          >
            The Private Salon Journal
          </span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '34px',
            fontWeight: 400,
            color: 'var(--text-main)',
            marginBottom: '12px',
            letterSpacing: '0.02em',
          }}
        >
          Receive Private Invitations &amp; Lookbook Previews
        </h2>

        <p
          style={{
            fontSize: '14px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          Join our bespoke clientele to receive advance previews of seasonal bridal collections,
          invitations to private trunk shows, and consultations with our atelier craftsmen.
        </p>

        {isSubscribed ? (
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--text-main)',
              fontSize: '14px',
            }}
          >
            <Check size={18} color="#10b981" />
            <span>Thank you. Your personal invitation has been dispatched.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '380px' }}>
              <Mail
                size={16}
                color="var(--gold-muted)"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="email"
                placeholder="Enter your personal email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(13, 13, 17, 0.8)',
                  border: error ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <Button variant="primary" type="submit" style={{ padding: '12px 24px' }}>
              Join Private Salon
            </Button>
          </form>
        )}

        {error && (
          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{error}</p>
        )}
      </div>
    </section>
  );
}
