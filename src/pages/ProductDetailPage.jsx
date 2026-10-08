import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetailView from '../components/ProductDetailPage';
import Spinner from '../components/common/Spinner';
import ErrorState from '../components/common/ErrorState';
import { catalogApi } from '../services/api/catalogApi';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import ConciergeBookingModal from '../components/ConciergeBookingModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await catalogApi.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Product not found in the atelier');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <Spinner size={36} label="Unveiling haute-couture piece..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px' }}>
        <ErrorState
          title="Garment Not Found"
          message={error || 'The requested couture silhouette could not be located in our collection archives.'}
          onRetry={() => navigate('/catalog')}
        />
      </div>
    );
  }

  return (
    <>
      <ProductDetailView
        productSummary={product}
        onClose={() => navigate(-1)}
        isWishlisted={isInWishlist(product.id)}
        onToggleWishlist={() => toggleWishlist(product)}
        onAddToCart={(variant, qty) => {
          addItem({
            productId: product.id,
            variantId: variant?.id,
            quantity: qty,
            productTitle: product.title,
          });
        }}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      <ConciergeBookingModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        selectedProduct={product}
      />
    </>
  );
}
