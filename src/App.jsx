import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw, 
  UserCheck, 
  KeyRound, 
  Lock, 
  Sparkles, 
  Send, 
  LogOut, 
  ShoppingBag, 
  Store, 
  MapPin, 
  Code2, 
  Heart, 
  CheckCircle2, 
  Smartphone,
  Check
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ProductDetailPage from './components/ProductDetailPage';
import TrustHallmarks from './components/TrustHallmarks';
import CuratedLookbook from './components/CuratedLookbook';
import ArtisanStory from './components/ArtisanStory';
import ConciergeBookingModal from './components/ConciergeBookingModal';
import FilterDrawer from './components/FilterDrawer';
import ProductListingHeader from './components/ProductListingHeader';
import QuickViewModal from './components/QuickViewModal';
import PaginationControl from './components/PaginationControl';
import Footer from './components/Footer';
import Button from './components/Button';
import Badge from './components/Badge';
import WishlistDrawer from './components/WishlistDrawer';
import CartDrawer from './components/CartDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState('boutique'); // 'boutique' | 'auth' | 'telemetry'

  // Phase 11: Authoritative Cart Engine State
  const [cartData, setCartData] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartToast, setCartToast] = useState(null);

  // Phase 10: Wishlist State
  const [wishlist, setWishlist] = useState([]);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [wishlistToast, setWishlistToast] = useState(null);

  // Catalog State
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Phase 8: Advanced Filter Engine & Layout State
  const [facets, setFacets] = useState({ colors: [], sizes: [], price_range: { min: 0, max: 150000 } });
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' | 'showcase'

  // Boutique Stores State
  const [stores, setStores] = useState([]);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  // Telemetry & Health State
  const [healthData, setHealthData] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);
  const [rawPayload, setRawPayload] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [authEmail, setAuthEmail] = useState('kavya@example.com');
  const [authPassword, setAuthPassword] = useState('KavyaPassword123!');
  const [authMessage, setAuthMessage] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // OTP State
  const [otpIdentifier, setOtpIdentifier] = useState('shreya@example.com');
  const [otpCode, setOtpCode] = useState('');
  const [otpSentInfo, setOtpSentInfo] = useState(null);
  const [otpMessage, setOtpMessage] = useState(null);
  const [otpLoading, setOtpLoading] = useState(false);

  // Fetch Health Probes
  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch('/api/health/');
      const data = await res.json();
      setHealthData(data);
      setRawPayload(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      setHealthData({
        status: 'disconnected',
        service: 'saajnika-backend',
        dependencies: {
          database: { status: 'disconnected', error: err.message },
          redis: { status: 'disconnected', error: err.message },
        },
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/catalog/categories/');
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  // Fetch Boutique Stores
  const fetchStores = async () => {
    try {
      const res = await fetch('/api/catalog/stores/');
      if (res.ok) {
        const data = await res.json();
        setStores(Array.isArray(data) ? data : data.results || []);
      }
    } catch (err) {
      console.error('Failed to load stores', err);
    }
  };

  // Fetch Dynamic Facets (Phase 8)
  const fetchFacets = async () => {
    try {
      const res = await fetch('/api/catalog/products/facets/');
      if (res.ok) {
        const data = await res.json();
        setFacets(data);
      }
    } catch (err) {
      console.error('Failed to load facets', err);
    }
  };

  // Fetch Products with multi-facet filters & pagination
  const fetchProducts = async () => {
    setLoadingCatalog(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);

      // Combine text search and occasion filter
      let query = searchQuery.trim();
      if (selectedOccasion) {
        const occasionTerms = {
          bridal: 'Bridal',
          sangeet: 'Sangeet',
          festive: 'Silk',
          heritage: 'Handloom',
        };
        const occTerm = occasionTerms[selectedOccasion] || selectedOccasion;
        query = query ? `${query} ${occTerm}` : occTerm;
      }
      if (query) params.append('q', query);

      if (sortOrder) params.append('ordering', sortOrder);
      if (selectedColors.length > 0) params.append('color', selectedColors.join(','));
      if (selectedSizes.length > 0) params.append('size', selectedSizes.join(','));
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      if (inStockOnly) params.append('in_stock', 'true');
      if (currentPage > 1) params.append('page', currentPage.toString());

      const res = await fetch(`/api/catalog/products/?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.results || []);
        setTotalProductsCount(data.count || 0);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchCategories();
    fetchStores();
    fetchFacets();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    selectedCategory, 
    sortOrder, 
    searchQuery, 
    selectedColors, 
    selectedSizes, 
    minPrice, 
    maxPrice, 
    inStockOnly, 
    selectedOccasion, 
    currentPage
  ]);

  // Compute Active Filter Chips
  const activeChips = [];
  if (selectedCategory) {
    const catObj = categories.find((c) => c.slug === selectedCategory);
    activeChips.push({
      id: 'category',
      label: `Collection: ${catObj?.name || selectedCategory}`,
    });
  }
  selectedColors.forEach((col) => {
    activeChips.push({
      id: `color-${col}`,
      label: `Color: ${col}`,
    });
  });
  selectedSizes.forEach((sz) => {
    activeChips.push({
      id: `size-${sz}`,
      label: `Size: ${sz}`,
    });
  });
  if (minPrice || maxPrice) {
    activeChips.push({
      id: 'price',
      label: `₹${minPrice || 0} - ₹${maxPrice || 'Max'}`,
    });
  }
  if (inStockOnly) {
    activeChips.push({
      id: 'in_stock',
      label: 'In Stock Only',
    });
  }
  if (selectedOccasion) {
    const occasionLabels = {
      bridal: 'Bridal Trousseau',
      sangeet: 'Sangeet & Reception',
      festive: 'Festive & Puja',
      heritage: 'Heirloom Handloom',
    };
    activeChips.push({
      id: 'occasion',
      label: `Occasion: ${occasionLabels[selectedOccasion] || selectedOccasion}`,
    });
  }
  if (searchQuery.trim()) {
    activeChips.push({
      id: 'search',
      label: `Search: "${searchQuery.trim()}"`,
    });
  }

  const activeFiltersCount = activeChips.length;

  const handleRemoveChip = (chipId) => {
    if (chipId === 'category') setSelectedCategory(null);
    else if (chipId.startsWith('color-')) {
      const col = chipId.replace('color-', '');
      setSelectedColors((prev) => prev.filter((c) => c !== col));
    } else if (chipId.startsWith('size-')) {
      const sz = chipId.replace('size-', '');
      setSelectedSizes((prev) => prev.filter((s) => s !== sz));
    } else if (chipId === 'price') {
      setMinPrice('');
      setMaxPrice('');
    } else if (chipId === 'in_stock') {
      setInStockOnly(false);
    } else if (chipId === 'occasion') {
      setSelectedOccasion(null);
    } else if (chipId === 'search') {
      setSearchQuery('');
    }
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedColors([]);
    setSelectedSizes([]);
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSelectedOccasion(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Phase 10: Wishlist LocalStorage Persistence & Sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem('saajnika_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse wishlist from storage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('saajnika_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to storage', e);
    }
  }, [wishlist]);

  // Sync with backend whenever user logs in or tokens update
  useEffect(() => {
    if (tokens?.access) {
      const syncBackendWishlist = async () => {
        try {
          const res = await fetch('/api/wishlist/sync/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokens.access}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_ids: wishlist }),
          });
          if (res.ok) {
            const data = await res.json();
            const serverIds = (data.results || []).map((r) => r.product.id);
            setWishlist(serverIds);
          }
        } catch (err) {
          console.error('Failed to sync wishlist with backend', err);
        }
      };
      syncBackendWishlist();
    }
  }, [tokens]);

  // Wishlist toggle handler with optimistic update, toast notification, and backend sync
  const handleToggleWishlist = async (productId) => {
    const isAdding = !wishlist.includes(productId);

    setWishlist((prev) => 
      prev.includes(productId) 
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    const foundProd = products.find((p) => p.id === productId);
    const garmentTitle = foundProd?.title || 'Garment';
    setWishlistToast({
      message: isAdding 
        ? `Added '${garmentTitle}' to your Private Curation.` 
        : `Removed '${garmentTitle}' from your curation.`,
      type: isAdding ? 'added' : 'removed',
    });
    setTimeout(() => {
      setWishlistToast(null);
    }, 3200);

    // If authenticated, persist to backend
    if (tokens?.access) {
      try {
        await fetch('/api/wishlist/toggle/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.access}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: productId }),
        });
      } catch (err) {
        console.error('Backend wishlist toggle failed', err);
      }
    }
  };

  // Clear all wishlisted items
  const handleClearWishlist = async () => {
    setWishlist([]);
    setWishlistToast({
      message: 'Your personal salon curation has been emptied.',
      type: 'cleared',
    });
    setTimeout(() => setWishlistToast(null), 3000);

    if (tokens?.access) {
      try {
        await fetch('/api/wishlist/clear/', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${tokens.access}`,
          },
        });
      } catch (err) {
        console.error('Backend wishlist clear failed', err);
      }
    }
  };

  // Helper to attach session key and JWT auth headers
  const getCartHeaders = (extra = {}) => {
    const headers = { 'Content-Type': 'application/json', ...extra };
    const sessionKey = localStorage.getItem('saajnika_cart_session');
    if (sessionKey) {
      headers['X-Cart-Session'] = sessionKey;
    }
    if (tokens?.access) {
      headers['Authorization'] = `Bearer ${tokens.access}`;
    }
    return headers;
  };

  const handleCartResponse = (data) => {
    setCartData(data);
    if (data?.session_key) {
      localStorage.setItem('saajnika_cart_session', data.session_key);
    }
  };

  // Fetch Cart on mount
  const fetchCart = async () => {
    setCartLoading(true);
    try {
      const res = await fetch('/api/cart/', {
        headers: getCartHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        handleCartResponse(data);
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Merge guest cart into user cart when user logs in
  useEffect(() => {
    if (tokens?.access) {
      const guestSession = localStorage.getItem('saajnika_cart_session');
      if (guestSession) {
        fetch('/api/cart/merge/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.access}`,
          },
          body: JSON.stringify({ session_key: guestSession }),
        })
          .then((res) => res.json())
          .then((data) => {
            handleCartResponse(data);
            localStorage.removeItem('saajnika_cart_session');
          })
          .catch((err) => {
            console.error('Cart merge failed', err);
            fetchCart();
          });
      } else {
        fetchCart();
      }
    }
  }, [tokens]);

  // Authoritative Add to Bag
  const handleAddToCart = async (product, variant, quantity = 1) => {
    setCartLoading(true);
    try {
      const targetVariant = variant || product?.variants?.find((v) => v.is_in_stock) || product?.variants?.[0];
      if (!targetVariant?.id) {
        setCartToast({ message: 'Please select a specific garment size or variant.', type: 'error' });
        setTimeout(() => setCartToast(null), 3500);
        return;
      }

      const res = await fetch('/api/cart/items/', {
        method: 'POST',
        headers: getCartHeaders(),
        body: JSON.stringify({
          variant_id: targetVariant.id,
          quantity: quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.stock || data.quantity || data.detail || 'Could not add garment to bag.';
        setCartToast({ message: errorMsg, type: 'error' });
        setTimeout(() => setCartToast(null), 3500);
        return;
      }

      handleCartResponse(data);
      setCartToast({
        message: `Reserved '${product.title}' (${targetVariant.size}) in your Couture Bag.`,
        type: 'success',
      });
      setTimeout(() => setCartToast(null), 3200);
    } catch (err) {
      console.error('Failed to add item to bag', err);
      setCartToast({ message: err.message || 'Atelier service error', type: 'error' });
      setTimeout(() => setCartToast(null), 3500);
    } finally {
      setCartLoading(false);
    }
  };

  // Update item quantity
  const handleUpdateCartQuantity = async (itemId, quantity) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}/`, {
        method: 'PATCH',
        headers: getCartHeaders(),
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCartToast({ message: data.stock || data.detail || 'Could not update quantity.', type: 'error' });
        setTimeout(() => setCartToast(null), 3500);
        return;
      }
      handleCartResponse(data);
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  // Remove line item
  const handleRemoveCartItem = async (itemId) => {
    try {
      const res = await fetch(`/api/cart/items/${itemId}/`, {
        method: 'DELETE',
        headers: getCartHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        handleCartResponse(data);
        setCartToast({ message: 'Garment removed from bag.', type: 'removed' });
        setTimeout(() => setCartToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to remove cart item', err);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      const res = await fetch('/api/cart/clear/', {
        method: 'DELETE',
        headers: getCartHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        handleCartResponse(data);
        setCartToast({ message: 'Couture bag emptied.', type: 'cleared' });
        setTimeout(() => setCartToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  // Apply Coupon
  const handleApplyCoupon = async (code) => {
    try {
      const res = await fetch('/api/cart/apply-coupon/', {
        method: 'POST',
        headers: getCartHeaders(),
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.code || data.detail || 'Failed to apply promotional code.' };
      }
      handleCartResponse(data);
      return data;
    } catch (err) {
      return { error: err.message || 'Atelier service error' };
    }
  };

  // Remove Coupon
  const handleRemoveCoupon = async () => {
    try {
      const res = await fetch('/api/cart/remove-coupon/', {
        method: 'DELETE',
        headers: getCartHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        handleCartResponse(data);
        setCartToast({ message: 'Promotional discount removed.', type: 'removed' });
        setTimeout(() => setCartToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to remove coupon', err);
    }
  };

  // Standard Login
  const handleLogin = async (e) => {
    e?.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);
    try {
      const res = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.non_field_errors?.[0] || 'Login failed');
      setCurrentUser(data.user);
      setTokens(data.tokens);
      setAuthMessage({ type: 'success', text: `Welcome back, ${data.user.full_name || data.user.email}! JWT access token issued.` });
    } catch (err) {
      setAuthMessage({ type: 'error', text: err.message });
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout and Blacklist
  const handleLogout = async () => {
    if (!tokens) return;
    try {
      await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access}`,
        },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setCurrentUser(null);
      setTokens(null);
      setAuthMessage({ type: 'success', text: 'Successfully logged out. Refresh token blacklisted.' });
    }
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e?.preventDefault();
    setOtpLoading(true);
    setOtpMessage(null);
    try {
      const res = await fetch('/api/auth/otp/send/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: otpIdentifier, purpose: 'login' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      setOtpSentInfo(data);
      setOtpMessage({ type: 'success', text: `Security OTP dispatched! Expires in ${data.expires_in_seconds}s.` });
    } catch (err) {
      setOtpMessage({ type: 'error', text: err.message });
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e?.preventDefault();
    setOtpLoading(true);
    setOtpMessage(null);
    try {
      const res = await fetch('/api/auth/otp/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: otpIdentifier, code: otpCode, purpose: 'login' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid or expired OTP');
      setCurrentUser(data.user);
      setTokens(data.tokens);
      setOtpMessage({ type: 'success', text: `OTP Verified! Logged in as ${data.user.email}.` });
      setOtpCode('');
      setOtpSentInfo(null);
    } catch (err) {
      setOtpMessage({ type: 'error', text: err.message });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Luxury Navbar with Announcement Bar & Tab Switcher */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartData?.total_items || 0}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          setActiveTab('boutique');
        }}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>

        {/* TAB 1: COUTURE BOUTIQUE SHOWCASE */}
        {activeTab === 'boutique' && (
          <>
            {/* Grand Editorial Hero Banner */}
            <HeroBanner 
              onExploreCategory={(slug) => {
                setSelectedCategory(slug);
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Quality & Trust Hallmarks */}
            <TrustHallmarks />

            {/* Curated Haute Couture Lookbooks */}
            <CuratedLookbook 
              onSelectCategory={(slug) => {
                setSelectedCategory(slug);
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Filter and Discovery Section */}
            <section id="catalog-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Product Listing Header with layout switch, total count & active chips */}
              <ProductListingHeader 
                title={selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'Couture Collection' : 'Haute Couture Ensembles'}
                subtitle="Handloom Masterpieces from Varanasi & Kanchipuram"
                totalCount={totalProductsCount}
                activeFiltersCount={activeFiltersCount}
                onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
                sortOrder={sortOrder}
                onSortChange={(order) => { setSortOrder(order); setCurrentPage(1); }}
                layoutMode={layoutMode}
                onLayoutChange={(mode) => setLayoutMode(mode)}
                activeChips={activeChips}
                onRemoveChip={handleRemoveChip}
                onClearAll={handleClearAllFilters}
              />

              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(slug) => { setSelectedCategory(slug); setCurrentPage(1); }}
                searchQuery={searchQuery}
                onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }}
                sortOrder={sortOrder}
                onSortChange={(order) => { setSortOrder(order); setCurrentPage(1); }}
                totalProductsCount={totalProductsCount}
                onRefresh={fetchProducts}
                loading={loadingCatalog}
              />

              {/* Product Gallery Grid */}
              {loadingCatalog ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gold-primary)' }}>
                  <RefreshCw size={40} className="animate-spin" style={{ margin: '0 auto 16px' }} />
                  <p style={{ letterSpacing: '0.06em', fontSize: '0.95rem' }}>Curating authentic handloom couture pieces...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center' }}>
                  <ShoppingBag size={48} color="var(--gold-primary)" style={{ opacity: 0.5, margin: '0 auto 16px' }} />
                  <h3 className="font-serif" style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--gold-light)' }}>
                    No Ensembles Match Your Selection
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Adjust your filter criteria, swatches, or search terms to explore our couture collections.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleClearAllFilters}
                  >
                    Reset Filters & View All Masterpieces
                  </Button>
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: layoutMode === 'showcase' 
                      ? 'repeat(auto-fill, minmax(440px, 1fr))' 
                      : 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '28px',
                  }}>
                    {products.map((prod) => (
                      <ProductCard 
                        key={prod.id}
                        product={prod}
                        layoutMode={layoutMode}
                        onOpenDetail={(p) => setSelectedProductForModal(p)}
                        onQuickView={(p) => setQuickViewProduct(p)}
                        isWishlisted={wishlist.includes(prod.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>

                  {/* Server-Side Pagination Bar */}
                  <PaginationControl 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalProductsCount}
                    onPageChange={(p) => {
                      setCurrentPage(p);
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    loading={loadingCatalog}
                  />
                </>
              )}

              {/* Generational Artisan Provenance & Handloom Heritage */}
              <ArtisanStory />

              {/* Omnichannel Stores Grid */}
              <div className="glass-panel" style={{ padding: '32px', marginTop: '16px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Store size={26} color="var(--gold-primary)" />
                    <div>
                      <h3 className="font-serif" style={{ fontSize: '1.5rem', color: 'var(--gold-light)' }}>
                        Flagship Boutiques & Private Styling Salons
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Experience Saajnika bridal couture in-person with private styling consultations and same-day boutique collection.
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    icon={Sparkles}
                    onClick={() => setIsConciergeOpen(true)}
                  >
                    Reserve Private Consultation
                  </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  {stores.map((st) => (
                    <div 
                      key={st.id} 
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.4)', 
                        padding: '20px', 
                        borderRadius: '12px', 
                        border: '1px solid var(--border-light)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <MapPin size={16} color="var(--gold-primary)" />
                          <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{st.city}</strong>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '4px' }}>
                          {st.name}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                          {st.address}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ color: 'var(--text-dim)' }}>{st.phone_number}</span>
                        <span style={{ color: '#10b981', fontWeight: 600 }}>● Boutique Pickup</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>
          </>
        )}

        {/* TAB 2: AUTHENTICATION & SECURITY ENGINE (PHASE 3) */}
        {activeTab === 'auth' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <Badge variant="gold" size="sm" style={{ marginBottom: '10px' }}>Security Engine</Badge>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                Phase 3: SimpleJWT Auth & Rate-Limited OTP
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Production-grade authentication featuring dual-token SimpleJWT (15m access / 7d refresh), PostgreSQL token blacklisting on logout, single-use 6-digit numeric OTPs with 5-minute expiry and attempt limiters.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px' }}>
              
              {/* Card 1: JWT Login */}
              <div className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <KeyRound size={22} color="var(--gold-primary)" />
                  <h3 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--gold-light)' }}>
                    SimpleJWT Authentication
                  </h3>
                </div>

                {currentUser ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '18px',
                      borderRadius: '12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '8px' }}>
                        <UserCheck size={20} />
                        <strong>Authenticated Session Active</strong>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                        <strong>Name:</strong> {currentUser.full_name || `${currentUser.first_name} ${currentUser.last_name}`}
                      </p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <strong>Email:</strong> {currentUser.email}
                      </p>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        <strong>Role:</strong> {currentUser.is_staff ? 'Administrator' : 'Customer'}
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(0, 0, 0, 0.45)',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontFamily: 'Consolas, monospace',
                      color: 'var(--gold-light)',
                      overflowX: 'auto',
                      border: '1px solid var(--border-subtle)',
                    }}>
                      <p style={{ color: 'var(--text-dim)', marginBottom: '4px' }}>JWT Access Token (Truncated):</p>
                      <p>{tokens?.access ? `${tokens.access.slice(0, 48)}...` : 'None'}</p>
                    </div>

                    <Button 
                      variant="outline"
                      icon={LogOut}
                      onClick={handleLogout}
                      style={{ width: '100%' }}
                    >
                      Logout & Blacklist Refresh Token
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Customer Email
                      </label>
                      <input 
                        type="email" 
                        value={authEmail} 
                        onChange={(e) => setAuthEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Password
                      </label>
                      <input 
                        type="password" 
                        value={authPassword} 
                        onChange={(e) => setAuthPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          background: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.9rem',
                        }}
                        required
                      />
                    </div>

                    {authMessage && (
                      <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        background: authMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: authMessage.type === 'success' ? '#34d399' : '#f87171',
                        border: authMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      }}>
                        {authMessage.text}
                      </div>
                    )}

                    <Button 
                      variant="primary" 
                      type="submit" 
                      loading={authLoading}
                      icon={Lock}
                      size="lg"
                    >
                      Authenticate with SimpleJWT
                    </Button>
                  </form>
                )}
              </div>

              {/* Card 2: Single-Use OTP Suite */}
              <div className="glass-panel" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <Smartphone size={22} color="var(--gold-primary)" />
                  <h3 className="font-serif" style={{ fontSize: '1.3rem', color: 'var(--gold-light)' }}>
                    Single-Use Security OTP Engine
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <form onSubmit={handleSendOTP} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Email or phone (+91...)"
                      value={otpIdentifier}
                      onChange={(e) => setOtpIdentifier(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.9rem',
                      }}
                      required
                    />
                    <Button 
                      variant="outline" 
                      type="submit" 
                      loading={otpLoading}
                      icon={Send}
                    >
                      Send OTP
                    </Button>
                  </form>

                  {otpSentInfo && (
                    <div style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      padding: '16px',
                      borderRadius: '10px',
                    }}>
                      <p style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                        OTP Dispatched Successfully
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Check Celery worker terminal logs for simulation code. Single-use numeric code valid for 5 minutes.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOTP} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="6-Digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      maxLength={6}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        background: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '1.1rem',
                        letterSpacing: '0.25em',
                        textAlign: 'center',
                      }}
                      required
                    />
                    <Button 
                      variant="primary" 
                      type="submit" 
                      loading={otpLoading}
                      icon={ShieldCheck}
                    >
                      Verify
                    </Button>
                  </form>

                  {otpMessage && (
                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      background: otpMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: otpMessage.type === 'success' ? '#34d399' : '#f87171',
                      border: otpMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                    }}>
                      {otpMessage.text}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* TAB 3: TELEMETRY & HEALTH PROBES */}
        {activeTab === 'telemetry' && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <Badge variant="gold" size="sm" style={{ marginBottom: '10px' }}>Infrastructure Diagnostics</Badge>
              <h2 className="font-serif gold-gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>
                Health Probes & Containerized Dependencies
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Real-time active verification of Django 5.1 runtime, PostgreSQL 16 ACID transactions, and Redis 7 broker connectivity.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {/* Django Health */}
              <div className="glass-panel" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Server size={28} color="var(--gold-primary)" />
                  <Badge variant={healthData?.status === 'healthy' ? 'in-stock' : 'out-of-stock'} size="sm">
                    {healthData?.status || 'Probing...'}
                  </Badge>
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '6px' }}>
                  Django 5.1 Backend
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Python 3.12 • DRF • Celery 5.4</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px' }}>Endpoint: http://localhost:8000/api/health/</p>
              </div>

              {/* PostgreSQL Health */}
              <div className="glass-panel" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Database size={28} color="var(--gold-primary)" />
                  <Badge variant={healthData?.dependencies?.database?.status === 'healthy' ? 'in-stock' : 'out-of-stock'} size="sm">
                    {healthData?.dependencies?.database?.status || 'Probing...'}
                  </Badge>
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '6px' }}>
                  PostgreSQL 16 Engine
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ACID Storage • Check Constraints</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Latency: {healthData?.dependencies?.database?.latency_ms ?? 0}ms
                </p>
              </div>

              {/* Redis Health */}
              <div className="glass-panel" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <Cpu size={28} color="var(--gold-primary)" />
                  <Badge variant={healthData?.dependencies?.redis?.status === 'healthy' ? 'in-stock' : 'out-of-stock'} size="sm">
                    {healthData?.dependencies?.redis?.status || 'Probing...'}
                  </Badge>
                </div>
                <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '6px' }}>
                  Redis 7 Broker & Cache
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Celery Broker (DB 0) • Django Cache (DB 1)</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                  Latency: {healthData?.dependencies?.redis?.latency_ms ?? 0}ms
                </p>
              </div>
            </div>

            {/* Raw JSON Health Payload */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Code2 size={20} color="var(--gold-primary)" />
                  <h3 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--gold-light)' }}>
                    Raw Telemetry Response (/api/health/)
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  icon={RefreshCw}
                  loading={loadingHealth}
                  onClick={fetchHealth}
                >
                  Refresh Probes
                </Button>
              </div>
              <pre style={{
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '18px',
                borderRadius: '8px',
                fontFamily: 'Consolas, monospace',
                fontSize: '0.82rem',
                color: '#34d399',
                overflowX: 'auto',
                border: '1px solid var(--border-subtle)',
              }}>
                {rawPayload ? JSON.stringify(rawPayload, null, 2) : 'Loading telemetry...'}
              </pre>
            </div>
          </section>
        )}

      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onOpenFullDetail={(p) => {
            setQuickViewProduct(null);
            setSelectedProductForModal(p);
          }}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Multi-Facet Filter Drawer */}
      <FilterDrawer 
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => { setSelectedCategory(slug); setCurrentPage(1); }}
        facets={facets}
        selectedColors={selectedColors}
        onToggleColor={(c) => {
          setSelectedColors((prev) => 
            prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
          );
          setCurrentPage(1);
        }}
        selectedSizes={selectedSizes}
        onToggleSize={(s) => {
          setSelectedSizes((prev) => 
            prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
          );
          setCurrentPage(1);
        }}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={(min, max) => {
          setMinPrice(min);
          setMaxPrice(max);
          setCurrentPage(1);
        }}
        inStockOnly={inStockOnly}
        onToggleInStock={() => {
          setInStockOnly((prev) => !prev);
          setCurrentPage(1);
        }}
        selectedOccasion={selectedOccasion}
        onSelectOccasion={(occ) => {
          setSelectedOccasion(occ);
          setCurrentPage(1);
        }}
        activeFiltersCount={activeFiltersCount}
        onClearAll={handleClearAllFilters}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onOpenFullDetail={(p) => {
            setQuickViewProduct(null);
            setSelectedProductForModal(p);
          }}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlist.includes(quickViewProduct.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Phase 9: Full Product Detail Page — Artisan Craftsmanship Engine */}
      {selectedProductForModal && (
        <ProductDetailPage 
          productSummary={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={handleAddToCart}
          onOpenConcierge={() => setIsConciergeOpen(true)}
          isWishlisted={wishlist.includes(selectedProductForModal.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {/* Phase 10: Private Curation / Wishlist Drawer */}
      <WishlistDrawer 
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistIds={wishlist}
        onToggleWishlist={handleToggleWishlist}
        onClearWishlist={handleClearWishlist}
        onAddToCart={handleAddToCart}
        onInspectGarment={(p) => {
          setIsWishlistDrawerOpen(false);
          setSelectedProductForModal(p);
        }}
        isLoggedIn={!!currentUser}
        onOpenAuth={() => setActiveTab('auth')}
        tokens={tokens}
      />

      {/* Luxury Wishlist Toast Notification */}
      {wishlistToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            backgroundColor: 'rgba(12, 12, 16, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--gold)',
            borderRadius: '8px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
            zIndex: 2000,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Heart 
            size={18} 
            color={wishlistToast.type === 'added' ? '#ef4444' : 'var(--gold-light)'} 
            fill={wishlistToast.type === 'added' ? '#ef4444' : 'none'} 
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
            {wishlistToast.message}
          </span>
          <button
            onClick={() => setIsWishlistDrawerOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--gold)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer',
              marginLeft: '6px',
            }}
          >
            View
          </button>
        </div>
      )}

      {/* Phase 11: Authoritative Couture Shopping Bag Drawer */}
      <CartDrawer 
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cartData}
        loading={cartLoading}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onInspectGarment={(p) => {
          setIsCartDrawerOpen(false);
          setSelectedProductForModal(p);
        }}
        onProceedToCheckout={() => {
          alert('Authoritative Cart Verified. Proceeding to Phase 12 Addresses & Phase 13 Checkout Engine.');
        }}
        onOpenAuth={() => setActiveTab('auth')}
        isLoggedIn={!!currentUser}
      />

      {/* Luxury Cart Toast Notification */}
      {cartToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            backgroundColor: cartToast.type === 'error' ? 'rgba(30, 10, 15, 0.96)' : 'rgba(12, 12, 16, 0.95)',
            backdropFilter: 'blur(16px)',
            border: cartToast.type === 'error' ? '1px solid #ef4444' : '1px solid var(--gold)',
            borderRadius: '8px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
            zIndex: 2001,
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <ShoppingBag 
            size={18} 
            color={cartToast.type === 'error' ? '#ef4444' : 'var(--gold-light)'} 
          />
          <span style={{ fontSize: '0.85rem', color: cartToast.type === 'error' ? '#fca5a5' : 'var(--text-primary)', fontWeight: 500 }}>
            {cartToast.message}
          </span>
          {cartToast.type !== 'error' && (
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gold)',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'underline',
                cursor: 'pointer',
                marginLeft: '6px',
              }}
            >
              Bag
            </button>
          )}
        </div>
      )}

      {/* VIP Bridal Concierge Styling Modal */}
      <ConciergeBookingModal 
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        stores={stores}
        currentUser={currentUser}
      />

      {/* Luxury Footer with Boutiques & Heritage Story */}
      <Footer stores={stores} />

    </div>
  );
}
