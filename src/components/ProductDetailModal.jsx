import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Store, 
  RefreshCw, 
  MapPin, 
  Check, 
  ShoppingBag, 
  Info, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

export default function ProductDetailModal({
  productSummary,
  onClose,
  onAddToCart = () => {},
}) {
  const [detail, setDetail] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (!productSummary) return;

    let isMounted = true;
    const fetchFullData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Product Detail
        const detailRes = await fetch(`/api/catalog/products/${productSummary.slug}/`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          if (isMounted) {
            setDetail(detailData);
            if (detailData.variants && detailData.variants.length > 0) {
              setSelectedVariant(detailData.variants[0]);
            }
            if (detailData.media && detailData.media.length > 0) {
              setSelectedMediaUrl(detailData.media[0].url);
            } else if (productSummary.primary_image) {
              setSelectedMediaUrl(productSummary.primary_image.url);
            }
          }
        }

        // 2. Fetch Omnichannel Stock Availability
        const availRes = await fetch(`/api/catalog/products/${productSummary.slug}/availability/`);
        if (availRes.ok) {
          const availData = await availRes.json();
          if (isMounted) {
            setAvailability(availData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch garment details', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFullData();
    return () => { isMounted = false; };
  }, [productSummary]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    onAddToCart(detail || productSummary, selectedVariant);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  if (!productSummary) return null;

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
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.25s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '36px',
          position: 'relative',
          border: '1px solid var(--border-active)',
          boxShadow: 'var(--shadow-modal)',
          backgroundColor: 'var(--bg-modal)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gold-primary)' }}>
            <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 16px' }} />
            <p style={{ letterSpacing: '0.05em' }}>Loading garment artisan specifications & boutique inventory...</p>
          </div>
        ) : detail ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '36px' }}>
            
            {/* Gallery Column */}
            <div>
              <div style={{
                width: '100%',
                height: '480px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#111116',
                border: '1px solid var(--border-subtle)',
              }}>
                <img
                  src={selectedMediaUrl || detail.media?.[0]?.url || productSummary.primary_image?.url}
                  alt={detail.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {detail.media && detail.media.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {detail.media.map((m, idx) => {
                    const isSelected = selectedMediaUrl === m.url;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedMediaUrl(m.url)}
                        style={{
                          width: '76px',
                          height: '76px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          flexShrink: 0,
                          opacity: isSelected ? 1 : 0.65,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <img src={m.url} alt={m.alt_text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Information & Configuration Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>
                  {detail.category?.name}
                </span>
                
                <h2 className="font-serif" style={{ fontSize: '2.2rem', color: 'var(--gold-light)', margin: '6px 0 10px', lineHeight: 1.2 }}>
                  {detail.title}
                </h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span className="font-serif" style={{ fontSize: '1.7rem', color: '#fff', fontWeight: 600 }}>
                    {formatPrice(selectedVariant?.effective_price || detail.base_price)}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    (Includes all taxes & white-glove delivery)
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {detail.description}
              </p>

              {/* Craftsmanship Accordion / Panel */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.86rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <h4 style={{ fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Heritage & Artisan Craftsmanship
                </h4>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Fabric Details: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{detail.fabric_details || '100% Pure Mulberry Silk'}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Care Guide: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{detail.care_instructions || 'Strictly dry clean only.'}</span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-main)' }}>Fit & Measurements: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{detail.fit_and_sizing_guide || 'Standard couture sizing. Tailored blouse piece included.'}</span>
                </div>
              </div>

              {/* Variant Selector */}
              {detail.variants && detail.variants.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 600 }}>
                    Select Color & Size Variant:
                  </h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {detail.variants.map((v) => {
                      const isSel = selectedVariant?.id === v.id;
                      const inStock = v.inventory?.available_stock > 0;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: isSel ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                            background: isSel ? 'rgba(212, 175, 55, 0.18)' : 'rgba(0, 0, 0, 0.4)',
                            color: '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <span style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: v.color_hex, display: 'inline-block', border: '1px solid #fff' }} />
                          <span>{v.color_name} ({v.size})</span>
                          <span style={{ fontSize: '0.72rem', color: inStock ? '#10b981' : '#ef4444' }}>
                            [{inStock ? `${v.inventory.available_stock} in stock` : 'Made-to-order'}]
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Omnichannel Boutique Stock Presence */}
              {availability && (
                <div style={{
                  background: 'rgba(212, 175, 55, 0.05)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Store size={18} color="var(--gold-primary)" />
                    <h4 style={{ fontSize: '0.82rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                      Flagship Boutique Availability (Click-and-Collect)
                    </h4>
                  </div>

                  {(() => {
                    const curAvail = availability.variants?.find((v) => v.sku === selectedVariant?.sku) || availability.variants?.[0];
                    if (!curAvail || !curAvail.store_availability?.length) {
                      return <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Warehouse dispatch only. In-store fittings available via concierge request.</p>;
                    }
                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                        {curAvail.store_availability.map((sa, idx) => (
                          <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>{sa.city}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sa.store_name}</p>
                            <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>● {sa.quantity} available in-store</p>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Add to Bag Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={ShoppingBag}
                  onClick={handleAdd}
                  style={{ width: '100%' }}
                >
                  {addedSuccess ? 'Reserved in Couture Bag!' : 'Add to Couture Bag'}
                </Button>

                {addedSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.85rem', justifyContent: 'center' }}>
                    <CheckCircle2 size={16} />
                    <span>Garment variant SKU {selectedVariant?.sku} added to bag.</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        ) : null}

      </div>
    </div>
  );
}
