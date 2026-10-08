import React, { useState } from 'react';
import { Heart, Sparkles, Eye } from 'lucide-react';
import Badge from './Badge';
import Button from './Button';

export default function ProductCard({
  product,
  onOpenDetail = () => {},
  onQuickView = () => {},
  layoutMode = 'grid',
  isWishlisted = false,
  onToggleWishlist = () => {},
}) {
  const [selectedColor, setSelectedColor] = useState(
    product.available_colors?.[0]?.name || null
  );

  const formatPrice = (val) => {
    if (!val) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      className="glass-panel"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => onOpenDetail(product)}
    >
      {/* Media Window */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: layoutMode === 'showcase' ? '460px' : '380px',
          overflow: 'hidden',
          backgroundColor: '#111116',
        }}
      >
        {product.primary_image ? (
          <img
            src={product.primary_image.url}
            alt={product.primary_image.alt_text || product.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={40} color="var(--gold-primary)" opacity={0.3} />
          </div>
        )}

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 2 }}>
          {product.is_new_arrival && (
            <Badge variant="new-arrival" size="sm">New Arrival</Badge>
          )}
          {product.is_best_seller && (
            <Badge variant="best-seller" size="sm">Best Seller</Badge>
          )}
        </div>

        {/* Stock Status Pill */}
        <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 2 }}>
          <Badge variant={product.is_in_stock ? 'in-stock' : 'low-stock'} size="sm">
            {product.is_in_stock ? 'In Stock' : 'Made to Order'}
          </Badge>
        </div>

        {/* Quick View Floating Pill */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            background: 'rgba(8, 8, 10, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            zIndex: 3,
            color: 'var(--gold-light)',
            fontSize: '0.74rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          title="Quick View Garment Specs"
        >
          <Eye size={13} />
          <span>Quick View</span>
        </button>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '14px',
            background: 'rgba(8, 8, 10, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 3,
            transition: 'all 0.2s ease',
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart
            size={16}
            color={isWishlisted ? '#ef4444' : 'var(--gold-light)'}
            fill={isWishlisted ? '#ef4444' : 'none'}
          />
        </button>
      </div>

      {/* Card Body */}
      <div style={{
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        gap: '14px',
      }}>
        <div>
          
          {/* Category Eyebrow & Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.74rem',
              color: 'var(--gold-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}>
              {product.category?.name || 'Couture'}
            </span>

            <span className="font-serif" style={{ fontSize: '1.25rem', color: 'var(--gold-light)', fontWeight: 600 }}>
              {formatPrice(product.base_price)}
            </span>
          </div>

          {/* Garment Title */}
          <h3 className="font-serif" style={{
            fontSize: '1.25rem',
            color: 'var(--text-main)',
            lineHeight: 1.3,
            marginBottom: '10px',
          }}>
            {product.title}
          </h3>

          {/* Color Swatches and Size Chips */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            
            {/* Color Swatches */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {product.available_colors?.map((col, idx) => (
                <span
                  key={idx}
                  title={col.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(col.name);
                  }}
                  style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: col.hex,
                    display: 'inline-block',
                    border: selectedColor === col.name ? '2px solid var(--gold-light)' : '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: selectedColor === col.name ? '0 0 8px rgba(212, 175, 55, 0.6)' : 'none',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            {/* Size Chips */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {product.available_sizes?.map((sz, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {sz}
                </span>
              ))}
            </div>

          </div>

        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          icon={Eye}
          style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(product);
          }}
        >
          Inspect Garment & Stock
        </Button>
      </div>

    </div>
  );
}
