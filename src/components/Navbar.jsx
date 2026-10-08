import React from 'react';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  Search, 
  Lock, 
  Server, 
  User, 
  LogOut,
  MapPin,
  Layers,
  Calendar
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount = 0,
  wishlistCount = 0,
  currentUser = null,
  onLogout = () => {},
  onOpenSearch = () => {},
  onOpenConcierge = () => {},
  onOpenWishlist = () => {},
  onOpenCart = () => {},
  categories = [],
  selectedCategory = null,
  onSelectCategory = () => {},
}) {
  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(8, 8, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
    }}>
      
      {/* Top Banner: Global Announcement & Concierge Trigger */}
      <div 
        onClick={onOpenConcierge}
        style={{
          background: 'linear-gradient(90deg, #aa820a 0%, #d4af37 50%, #aa820a 100%)',
          color: '#08080a',
          textAlign: 'center',
          padding: '6px 16px',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.92'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1.0'}
      >
        <span>Complimentary Bespoke Couture Consultation & White-Glove Insured Delivery Across India</span>
        <span style={{ textDecoration: 'underline', fontWeight: 700, marginLeft: '6px' }}>Book Private Appointment →</span>
      </div>

      {/* Main Navbar */}
      <div style={{
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap',
      }}>
        
        {/* Brand Monogram & Title */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={() => { setActiveTab('boutique'); onSelectCategory(null); }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #f3e5ab 0%, #d4af37 60%, #8a6e14 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
            flexShrink: 0,
          }}>
            <Sparkles size={24} color="#08080a" />
          </div>
          <div>
            <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.1rem', lineHeight: 1, letterSpacing: '0.04em' }}>
              SAAJNIKA
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '2px' }}>
              Haute Couture • Indian Luxury
            </p>
          </div>
        </div>

        {/* Center: System Console Selector */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid var(--border-light)',
        }}>
          <button
            onClick={() => setActiveTab('boutique')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'boutique' ? 'var(--gold-btn-gradient)' : 'transparent',
              color: activeTab === 'boutique' ? '#08080a' : 'var(--text-main)',
              transition: 'all 0.2s ease',
            }}
          >
            <ShoppingBag size={15} />
            Couture Boutique
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'auth' ? 'var(--gold-btn-gradient)' : 'transparent',
              color: activeTab === 'auth' ? '#08080a' : 'var(--text-main)',
              transition: 'all 0.2s ease',
            }}
          >
            <Lock size={15} />
            Auth Engine (Phase 3)
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '7px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === 'telemetry' ? 'var(--gold-btn-gradient)' : 'transparent',
              color: activeTab === 'telemetry' ? '#08080a' : 'var(--text-main)',
              transition: 'all 0.2s ease',
            }}
          >
            <Server size={15} />
            System Probes
          </button>
        </div>

        {/* Right Actions: Search, Wishlist, Cart, User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* VIP Concierge Appointment Trigger */}
          <button
            onClick={onOpenConcierge}
            className="luxury-btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Book Private Styling Consultation"
          >
            <Calendar size={14} color="var(--gold-primary)" />
            <span>Book Salon</span>
          </button>

          <button
            onClick={onOpenSearch}
            className="luxury-btn-ghost"
            style={{ padding: '8px', borderRadius: '50%' }}
            title="Search Couture Garments"
          >
            <Search size={18} color="var(--gold-light)" />
          </button>

          {/* Wishlist Pill */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={onOpenWishlist}
              className="luxury-btn-ghost"
              style={{ padding: '8px', borderRadius: '50%' }}
              title="My Private Curation"
            >
              <Heart size={18} color={wishlistCount > 0 ? '#ef4444' : 'var(--gold-light)'} fill={wishlistCount > 0 ? '#ef4444' : 'none'} />
            </button>
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#ef4444',
                color: '#fff',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {wishlistCount}
              </span>
            )}
          </div>

          {/* Cart Bag Pill */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={onOpenCart}
              className="luxury-btn"
              style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
            >
              <ShoppingBag size={16} />
              <span>Bag ({cartCount})</span>
            </button>
          </div>

          {/* User Profile or Login Trigger */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
              <User size={14} color="var(--gold-primary)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser.first_name || currentUser.email.split('@')[0]}
              </span>
              <button 
                onClick={onLogout} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', padding: '2px' }}
                title="Logout"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="luxury-btn-outline"
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              Sign In
            </button>
          )}

        </div>

      </div>

      {/* Subnav: Category Bar (when in boutique mode) */}
      {activeTab === 'boutique' && categories.length > 0 && (
        <nav style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(10, 10, 14, 0.6)',
          padding: '8px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          overflowX: 'auto',
        }}>
          <button
            onClick={() => onSelectCategory(null)}
            style={{
              background: 'none',
              border: 'none',
              color: selectedCategory === null ? 'var(--gold-light)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: selectedCategory === null ? 600 : 400,
              cursor: 'pointer',
              padding: '4px 8px',
              borderBottom: selectedCategory === null ? '2px solid var(--gold-primary)' : '2px solid transparent',
              transition: 'all 0.2s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            All Collections
          </button>

          {categories.map((c) => {
            const isSel = selectedCategory === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.slug)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isSel ? 'var(--gold-light)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: isSel ? 600 : 400,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderBottom: isSel ? '2px solid var(--gold-primary)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </button>
            );
          })}
        </nav>
      )}

    </header>
  );
}
