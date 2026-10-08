import React, { useState } from 'react';
import { Sparkles, ChevronRight, Eye, Layers } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

export default function CuratedLookbook({ onSelectCategory = () => {} }) {
  const [activeLookbook, setActiveLookbook] = useState(0);

  const lookbooks = [
    {
      id: 'banarasi-heritage',
      title: 'The Royal Banarasi Edit',
      subtitle: 'Varanasi Handlooms & Antique Gold Zari',
      description: 'Woven on generational pit looms along the sacred ghats of Kashi. Features intricate kadwa floral vines and heavy pallus electroplated in genuine silver-gilt zari.',
      categorySlug: 'sarees',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      badge: 'Heritage Classic',
      curatedPieces: 8,
      artisanHours: '180+ hours',
    },
    {
      id: 'bridal-trousseau',
      title: 'The Grand Bridal Trousseau',
      subtitle: 'Heirloom Crimson Lehengas & Zardozi Tapestry',
      description: 'Regal bridal silhouettes designed for sacred wedding vows. Heavy kalis adorned with hand-stitched French knots, dabka, sequins, and pure gold threadwork.',
      categorySlug: 'lehengas',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      badge: 'Haute Bridal',
      curatedPieces: 6,
      artisanHours: '320+ hours',
    },
    {
      id: 'velvet-soiree',
      title: 'Velvet & Brocade Soirée',
      subtitle: 'Architectural Anarkalis & Regal Capes',
      description: 'Plush micro-velvet paired with raw silk and metallic tissue dupattas. Tailored for sangeet galas and black-tie royal evening receptions.',
      categorySlug: 'anarkalis',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      badge: 'Evening Couture',
      curatedPieces: 5,
      artisanHours: '140+ hours',
    },
  ];

  return (
    <section className="glass-panel" style={{ padding: '36px', borderRadius: '16px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '28px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={16} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
              Curated Editorial Lookbooks
            </span>
          </div>
          <h3 className="font-serif gold-gradient-text" style={{ fontSize: '2rem' }}>
            The Season’s Haute Couture Edits
          </h3>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '420px', lineHeight: 1.5 }}>
          Explore themed bridal and festive edits, curated by Saajnika’s creative directors with master weavers from historic textile hubs.
        </p>
      </div>

      {/* Lookbook Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {lookbooks.map((lb, idx) => (
          <div
            key={lb.id}
            style={{
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              border: activeLookbook === idx ? '1px solid var(--gold-primary)' : '1px solid var(--border-light)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              boxShadow: activeLookbook === idx ? '0 0 25px rgba(212, 175, 55, 0.2)' : 'none',
            }}
            onClick={() => setActiveLookbook(idx)}
          >
            {/* Visual Photography Window */}
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
              <img
                src={lb.image}
                alt={lb.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(180deg, rgba(8,8,10,0.2) 0%, rgba(8,8,10,0.85) 100%)',
              }} />

              <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                <Badge variant="gold" size="sm">{lb.badge}</Badge>
              </div>

              <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  {lb.subtitle}
                </span>
                <h4 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', marginTop: '2px' }}>
                  {lb.title}
                </h4>
              </div>
            </div>

            {/* Content & Action */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                {lb.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
              }}>
                <span>Artisan Effort: <strong style={{ color: 'var(--gold-light)' }}>{lb.artisanHours}</strong></span>
                <span>{lb.curatedPieces} Pieces in Atelier</span>
              </div>

              <Button
                variant={activeLookbook === idx ? 'primary' : 'outline'}
                icon={ChevronRight}
                size="sm"
                style={{ width: '100%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(lb.categorySlug);
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Curated Edit ({lb.categorySlug.toUpperCase()})
              </Button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
