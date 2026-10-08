# Saajnika Luxury Design System

## 1. Aesthetic Vision & Brand Persona

Saajnika is an ultra-premium Indian haute-couture and contemporary women's fashion house. The user interface must reflect timeless refinement, high artisanal craft, and serene minimalism.

### Key Visual Tenets:
- **Haute Couture Aesthetic:** Generous negative space, editorial typography, obsidian depth, and luminous champagne/gold accents.
- **Glassmorphism & Surface Depth:** Frosted dark acrylic layers (`backdrop-filter: blur(16px)`), micro-borders, and gold ambient glows.
- **Micro-Interactions:** Subtle ease-out transitions (600ms cubic-bezier), gentle image scalings, and tactile button states.

---

## 2. Typography

We pair a high-fashion editorial serif with an ultra-clean contemporary geometric sans-serif.

| Role | Font Family | Google Fonts Fallback | Usage |
|---|---|---|---|
| **Display / Serif** | `'Cormorant Garamond'` | Georgia, serif | Hero titles, editorial quotes, couture headings, product titles |
| **Body / Sans** | `'Plus Jakarta Sans'` | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Navigation, prices, buttons, specifications, body copy |

### CSS Variables:
```css
--font-serif: 'Cormorant Garamond', Georgia, serif;
--font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

## 3. Color Palette & Surface Tokens

### Obsidian & Charcoal Backgrounds
- `--bg-obsidian`: `#08080a` (Deepest canvas background)
- `--bg-primary`: `#0d0d11` (Primary layout surface)
- `--bg-secondary`: `#131318` (Secondary containers & section panels)
- `--bg-surface`: `#181820` (Elevated card surfaces)
- `--bg-card`: `rgba(22, 22, 29, 0.78)` (Frosted acrylic glass panels)
- `--bg-modal`: `rgba(13, 13, 17, 0.94)` (Modal and drawer overlays)

### Gold & Champagne Accents
- `--gold-primary`: `#d4af37` (Core gold accent)
- `--gold-light`: `#f3e5ab` (Champagne highlight)
- `--gold-dark`: `#aa820a` (Burnished gold)
- `--gold-muted`: `rgba(212, 175, 55, 0.4)` (Subtle gold borders)
- `--gold-metallic`: `linear-gradient(135deg, #fdfbf7 0%, #f3e5ab 35%, #d4af37 70%, #8a6e14 100%)`
- `--gold-btn-gradient`: `linear-gradient(135deg, #e4be46 0%, #d4af37 50%, #9e7a08 100%)`

### Rose & Warm Accents
- `--rose-accent`: `#e0a899` (Silk rose highlight)
- `--rose-glow`: `rgba(224, 168, 153, 0.2)`

### Typography Colors
- `--text-main`: `#f5f5f7` (Primary legible text)
- `--text-secondary`: `#d1d1d8` (Secondary content)
- `--text-muted`: `#9e9ea7` (Subtle captions and descriptors)
- `--text-dim`: `#65656d` (Disabled or tertiary metadata)

### Status Indicators
- `--success`: `#10b981` (In-stock, successful voucher, payment authorized)
- `--danger`: `#ef4444` (Out of stock, invalid input, failed payment)
- `--warning`: `#f59e0b` (Low stock warning, pending state)

---

## 4. UI Primitives & Component Patterns

1. **Buttons (`Button.jsx`):**
   - `primary`: Gold metallic gradient with dark text.
   - `secondary`: Dark charcoal background with subtle gold border.
   - `ghost`: Transparent with gold hover underline.
2. **Badges (`Badge.jsx`):**
   - High-contrast, micro-padded tags for "Bespoke", "Limited Run", "Ready to Ship", "Pre-Order".
3. **Drawers (`CartDrawer.jsx`, `WishlistDrawer.jsx`, `FilterDrawer.jsx`):**
   - Right-side sliding panel with dark backdrop and smooth spring animations.
4. **Modals (`ProductDetailModal.jsx`, `QuickViewModal.jsx`, `ConciergeBookingModal.jsx`):**
   - Centered floating glass viewport with accessible close trigger (`Escape` key support).

---

## 5. Required UI States

Every data-dependent view must provide dedicated UI states:
- **Loading State:** Subtle shimmering skeleton loaders or gold spinners (no disruptive layout jumps).
- **Success State:** Clear visual hierarchy with responsive data display.
- **Empty State:** High-fashion empty illustrations/icons with actionable buttons (e.g. "Explore The Current Collection").
- **Error State:** Elegant, non-technical error notifications with actionable recovery options.
- **Retry State:** One-click retry triggers on network or probe failures.
