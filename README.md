# SAAJNIKA — Frontend

### Production-Ready Women's Fashion E-Commerce Platform

This repository contains the **React frontend** for Saajnika, a production-style women's-fashion e-commerce platform.

The frontend is responsible for the customer and administrative web interface defined in the Saajnika Internship Project Implementation Plan. It communicates with the Django REST Framework API for authentication, catalog, cart, checkout, payments, orders, shipping, and administration.

> **Important:** The technology stack below follows the internship project plan exactly. No frontend technology has been substituted.

---

# 🛠️ Technology Stack

| Layer | Required Technology | Frontend Responsibility |
|---|---|---|
| Frontend | **React** | Component-based web application |
| UI | **Bootstrap / Tailwind** | Responsive and maintainable UI |
| Backend API | **Django + Django REST Framework** | REST API consumed by frontend |
| Authentication | **JWT / SimpleJWT** | Access/refresh-token based authentication |
| Database | **PostgreSQL** | Persistent data accessed through the API |
| Media | **Cloudinary** | Product/banner media delivered to frontend |
| Cache / Broker | **Redis** | Backend infrastructure; frontend consumes resulting API data |
| Async Jobs | **Celery** | Backend background processing |
| Payments | **Razorpay** | Customer payment checkout flow |
| Shipping | **Shiprocket or equivalent** | Shipping/serviceability/tracking data |
| Web Server | **Nginx + Gunicorn** | Production serving infrastructure |
| Containers | **Docker + Docker Compose** | Reproducible application environment |
| Version Control | **Git + GitHub/GitLab** | Source control and collaboration |
| Testing | **Pytest / Django tests + API tests** | Backend/API testing; frontend flows must also be validated |

The required project technology baseline is React with Bootstrap/Tailwind on the frontend and Django + Django REST Framework on the backend. fileciteturn0file0L37-L65

---

# 🚀 Frontend Scope

The frontend implements the web experience for the complete customer journey:

```text
Home
   ↓
Categories
   ↓
Product Listing
   ↓
Search / Filters
   ↓
Product Details
   ↓
Cart
   ↓
Address
   ↓
Checkout
   ↓
Payment
   ↓
Order Confirmation
   ↓
Order Tracking
```

The frontend must also provide the required administrative interface for:

- Products
- Inventory
- Orders
- Coupons
- Banners
- Promotions
- Customers
- Payments

The project plan defines these customer and operational capabilities as part of the complete system. fileciteturn0file0L21-L36

---

# 🖥️ Frontend Screens

The frontend must contain the following screens defined in the project plan.

| Screen | Required Contents |
|---|---|
| **Home** | Header, search, categories, hero/banner, featured products, offers and footer |
| **Product Listing** | Filters, sorting, pagination, product cards and stock state |
| **Product Detail** | Gallery, title, price, discount, sizes/variants, quantity, stock, add-to-cart/buy-now |
| **Cart** | Items, quantity controls, coupon, price breakdown and checkout CTA |
| **Checkout** | Address selection, delivery, order summary and payment CTA |
| **Payment Result** | Success/failure/pending states with recovery actions |
| **Orders** | Order list and order detail with status timeline |
| **Account** | Profile, addresses, wishlist and security/logout |
| **Admin** | Operational dashboard for products, orders, inventory and promotions |

fileciteturn0file0L272-L284

---

# 🏠 Home Page

The Home page provides:

- Header
- Search
- Category navigation
- Hero/banner section
- Featured products
- Offers
- Footer

Product and banner media are provided through the backend/media system using Cloudinary.

---

# 🛍️ Product Listing

The product listing interface supports:

- Category navigation
- Product search
- Filters
  - Category
  - Size
  - Price range
  - Availability
  - Relevant product attributes
- Sorting
  - Newest
  - Price ascending
  - Price descending
  - Relevance
- Pagination
- Featured products
- New products
- Discounted products
- Product stock state

These catalog behaviours are defined in the project plan. fileciteturn0file0L133-L140

---

# 👗 Product Detail

The Product Detail page provides:

- Product gallery
- Product title
- Description
- Price
- Sale/discount information
- Size/variant selection
- Quantity
- Stock status
- Add to Cart
- Buy Now
- Related products

