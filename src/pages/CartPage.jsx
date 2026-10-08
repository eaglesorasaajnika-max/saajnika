import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { formatINR } from '../utils/formatters';
import { Trash2, Heart, Tag, ArrowRight, ShieldCheck, ShoppingBag, Plus, Minus } from 'lucide-react';
import Button from '../components/Button';
import EmptyState from '../components/common/EmptyState';
import OrderSummaryCard from '../components/checkout/OrderSummaryCard';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const { toggleWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    setIsApplying(true);
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err) {
      setCouponError(err.message || 'Invalid promotional voucher.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleMoveToWishlist = async (item) => {
    toggleWishlist(item.product);
    await removeItem(item.id, item.product.title);
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: '800px', margin: '48px auto', padding: '0 24px' }}>
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag Is Empty"
          message="Your private shopping bag holds no reserved garments. Indulge in our current haute-couture collections."
          actionLabel="Explore Haute Couture"
          onAction={() => navigate('/catalog')}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '36px 24px 80px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '34px',
          color: 'var(--text-main)',
          marginBottom: '28px',
          letterSpacing: '0.02em',
        }}
      >
        Private Shopping Bag ({cart.item_count} {cart.item_count === 1 ? 'Garment' : 'Garments'})
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'start',
        }}
      >
        {/* Left: Cart Line Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* White-Glove Shipping Progress */}
          <div
            className="glass-panel"
            style={{
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>
                {cart.subtotal >= cart.shipping_threshold
                  ? '✨ Qualified for Complimentary White-Glove Insured Delivery'
                  : `Add ${formatINR(cart.shipping_threshold - cart.subtotal)} more for Complimentary Delivery`}
              </span>
              <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>
                {cart.free_shipping_progress}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${cart.free_shipping_progress}%`,
                  height: '100%',
                  background: 'var(--gold-btn-gradient)',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>

          {/* Item Rows */}
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              <img
                src={item.product?.primary_image?.url}
                alt={item.product?.title}
                style={{
                  width: '110px',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  backgroundColor: '#111',
                }}
              />

              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-main)' }}>
                      {item.product?.title}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id, item.product?.title)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                      title="Remove from bag"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Variant: <strong style={{ color: 'var(--text-secondary)' }}>{item.variant?.size}</strong>
                    {item.variant?.color && ` • Color: ${item.variant.color}`}
                  </p>

                  <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--gold-primary)', marginTop: '8px' }}>
                    {formatINR(item.unit_price)}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                    paddingTop: '12px',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  {/* Stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: item.quantity <= 1 ? 'var(--text-dim)' : 'var(--text-main)',
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Minus size={13} />
                    </button>
                    <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      disabled={item.quantity >= (item.available_stock || 10)}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-main)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Move to Wishlist */}
                  <button
                    onClick={() => handleMoveToWishlist(item)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold-light)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Heart size={14} /> Move to Private Salon
                  </button>

                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {formatINR(item.unit_price * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Voucher Input & Order Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Coupon Box */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <h4 style={{ fontSize: '14px', color: 'var(--gold-light)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={15} /> Apply Privilege Voucher
            </h4>

            {cart.applied_coupon ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#10b981', fontSize: '13px' }}>
                    {cart.applied_coupon.code}
                  </span>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {cart.applied_coupon.description}
                  </p>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter code (e.g. SAAJNIKA10)"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCouponError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(10, 10, 14, 0.8)',
                    border: couponError ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                  }}
                />
                <Button variant="secondary" type="submit" disabled={isApplying} style={{ padding: '10px 16px', fontSize: '12px' }}>
                  Apply
                </Button>
              </form>
            )}

            {couponError && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{couponError}</p>
            )}
          </div>

          {/* Summary Card */}
          <OrderSummaryCard cart={cart} />

          {/* Proceed CTA */}
          <Button
            variant="primary"
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', padding: '16px', fontSize: '15px', gap: '8px' }}
          >
            Proceed to Private Checkout <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
