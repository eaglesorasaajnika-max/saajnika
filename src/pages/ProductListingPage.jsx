import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductListingHeader from '../components/ProductListingHeader';
import FilterDrawer from '../components/FilterDrawer';
import QuickViewModal from '../components/QuickViewModal';
import PaginationControl from '../components/PaginationControl';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Spinner from '../components/common/Spinner';
import { catalogApi } from '../services/api/catalogApi';
import { useWishlist } from '../hooks/useWishlist';

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facets, setFacets] = useState({ colors: [], sizes: [], price_range: { min: 40000, max: 250000 } });
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutMode, setLayoutMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals & Drawers
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Query Params
  const categoryParam = searchParams.get('category') || null;
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const colorsParam = searchParams.getAll('color');
  const sizesParam = searchParams.getAll('size');
  const minPriceParam = searchParams.get('min_price') || '';
  const maxPriceParam = searchParams.get('max_price') || '';
  const inStockParam = searchParams.get('in_stock') === 'true';

  useEffect(() => {
    async function fetchMetadata() {
      const [cats, facetData] = await Promise.all([
        catalogApi.getCategories(),
        catalogApi.getFacets(),
      ]);
      setCategories(cats);
      setFacets(facetData);
    }
    fetchMetadata();
  }, []);

  useEffect(() => {
    async function fetchCatalog() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await catalogApi.getProducts({
          category: categoryParam,
          search: searchParam,
          sort: sortParam,
          colors: colorsParam,
          sizes: sizesParam,
          min_price: minPriceParam,
          max_price: maxPriceParam,
          in_stock_only: inStockParam,
          page: currentPage,
        });
        setProducts(data?.results || []);
        setTotalCount(data?.count || 0);
        setTotalPages(data?.total_pages || 1);
      } catch (err) {
        setError(err.message || 'Failed to load catalog');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCatalog();
  }, [
    categoryParam,
    searchParam,
    sortParam,
    colorsParam.join(','),
    sizesParam.join(','),
    minPriceParam,
    maxPriceParam,
    inStockParam,
    currentPage,
  ]);

  const handleSortChange = (newSort) => {
    searchParams.set('sort', newSort);
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchParams(categoryParam ? { category: categoryParam } : {});
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 64px' }}>
      {/* Header controls */}
      <ProductListingHeader
        totalCount={totalCount}
        selectedCategory={categoryParam}
        categories={categories}
        sortOrder={sortParam}
        onSortChange={handleSortChange}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
        onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
        activeFiltersCount={colorsParam.length + sizesParam.length + (minPriceParam ? 1 : 0) + (inStockParam ? 1 : 0)}
        onClearFilters={handleClearFilters}
        searchQuery={searchParam}
      />

      {/* Content Area */}
      {isLoading ? (
        <div style={{ padding: '80px', textAlign: 'center' }}>
          <Spinner size={32} label="Retrieving bespoke catalog..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => setCurrentPage(1)} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No Haute Couture Pieces Found"
          message="No silhouettes in our atelier match your selected filter criteria. Try expanding your parameters."
          actionLabel="Clear All Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                layoutMode === 'showcase'
                  ? 'repeat(auto-fill, minmax(360px, 1fr))'
                  : 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px',
              marginTop: '24px',
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layoutMode={layoutMode}
                isWishlisted={isInWishlist(product.id)}
                onToggleWishlist={() => toggleWishlist(product)}
                onOpenDetail={() => navigate(`/product/${product.id}`)}
                onQuickView={() => setQuickViewProduct(product)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: '48px' }}>
              <PaginationControl
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        facets={facets}
        selectedColors={colorsParam}
        onToggleColor={(c) => {
          const next = colorsParam.includes(c)
            ? colorsParam.filter((item) => item !== c)
            : [...colorsParam, c];
          searchParams.delete('color');
          next.forEach((item) => searchParams.append('color', item));
          setSearchParams(searchParams);
        }}
        selectedSizes={sizesParam}
        onToggleSize={(s) => {
          const next = sizesParam.includes(s)
            ? sizesParam.filter((item) => item !== s)
            : [...sizesParam, s];
          searchParams.delete('size');
          next.forEach((item) => searchParams.append('size', item));
          setSearchParams(searchParams);
        }}
        minPrice={minPriceParam}
        setMinPrice={(val) => {
          if (val) searchParams.set('min_price', val);
          else searchParams.delete('min_price');
          setSearchParams(searchParams);
        }}
        maxPrice={maxPriceParam}
        setMaxPrice={(val) => {
          if (val) searchParams.set('max_price', val);
          else searchParams.delete('max_price');
          setSearchParams(searchParams);
        }}
        inStockOnly={inStockParam}
        setInStockOnly={(val) => {
          if (val) searchParams.set('in_stock', 'true');
          else searchParams.delete('in_stock');
          setSearchParams(searchParams);
        }}
        onResetFilters={handleClearFilters}
      />

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
