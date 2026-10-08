import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShoppingBag, Eye, CheckCircle2, Heart } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function QuickViewModal({
  product,
  onClose,
  onOpenFullDetail = () => {},
  onAddToCart = () => {},
  isWishlisted = false,
  onToggleWishlist = () => {},
}) {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (!product) return;
    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/catalog/products/${product.slug}/`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDetail(data);
            if (data.variants && data.variants.length > 0) {
              setSelectedVariant(data.variants[0]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load quick view data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDetail();
    return () => { isMounted = false; };
  }, [product]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const formatPrice = (val) => {
    if (!val) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAdd = () => {
    if (!selectedVariant) return;
    onAddToCart(detail || product, selectedVariant);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1060,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '780px',
          width: '100%',
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-active)',
          borderRadius: '16px',
          padding: '32px',
          position: 'relative',
          boxShadow: 'var(--shadow-modal)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Actions */}
        <div style={{ position: 'absolute', top: '18px', right: '18px', display: 'flex', gap: '8px', zIndex: 10 }}>
          <button
            onClick={() => onToggleWishlist(product.id)}
            style={{
              background: isWishlisted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: isWishlisted ? '1px solid rgba(239, 68, 68, 0.5)' : 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isWishlisted ? '#ef4444' : '#fff',
              transition: 'all 0.2s ease',
            }}
            title={isWishlisted ? "Remove from Private Curation" : "Save to Private Curation"}
          >
            <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
            }}
            title="Close Quick View"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
          
          {/* Garment Image Showcase */}
          <div style={{
            height: '380px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#111116',
            position: 'relative',
          }}>
            <img
              src={detail?.media?.[0]?.url || product.primary_image?.url}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <Badge variant="gold" size="sm">Quick View</Badge>
            </div>
          </div>

          {/* Garment Specs & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.76rem', color: 'var(--gold-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                {product.category?.name || 'Couture'}
              </span>

              <h3 className="font-serif" style={{ fontSize: '1.6rem', color: 'var(--gold-light)', margin: '4px 0 8px', lineHeight: 1.2 }}>
                {product.title}
              </h3>

              <p className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 600, marginBottom: '12px' }}>
                {formatPrice(selectedVariant?.effective_price || product.base_price)}
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '14px' }}>
                {detail?.fabric_details || '100% Pure Handwoven Mulberry Silk with real gold electroplated zari.'}
              </p>

              {/* Variant Selector */}
              {detail?.variants && detail.variants.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                    Select Size & Color:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {detail.variants.map((v) => {
                      const isSel = selectedVariant?.id === v.id;
                      const inStock = v.inventory?.available_stock > 0;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: isSel ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.15)',
                            background: isSel ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.3)',
                            color: '#fff',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: v.color_hex, display: 'inline-block' }} />
                          <span>{v.color_name} ({v.size})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Button
                variant="primary"
                icon={ShoppingBag}
                onClick={handleAdd}
                style={{ width: '100%' }}
              >
                {addedSuccess ? 'Reserved in Bag!' : 'Add to Couture Bag'}
              </Button>

              <Button
                variant="outline"
                icon={Eye}
                onClick={() => {
                  onClose();
                  onOpenFullDetail(product);
                }}
                style={{ width: '100%' }}
              >
                Full Artisan Details & Boutique Availability
              </Button>

              {addedSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#34d399', fontSize: '0.8rem' }}>
                  <CheckCircle2 size={14} />
                  <span>Garment reserved in bag.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
