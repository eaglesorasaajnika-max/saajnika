import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

// Context Providers
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';

// Global Layout & Drawers
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AuthModal from './components/auth/AuthModal';
import ConciergeBookingModal from './components/ConciergeBookingModal';

// Pages
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentResultPage from './pages/PaymentResultPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AccountPage from './pages/AccountPage';
import WishlistPage from './pages/WishlistPage';
import AdminPage from './pages/AdminPage';

// APIs
import { catalogApi } from './services/api/catalogApi';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

  const { user, logout, isAuthenticated } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon, addToCart } = useCart();
  const { wishlist, toggleWishlist, clearWishlist, removeFromWishlist } = useWishlist();

  // Modals & Drawers state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConciergeModalOpen, setIsConciergeModalOpen] = useState(false);

  // Categories & Stores for global navigation
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function loadNavData() {
      try {
        const cats = await catalogApi.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.warn('Could not load categories for navbar:', err);
      }
    }
    loadNavData();
  }, []);

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    if (slug) {
      navigate(`/catalog?category=${slug}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#08080a', color: '#fff' }}>
      {/* Show Global Navbar only when not in Admin Suite */}
      {!isAdmin && (
        <Navbar
          activeTab="boutique"
          setActiveTab={(tab) => {
            if (tab === 'auth') {
              if (isAuthenticated) {
                navigate('/account');
              } else {
                setIsAuthModalOpen(true);
              }
            } else if (tab === 'boutique') {
              navigate('/catalog');
            } else if (tab === 'telemetry') {
              navigate('/admin');
            }
          }}
          cartCount={cart?.total_items || 0}
          wishlistCount={wishlist?.length || 0}
          currentUser={user}
          onLogout={logout}
          onOpenSearch={() => navigate('/search')}
          onOpenConcierge={() => setIsConciergeModalOpen(true)}
          onOpenWishlist={() => setIsWishlistDrawerOpen(true)}
          onOpenCart={() => setIsCartDrawerOpen(true)}
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      )}

      {/* Main Page Body */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<ProductListingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/:status" element={<PaymentResultPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Show Global Footer only when not in Admin Suite */}
      {!isAdmin && <Footer />}

      {/* Global Interactive Drawers */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onApplyCoupon={applyCoupon}
        onRemoveCoupon={removeCoupon}
        onInspectGarment={(id) => {
          setIsCartDrawerOpen(false);
          navigate(`/product/${id}`);
        }}
        onProceedToCheckout={() => {
          setIsCartDrawerOpen(false);
          navigate('/checkout');
        }}
        onOpenAuth={() => {
          setIsCartDrawerOpen(false);
          setIsAuthModalOpen(true);
        }}
        isLoggedIn={isAuthenticated}
      />

      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistIds={wishlist.map((w) => (typeof w === 'object' ? w.id : w))}
        onToggleWishlist={toggleWishlist}
        onClearWishlist={clearWishlist}
        onAddToCart={addToCart}
        onInspectGarment={(id) => {
          setIsWishlistDrawerOpen(false);
          navigate(`/product/${id}`);
        }}
        isLoggedIn={isAuthenticated}
        onOpenAuth={() => {
          setIsWishlistDrawerOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Concierge Appointment Modal */}
      <ConciergeBookingModal
        isOpen={isConciergeModalOpen}
        onClose={() => setIsConciergeModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <BrowserRouter>
              <AppShell />
            </BrowserRouter>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
