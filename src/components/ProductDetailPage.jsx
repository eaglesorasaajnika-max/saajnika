import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Gem,
  Shield,
  Clock,
  Truck,
  Heart,
  Share2,
  Ruler,
  Palette,
  Package,
  Award,
  Eye,
} from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

/**
 * Phase 9: Product Detail Page (PDP) & Artisan Craftsmanship Engine
 * 
 * Premium full-screen garment inspection experience with:
 * - Multi-angle media gallery with magnifier loupe
 * - Variant color/size matrix with live stock indicators
 * - Omnichannel boutique availability (click-and-collect)
 * - Artisan provenance & craftsmanship breakdown
 * - Sizing guide & care accordion
 * - Direct bridal concierge SKU link
 */
export default function ProductDetailPage({
  productSummary,
  onClose,
  onAddToCart = () => {},
  onOpenConcierge = () => {},
  isWishlisted = false,
  onToggleWishlist = () => {},
}) {
  const [detail, setDetail] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [activeAccordion, setActiveAccordion] = useState('fabric');
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const imageRef = useRef(null);

  useEffect(() => {
    if (!productSummary) return;
    let isMounted = true;

    const fetchFullData = async () => {
      setLoading(true);
      try {
        const [detailRes, availRes] = await Promise.all([
          fetch(`/api/catalog/products/${productSummary.slug}/`),
          fetch(`/api/catalog/products/${productSummary.slug}/availability/`),
        ]);

        if (detailRes.ok) {
          const detailData = await detailRes.json();
          if (isMounted) {
            setDetail(detailData);
            if (detailData.variants?.length > 0) {
              const firstVariant = detailData.variants[0];
              setSelectedVariant(firstVariant);
              setSelectedColor(firstVariant.color_name);
              setSelectedSize(firstVariant.size);
            }
          }
        }

        if (availRes.ok) {
          const availData = await availRes.json();
          if (isMounted) setAvailability(availData);
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

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigateMedia(-1);
      if (e.key === 'ArrowRight') navigateMedia(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, selectedMediaIndex]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const formatPrice = (val) => {
    if (!val) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const navigateMedia = (direction) => {
    if (!detail?.media?.length) return;
    setSelectedMediaIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return detail.media.length - 1;
      if (next >= detail.media.length) return 0;
      return next;
    });
  };

  const handleZoomMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleAdd = () => {
    if (!selectedVariant) return;
    onAddToCart(detail || productSummary, selectedVariant);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 4000);
  };

  // Derive unique colors and sizes from variants
  const uniqueColors = [];
  const colorSeen = new Set();
  const uniqueSizes = [];
  const sizeSeen = new Set();

  if (detail?.variants) {
    for (const v of detail.variants) {
      if (v.is_active && !colorSeen.has(v.color_name)) {
        colorSeen.add(v.color_name);
        uniqueColors.push({ name: v.color_name, hex: v.color_hex });
      }
      if (v.is_active && !sizeSeen.has(v.size)) {
        sizeSeen.add(v.size);
        uniqueSizes.push(v.size);
      }
    }
  }

  // Find matching variant for current color+size
  const findVariant = (color, size) => {
    return detail?.variants?.find(
      (v) => v.color_name === color && v.size === size && v.is_active
    );
  };

  // When color or size changes, update selected variant
  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    const match = findVariant(colorName, selectedSize);
    if (match) {
      setSelectedVariant(match);
    } else {
      // Find first variant with this color
      const fallback = detail?.variants?.find((v) => v.color_name === colorName && v.is_active);
      if (fallback) {
        setSelectedVariant(fallback);
        setSelectedSize(fallback.size);
      }
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const match = findVariant(selectedColor, size);
    if (match) {
      setSelectedVariant(match);
    }
  };

  // Check if a size is available in current color
  const isSizeAvailableInColor = (size) => {
    return !!findVariant(selectedColor, size);
  };

  // Get stock status for current variant
  const getStockStatus = (variant) => {
    if (!variant?.inventory) return { label: 'Made to Order', color: '#f59e0b', icon: Clock };
    const stock = variant.inventory.available_stock;
    if (stock <= 0) return { label: 'Made to Order', color: '#f59e0b', icon: Clock };
    if (stock <= 3) return { label: `Only ${stock} Left`, color: '#ef4444', icon: AlertCircle };
    if (stock <= variant.inventory.low_stock_threshold) return { label: `${stock} in Stock`, color: '#f59e0b', icon: AlertCircle };
    return { label: 'In Stock', color: '#10b981', icon: CheckCircle2 };
  };

  // Boutique availability for current variant
  const currentBoutiqueAvailability = () => {
    if (!availability?.variants || !selectedVariant) return [];
    const match = availability.variants.find((v) => v.sku === selectedVariant.sku);
    return match?.store_availability || [];
  };

  // Accordion sections
  const accordionSections = [
    { id: 'fabric', title: 'Fabric & Material Heritage', icon: Scissors, content: detail?.fabric_details },
    { id: 'sizing', title: 'Fit & Sizing Guide', icon: Ruler, content: detail?.fit_and_sizing_guide },
    { id: 'care', title: 'Care & Preservation', icon: Shield, content: detail?.care_instructions },
  ];

  // Provenance badges
  const provenanceBadges = [
    { icon: Award, label: 'GI Certified Handloom', sub: 'Geographical Indication Tag' },
    { icon: Gem, label: 'Pure Zari Thread', sub: 'Silver & Gold Electroplated' },
    { icon: Scissors, label: 'Master Artisan Woven', sub: '3rd Generation Karigar' },
    { icon: Package, label: 'White-Glove Delivery', sub: 'Silk-Wrapped Packaging' },
  ];

  if (!productSummary) return null;

  const currentMedia = detail?.media?.[selectedMediaIndex];
  const currentMediaUrl = currentMedia?.url || productSummary.primary_image?.url;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '16px auto',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 0',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '16px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={20} color="var(--gold-primary)" />
            <span className="font-serif" style={{ color: 'var(--gold-light)', fontSize: '1rem' }}>
              Garment Artisan Inspection
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={16} />
              <span>Close</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--gold-primary)', flex: 1 }}>
            <RefreshCw size={40} className="animate-spin" style={{ margin: '0 auto 16px' }} />
            <p className="font-serif" style={{ fontSize: '1.1rem', letterSpacing: '0.05em' }}>
              Loading artisan specifications & boutique inventory...
            </p>
          </div>
        ) : detail ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', flex: 1, paddingBottom: '40px' }}>
            
            {/* LEFT: Multi-Angle Gallery with Zoom */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '16px', alignSelf: 'start' }}>
              
              {/* Main Image with Magnifier Loupe */}
              <div
                ref={imageRef}
                style={{
                  width: '100%',
                  aspectRatio: '3 / 4',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#0a0a0e',
                  border: '1px solid var(--border-subtle)',
                  position: 'relative',
                  cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                }}
                onClick={() => setIsZoomed(!isZoomed)}
                onMouseMove={handleZoomMove}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <img
                  src={currentMediaUrl}
                  alt={currentMedia?.alt_text || detail.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
                    transition: isZoomed ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Zoom Indicator */}
                {!isZoomed && (
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(8, 8, 10, 0.8)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--gold-light)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    <ZoomIn size={14} />
                    <span>Click to Magnify</span>
                  </div>
                )}

                {/* Gallery Nav Arrows */}
                {detail.media?.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateMedia(-1); }}
                      style={{
                        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'rgba(8, 8, 10, 0.7)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateMedia(1); }}
                      style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'rgba(8, 8, 10, 0.7)', backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {detail.media?.length > 1 && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(8, 8, 10, 0.75)', backdropFilter: 'blur(6px)',
                    borderRadius: '6px', padding: '4px 10px',
                    color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}>
                    {selectedMediaIndex + 1} / {detail.media.length}
                  </div>
                )}

                {/* Badges */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {detail.is_new_arrival && <Badge variant="new-arrival" size="sm">New Arrival</Badge>}
                  {detail.is_best_seller && <Badge variant="best-seller" size="sm">Best Seller</Badge>}
                  {detail.is_featured && <Badge variant="gold" size="sm">Curated Pick</Badge>}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {detail.media?.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {detail.media.map((m, idx) => {
                    const isSelected = idx === selectedMediaIndex;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedMediaIndex(idx)}
                        style={{
                          width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden',
                          border: isSelected ? '2px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer', flexShrink: 0,
                          opacity: isSelected ? 1 : 0.55,
                          transition: 'all 0.25s ease',
                          boxShadow: isSelected ? '0 0 12px rgba(212, 175, 55, 0.3)' : 'none',
                        }}
                      >
                        <img src={m.url} alt={m.alt_text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: Garment Info, Variants, Stock & Provenance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Category Eyebrow & Title */}
              <div>
                <span style={{
                  fontSize: '0.78rem', color: 'var(--gold-primary)',
                  letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600,
                }}>
                  {detail.category?.name || 'Haute Couture'}
                </span>

                <h1 className="font-serif" style={{
                  fontSize: '2.4rem', color: 'var(--gold-light)',
                  margin: '8px 0 12px', lineHeight: 1.15,
                }}>
                  {detail.title}
                </h1>

                {/* Price & Stock Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span className="font-serif" style={{ fontSize: '2rem', color: '#fff', fontWeight: 600 }}>
                    {formatPrice(selectedVariant?.effective_price || detail.base_price)}
                  </span>

                  {selectedVariant && (() => {
                    const status = getStockStatus(selectedVariant);
                    const StatusIcon = status.icon;
                    return (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 14px', borderRadius: '20px',
                        background: `${status.color}15`, border: `1px solid ${status.color}40`,
                      }}>
                        <StatusIcon size={14} color={status.color} />
                        <span style={{ fontSize: '0.82rem', color: status.color, fontWeight: 600 }}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', marginTop: '6px' }}>
                  Inclusive of all taxes • White-glove silk-wrapped delivery
                </p>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.75 }}>
                {detail.description}
              </p>

              {/* Color Selector */}
              <div>
                <h4 style={{
                  fontSize: '0.82rem', color: 'var(--gold-light)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '12px',
                }}>
                  <Palette size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Color: <span style={{ color: 'var(--text-main)' }}>{selectedColor}</span>
                </h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {uniqueColors.map((col) => {
                    const isActive = selectedColor === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => handleColorSelect(col.name)}
                        title={col.name}
                        style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: col.hex,
                          border: isActive ? '3px solid var(--gold-primary)' : '2px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          boxShadow: isActive ? '0 0 16px rgba(212, 175, 55, 0.5), inset 0 0 0 2px rgba(0,0,0,0.3)' : 'inset 0 0 0 1px rgba(0,0,0,0.2)',
                          transition: 'all 0.25s ease',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        {isActive && (
                          <Check size={18} color="#fff" strokeWidth={3} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <h4 style={{
                  fontSize: '0.82rem', color: 'var(--gold-light)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '12px',
                }}>
                  <Ruler size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Size: <span style={{ color: 'var(--text-main)' }}>{selectedSize}</span>
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {uniqueSizes.map((sz) => {
                    const isActive = selectedSize === sz;
                    const isAvailable = isSizeAvailableInColor(sz);
                    const variant = findVariant(selectedColor, sz);
                    const stockInfo = variant ? getStockStatus(variant) : null;

                    return (
                      <button
                        key={sz}
                        onClick={() => isAvailable && handleSizeSelect(sz)}
                        disabled={!isAvailable}
                        style={{
                          padding: '10px 18px', borderRadius: '10px',
                          border: isActive ? '2px solid var(--gold-primary)'
                            : isAvailable ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.06)',
                          background: isActive ? 'rgba(212, 175, 55, 0.15)' : 'rgba(0, 0, 0, 0.35)',
                          color: isAvailable ? '#fff' : 'rgba(255,255,255,0.25)',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          fontSize: '0.88rem', fontWeight: 600,
                          transition: 'all 0.2s ease',
                          textDecoration: isAvailable ? 'none' : 'line-through',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                          minWidth: '60px',
                        }}
                      >
                        <span>{sz}</span>
                        {isAvailable && stockInfo && (
                          <span style={{ fontSize: '0.65rem', color: stockInfo.color, fontWeight: 500 }}>
                            {stockInfo.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Variant SKU */}
              {selectedVariant && (
                <div style={{
                  background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px 14px',
                  border: '1px solid var(--border-subtle)', fontSize: '0.78rem',
                  fontFamily: 'Consolas, monospace', color: 'var(--text-dim)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span>SKU: <strong style={{ color: 'var(--gold-light)' }}>{selectedVariant.sku}</strong></span>
                  <span>
                    {selectedVariant.price_override && (
                      <span style={{ color: 'var(--gold-primary)' }}>
                        Price Override: {formatPrice(selectedVariant.price_override)}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Add to Bag & Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={addedSuccess ? CheckCircle2 : ShoppingBag}
                  onClick={handleAdd}
                  style={{ flex: 1, padding: '14px' }}
                >
                  {addedSuccess ? 'Added to Couture Bag!' : 'Add to Couture Bag'}
                </Button>

                <button
                  onClick={() => onToggleWishlist(productSummary.id)}
                  title={isWishlisted ? "Remove from Private Curation" : "Save to Private Curation"}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '10px',
                    background: isWishlisted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: isWishlisted ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    color: isWishlisted ? '#ef4444' : 'var(--gold-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} color={isWishlisted ? '#ef4444' : 'currentColor'} />
                </button>

                <button
                  onClick={() => onOpenConcierge()}
                  title="Book Private Styling Consultation"
                  style={{
                    padding: '14px 18px', borderRadius: '10px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    cursor: 'pointer', color: 'var(--gold-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Sparkles size={20} />
                </button>
              </div>

              {addedSuccess && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontSize: '0.85rem',
                  padding: '10px 14px', borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)',
                }}>
                  <CheckCircle2 size={16} />
                  <span>
                    <strong>{selectedVariant?.sku}</strong> — {selectedVariant?.color_name} ({selectedVariant?.size}) reserved in your couture bag.
                  </span>
                </div>
              )}

              {/* Delivery Promise */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
              }}>
                <div style={{
                  background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <Truck size={18} color="var(--gold-primary)" />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>Free White-Glove Delivery</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>7-10 business days</p>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <Shield size={18} color="var(--gold-primary)" />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>Authenticity Certificate</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>GI tag & provenance docs</p>
                  </div>
                </div>
              </div>

              {/* Craftsmanship Accordion */}
              <div style={{
                borderRadius: '12px', overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
              }}>
                {accordionSections.map((sec) => {
                  const isExpanded = activeAccordion === sec.id;
                  const SectionIcon = sec.icon;
                  return (
                    <div key={sec.id}>
                      <button
                        onClick={() => setActiveAccordion(isExpanded ? null : sec.id)}
                        style={{
                          width: '100%', textAlign: 'left',
                          padding: '14px 16px',
                          background: isExpanded ? 'rgba(212, 175, 55, 0.06)' : 'rgba(0, 0, 0, 0.3)',
                          border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                          cursor: 'pointer', color: isExpanded ? 'var(--gold-light)' : 'var(--text-main)',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          fontSize: '0.85rem', fontWeight: 600,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <SectionIcon size={16} color="var(--gold-primary)" />
                        <span>{sec.title}</span>
                        <span style={{ marginLeft: 'auto', fontSize: '1rem', color: 'var(--text-dim)' }}>
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>
                      {isExpanded && (
                        <div style={{
                          padding: '14px 16px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          color: 'var(--text-muted)',
                          fontSize: '0.88rem',
                          lineHeight: 1.7,
                          animation: 'fadeIn 0.2s ease',
                        }}>
                          {sec.content || 'Details available upon request. Contact our concierge team for bespoke information.'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Artisan Provenance Badges */}
              <div>
                <h4 style={{
                  fontSize: '0.82rem', color: 'var(--gold-light)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '14px',
                }}>
                  <Award size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                  Artisan Provenance & Certification
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {provenanceBadges.map((badge, idx) => {
                    const BadgeIcon = badge.icon;
                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(212, 175, 55, 0.04)',
                          border: '1px solid rgba(212, 175, 55, 0.15)',
                          borderRadius: '10px', padding: '14px',
                          display: 'flex', alignItems: 'center', gap: '12px',
                        }}
                      >
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          background: 'rgba(212, 175, 55, 0.12)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <BadgeIcon size={18} color="var(--gold-primary)" />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>{badge.label}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{badge.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Omnichannel Boutique Availability */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.04)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.18)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Store size={18} color="var(--gold-primary)" />
                  <h4 style={{
                    fontSize: '0.82rem', color: 'var(--gold-light)',
                    textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
                  }}>
                    Flagship Boutique Availability — Click & Collect
                  </h4>
                </div>

                {(() => {
                  const stores = currentBoutiqueAvailability();
                  if (!stores.length) {
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px' }}>
                        <Truck size={16} color="var(--text-muted)" />
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          Warehouse dispatch only for this variant. Book a <button onClick={onOpenConcierge} style={{ color: 'var(--gold-primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.84rem' }}>private fitting consultation</button> for in-store preview.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                      {stores.map((sa, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <MapPin size={13} color="var(--gold-primary)" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{sa.city}</span>
                          </div>
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{sa.store_name}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                            <span style={{ fontSize: '0.76rem', color: '#10b981', fontWeight: 600 }}>
                              {sa.quantity} units • {sa.supports_pickup ? 'Same-day pickup' : 'View in store'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
