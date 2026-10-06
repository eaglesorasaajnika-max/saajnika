# SAAJNIKA

## Production E-Commerce Platform

> Build a real-world, production-ready commerce platform — not just a demo store.

Saajnika is a production-style women's fashion e-commerce platform developed as an internship project. It covers customer accounts, catalog, cart, checkout, payments, orders, shipping, notifications, admin operations, security, background jobs, monitoring, testing, and deployment.

## 🎯 Project Objective

The goal is to demonstrate how a business requirement can be transformed into a reliable, secure, maintainable, production-style e-commerce application.

### Core Customer Journey

```text
Home → Categories → Product Listing → Search / Filters → Product Details
→ Variant / Size → Add to Cart / Buy Now → Address → Delivery → Coupon
→ Payment → Order Confirmation → Order Tracking
```

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Backend | Node.js + TypeScript |
| API | Express.js |
| Database | Firebase Realtime Database |
| Authentication | Firebase Authentication |
| Validation | Zod |
| Media | Cloudinary |
| Cache | Redis |
| Background Jobs | BullMQ + Redis |
| Payments | Razorpay |
| Shipping | Shiprocket or equivalent |
| API Documentation | Swagger / OpenAPI |
| Testing | Jest + Supertest |
| Web Server | Nginx |
| Containers | Docker + Docker Compose |
| Version Control | Git + GitHub |
| Monitoring | Structured Logging + Sentry |

## 🏗️ Architecture

```text
Customer
   │
   ▼
React + TypeScript + Tailwind
   │ HTTPS
   ▼
Node.js + Express REST API
   ├──────────────► Firebase Realtime Database
   ├──────────────► Cloudinary
   ├──────────────► Razorpay
   ├──────────────► Shiprocket
   └──────────────► Redis
                         │
                         ▼
                      BullMQ
                         │
                         ▼
                 Background Workers
```

## 🗄️ Database

Firebase Realtime Database is the primary application data store.

```text
saajnika/
├── users/
├── products/
├── categories/
├── variants/
├── inventory/
├── carts/
├── wishlists/
├── addresses/
├── coupons/
├── orders/
├── payments/
├── shipments/
├── banners/
├── notifications/
└── auditLogs/
```

Firebase stores application data. Large image files are stored in Cloudinary; Firebase stores their URLs and metadata.

## 🖼️ Media Management

Cloudinary is used for product images, thumbnails, category images, promotional banners, and brand assets.

```text
Cloudinary → Actual image files
Firebase   → Image URL + metadata
```

## 🔐 Authentication & Authorization

Authentication is handled using Firebase Authentication. The backend verifies authenticated requests and applies authorization rules.

Roles:

```text
CUSTOMER
ADMIN
```

Customers can manage their own profile, addresses, cart, wishlist and orders. Admin permissions are enforced server-side for products, categories, variants, inventory, orders, payments, coupons, banners, customers and audit information.

## 🛍️ Catalog

The catalog supports products, categories, variants, SKU, pricing, stock, images, search, filters, sorting, pagination, featured/new/discounted products, related products and out-of-stock handling.

Example product structure:

```text
Product
├── Name
├── Slug
├── Description
├── Category
├── Brand / Collection
├── Base Price
├── Sale Price
├── Status
├── SEO Metadata
├── Images
├── Variants
└── Timestamps
```

## 📦 Inventory

The backend validates stock during checkout, prevents negative inventory, handles concurrent purchases, supports stock restoration where appropriate, and provides inventory history and admin visibility.

Stock must be validated again during checkout, not only when an item is added to the cart.

## 🛒 Cart & Checkout

```text
Cart → Address → Delivery → Coupon → Server-side Pricing → Order Creation → Payment
```

The backend is authoritative for price, discount, stock, coupon validity and final payable amount.

## 🎟️ Coupons

Coupon rules can include code, expiry, minimum order value, discount, usage limit, customer eligibility, and active/inactive state. All rules are validated server-side.

## 💰 Razorpay Payments

```text
Customer
   ↓
Checkout
   ↓
Backend validates cart, stock and amount
   ↓
Backend creates Razorpay Order
   ↓
Frontend opens Razorpay Checkout
   ↓
Payment completed
   ↓
Backend verifies signature
   ↓
Razorpay Webhook
   ↓
Webhook verified and processed idempotently
   ↓
Payment / Order updated
```

Never trust a browser-supplied final amount or frontend-only payment success. Razorpay secret keys must remain on the backend.

### Payment Audit Fields

```text
internal_order_id
razorpay_order_id
razorpay_payment_id
signature
status
webhook_event_id
created_at
updated_at
```

## 📋 Orders

Orders preserve historical item prices, SKU/variant information, quantities, discounts, address snapshots, payment references, payment status, order status, shipment details, and timestamps.

### Order States

