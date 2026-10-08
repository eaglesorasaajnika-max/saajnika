import React from 'react';
import { Sparkles, MapPin, Phone, Mail, ShieldCheck, Gem, Clock } from 'lucide-react';

export default function Footer({ stores = [] }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(8, 8, 10, 0.95)',
      marginTop: '48px',
      padding: '48px 24px 28px',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '40px',
        marginBottom: '40px',
      }}>
        
        {/* Brand & Atelier Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #f3e5ab 0%, #d4af37 60%, #8a6e14 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={18} color="#08080a" />
            </div>
            <h3 className="font-serif gold-gradient-text" style={{ fontSize: '1.6rem', letterSpacing: '0.04em' }}>
              SAAJNIKA
            </h3>
          </div>

          <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Saajnika is India's premier luxury fashion house dedicated to preserving generational handloom artistry. Every piece is handcrafted by master weavers in Varanasi and Kanchipuram with certified pure silks and real gold electroplated zari.
          </p>

          <div style={{ display: 'flex', gap: '16px', color: 'var(--gold-light)', fontSize: '0.8rem' }}>
            <span>● 100% Certified Mulberry Silk</span>
            <span>● Hallmarked Zari</span>
            <span>● Made-to-Measure</span>
          </div>
        </div>

        {/* Flagship Boutiques Column */}
        <div>
          <h4 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '16px' }}>
            Flagship Boutiques
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {stores.length > 0 ? (
              stores.map((s) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={15} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{s.name}</strong>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{s.address}, {s.city}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--gold-muted)' }}>{s.phone_number}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p><strong>Mumbai:</strong> Kala Ghoda Atelier, Fort</p>
                <p><strong>New Delhi:</strong> The Colonnade, Mehrauli</p>
                <p><strong>Bangalore:</strong> Pavilion at UB City</p>
                <p><strong>Hyderabad:</strong> Atelier Banjara Hills</p>
              </>
            )}
          </div>
        </div>

        {/* Concierge & Client Care */}
        <div>
          <h4 className="font-serif" style={{ fontSize: '1.2rem', color: 'var(--gold-light)', marginBottom: '16px' }}>
            Client Concierge & Care
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="#consultation" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Private Bridal Styling Consultation</a></li>
            <li><a href="#collect" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Click-and-Collect Boutique Pickup</a></li>
            <li><a href="#care" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Silk & Zari Preservation Protocol</a></li>
            <li><a href="#shipping" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Insured Global & Domestic Shipping</a></li>
            <li><a href="#authenticity" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Silk Mark Certified Guarantee</a></li>
          </ul>

          <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-main)' }}>
              Concierge Hours: 10:00 AM – 8:00 PM IST
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--gold-light)', marginTop: '2px' }}>
              concierge@saajnika.com • +91 22 2288 4500
            </p>
          </div>
        </div>

      </div>

      {/* Engineering Architecture Strip */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.78rem',
        color: 'var(--text-dim)',
      }}>
        <p>© 2026 Saajnika Haute Couture Ltd. All rights reserved.</p>
        <p>Architecture: Django 5.1 • PostgreSQL 16 • Redis 7 • Celery 5.4 • Cloudinary • React 19</p>
      </div>

    </footer>
  );
}
