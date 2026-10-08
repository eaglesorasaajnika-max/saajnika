import React from 'react';
import { Sparkles, ShieldCheck, Gem, Compass } from 'lucide-react';
import Button from './Button';

export default function HeroBanner({ onExploreCategory = () => {} }) {
  return (
    <div style={{
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: '#0e0e14',
      minHeight: '440px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: 'var(--shadow-luxury)',
    }}>
      
      {/* Background Photography with Deep Vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=80")',
        backgroundPosition: 'right 20% center',
        backgroundSize: 'cover',
        opacity: 0.38,
      }} />

      {/* Luxury Gradient Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, #08080a 0%, rgba(8, 8, 10, 0.92) 50%, rgba(8, 8, 10, 0.4) 100%)',
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '48px 48px',
        maxWidth: '720px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        
        {/* Collection Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--gold-primary)" />
          <span style={{
            fontSize: '0.82rem',
            color: 'var(--gold-light)',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            Autumn / Winter Haute Couture 2026
          </span>
        </div>

        {/* Grand Headline */}
        <h2 className="font-serif gold-gradient-text" style={{
          fontSize: '3.2rem',
          lineHeight: 1.1,
          letterSpacing: '0.02em',
          fontWeight: 600,
        }}>
          Generational Artistry, Woven in Pure Gold & Silk
        </h2>

        {/* Narrative Description */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.7,
        }}>
          Handcrafted in Varanasi and Kanchipuram on traditional pit looms. Each saree, bridal lehenga, and anarkali ensemble represents hundreds of artisan hours with electroplated real silver-gilt zari.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '6px' }}>
          <Button 
            variant="primary" 
            size="lg"
            icon={Sparkles}
            onClick={() => onExploreCategory('sarees')}
          >
            Explore Sarees
          </Button>

          <Button 
            variant="outline" 
            size="lg"
            icon={Compass}
            onClick={() => onExploreCategory('lehengas')}
          >
            Bridal Lehengas
          </Button>
        </div>

        {/* Quality Hallmarks */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginTop: '12px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Gem size={15} color="var(--gold-primary)" />
            <span>Certified 100% Pure Mulberry Silk</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={15} color="var(--gold-primary)" />
            <span>Pure Gold Electroplated Zari</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Compass size={15} color="var(--gold-primary)" />
            <span>Bespoke Measurement Service</span>
          </div>
        </div>

      </div>

    </div>
  );
}
