import React, { useState } from 'react';
import Modal from '../common/Modal';
import OtpLoginForm from './OtpLoginForm';
import PasswordLoginForm from './PasswordLoginForm';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('otp'); // 'otp' | 'password'
  const { loginPassword, requestOtp, verifyOtp } = useAuth();
  const { showSuccess, showError } = useNotification();

  const handleSuccess = (data) => {
    showSuccess(`Welcome back, ${data?.user?.first_name || 'Client'}!`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', gap: '8px' }}>
        <button
          onClick={() => setMode('otp')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: mode === 'otp' ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.04)',
            color: mode === 'otp' ? '#08080a' : 'var(--text-muted)',
            fontWeight: mode === 'otp' ? 600 : 400,
            fontSize: '12px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Passwordless OTP
        </button>

        <button
          onClick={() => setMode('password')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: mode === 'password' ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.04)',
            color: mode === 'password' ? '#08080a' : 'var(--text-muted)',
            fontWeight: mode === 'password' ? 600 : 400,
            fontSize: '12px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Password / Admin
        </button>
      </div>

      {mode === 'otp' ? (
        <OtpLoginForm
          onRequestOtp={requestOtp}
          onVerifyOtp={verifyOtp}
          onSuccess={handleSuccess}
        />
      ) : (
        <PasswordLoginForm
          onLogin={loginPassword}
          onSuccess={handleSuccess}
        />
      )}
    </Modal>
  );
}