The UI must prevent customers from attempting to purchase out-of-stock variants. fileciteturn0file0L127-L140

---

# 🛒 Cart

The Cart screen provides:

- Cart items
- Quantity controls
- Remove item
- Variant information
- Stock state
- Coupon input
- Price breakdown
- Checkout CTA

The frontend displays pricing and stock information returned by the server. The browser is not the authority for final pricing or inventory.

---

# 💳 Checkout

The Checkout screen provides:

- Delivery address selection
- Delivery information
- Order summary
- Discount information
- Shipping/tax/fee information where applicable
- Final payable amount
- Payment CTA

The backend remains authoritative for:

- Cart validation
- Stock validation
- Coupon validation
- Pricing
- Final total
- Order creation

The frontend must therefore treat checkout data returned by the API as authoritative. fileciteturn0file0L147-L163

---

# 💰 Razorpay Payment UI

The frontend integrates with the **Razorpay** payment flow specified in the project plan.

```text
React Frontend
      ↓
Django REST API
      ↓
Validate Cart / Stock / Pricing
      ↓
Create Razorpay Order
      ↓
Razorpay Checkout
      ↓
Customer Payment
      ↓
Backend Verification
      ↓
Order Confirmation
```

The frontend may receive payment identifiers from Razorpay and send them to the backend for verification.

The frontend must **never contain or expose the Razorpay secret key**. Payment signature verification and webhook processing remain backend responsibilities. fileciteturn0file0L176-L198

---

# 💵 Payment Result States

The frontend must handle:

```text
SUCCESS
FAILED
PENDING
```

Payment states must provide clear recovery actions.

Examples:

- Retry payment
- Return to checkout
- View order
- Continue shopping

The project plan explicitly requires clear actions for pending/failed payment states. fileciteturn0file0L285-L290

---

# 📦 Orders

The Orders section provides:

- Order list
- Order details
- Purchased items
- Purchased prices
- Discounts
- Delivery information
- Payment reference/status where appropriate
- Order status timeline
- Tracking information
- Cancellation action where supported

The backend controls the valid order state transitions:

```text
CREATED
   ↓
PAYMENT_PENDING
   ↓
PAID
   ↓
PROCESSING
   ↓
PACKED
   ↓
SHIPPED
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

Exception states may include:

```text
PAYMENT_FAILED
CANCELLED
RETURN_REQUESTED
RETURNED
REFUNDED
```

The frontend displays the state supplied by the backend and does not independently change order state. fileciteturn0file0L164-L175

---

# 👤 Account

The Account section includes:

- Profile
- Addresses
- Wishlist
- Order history
- Account operations
- Security/logout

The customer must only see their own account, address, wishlist and order information.

Authorization remains enforced by the server. fileciteturn0file0L105-L109

---

# 🧑‍💼 Admin Frontend

The frontend provides operational screens for the administration system.

### Products

- Create/edit products
- Manage variants
- Manage prices
- Manage images
- Manage stock
- Archive products

### Categories

- Create categories
- Reorder categories
- Control visibility

### Orders

- Search orders
- Inspect orders
- Update permitted states
- Cancel/refund where supported

### Payments

- View payment references
- View reconciliation status

### Coupons

- Create coupon codes
- Validity
- Usage limits
- Minimum order value
- Discount rules

### Banners

- Manage homepage banners
- Manage carousel content
- Control ordering

### Customers

- Search customer accounts
- View relevant customer/order information

### Inventory

- Stock adjustments
- Low-stock visibility
- Inventory history

### Audit

- Display relevant audit information provided by the API

These modules correspond to the administration scope in the project plan. fileciteturn0file0L234-L246

---

# 🔐 Authentication

Authentication uses the project's required **JWT / SimpleJWT** architecture.

Expected frontend flow:

```text
Send OTP
   ↓
Verify OTP
   ↓
Receive Access + Refresh Tokens
   ↓
Authenticated Application
   ↓
Access Token Expires
   ↓
Refresh Token Flow
   ↓
