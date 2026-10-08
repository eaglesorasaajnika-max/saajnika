import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Truck, 
  Tag, 
  Check, 
  AlertCircle,
  Eye,
  ShieldCheck,
  Percent
} from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = null,
  loading = false,
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onClearCart = () => {},
  onApplyCoupon = () => {},
  onRemoveCoupon = () => {},
  onInspectGarment = () => {},
  onProceedToCheckout = () => {},
  onOpenAuth = () => {},
  isLoggedIn = false,
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [couponSuccess, setCouponSuccess] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = cart?.items || [];
  const subtotal = parseFloat(cart?.subtotal || 0);
  const discountAmount = parseFloat(cart?.discount_amount || 0);
  const taxAmount = parseFloat(cart?.tax_amount || 0);
  const shippingFee = parseFloat(cart?.shipping_fee || 0);
  const finalTotal = parseFloat(cart?.final_total || 0);
  const freeShippingThreshold = parseFloat(cart?.free_shipping_threshold || 10000);
  const freeShippingAchieved = cart?.free_shipping_achieved || false;
  const amountNeededForFreeShipping = parseFloat(cart?.amount_needed_for_free_shipping || 0);
  const hasStockIssues = cart?.has_stock_issues || false;

  const shippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await onApplyCoupon(couponCode.trim());
      if (res?.error) {
        setCouponError(res.error);
      } else {
        setCouponSuccess(`Code '${couponCode.trim().toUpperCase()}' applied!`);
        setCouponCode('');
      }
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleQuickCoupon = async (code) => {
    setCouponCode(code);
    setCouponLoading(true);
    setCouponError(null);
    setCouponSuccess(null);

    try {
      const res = await onApplyCoupon(code);
      if (res?.error) {
        setCouponError(res.error);
      } else {
        setCouponSuccess(`Code '${code}' applied!`);
        setCouponCode('');
      }
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'flex-end',
        animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          height: '100%',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '22px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.06) 0%, transparent 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={20} color="var(--gold-light)" />
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  letterSpacing: '0.04em',
                  color: 'var(--gold-light)',
                  margin: 0,
                }}
              >
                Couture Shopping Bag
              </h2>
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                margin: '4px 0 0 0',
                letterSpacing: '0.02em',
              }}
            >
              {cart?.total_items || 0} {cart?.total_items === 1 ? 'Garment Unit' : 'Garment Units'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {items.length > 0 && (
              <button
                onClick={onClearCart}
                className="luxury-btn-ghost"
                style={{
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
                title="Empty shopping bag"
              >
                Empty Bag
              </button>
            )}

            <button
              onClick={onClose}
              className="luxury-btn-ghost"
              style={{
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Close Bag (Esc)"
            >
              <X size={20} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        {/* Free Shipping Meter */}
        {items.length > 0 && (
          <div
            style={{
              padding: '12px 28px',
              backgroundColor: 'rgba(212, 175, 55, 0.05)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                marginBottom: '6px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)' }}>
                <Truck size={14} />
                {freeShippingAchieved ? (
                  <strong>Complimentary White-Glove Courier Delivery Unlocked</strong>
                ) : (
                  <span>
                    Add <strong>{formatINR(amountNeededForFreeShipping)}</strong> more for Complimentary Delivery
                  </span>
                )}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                {shippingProgress}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${shippingProgress}%`,
                  height: '100%',
                  backgroundColor: freeShippingAchieved ? '#10b981' : 'var(--gold)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
          }}
        >
          {loading ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  border: '2px solid rgba(212, 175, 55, 0.2)',
                  borderTopColor: 'var(--gold)',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Synchronizing your couture bag...
              </p>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'var(--gold)',
                }}
              >
                <ShoppingBag size={34} strokeWidth={1.5} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  color: 'var(--text-primary)',
                  marginBottom: '10px',
                  fontWeight: 500,
                }}
              >
                Your Couture Bag is Empty
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.6',
                  maxWidth: '320px',
                  marginBottom: '28px',
                }}
              >
                Explore our handwoven Banarasi weaves, zardozi lehengas, and couture bridal heirlooms to begin your order.
              </p>

              <Button
                variant="primary"
                onClick={onClose}
                style={{
                  padding: '12px 28px',
                  fontSize: '0.85rem',
                  letterSpacing: '0.08em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>DISCOVER COUTURE HEIRLOOMS</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            /* Garment Item Cards */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item) => {
                const isOutOfStock = !item.is_in_stock || item.available_stock <= 0;
                const isMaxStock = item.quantity >= item.available_stock;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: isOutOfStock
                        ? 'rgba(239, 68, 68, 0.05)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isOutOfStock
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      position: 'relative',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '90px',
                        height: '120px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#121216',
                        position: 'relative',
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                      onClick={() => onInspectGarment({ id: item.product_id, slug: item.product_slug, title: item.product_title })}
                      title="Inspect Garment"
                    >
                      <img
                        src={item.primary_image_url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                        alt={item.product_title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          {item.category_name && (
                            <span
                              style={{
                                fontSize: '0.68rem',
                                color: 'var(--gold-light)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '2px',
                              }}
                            >
                              {item.category_name}
                            </span>
                          )}
                          <h4
                            onClick={() => onInspectGarment({ id: item.product_id, slug: item.product_slug, title: item.product_title })}
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '0.98rem',
                              color: 'var(--text-primary)',
                              margin: '0 0 4px 0',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '220px',
                            }}
                            title={item.product_title}
                          >
                            {item.product_title}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <span>Size: <strong style={{ color: 'var(--text-secondary)' }}>{item.size_display || item.size}</strong></span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color_hex }} />
                              {item.color_name}
                            </span>
                          </div>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '4px',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                          title="Remove from bag"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Stock Warning if applicable */}
                      {item.stock_warning && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '0.72rem', margin: '6px 0' }}>
                          <AlertCircle size={12} />
                          <span>{item.stock_warning}</span>
                        </div>
                      )}

                      {/* Price & Quantity Stepper Row */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 'auto',
                          paddingTop: '10px',
                        }}
                      >
                        {/* Stepper */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '4px',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={{
                              padding: '5px 8px',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>

                          <span
                            style={{
                              padding: '0 8px',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              minWidth: '24px',
                              textAlign: 'center',
                            }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isMaxStock}
                            style={{
                              padding: '5px 8px',
                              background: 'transparent',
                              border: 'none',
                              color: isMaxStock ? 'var(--text-dim)' : 'var(--text-secondary)',
                              cursor: isMaxStock ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title={isMaxStock ? 'Max available stock reached' : 'Increase quantity'}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: 'right' }}>
                          <span
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: 600,
                              fontFamily: 'var(--font-serif)',
                              color: 'var(--gold-light)',
                            }}
                          >
                            {formatINR(parseFloat(item.line_total))}
                          </span>
                          {item.quantity > 1 && (
                            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                              ({formatINR(parseFloat(item.unit_price))} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Promotional Voucher Accordion / Input */}
              <div
                style={{
                  marginTop: '12px',
                  padding: '16px',
                  backgroundColor: 'rgba(212, 175, 55, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                }}
              >
                {cart?.coupon ? (
                  /* Applied Coupon Banner */
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} color="#10b981" />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: '#10b981',
                              letterSpacing: '0.05em',
                            }}
                          >
                            {cart.coupon.code}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            ({cart.coupon.description})
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 500 }}>
                          -{formatINR(discountAmount)} applied
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={onRemoveCoupon}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  /* Coupon Input Form */
                  <form onSubmit={handleApplyCoupon}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        placeholder="Promotional code (e.g. ROYAL10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.4)',
                          border: couponError ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          color: '#fff',
                          outline: 'none',
                          letterSpacing: '0.05em',
                        }}
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponCode.trim()}
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--gold)',
                          color: '#0a0a0e',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: couponLoading || !couponCode.trim() ? 'not-allowed' : 'pointer',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {couponLoading ? '...' : 'APPLY'}
                      </button>
                    </div>

                    {/* Quick suggestion tags */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Try:</span>
                      <button
                        type="button"
                        onClick={() => handleQuickCoupon('ROYAL10')}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.68rem',
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          border: '1px dashed var(--gold)',
                          borderRadius: '3px',
                          color: 'var(--gold-light)',
                          cursor: 'pointer',
                        }}
                      >
                        ROYAL10 (10% Off)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickCoupon('WELCOME1000')}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.68rem',
                          backgroundColor: 'rgba(212, 175, 55, 0.1)',
                          border: '1px dashed var(--gold)',
                          borderRadius: '3px',
                          color: 'var(--gold-light)',
                          cursor: 'pointer',
                        }}
                      >
                        WELCOME1000 (₹1,000 Off)
                      </button>
                    </div>

                    {couponError && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.72rem', color: '#ef4444' }}>
                        {couponError}
                      </p>
                    )}
                    {couponSuccess && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '0.72rem', color: '#10b981' }}>
                        {couponSuccess}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Authoritative Calculations & Checkout */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 28px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(10, 10, 14, 0.95)',
            }}
          >
            {/* Calculation rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>Subtotal (Garments)</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatINR(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#10b981' }}>
                  <span>Promotional Discount ({cart?.coupon?.code})</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>Luxury Apparel GST ({cart?.tax_rate_percent || 12}%)</span>
                <span style={{ color: 'var(--text-primary)' }}>{formatINR(taxAmount)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>White-Glove Courier Delivery</span>
                <span style={{ color: shippingFee === 0 ? '#10b981' : 'var(--text-primary)' }}>
                  {shippingFee === 0 ? 'COMPLIMENTARY' : formatINR(shippingFee)}
                </span>
              </div>

              <div
                style={{
                  height: '1px',
                  backgroundColor: 'var(--border-subtle)',
                  margin: '4px 0',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.88rem', letterSpacing: '0.04em', color: 'var(--text-primary)', fontWeight: 600 }}>
                  TOTAL PAYABLE
                </span>
                <span
                  style={{
                    fontSize: '1.35rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--gold-light)',
                    fontWeight: 600,
                  }}
                >
                  {formatINR(finalTotal)}
                </span>
              </div>
            </div>

            {/* Warning if stock issues exist */}
            {hasStockIssues && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#ef4444',
                  fontSize: '0.78rem',
                  marginBottom: '12px',
                }}
              >
                <AlertCircle size={16} />
                <span>One or more garments exceed atelier stock. Please adjust quantities to proceed.</span>
              </div>
            )}

            {/* Checkout Action */}
            <Button
              variant="primary"
              disabled={hasStockIssues}
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Lock size={15} />
              <span>PROCEED TO SECURE CHECKOUT</span>
              <ArrowRight size={15} />
            </Button>

            {!isLoggedIn && (
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  marginTop: '10px',
                  marginBottom: 0,
                }}
              >
                Guest checkout enabled. Or{' '}
                <button
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--gold)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                  }}
                >
                  Sign in
                </button>{' '}
                to access saved addresses & salon points.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
