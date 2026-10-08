import React from 'react';
import { Search, RefreshCw, X, ArrowUpDown } from 'lucide-react';

export default function CategoryFilter({
  categories = [],
  selectedCategory = null,
  onSelectCategory = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  sortOrder = 'newest',
  onSortChange = () => {},
  totalProductsCount = 0,
  onRefresh = () => {},
  loading = false,
}) {
  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Category Pills Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '0.82rem',
          color: 'var(--gold-light)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginRight: '6px',
        }}>
          Collections:
        </span>

        {/* All Categories Option */}
        <button
          onClick={() => onSelectCategory(null)}
          style={{
            padding: '8px 18px',
            borderRadius: '20px',
            fontSize: '0.84rem',
            fontWeight: 500,
            cursor: 'pointer',
            border: selectedCategory === null ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
            background: selectedCategory === null ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.03)',
            color: selectedCategory === null ? 'var(--gold-light)' : 'var(--text-muted)',
            transition: 'all 0.2s ease',
          }}
        >
          All Ensembles ({totalProductsCount})
        </button>

        {/* Categories */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                fontSize: '0.84rem',
                fontWeight: 500,
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isSelected ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {cat.name}
              {cat.product_count !== undefined && (
                <span style={{ fontSize: '0.74rem', opacity: 0.7 }}>({cat.product_count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        
        {/* Search Field */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
          <Search size={18} color="var(--gold-primary)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search Varanasi silk, zari embroidery, bridal lehengas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 38px 10px 42px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.88rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--gold-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Dropdown & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={15} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border-subtle)',
                padding: '8px 14px',
                borderRadius: '8px',
                color: 'var(--text-main)',
                fontSize: '0.84rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Latest Couture Arrivals</option>
              <option value="featured">Featured Masterpieces</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="luxury-btn-ghost"
            style={{ padding: '8px 12px' }}
            title="Refresh Catalog"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

      </div>

    </div>
  );
}
