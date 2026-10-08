# Saajnika Frontend Architecture

## 1. Architectural Overview & Philosophy

Saajnika is a luxury women's haute-couture e-commerce platform. The frontend is built with **React 19** and **Vite**, communicating asynchronously with an authoritative **Django REST Framework (DRF)** backend.

### Core Architectural Principles

1. **Zero-Trust Client (Backend Authority):**
   - The frontend is strictly a presentation and interaction layer.
   - Pricing, tax (GST), discounts, coupons, shipping thresholds, stock availability, and order status are calculated and enforced exclusively by the backend.
   - The frontend never computes final payable totals as an authority.
2. **Separation of Concerns:**
   - UI components do not perform direct API calls; network logic is delegated to `services/api/`.
   - Global application state (Authentication, Bag/Cart, Wishlist, Notifications) is encapsulated in React Contexts and custom hooks.
3. **Stateless JWT Authentication:**
   - Access and refresh tokens are managed securely. Token expiration (HTTP 401) triggers automated refresh cycles or graceful redirection to login.
4. **Resilient UX States:**
   - Every data-driven screen must provide: **Loading**, **Success**, **Empty**, **Error**, and **Retry** states.

---

## 2. Target Directory Structure

The frontend application root is structured as follows:

```text
saajnika-frontend/
│
├── public/                   # Static browser assets (favicon, SVG icons)
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/               # Brand photography & visual assets
│   ├── components/           # Reusable UI components
│   │   ├── common/           # Button, Badge, Modal, Pagination, Toast, Spinner
│   │   ├── layout/           # Navbar, Footer, Container
│   │   ├── product/          # ProductCard, QuickViewModal, ProductDetailModal
│   │   ├── catalog/          # ProductListingHeader, CategoryFilter, FilterDrawer
│   │   ├── cart/             # CartDrawer, CartItemRow, VoucherForm
│   │   ├── wishlist/         # WishlistDrawer, WishlistItem
│   │   ├── home/             # HeroBanner, CuratedLookbook, ArtisanStory
│   │   └── concierge/        # ConciergeBookingModal
│   │
│   ├── pages/                # Route screens (Home, Catalog, ProductDetail, Cart, Checkout, Orders, Account)
│   ├── layouts/              # Shell layouts (StorefrontLayout, AccountLayout, AuthLayout)
│   ├── services/
│   │   └── api/              # API communication layer
│   │       ├── client.js     # Base Fetch/Axios client with interceptors
│   │       ├── authApi.js    # Auth, OTP, Profile endpoints
│   │       ├── catalogApi.js # Categories, Products, Filters endpoints
│   │       ├── cartApi.js    # Server-authoritative cart endpoints
│   │       ├── wishlistApi.js# Wishlist salon endpoints
│   │       ├── orderApi.js   # Checkout, Orders, Payment endpoints
│   │       └── mockData.js   # Isolated fixtures for offline UI development
│   │
│   ├── context/              # Global state providers (Auth, Cart, Wishlist, Notification)
│   ├── hooks/                # Custom hooks (useAuth, useCart, useWishlist, useProducts)
│   ├── routes/               # Route declarations & ProtectedRoute guards
│   ├── utils/                # Currency formatters, validators, session helpers
│   ├── styles/               # Design system & CSS custom property tokens
│   │   └── index.css
│   │
│   ├── App.jsx               # Application shell & root provider
│   ├── index.css             # Base stylesheet & font imports
│   └── main.jsx              # React 19 bootstrap entrypoint
│
├── .env.example              # Browser-safe environment variable template
├── .gitignore                # Source control exclusions
├── package.json              # Dependencies and build scripts
├── vite.config.js            # Vite build and proxy configuration
├── README.md                 # Official company repository specification
├── DEVELOPMENT_LOG.md        # Session milestone log
├── FRONTEND_ARCHITECTURE.md  # Architectural standards (this document)
├── DESIGN_SYSTEM.md          # Luxury UI design system guidelines
├── API_INTEGRATION.md        # Django REST Framework endpoint mapping
└── CHANGELOG.md              # Versioned release notes
```

---

## 3. Current State vs. Target State

| Dimension | Current Foundation State (Day 01) | Target Architecture |
|---|---|---|
| **Root Location** | Clean React 19 application at repository root | Maintained at repository root |
| **Components** | 19 modular UI components in `src/components/` | Sub-categorized into `common/`, `layout/`, `product/`, `cart/`, etc. |
| **State & Routing** | Monolithic state inside `src/App.jsx` | Dedicated React Router + `AuthContext`, `CartContext`, `WishlistContext` |
| **API Layer** | Direct `fetch()` calls inside `App.jsx` | Dedicated client in `src/services/api/` with interceptors and mock fallbacks |
| **Styling** | Luxury CSS design system in `src/index.css` | Modular tokens + component styling adhering to luxury standards |

---

## 4. Security Baseline

- **No Secrets:** Never commit `.env` or reference backend secrets (`DATABASE_URL`, `RAZORPAY_SECRET`, `JWT_SECRET`, etc.).
- **VITE_ Prefix:** Only environment variables prefixed with `VITE_` are exposed to the client.
- **Client Sanitization:** All text inputs are trimmed and validated before transmission.