Continue Session / Logout
```

The frontend must support:

- Login/authentication flow
- OTP verification UI
- Protected routes
- Access-token handling
- Refresh-token flow
- Logout
- Authentication failure handling

The project plan requires short-lived access tokens, controlled refresh, OTP expiry/single-use behaviour, and protected server endpoints. fileciteturn0file0L97-L115

---

# 🔌 API Integration

The React application communicates with the **Django REST Framework API**.

## Authentication

```text
/api/auth/send-otp/
/api/auth/verify-otp/
/api/auth/refresh/
/api/auth/logout/
```

## Profile

```text
/api/profile/
/api/profile/update/
```

## Products

```text
/api/products/
/api/products/{id}/
/api/products/home/
```

## Categories

```text
/api/categories/
/api/categories/{slug}/
```

## Cart

```text
/api/cart/
/api/cart/add/
/api/cart/update/
/api/cart/remove/
```

## Addresses

```text
/api/addresses/
/api/addresses/{id}/
```

## Wishlist

```text
/api/wishlist/
/api/wishlist/toggle/
```

## Checkout

```text
/api/checkout/
/api/buy-now/
```

## Payments

```text
/api/payments/create/
/api/payments/verify/
/api/payments/webhook/
```

## Orders

```text
/api/orders/
/api/orders/{id}/
/api/orders/{id}/cancel/
```

## Shipping

```text
/api/shipping/serviceability/
/api/shipping/track/{id}/
```

## Admin

```text
/api/admin/products/
/api/admin/orders/
/api/admin/inventory/
```

These endpoint domains follow the API design specified in the implementation plan. fileciteturn0file0L247-L266

---

# 📁 Frontend Repository Structure

The project plan specifies `frontend/` as the React application. A clean React organization can be maintained inside that directory:

```text
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── product/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── order/
│   │   └── admin/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetail/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── PaymentResult/
│   │   ├── Orders/
│   │   ├── Account/
│   │   └── Admin/
│   │
│   ├── services/
│   │   └── api/
│   │
│   ├── hooks/
│   ├── context/
│   ├── routes/
│   ├── utils/
│   └── assets/
│
├── package.json
└── README.md
```

This is a frontend organization proposal; the required project plan itself specifies React under `frontend/` without prescribing a deeper component directory structure. fileciteturn0file0L84-L96

---

# 🔄 Required UI States

Every data-heavy screen must provide:

```text
Loading
   ↓
Success
   ↓
Empty
   ↓
Error
   ↓
Retry
```

Examples:

- Product loading
- Empty product results
- Empty cart
- Empty wishlist
- Empty orders
- API error
- Network error
- Authentication expiry
- Payment failure
- Payment pending
- Out-of-stock variant

The project plan explicitly requires loading, empty, error and retry states for data-heavy screens. fileciteturn0file0L285-L292

---

# 📱 Responsive Design

The frontend must work across:

### Mobile

- Responsive navigation
- Product cards
- Product details
- Cart
- Checkout
- Account

### Tablet

- Responsive product grids
- Checkout layout
- Account/order interfaces

### Desktop

- Full product grids
- Expanded navigation
- Admin operational interface

The implementation plan requires responsive behaviour across mobile, tablet and desktop. fileciteturn0file0L285-L292

---

# ♿ Accessibility

The frontend should maintain:

- Accessible labels
- Keyboard navigation where applicable
- Readable contrast
- Clear form feedback
- Usable controls
- Responsive layouts

These are part of the required UX edge cases in the project plan. fileciteturn0file0L285-L292

---

# 🛡️ Frontend Security Rules

The frontend must follow these rules:

- Never expose backend secrets
- Never expose Razorpay secret keys
- Never expose database credentials
- Never store production secrets in source control
- Do not trust browser-calculated final prices
- Do not trust browser-calculated inventory
- Respect server-side permissions
- Handle expired/invalid JWT gracefully
- Do not expose internal backend errors to customers
- Use API validation responses to provide actionable UI errors

The project plan specifically requires secrets to be stored through environment variables/secret management and requires server-side validation for sensitive operations. fileciteturn0file0L110-L123

---

# ⚙️ Environment Configuration

The exact frontend environment-variable names should match the React build configuration used by the project.

Example:

```env
API_BASE_URL=http://localhost:8000/api
```

Only browser-safe configuration belongs in the frontend environment.

Do **not** put these in the React environment:

```text
RAZORPAY_SECRET
DATABASE_PASSWORD
JWT_SECRET
CLOUDINARY_API_SECRET
SMTP_PASSWORD
SHIPPING_PRIVATE_API_KEY
```

---

# 💻 Frontend Development

## Prerequisites

Install the React project's required Node.js environment and package manager.

## Clone

```bash
git clone <YOUR_REPOSITORY_URL>
cd saajnika/frontend
```

## Install Dependencies

Use the package manager defined by the actual project configuration.

```bash
npm install
```

## Start Development

Use the development script defined in `package.json`.

```bash
npm run dev
```

> The project plan specifies **React + Bootstrap/Tailwind** but does not prescribe a specific React build tool or package manager. Therefore this README intentionally does not replace the documented stack with Vite, Next.js, or another framework.

---

# 🧪 Frontend Quality & Testing

The project plan requires frontend coverage for:

### Critical Components

- Forms
- Product components
- Cart controls
- Loading/error states
- Checkout flow

### Critical Purchase Journey

```text
Browse Product
   ↓