```text
CREATED → PAYMENT_PENDING → PAID → PROCESSING → PACKED
→ SHIPPED → OUT_FOR_DELIVERY → DELIVERED
```

Possible exceptions: `PAYMENT_FAILED`, `CANCELLED`, `RETURN_REQUESTED`, `RETURNED`, `REFUNDED`.

## 🚚 Shipping

Shiprocket or an equivalent provider can handle pincode/serviceability, shipment creation, courier selection, shipment/tracking IDs, tracking updates and delivery status. Provider failures must be handled safely and retryable operations should be idempotent.

## ⚡ Redis & BullMQ

Redis is used for caching and queue infrastructure. BullMQ handles asynchronous work such as order emails, payment/shipping notifications, OTP delivery, payment reconciliation, abandoned-cart cleanup, scheduled tasks and provider retries.

```text
API Request → Redis Queue → BullMQ Worker → Process Job
```

Background work should not unnecessarily block customer-facing API requests.

## 👨‍💼 Admin Operations

Admin functionality includes:

- Products: create/edit/archive, variants, prices, images, stock
- Categories: create/reorder/visibility
- Orders: search, inspect, allowed status updates, cancellation/refunds where supported
- Payments: payment references and reconciliation status
- Coupons: codes, limits, validity, minimum order and discounts
- Banners: homepage content and ordering
- Customers: controlled account/order information
- Inventory: adjustments, low-stock visibility and history
- Audit logs: who changed what and when

## 🌐 API Structure

```text
/api/auth/...
/api/profile/
/api/profile/update/
/api/products/
/api/products/:id
/api/products/home/
/api/categories/
/api/categories/:slug
/api/cart/
/api/cart/add/
/api/cart/update/
/api/cart/remove/
/api/addresses/
/api/addresses/:id
/api/wishlist/
/api/wishlist/toggle/
/api/checkout/
/api/buy-now/
/api/payments/create/
/api/payments/verify/
/api/payments/webhook/
/api/orders/
/api/orders/:id
/api/orders/:id/cancel/
/api/shipping/serviceability/
/api/shipping/track/:id
/api/admin/products/
/api/admin/orders/
/api/admin/inventory/
```

## 📱 Frontend Screens

Customer screens include Home, Product Listing, Product Details, Cart, Checkout, Payment Result, Orders, Order Details, Account, Addresses and Wishlist.

Admin screens include Dashboard, Products, Categories, Inventory, Orders, Payments, Coupons, Banners, Customers and Audit Logs.

Every data-heavy screen should handle loading, empty, error, retry and success states. Payment pending/failed, expired authentication, out-of-stock variants, network failures and duplicate checkout clicks must have clear handling. The UI should be responsive across mobile, tablet and desktop.

## 🔒 Security

Security is a core feature.

Implement authentication, authorization, input validation, rate limiting, explicit CORS, secure error handling, upload validation, webhook signature verification, idempotency and PII protection.

Never commit or expose:

```text
.env
Firebase private keys
Razorpay secrets
Cloudinary API secret
Redis credentials
Shiprocket credentials
```

## ⚙️ Environment Variables

### Backend

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_DATABASE_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

REDIS_URL=

SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=

SENTRY_DSN=
```

### Frontend

Only browser-safe/public configuration belongs here:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Never expose `RAZORPAY_KEY_SECRET`, `CLOUDINARY_API_SECRET`, `FIREBASE_PRIVATE_KEY`, Redis credentials or Shiprocket credentials to the browser.

## 📁 Repository Structure

```text
saajnika/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── queues/
│   │   ├── workers/
│   │   ├── utils/
│   │   └── server.ts
│   ├── tests/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── types/
│   │   └── utils/
│   ├── public/
│   ├── package.json
│   └── .env.example
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── deployment/
│   └── testing/
├── docker/
├── docker-compose.yml
├── .gitignore
├── README.md
└── package.json
```

## 🧪 Testing

Testing covers unit, API, integration, frontend, security and regression layers.

Critical scenarios include:

- Two users attempting to purchase the last unit simultaneously
- Payment succeeding while the frontend callback is interrupted
- Duplicate payment webhooks
- Payment failure after internal order creation
- Expired/invalid/overused coupons
- JWT/authentication expiry during checkout
- Temporary email provider failure and BullMQ retry
- Shipping provider timeout
- Customer/admin permission boundary violations

## 🐳 Docker

Example services:

```text
frontend
backend
redis
nginx
```

Firebase, Cloudinary, Razorpay and Shiprocket remain external services.

```bash
docker compose up --build
docker compose down
```

## 🚀 Local Development

### 1. Clone

```bash
git clone https://github.com/eaglesorasaajnika-max/saajnika.git
cd saajnika
```

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure environment

Create `backend/.env` and `frontend/.env` using the corresponding `.env.example` files.

### 4. Start backend

```bash
cd backend
npm run dev
```

Default backend URL:

```text
http://localhost:5000
```

### 5. Start frontend

```bash
cd frontend
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## 📖 API Documentation

