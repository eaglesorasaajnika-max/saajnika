# Saajnika API Integration Guide

## 1. Integration Model & Philosophy

The Saajnika frontend is decoupled from the Django REST Framework (DRF) backend. The backend serves as the authoritative source of truth for all domain rules, pricing, inventory, tax, and order state.

### Architectural Rules
- The frontend **never** generates final order prices or verifies coupons client-side.
- All requests communicate with the DRF server via `/api/` endpoints.
- During isolated frontend development when the backend server is not running locally, the frontend utilizes structured mock data located in `src/services/api/mockData.js` rather than broken mock logic.

---

## 2. API Endpoint Mapping

The frontend is architected to consume the following Django REST Framework endpoint domains:

### Authentication & Profiles (`/api/auth/`)
- `POST /api/auth/token/`: Obtain JWT access and refresh tokens.
- `POST /api/auth/token/refresh/`: Refresh expired JWT access token.
- `POST /api/auth/otp/request/`: Request single-use login OTP via SMS/Email.
- `POST /api/auth/otp/verify/`: Verify OTP and exchange for JWT tokens.
- `GET /api/profile/`: Fetch customer details, addresses, and measurements.
- `PUT /api/profile/`: Update customer information.

### Catalog & Discovery (`/api/catalog/` or `/api/products/`)
- `GET /api/categories/`: Hierarchical category tree.
- `GET /api/products/`: Paginated product collection with filter query parameters:
  - `?category=<slug>`
  - `?colors=<color1>,<color2>`
  - `?sizes=<size1>,<size2>`
  - `?min_price=<num>&max_price=<num>`
  - `?search=<query>`
  - `?sort=newest|price_asc|price_desc|popularity`
  - `?page=<num>`
- `GET /api/products/{id}/`: Full product detail, SKU variants, gallery, and craftsmanship metadata.
- `GET /api/catalog/facets/`: Dynamic filter facets and price boundary values.

### Authoritative Cart (`/api/cart/`)
- `GET /api/cart/`: Fetch authoritative cart summary with line items, tax, shipping, and discount calculations.
- `POST /api/cart/items/`: Add SKU variant to cart with live inventory check.
- `PATCH /api/cart/items/{id}/`: Update item quantity (clamped to available stock).
- `DELETE /api/cart/items/{id}/`: Remove item from cart.
- `POST /api/cart/apply-coupon/`: Server-validated voucher application.
- `DELETE /api/cart/remove-coupon/`: Remove voucher.
- `POST /api/cart/merge/`: Merge guest cart with authenticated customer cart upon login.

### Wishlist & Curations (`/api/wishlist/`)
- `GET /api/wishlist/`: Retrieve saved couture items.
- `POST /api/wishlist/`: Toggle or save product to wishlist.
- `DELETE /api/wishlist/{product_id}/`: Remove item.

### Checkout & Payments (`/api/checkout/` & `/api/payments/`)
- `POST /api/checkout/summary/`: Authoritative pre-order review.
- `POST /api/payments/create-order/`: Create server-side Razorpay payment order.
- `POST /api/payments/verify/`: Submit signature verification to backend.

### Orders & Tracking (`/api/orders/`)
- `GET /api/orders/`: Customer order history.
- `GET /api/orders/{id}/`: Detailed order snapshot and timeline.
- `GET /api/shipping/track/{id}/`: Live tracking integration.

---

## 3. Environment Configuration

The API base URL is configured in `.env` using Vite conventions:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

During local development, `vite.config.js` proxies `/api` requests to `http://127.0.0.1:8000` to prevent cross-origin resource sharing (CORS) complications.