Select Variant
   ↓
Add to Cart
   ↓
Checkout
   ↓
Payment
   ↓
Order Confirmation
   ↓
Order Tracking
```

### Critical Frontend Scenarios

- Two checkout attempts
- Out-of-stock variant
- Payment failure
- Payment pending
- Authentication expiry during checkout
- API failure
- Shipping provider failure
- Empty cart
- Empty order history

The project plan specifically lists the frontend critical-component layer and the critical purchase journey as regression concerns. fileciteturn0file0L315-L328

---

# 🗺️ Frontend Implementation Sequence

The frontend follows the overall project milestone sequence:

| Phase | Frontend Deliverable |
|---|---|
| 1 | Foundation and application structure |
| 2 | Authentication UI and protected routes |
| 3 | Product catalog, listing and detail |
| 4 | Cart UI |
| 5 | Checkout and address UI |
| 6 | Razorpay payment flow and result states |
| 7 | Orders and order status timeline |
| 8 | Notification-related UI states |
| 9 | Shipping/serviceability/tracking UI |
| 10 | Production-ready UI, admin and final testing |

The overall ten-phase implementation sequence is defined in the project plan. fileciteturn0file0L293-L314

---

# ✅ Frontend Definition of Done

The frontend portion is ready when:

### Customer Screens

- [ ] Home completed
- [ ] Product listing completed
- [ ] Product detail completed
- [ ] Cart completed
- [ ] Checkout completed
- [ ] Payment result states completed
- [ ] Orders completed
- [ ] Account completed

### Catalog

- [ ] Search
- [ ] Filters
- [ ] Sorting
- [ ] Pagination
- [ ] Variant selection
- [ ] Stock state
- [ ] Product gallery

### Commerce

- [ ] Cart quantity controls
- [ ] Coupon UI
- [ ] Price breakdown
- [ ] Address selection
- [ ] Checkout CTA
- [ ] Buy Now

### Payments

- [ ] Razorpay checkout integration
- [ ] Success state
- [ ] Failure state
- [ ] Pending state
- [ ] Recovery actions

### Orders

- [ ] Order list
- [ ] Order detail
- [ ] Status timeline
- [ ] Tracking information
- [ ] Cancellation UI where supported

### UX

- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Retry actions
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] Accessible labels
- [ ] Readable contrast

### Security

- [ ] No backend secrets in frontend
- [ ] No Razorpay secret in frontend
- [ ] Protected routes
- [ ] JWT expiry handled
- [ ] Server-side authorization respected

---

# 📸 Screenshots

Recommended screenshot directory:

```text
docs/
└── screenshots/
    ├── home.png
    ├── product-listing.png
    ├── product-detail.png
    ├── cart.png
    ├── checkout.png
    ├── payment-result.png
    ├── orders.png
    ├── account.png
    └── admin.png
```

---

# 📌 Project Status

🚧 **Frontend Under Active Development**

The frontend is being implemented as part of the complete Saajnika production e-commerce system.

```text
Foundation
    ↓
Authentication
    ↓
Catalog
    ↓
Cart
    ↓
Checkout
    ↓
Payments
    ↓
Orders
    ↓
Async / Notifications
    ↓
Shipping
    ↓
Admin / Production Readiness
```

---

# 📄 License

Add the applicable project license here.
