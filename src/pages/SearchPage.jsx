import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Sparkles, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { catalogApi } from '../services/api/catalogApi';
import { useWishlist } from '../hooks/useWishlist';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedTerm = useDebounce(searchTerm, 350);

  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function loadCategories() {
      const cats = await catalogApi.getCategories();
      setCategories(cats);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedTerm.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await catalogApi.getProducts({ search: debouncedTerm.trim() });
        setResults(data?.results || []);
        setSearchParams({ q: debouncedTerm.trim() });
      } catch (e) {
        console.warn('Search query failed:', e);
      } finally {
        setIsLoading(false);
      }
    }
    performSearch();
  }, [debouncedTerm, setSearchParams]);

  const quickPillSearches = ['Banarasi', 'Velvet Lehenga', 'Bridal', 'Silk Sari', 'Anarkali', 'Kundan'];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Search Header Bar */}
      <div style={{ maxWidth: '720px', margin: '0 auto 48px', textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '36px',
            color: 'var(--text-main)',
            marginBottom: '16px',
            letterSpacing: '0.02em',
          }}
        >
          Discover The Atelier
        </h1>

        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={20}
            color="var(--gold-primary)"
            style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            autoFocus
            placeholder="Search silhouettes, fabrics, embroidery, or artisans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 48px 16px 52px',
              borderRadius: '16px',
              backgroundColor: 'rgba(18, 18, 24, 0.85)',
              border: '1px solid var(--border-active)',
              color: 'var(--text-main)',
              fontSize: '16px',
              outline: 'none',
              boxShadow: 'var(--shadow-luxury)',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setResults([]);
                setSearchParams({});
              }}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Suggestion Pills */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', alignSelf: 'center' }}>
            Trending inquiries:
          </span>
          {quickPillSearches.map((pill) => (
            <button
              key={pill}
              onClick={() => setSearchTerm(pill)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '20px',
                padding: '4px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold-primary)';
                e.currentTarget.style.color = 'var(--gold-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <Spinner size={32} label="Searching haute-couture collections..." />
        </div>
      ) : debouncedTerm.trim() && results.length === 0 ? (
        <EmptyState
          title={`No Silhouettes Discovered for "${debouncedTerm}"`}
          message="We could not locate any pieces matching your search query. Try exploring our master collections."
          actionLabel="Explore All Haute Couture"
          onAction={() => navigate('/catalog')}
        />
      ) : (
        results.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Showing <strong style={{ color: 'var(--gold-light)' }}>{results.length}</strong> creations for{' '}
                <em style={{ color: 'var(--text-main)' }}>"{debouncedTerm}"</em>
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '28px',
              }}
            >
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isInWishlist(product.id)}
                  onToggleWishlist={() => toggleWishlist(product)}
                  onOpenDetail={() => navigate(`/product/${product.id}`)}
                  onQuickView={() => setQuickViewProduct(product)}
                />
              ))}
            </div>
          </div>
        )
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={Boolean(quickViewProduct)}
          onClose={() => setQuickViewProduct(null)}
          onViewFullDetail={() => {
            const id = quickViewProduct.id;
            setQuickViewProduct(null);
            navigate(`/product/${id}`);
          }}
        />
      )}
    </div>
  );
}
