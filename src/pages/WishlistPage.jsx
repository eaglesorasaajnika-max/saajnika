import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import { formatINR } from '../utils/formatters';
import Button from '../components/Button';
import EmptyState from '../components/common/EmptyState';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles, Share2 } from 'lucide-react';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showSuccess } = useNotification();

  const handleMoveToCart = async (product) => {
    const variant = product.variants?.[0];
    await addToCart(product, variant, 1);
    removeFromWishlist(product.id);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Private curation link copied to clipboard.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '36px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <button
            onClick={() => navigate('/catalog')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gold-primary)',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: 0,
              marginBottom: '12px',
            }}
          >
            <ArrowLeft size={14} /> Back to Catalog
          </button>

          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '4px' }}>
            Private Salon Selection
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', color: 'var(--text-main)', margin: 0 }}>
            Your Curated Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length > 0 && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={handleShare} style={{ gap: '6px', fontSize: '13px' }}>
              <Share2 size={14} /> Share Curation
            </Button>
            <Button variant="secondary" onClick={clearWishlist} style={{ gap: '6px', fontSize: '13px' }}>
              <Trash2 size={14} /> Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Curation is Empty"
          message="Save your favorite handloom sarees, bespoke lehengas, and couture ensembles to your private salon."
          actionLabel="Explore Haute Couture"
          onAction={() => navigate('/catalog')}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '28px',
          }}
        >
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="glass-panel"
              style={{
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={product.primary_image || (product.images && product.images[0]) || '/assets/hero.png'}
                  alt={product.title}
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{
                    width: '100%',
                    height: '360px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    transition: 'transform 0.4s ease',
                  }}
                />

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(8, 8, 10, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--gold-primary)',
                  }}
                  title="Remove from Curation"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gold-primary)' }}>
                    {product.craft_technique || 'Handloom Heirloom'}
                  </span>
                  <h3
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '18px',
                      color: 'var(--text-main)',
                      marginTop: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    {product.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--gold-light)' }}>
                    {formatINR(product.price)}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span style={{ fontSize: '13px', textDecoration: 'line-through', color: 'var(--text-dim)' }}>
                      {formatINR(product.mrp)}
                    </span>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleMoveToCart(product)}
                  style={{ width: '100%', gap: '8px', marginTop: '6px' }}
                >
                  <ShoppingBag size={15} /> Move to Couture Bag
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
