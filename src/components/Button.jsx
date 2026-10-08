import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'outline' | 'ghost' | 'glass'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon = null,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  className = '',
  ...props
}) {
  const getVariantClass = () => {
    switch (variant) {
      case 'outline':
        return 'luxury-btn-outline';
      case 'ghost':
        return 'luxury-btn-ghost';
      case 'primary':
      default:
        return 'luxury-btn';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 14px', fontSize: '0.8rem' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '1rem' };
      case 'md':
      default:
        return {};
    }
  };

  return (
    <button
      type={type}
      className={`${getVariantClass()} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...getSizeStyles(), ...style }}
      {...props}
    >
      {loading ? (
        <RefreshCw size={size === 'sm' ? 12 : 16} className="animate-spin" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : 18} />
      )}
      {children}
    </button>
  );
}
