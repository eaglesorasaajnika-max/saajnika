import React, { useState } from 'react';
import { MapPin, Sparkles, Award, Compass, Heart } from 'lucide-react';
import Badge from './Badge';

export default function ArtisanStory() {
  const [activeRegion, setActiveRegion] = useState('varanasi');

  const regions = [
    {
      id: 'varanasi',
      name: 'Varanasi (Kashi)',
      state: 'Uttar Pradesh',
      technique: 'Kadwa & Fekwa Pit Loom Weaving',
      threadwork: 'Pure Silver & 24K Gold Electroplated Zari',
      leadTime: '60 to 90 Days Per Saree',
      story: 'Along the ancient banks of Varanasi, our master artisans operate pit looms passed down across four generations. Each motif in the kadwa technique is individually hand-engraved with no loose threads at the back, creating a reversible heirloom cloth of exceptional durability.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      masterWeaver: 'Raghunath Ansari',
      generations: '4th Generation Master Weaver',
    },
    {
      id: 'kanchipuram',
      name: 'Kanchipuram',
      state: 'Tamil Nadu',
      technique: 'Korvai Interlocking Temple Borders',
      threadwork: 'Heavy 3-Ply Twisted Mulberry Silk',
      leadTime: '45 to 70 Days Per Saree',
      story: 'Kanchipuram silk is revered for its structural weight and architectural borders. Using the ancient korvai method requiring two weavers on a single loom, the contrasting body and pallu are interlocking without seams, creating a crisp drape that endures for decades.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      masterWeaver: 'Sundaram Pillai',
      generations: '3rd Generation Temple Loom Artist',
    },
    {
      id: 'chanderi',
      name: 'Chanderi & Paithani',
      state: 'Madhya Pradesh & Maharashtra',
      technique: 'Gold Tapestry & Sheer Gossamer Weaves',
      threadwork: 'Fine Chanderi Zari & Asavali Peacock Motifs',
      leadTime: '40 to 60 Days Per Piece',
      story: 'Chanderi weavers combine sheer silk warp with fine cotton weft to produce translucent, featherlight drapes beloved by royalty. Combined with Paithani’s oblique tapestry weaving technique for kaleidoscopic peacocks, these pieces radiate effortless royal dignity.',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      masterWeaver: 'Madhavrao Koli',
      generations: 'Master National Awardee',
    },
  ];

  const current = regions.find((r) => r.id === activeRegion) || regions[0];

  return (
    <section className="glass-panel" style={{ padding: '36px', borderRadius: '16px' }}>
      
      {/* Section Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Compass size={16} color="var(--gold-primary)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
            Generational Provenance & Handloom Heritage
          </span>
        </div>
        <h3 className="font-serif gold-gradient-text" style={{ fontSize: '2.4rem', lineHeight: 1.2, marginBottom: '12px' }}>
          The Hands That Weave Imperial Royalty
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
          Saajnika directly supports over 120 artisan families in Varanasi, Kanchipuram, and Chanderi. By cutting out middlemen, we ensure ethical compensation, generational craft preservation, and absolute purity of materials.
        </p>
      </div>

      {/* Region Selector Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '28px',
        flexWrap: 'wrap',
      }}>
        {regions.map((r) => {
          const isSelected = activeRegion === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRegion(r.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '25px',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isSelected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(0, 0, 0, 0.35)',
                color: isSelected ? 'var(--gold-light)' : 'var(--text-muted)',
                transition: 'all 0.25s ease',
              }}
            >
              <MapPin size={15} color={isSelected ? 'var(--gold-primary)' : 'var(--text-dim)'} />
              <span>{r.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Region Showcase Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '32px',
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '30px',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
      }}>
        
        {/* Left: Artisan Story & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Badge variant="gold" size="sm">{current.state}</Badge>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>● Certified Handloom Hub</span>
            </div>

            <h4 className="font-serif" style={{ fontSize: '1.8rem', color: 'var(--gold-light)', marginBottom: '14px' }}>
              {current.technique}
            </h4>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '20px' }}>
              {current.story}
            </p>

            {/* Technical Craft Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Threadwork
                </span>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                  {current.threadwork}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Artisan Lead Time
                </span>
                <p style={{ fontSize: '0.84rem', color: 'var(--gold-light)', fontWeight: 600, marginTop: '2px' }}>
                  {current.leadTime}
                </p>
              </div>
            </div>
          </div>

          {/* Master Weaver Quote Card */}
          <div style={{
            padding: '16px 20px',
            borderLeft: '3px solid var(--gold-primary)',
            background: 'rgba(212, 175, 55, 0.06)',
            borderRadius: '0 8px 8px 0',
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '8px' }}>
              "A Saajnika saree is not merely fabric. It is a chronicle of sacred motifs, mathematical symmetry, and sixty days of rhythmic shuttle movement."
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 600 }}>
              — {current.masterWeaver} ({current.generations})
            </p>
          </div>
        </div>

        {/* Right: Atelier Photography Window */}
        <div style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '360px',
          border: '1px solid var(--border-light)',
        }}>
          <img
            src={current.image}
            alt={current.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px',
            background: 'linear-gradient(0deg, rgba(8,8,10,0.95) 0%, rgba(8,8,10,0) 100%)',
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--gold-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Atelier Archive
            </p>
            <h5 className="font-serif" style={{ fontSize: '1.3rem', color: '#fff', marginTop: '2px' }}>
              Master Weaver Workshop, {current.name}
            </h5>
          </div>
        </div>

      </div>

    </section>
  );
}
