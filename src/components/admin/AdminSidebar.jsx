import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Boxes,
  Tag,
  Image,
  Users,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function AdminSidebar({ activeTab, onSelectTab, onExitAdmin }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Couture Products', icon: Package },
    { id: 'categories', label: 'Artisan Categories', icon: Layers },
    { id: 'orders', label: 'Orders & Shipments', icon: ShoppingBag },
    { id: 'inventory', label: 'Omnichannel Stock', icon: Boxes },
    { id: 'coupons', label: 'Promotional Vouchers', icon: Tag },
    { id: 'banners', label: 'Editorial Banners', icon: Image },
    { id: 'customers', label: 'Clientele & VIP Tiers', icon: Users },
    { id: 'audit', label: 'Audit Security Log', icon: ShieldAlert },
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'rgba(10, 10, 14, 0.98)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
        height: '100%',
        minHeight: '100vh',
      }}
    >
      <div>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #f3e5ab 0%, #d4af37 60%, #8a6e14 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="#08080a" />
          </div>
          <div>
            <h2 className="font-serif" style={{ fontSize: '18px', color: 'var(--gold-light)', lineHeight: 1 }}>
              SAAJNIKA
            </h2>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
              Operations Suite
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '20px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#08080a' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--gold-primary)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={16} color={isActive ? '#08080a' : 'var(--gold-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Exit to Storefront */}
      <button
        onClick={onExitAdmin}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--text-muted)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={15} />
        <span>Return to Boutique</span>
      </button>
    </aside>
  );
}
