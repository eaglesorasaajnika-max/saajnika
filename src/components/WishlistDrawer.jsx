import React, { useState, useEffect } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Check, 
  AlertCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds = [],
  onToggleWishlist,
  onClearWishlist,
  onAddToCart,
  onInspectGarment,
  isLoggedIn = false,
  onOpenAuth,
  tokens = null,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState({}); // { [productId]: variantId }
  const [addedFeedback, setAddedFeedback] = useState({}); // { [productId]: true }

  // Fetch or preview wishlist items when drawer opens or wishlistIds change
  useEffect(() => {
    if (!isOpen) return;

    if (wishlistIds.length === 0) {
      setItems([]);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const fetchWishlist = async () => {
      try {
        if (isLoggedIn && tokens?.access) {
          // Fetch authenticated wishlist
          const res = await fetch('/api/wishlist/', {
            headers: {
              'Authorization': `Bearer ${tokens.access}`,
              'Content-Type': 'application/json',
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (isMounted) {
              const formattedItems = (data.results || []).map(r => r.product);
              setItems(formattedItems);
              initSelectedVariants(formattedItems);
            }
            return;
          }
        }

        // Fallback or Guest preview
        const res = await fetch('/api/wishlist/guest-preview/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_ids: wishlistIds }),
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setItems(data.results || []);
            initSelectedVariants(data.results || []);
          }
        }
      } catch (err) {
        console.error('Failed to load wishlist items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchWishlist();

    return () => {
      isMounted = false;
    };
  }, [isOpen, wishlistIds, isLoggedIn, tokens]);

  // Set default selected variant (first in-stock variant, or first active)
  const initSelectedVariants = (garments) => {
    const initial = {};
    garments.forEach(prod => {
      if (prod.variants && prod.variants.length > 0) {
        const inStock = prod.variants.find(v => v.is_in_stock);
        initial[prod.id] = inStock ? inStock.id : prod.variants[0].id;
      }
    });
    setSelectedVariants(prev => ({ ...initial, ...prev }));
  };

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

  const handleSelectSize = (productId, variantId) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId,
    }));
  };

  const handleMoveToBag = (product) => {
    const variantId = selectedVariants[product.id];
    const variant = product.variants?.find(v => v.id === variantId) || product.variants?.[0] || null;

    if (onAddToCart) {
      onAddToCart(product, variant);
    }

    setAddedFeedback(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleMoveAllToBag = () => {
    items.forEach(product => {
      const variantId = selectedVariants[product.id];
      const variant = product.variants?.find(v => v.id === variantId) || product.variants?.[0] || null;
      if (variant && variant.is_in_stock && onAddToCart) {
        onAddToCart(product, variant);
      }
    });

    const allAdded = {};
    items.forEach(p => { allAdded[p.id] = true; });
    setAddedFeedback(allAdded);
    setTimeout(() => setAddedFeedback({}), 2200);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.base_price || 0), 0);
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
        backgroundColor: 'rgba(5, 5, 8, 0.75)',
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
          maxWidth: '480px',
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
            padding: '24px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={20} color="var(--gold-light)" fill="var(--gold-light)" />
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.45rem',
                  letterSpacing: '0.04em',
                  color: 'var(--gold-light)',
                  margin: 0,
                }}
              >
                Private Curation
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
              {wishlistIds.length} {wishlistIds.length === 1 ? 'Garment Saved' : 'Garments Saved'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {wishlistIds.length > 0 && (
              <button
                onClick={onClearWishlist}
                className="luxury-btn-ghost"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                title="Clear all saved curations"
              >
                <Trash2 size={13} />
                <span>Clear All</span>
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
              title="Close curation drawer (Esc)"
            >
              <X size={20} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        {/* Guest Banner if not logged in */}
        {!isLoggedIn && wishlistIds.length > 0 && (
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(212, 175, 55, 0.08)',
              borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold-light)' }}>
              <ShieldCheck size={16} />
              <span>Saved locally. Sign in to synchronize.</span>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onOpenAuth) onOpenAuth();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gold)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
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
            <div style={{ padding: '60px 0', textAlign: 'center' }}>
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
                Retrieving your atelier curations...
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
                <Heart size={34} strokeWidth={1.5} />
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
                Your Personal Salon is Empty
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
                Explore our handwoven Banarasi weaves, zardozi lehengas, and couture bridal heirlooms to curate your private selection.
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
                <span>EXPLORE COUTURE COLLECTION</span>
                <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            /* Curated Garment Cards */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((product) => {
                const selectedVariantId = selectedVariants[product.id];
                const activeVariant = product.variants?.find(v => v.id === selectedVariantId) || product.variants?.[0];
                const isItemInStock = activeVariant?.is_in_stock ?? product.is_in_stock;
                const isAdded = addedFeedback[product.id];

                return (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      padding: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      position: 'relative',
                      transition: 'border-color 0.2s ease',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '100px',
                        height: '135px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#121216',
                        position: 'relative',
                        flexShrink: 0,
                        cursor: 'pointer',
                      }}
                      onClick={() => onInspectGarment && onInspectGarment(product)}
                      title="Inspect Garment"
                    >
                      <img
                        src={product.primary_image?.url || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '4px',
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '0.65rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Eye size={10} /> Inspect
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div>
                          {product.category?.name && (
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--gold-light)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'block',
                                marginBottom: '2px',
                              }}
                            >
                              {product.category.name}
                            </span>
                          )}
                          <h4
                            onClick={() => onInspectGarment && onInspectGarment(product)}
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1rem',
                              color: 'var(--text-primary)',
                              margin: '0 0 6px 0',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '220px',
                            }}
                            title={product.title}
                          >
                            {product.title}
                          </h4>
                        </div>

                        {/* Remove Action */}
                        <button
                          onClick={() => onToggleWishlist(product.id)}
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
                          title="Remove from private curation"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                        <span
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: 'var(--gold-light)',
                          }}
                        >
                          ₹{parseInt(activeVariant?.effective_price || product.base_price, 10).toLocaleString('en-IN')}
                        </span>

                        {isItemInStock ? (
                          <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                            In Stock
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#f59e0b' }}>
                            Made to Order
                          </span>
                        )}
                      </div>

                      {/* Size Variant Selector */}
                      {product.variants && product.variants.length > 1 && (
                        <div style={{ marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                            Select Size:
                          </span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {product.variants.map((v) => {
                              const isSelected = selectedVariantId === v.id;
                              return (
                                <button
                                  key={v.id}
                                  onClick={() => handleSelectSize(product.id, v.id)}
                                  style={{
                                    padding: '2px 8px',
                                    fontSize: '0.68rem',
                                    borderRadius: '3px',
                                    border: isSelected
                                      ? '1px solid var(--gold)'
                                      : '1px solid var(--border-subtle)',
                                    backgroundColor: isSelected
                                      ? 'rgba(212, 175, 55, 0.15)'
                                      : 'transparent',
                                    color: isSelected ? 'var(--gold-light)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  {v.size_display || v.size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Bottom Button Actions */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                        <button
                          onClick={() => handleMoveToBag(product)}
                          disabled={!isItemInStock}
                          className="luxury-btn"
                          style={{
                            flex: 1,
                            padding: '7px 12px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            borderRadius: '4px',
                            backgroundColor: isAdded
                              ? '#10b981'
                              : isItemInStock
                              ? 'var(--gold)'
                              : 'rgba(255, 255, 255, 0.08)',
                            color: isItemInStock ? '#0a0a0e' : 'var(--text-muted)',
                            cursor: isItemInStock ? 'pointer' : 'not-allowed',
                            fontWeight: 600,
                            letterSpacing: '0.04em',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {isAdded ? (
                            <>
                              <Check size={14} />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={13} />
                              <span>{isItemInStock ? 'Move to Bag' : 'Out of Stock'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Totals and Mass Actions */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 28px',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(10, 10, 14, 0.95)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                CURATION VALUE
              </span>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                }}
              >
                ₹{parseInt(calculateSubtotal(), 10).toLocaleString('en-IN')}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="primary"
                onClick={handleMoveAllToBag}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <ShoppingBag size={15} />
                <span>MOVE ALL AVAILABLE TO BAG</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
