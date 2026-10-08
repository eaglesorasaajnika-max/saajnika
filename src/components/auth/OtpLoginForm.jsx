import React, { useState, useEffect } from 'react';
import { Smartphone, Mail, KeyRound, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import Button from '../Button';
import Spinner from '../common/Spinner';

export default function OtpLoginForm({
  onRequestOtp,
  onVerifyOtp,
  onSuccess,
}) {
  const [step, setStep] = useState('REQUEST'); // 'REQUEST' | 'VERIFY'
  const [identifier, setIdentifier] = useState('kavya.singhania@example.com');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide an email or 10-digit mobile number.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await onRequestOtp(identifier.trim());
      setStep('VERIFY');
      setCountdown(res?.expires_in_seconds || 60);
      if (res?.demo_hint) {
        setHint(`Demo verification code: ${res.demo_hint}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const data = await onVerifyOtp(identifier.trim(), otpCode.trim());
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message || 'Verification failed. Code may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Sparkles size={24} color="var(--gold-primary)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px' }}>
          {step === 'REQUEST' ? 'Private Salon Access' : 'Verify Identity'}
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          {step === 'REQUEST'
            ? 'Sign in password-free using your authenticated email or mobile.'
            : `Enter the 6-digit code dispatched to ${identifier}`}
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '18px',
          }}
        >
          {error}
        </div>
      )}

      {hint && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: 'var(--gold-light)',
            fontSize: '12px',
            marginBottom: '18px',
            textAlign: 'center',
          }}
        >
          {hint}
        </div>
      )}

      {step === 'REQUEST' ? (
        <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Email or Mobile Number
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                color="var(--gold-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="kavya.singhania@example.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(12, 12, 16, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          <Button variant="primary" type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px' }}>
            {isLoading ? <Spinner size={18} label="" /> : <>Request Salon OTP <ArrowRight size={15} style={{ marginLeft: '6px' }} /></>}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              6-Digit Verification Code
            </label>
            <div style={{ position: 'relative' }}>
              <KeyRound
                size={16}
                color="var(--gold-muted)"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                required
                maxLength="6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(12, 12, 16, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '18px',
                  letterSpacing: '0.2em',
                  textAlign: 'center',
                }}
              />
            </div>
          </div>

          <Button variant="primary" type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px' }}>
            {isLoading ? <Spinner size={18} label="" /> : 'Authenticate & Enter Atelier'}
          </Button>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
              fontSize: '13px',
            }}
          >
            <button
              type="button"
              onClick={() => { setStep('REQUEST'); setOtpCode(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Change Contact
            </button>

            {countdown > 0 ? (
              <span style={{ color: 'var(--gold-light)', fontFamily: 'monospace' }}>
                Resend in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestOtp}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={13} /> Resend Code
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
