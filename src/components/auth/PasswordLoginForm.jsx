import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../Button';
import Spinner from '../common/Spinner';

export default function PasswordLoginForm({ onLogin, onSuccess }) {
  const [email, setEmail] = useState('kavya.singhania@example.com');
  const [password, setPassword] = useState('KavyaPassword123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await onLogin(email.trim(), password);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setError(err.message || 'Authentication rejected. Verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            fontSize: '13px',
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
          Registered Email
        </label>
        <div style={{ position: 'relative' }}>
          <Mail
            size={16}
            color="var(--gold-muted)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

      <div>
        <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
          Password / Admin Passkey
        </label>
        <div style={{ position: 'relative' }}>
          <Lock
            size={16}
            color="var(--gold-muted)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      <Button variant="primary" type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', marginTop: '6px' }}>
        {isLoading ? <Spinner size={18} label="" /> : <>Sign In with Password <ArrowRight size={15} style={{ marginLeft: '6px' }} /></>}
      </Button>

      <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-dim)', marginTop: '8px' }}>
        <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
        SimpleJWT Token authentication with automated refresh rotation
      </div>
    </form>
  );
}
