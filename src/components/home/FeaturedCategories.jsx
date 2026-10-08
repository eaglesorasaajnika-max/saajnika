import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FeaturedCategories({ categories = [], onSelectCategory = () => {} }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section style={{ margin: '64px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)',
            marginBottom: '8px',
          }}
        >
          Curated Heirlooms
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '36px',
            fontWeight: 400,
            color: 'var(--text-main)',
            letterSpacing: '0.02em',
          }}
        >
          Signature Categories
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}
      >
        {categories.slice(0, 4).map((cat) => (
          <div
            key={cat.id}
            className="glass-panel"
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s',
            }}
            onClick={() => onSelectCategory(cat.slug)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-luxury)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ position: 'relative', height: '340px', overflow: 'hidden' }}>
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(8, 8, 10, 0.1) 0%, rgba(8, 8, 10, 0.85) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '20px',
                  right: '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--gold-light)',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  {cat.item_count || 12} Haute Pieces
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '22px',
                    fontWeight: 400,
                    color: 'var(--text-main)',
                    marginBottom: '6px',
                  }}
                >
                  {cat.name}
                </h3>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--gold-primary)',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}
                >
                  Explore Collection <ArrowRight size={13} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
