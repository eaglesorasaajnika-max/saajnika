import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import CuratedLookbook from '../components/CuratedLookbook';
import ArtisanStory from '../components/ArtisanStory';
import TrustHallmarks from '../components/TrustHallmarks';
import FeaturedCategories from '../components/home/FeaturedCategories';
import NewsletterSection from '../components/home/NewsletterSection';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import ConciergeBookingModal from '../components/ConciergeBookingModal';
import { catalogApi } from '../services/api/catalogApi';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../components/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function loadData() {
      const cats = await catalogApi.getCategories();
      setCategories(cats);
      const prods = await catalogApi.getProducts({ in_stock_only: true });
      setFeaturedProducts(prods?.results || []);
    }
    loadData();
  }, []);

  return (
    <div className="homepage-container" style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
      {/* Hero Banner */}
      <HeroBanner onExplore={() => navigate('/catalog')} onBookConcierge={() => setIsConciergeOpen(true)} />

      {/* Trust Hallmarks */}
      <TrustHallmarks />

      {/* Featured Categories */}
      <FeaturedCategories
        categories={categories}
        onSelectCategory={(slug) => navigate(`/catalog?category=${slug}`)}
      />

      {/* Trending / Featured Haute Pieces */}
      <section style={{ margin: '72px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '6px' }}>
              Hand-Embroidered Masterpieces
            </p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '34px', color: 'var(--text-main)', letterSpacing: '0.02em' }}>
              The Curated Collection
            </h2>
          </div>

          <Button variant="secondary" onClick={() => navigate('/catalog')} style={{ gap: '6px', fontSize: '13px' }}>
            View Full Atelier <ArrowRight size={14} />
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '28px' }}>
          {featuredProducts.slice(0, 4).map((product) => (
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
      </section>

      {/* Curated Lookbook */}
      <CuratedLookbook onExploreLook={(slug) => navigate(`/catalog?category=${slug}`)} />

      {/* Brand Artisan Narrative */}
      <ArtisanStory onBookAtelier={() => setIsConciergeOpen(true)} />

      {/* VIP Salon Newsletter */}
      <NewsletterSection />

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

      {/* VIP Concierge Booking Modal */}
      <ConciergeBookingModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />
    </div>
  );
}