Swagger/OpenAPI documentation should include endpoints, methods, authentication requirements, request bodies, query parameters, responses, errors and examples.

## 🌍 Deployment

The project supports local, staging and production environments.

```text
Internet
   ↓
HTTPS
   ↓
Nginx
   ↓
Node.js + Express
   ↓
Firebase Realtime Database

External:
├── Cloudinary
├── Redis
├── Razorpay
├── Shiprocket
└── Sentry
```

Production requirements include HTTPS, secure environment variables, Docker, Nginx, Redis/BullMQ workers, structured logs, monitoring, recovery procedures and rollback strategy.

## 💾 Backup & Recovery

Firebase Realtime Database is the application database. Firebase-supported backup/export and recovery mechanisms should be configured, documented and tested.

A backup that has never been restored should not be considered a proven recovery strategy.

## 📅 20-Day Implementation Plan

| Day | Focus |
|---|---|
| 1 | Repository, architecture and environment setup |
| 2 | Firebase Realtime Database + Cloudinary |
| 3 | Authentication and authorization |
| 4 | Product/catalog backend |
| 5 | Product catalog frontend |
| 6 | Cloudinary media + wishlist |
| 7 | Cart |
| 8 | Checkout + address + coupons |
| 9 | Razorpay integration |
| 10 | Orders + status transitions |
| 11 | Admin operations |
| 12 | Redis + BullMQ + notifications |
| 13 | Shipping integration |
| 14 | Security hardening |
| 15 | Unit/API testing |
| 16 | Payment, webhook and failure testing |
| 17 | Frontend UX and responsive polish |
| 18 | Docker + Nginx + deployment |
| 19 | Full QA + bug fixing |
| 20 | Documentation + final handover |

## 📋 Definition of Done

- [ ] Customer registration/login works.
- [ ] Protected APIs are implemented.
- [ ] Customer can browse/search/filter products.
- [ ] Product variants work.
- [ ] Product images are managed through Cloudinary.
- [ ] Cart functionality works.
- [ ] Stock is validated during checkout.
- [ ] Pricing is calculated server-side.
- [ ] Coupons are validated server-side.
- [ ] Delivery addresses work.
- [ ] Razorpay sandbox payment works.
- [ ] Payment signatures are verified.
- [ ] Payment webhooks are verified.
- [ ] Duplicate webhook processing is prevented.
- [ ] Orders preserve historical item prices and address snapshots.
- [ ] Order status transitions are controlled.
- [ ] Background jobs work through BullMQ/Redis.
- [ ] Notifications use background processing where appropriate.
- [ ] Admin can manage products, inventory, orders and promotions.
- [ ] Shipping integration is implemented or cleanly abstracted.
- [ ] API validation and authorization work.
- [ ] Critical tests pass.
- [ ] Frontend handles loading, empty, error and payment states.
- [ ] Production secrets are not committed.
- [ ] Docker environment is reproducible.
- [ ] Deployment is documented.
- [ ] Logs and monitoring are available.
- [ ] README and API documentation are complete.

## 🔀 Git Workflow

Use feature branches:

```text
main
└── develop
    ├── feature/auth
    ├── feature/catalog
    ├── feature/cart
    ├── feature/checkout
    ├── feature/payment
    ├── feature/orders
    ├── feature/shipping
    └── feature/admin
```

Example:

```bash
git checkout -b feature/catalog
git add .
git commit -m "feat: implement product catalog"
git push origin feature/catalog
```

Use Pull Requests for meaningful changes. Never commit `.env`, secrets, private keys, database dumps or generated build artifacts.

## 📦 Final Handover

The final project should contain:

```text
Source Code
README
Environment Documentation
API Documentation
Firebase Data Structure
Architecture Diagram
Test Report
Deployment Guide
Demo
```

The final demonstration should cover the customer purchase journey, admin operations, payment flow, shipping, and failure/edge cases.

## 👥 Project Information

**Project:** Saajnika Production E-Commerce  
**Project Type:** Internship Assignment  
**Domain:** Women's Fashion E-Commerce  
**Frontend:** React + TypeScript + Tailwind CSS  
**Backend:** Node.js + Express + TypeScript  
**Database:** Firebase Realtime Database  
**Authentication:** Firebase Authentication  
**Media:** Cloudinary  
**Cache / Queue:** Redis + BullMQ  
**Payments:** Razorpay  
**Shipping:** Shiprocket / Equivalent

## 📜 License

This project is developed as part of an internship/project assignment. Usage and distribution are subject to the project owner and organization requirements.

> **Build it like someone will actually have to operate it after you leave.**
