import React from 'react';
import { 
  SlidersHorizontal, 
  Grid3X3, 
  Grid2X2, 
  LayoutGrid, 
  X, 
  RotateCcw, 
  ArrowUpDown,
  Search,
  Sparkles
} from 'lucide-react';
import Badge from './Badge';

export default function ProductListingHeader({
  title = 'Haute Couture Ensembles',
  subtitle = 'Handloom Masterpieces from Varanasi & Kanchipuram',
  totalCount = 0,
  activeFiltersCount = 0,
  onOpenFilterDrawer = () => {},
  sortOrder = 'newest',
  onSortChange = () => {},
  layoutMode = 'grid', // 'grid' | 'showcase' | 'compact'
  onLayoutChange = () => {},
  activeChips = [],
  onRemoveChip = () => {},
  onClearAll = () => {},
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Row: Title, Counter, and Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-light)',
      }}>
        
        {/* Title & Item Counter */}
        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Curated Catalog
          </span>
          <h2 className="font-serif gold-gradient-text" style={{ fontSize: '2.2rem', lineHeight: 1.1, margin: '2px 0 6px' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Showing <strong style={{ color: 'var(--gold-light)' }}>{totalCount}</strong> authenticated handloom pieces
          </p>
        </div>

        {/* Right Controls: Filter Drawer Button, View Switcher, Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Filter Drawer Trigger */}
          <button
            onClick={onOpenFilterDrawer}
            className="luxury-btn-outline"
            style={{
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
            }}
          >
            <SlidersHorizontal size={15} color="var(--gold-primary)" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span style={{
                background: 'var(--gold-primary)',
                color: '#08080a',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Layout Mode Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            gap: '2px',
          }}>
            <button
              onClick={() => onLayoutChange('grid')}
              style={{
                background: layoutMode === 'grid' ? 'rgba(212, 175, 55, 0.25)' : 'transparent',
                border: 'none',
                padding: '6px 8px',
                borderRadius: '6px',
                color: layoutMode === 'grid' ? 'var(--gold-light)' : 'var(--text-dim)',
                cursor: 'pointer',
              }}
              title="Standard Grid (3-4 Columns)"
            >
              <LayoutGrid size={16} />
            </button>

            <button
              onClick={() => onLayoutChange('showcase')}
              style={{
                background: layoutMode === 'showcase' ? 'rgba(212, 175, 55, 0.25)' : 'transparent',
                border: 'none',
                padding: '6px 8px',
                borderRadius: '6px',
                color: layoutMode === 'showcase' ? 'var(--gold-light)' : 'var(--text-dim)',
                cursor: 'pointer',
              }}
              title="Showcase View (2 Columns)"
            >
              <Grid2X2 size={16} />
            </button>
          </div>

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border-subtle)',
                padding: '8px 12px',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '0.84rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Latest Arrivals</option>
              <option value="featured">Featured Masterpieces</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

        </div>

      </div>

      {/* Active Filter Chips Bar */}
      {activeChips.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          padding: '6px 0',
        }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Applied:
          </span>

          {activeChips.map((chip) => (
            <span
              key={chip.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '16px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                color: 'var(--gold-light)',
                fontSize: '0.78rem',
              }}
            >
              <span>{chip.label}</span>
              <button
                onClick={() => onRemoveChip(chip)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold-light)',
                  cursor: 'pointer',
                  padding: '1px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Remove filter"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            onClick={onClearAll}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              marginLeft: '4px',
            }}
          >
            Clear All
          </button>
        </div>
      )}

    </div>
  );
}
