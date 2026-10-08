import React from 'react';
import { X, SlidersHorizontal, Check, RotateCcw, Sparkles } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function FilterDrawer({
  isOpen,
  onClose,
  categories = [],
  selectedCategory = null,
  onSelectCategory = () => {},
  facets = { colors: [], sizes: [], price_range: { min: 0, max: 150000 } },
  selectedColors = [],
  onToggleColor = () => {},
  selectedSizes = [],
  onToggleSize = () => {},
  minPrice = '',
  maxPrice = '',
  onPriceChange = () => {},
  inStockOnly = false,
  onToggleInStock = () => {},
  selectedOccasion = null,
  onSelectOccasion = () => {},
  activeFiltersCount = 0,
  onClearAll = () => {},
}) {
  const occasions = [
    { id: 'bridal', name: 'Bridal Trousseau' },
    { id: 'sangeet', name: 'Sangeet & Reception' },
    { id: 'festive', name: 'Festive & Puja' },
    { id: 'heritage', name: 'Heirloom Handloom' },
  ];

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
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <SlidersHorizontal size={20} color="var(--gold-primary)" />
            <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--gold-light)' }}>
              Refine Haute Couture
            </h3>
            {activeFiltersCount > 0 && (
              <Badge variant="gold" size="sm">{activeFiltersCount} Active</Badge>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeFiltersCount > 0 && (
              <button
                onClick={onClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                }}
                title="Reset all filters"
              >
                <RotateCcw size={13} />
                <span>Reset</span>
              </button>
            )}

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
              title="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Body */}
        <div style={{
          padding: '28px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          flex: 1,
        }}>

          {/* Section 1: Availability Switch */}
          <div style={{
            background: 'rgba(212, 175, 55, 0.06)',
            padding: '16px',
            borderRadius: '10px',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                In Stock & Ready to Dispatch
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Exclude made-to-order couture lead times
              </span>
            </div>

            <button
              onClick={onToggleInStock}
              style={{
                width: '46px',
                height: '24px',
                borderRadius: '12px',
                background: inStockOnly ? 'var(--gold-primary)' : 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s ease',
              }}
            >
              <span style={{
                position: 'absolute',
                top: '2px',
                left: inStockOnly ? '24px' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: inStockOnly ? '#08080a' : '#fff',
                transition: 'left 0.2s ease',
              }} />
            </button>
          </div>

          {/* Section 2: Collection Categories */}
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>
              Collection
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                onClick={() => onSelectCategory(null)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  border: selectedCategory === null ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                  background: selectedCategory === null ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.3)',
                  color: selectedCategory === null ? 'var(--gold-light)' : 'var(--text-muted)',
                }}
              >
                All Ensembles
              </button>
              {categories.map((c) => {
                const isSel = selectedCategory === c.slug;
                return (
                  <button
                    key={c.id}
                    onClick={() => onSelectCategory(c.slug)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      border: isSel ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                      background: isSel ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.3)',
                      color: isSel ? 'var(--gold-light)' : 'var(--text-muted)',
                    }}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Color Families */}
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>
              Color Palettes
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {facets.colors?.map((col, idx) => {
                const isSel = selectedColors.includes(col.name);
                return (
                  <button
                    key={idx}
                    onClick={() => onToggleColor(col.name)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: isSel ? 'rgba(212, 175, 55, 0.18)' : 'rgba(0,0,0,0.35)',
                      border: isSel ? '1px solid var(--gold-primary)' : '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      color: isSel ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.84rem',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: col.hex,
                      border: '1px solid rgba(255,255,255,0.5)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isSel && <Check size={10} color="#fff" strokeWidth={3} />}
                    </span>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {col.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Size Matrix */}
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>
              Sizing & Formats
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {facets.sizes?.map((sz, idx) => {
                const isSel = selectedSizes.includes(sz);
                return (
                  <button
                    key={idx}
                    onClick={() => onToggleSize(sz)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      minWidth: '50px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSel ? '1px solid var(--gold-primary)' : '1px solid var(--border-light)',
                      background: isSel ? 'var(--gold-btn-gradient)' : 'rgba(0,0,0,0.35)',
                      color: isSel ? '#08080a' : 'var(--text-main)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Price Range (INR) */}
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>
              Price Spectrum (INR)
            </h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Min Price</span>
                <input
                  type="number"
                  placeholder="₹ Min"
                  value={minPrice}
                  onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <span style={{ color: 'var(--text-dim)', paddingTop: '16px' }}>—</span>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Max Price</span>
                <input
                  type="number"
                  placeholder="₹ Max"
                  value={maxPrice}
                  onChange={(e) => onPriceChange(minPrice, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 6: Occasions */}
          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px', fontWeight: 600 }}>
              Couture Occasion
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {occasions.map((occ) => {
                const isSel = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    onClick={() => onSelectOccasion(isSel ? null : occ.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      border: isSel ? '1px solid var(--gold-primary)' : '1px solid var(--border-light)',
                      background: isSel ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0,0,0,0.3)',
                      color: isSel ? 'var(--gold-light)' : 'var(--text-muted)',
                    }}
                  >
                    {occ.name}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Drawer Bottom Actions */}
        <div style={{
          padding: '20px 28px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          gap: '12px',
        }}>
          <Button
            variant="outline"
            onClick={onClearAll}
            style={{ flex: 1 }}
          >
            Clear All
          </Button>

          <Button
            variant="primary"
            onClick={onClose}
            style={{ flex: 2 }}
          >
            View Ensembles
          </Button>
        </div>

      </div>
    </div>
  );
}
