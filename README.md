# SAAJNIKA

### Production-Ready Women's Fashion E-Commerce Platform

Saajnika is a production-style women's fashion e-commerce platform designed to provide a complete customer shopping journey — from product discovery and search to cart, checkout, payment, order tracking, and fulfilment.

The platform also provides administrative and operational capabilities for managing products, inventory, orders, payments, coupons, banners, customers, and other business operations.

> Internship Project — Production E-Commerce System

---

## 🚀 Project Overview

Saajnika is not designed as a static or demo store.

The system is built around a complete production-oriented e-commerce workflow:

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
  ↓
Delivery
```

The backend remains authoritative for:

- Pricing
- Inventory
- Payment state
- Order state
- Coupon validation
- Checkout calculations
- Order transitions

---

# ✨ Key Features

## 👩 Customer Features

- Customer registration and login
- JWT authentication
- OTP verification
- Profile management
- Delivery address management
- Product browsing
- Product search
- Product filtering
- Product sorting
- Product variants
- Size/color selection
- Wishlist
- Shopping cart
- Buy Now
- Coupon application
- Checkout
- Razorpay payment
- Order history
- Order tracking
- Account security
- Transactional notifications

---

## 🛍️ Product & Catalog

### Product

- Product name
- Slug
- Description
- Category
- Brand / collection
- Base price
- Sale price
- Product status
- SEO metadata
- Timestamps

### Variants

- Size
- Color
- Other business-specific attributes
- SKU

### Inventory

- Available quantity
- Reserved quantity where applicable
- Low-stock threshold
- Stock status
- Inventory history
- Admin inventory adjustments

### Product Media

Product and banner images are managed through Cloudinary.

Features include:

- Multiple images
- Thumbnails
- Primary image
- Image ordering
- Cloudinary transformations

The system prevents purchasing unavailable variants and revalidates stock during checkout.

---

# 🛒 Cart & Checkout

The checkout system is completely server-controlled.

### Cart

Users can:

- Add products
- Update quantities
- Remove products
- View stock state
- Calculate cart subtotal

### Checkout

The backend calculates:

- Product prices
- Discounts
- Coupon discounts
- Shipping charges
- Applicable taxes/fees
- Final payable amount

The browser is never treated as the source of truth for the final amount.

---

# 💳 Payment System

Saajnika uses **Razorpay** for payment processing.

### Payment Flow

```text
Customer
   ↓
React Frontend
   ↓
Django API
   ↓
Validate Cart
   ↓
Validate Stock
   ↓
Calculate Final Amount
   ↓
Create Razorpay Order
   ↓
Razorpay Checkout
   ↓
Payment
   ↓
Backend Verification
   ↓
Webhook Processing
   ↓
Order Paid
```

### Payment Security

- Razorpay order created server-side
- Server-calculated amount
- Payment signature verification
- Webhook verification
- Webhook idempotency
- Payment audit records
- Duplicate processing prevention
- Secret keys remain server-side

> Razorpay secret keys must never be exposed to the React browser bundle.

---

# 📦 Order Management

Orders use controlled backend state transitions.

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

Orders preserve historical information such as:

- Purchased price
- Discount
- Shipping address snapshot
- SKU / variant information
- Payment references
- Gateway order ID
- Order status
- Timestamps

---

# 🚚 Shipping & Fulfilment

Shipping is designed around a provider abstraction such as Shiprocket or an equivalent provider.

Supported functionality includes:

- Pincode serviceability
- Shipment creation
- Courier selection
- Shipment ID
- Tracking number
- Tracking updates
- Delivery status
- Provider failure handling
- Safe retries

The customer sees simplified shipment statuses without exposing internal provider details.

---

# 📧 Notifications & Background Jobs

Saajnika uses **Celery + Redis** for asynchronous and scheduled processing.

Redis is used for:

- Caching
- Celery message brokering

Celery workers handle:

- Email
- SMS tasks
- OTP delivery
- Order notifications
- Shipping notifications
- Payment reconciliation
- Abandoned-cart cleanup
- Cache invalidation

> Redis itself is not the email system. Celery workers consume queued jobs and communicate with the configured SMTP/email provider.

### Notification Events

- Welcome / account verification
- OTP verification
- Order placed
- Payment successful
- Payment failed
- Order shipped
- Order delivered
- Password/security notifications

Tasks use bounded retries and exponential backoff where appropriate.

---

# 👨‍💼 Admin & Operations

The platform includes administrative functionality for managing the business.

### Admin Modules

#### Products

- Create products
- Edit products
- Archive products
- Manage variants
- Manage prices
- Manage images
- Manage stock

#### Categories

- Create categories
- Reorder categories
- Control visibility

#### Orders

- Search orders
- Inspect orders
- Update allowed states
- Cancel orders
- Refund where supported

#### Payments

- View payment references
- View reconciliation status

#### Coupons

- Create coupon codes
- Configure validity
- Set usage limits
- Configure minimum order value
- Configure discounts

#### Banners

- Manage homepage banners
- Manage carousel content
- Configure ordering

#### Customers

- Search accounts
- View relevant account/order information

#### Inventory

- Stock adjustments
- Low-stock visibility
- Inventory history

#### Audit

- Record admin action
- Record who performed the action
- Record when the action occurred

---

# 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| UI | Bootstrap / Tailwind CSS |
| Backend | Django |
| API | Django REST Framework |
| Database | PostgreSQL |
| Authentication | JWT / SimpleJWT |
| Media Storage | Cloudinary |
| Cache | Redis |
| Message Broker | Redis |
| Background Jobs | Celery |
| Scheduler | Celery Beat |
| Payments | Razorpay |
| Shipping | Shiprocket / Equivalent |
| Web Server | Nginx |
| Application Server | Gunicorn |
| Containers | Docker + Docker Compose |
| Version Control | Git + GitHub/GitLab |
| Testing | Pytest / Django Tests / API Tests |
| Monitoring | Structured Logs + Error Monitoring |

---

# 🏛️ System Architecture

```text
                         ┌──────────────────────┐
                         │      Customer        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │   Customer + Admin   │
                         └──────────┬───────────┘
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │        Nginx         │
                         │    Reverse Proxy     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    Django REST API   │
                         │    Business Logic    │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └─────────────┐
                    ▼                                  ▼
          ┌──────────────────┐                ┌──────────────────┐
          │    PostgreSQL    │                │      Redis       │
          │ Persistent Data  │                │ Cache / Broker   │
          └──────────────────┘                └────────┬─────────┘
                                                       │
                                                       ▼
                                             ┌──────────────────┐
                                             │      Celery       │
                                             │ Background Jobs   │
                                             └───────┬──────────┘
                                                     │
                    ┌────────────────────────────────┼──────────────┐
                    ▼                                ▼              ▼
             ┌────────────┐                  ┌────────────┐  ┌────────────┐
             │ Cloudinary │                  │  Razorpay  │  │ Shiprocket │
             │   Media    │                  │  Payments  │  │  Shipping  │
             └────────────┘                  └────────────┘  └────────────┘
```

---

# 📁 Repository Structure

```text
saajnika/
│
├── backend/
│   ├── apps/
│   │   ├── catalog/
│   │   ├── accounts/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── shipping/
│   │   └── notifications/
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── docker/
│   ├── nginx/
│   └── ...
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── ERD.md
│   ├── TESTING.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 🔐 Authentication & Security

### Authentication

- Custom user model
- JWT access token
- JWT refresh token
- Short-lived access tokens
- Controlled refresh strategy
- OTP verification
- Logout/token invalidation strategy

### Authorization

- Customer role
- Admin role
- Server-side permission enforcement
- Customer data isolation
- Admin endpoint protection

### Security Controls

- HTTPS
- Environment-based secrets
- CORS configuration
- CSRF protection where applicable
- DRF input validation
- Rate limiting
- Webhook signature verification
- Django ORM / parameterized queries
- Upload validation
- PII protection
- No secrets in Git

---

# 🔌 API Structure

## Authentication

```text
POST /api/auth/send-otp/
POST /api/auth/verify-otp/
POST /api/auth/refresh/
POST /api/auth/logout/
```

## Products

```text
GET /api/products/
GET /api/products/{id}/
GET /api/products/home/
```

## Cart

```text
GET    /api/cart/
POST   /api/cart/add/
PATCH  /api/cart/update/
DELETE /api/cart/remove/
```

## Checkout & Payments

```text
POST /api/checkout/
POST /api/buy-now/

POST /api/payments/create/
POST /api/payments/verify/
POST /api/payments/webhook/
```

## Orders

```text
GET  /api/orders/
GET  /api/orders/{id}/
POST /api/orders/{id}/cancel/
```

## Shipping

```text
GET /api/shipping/serviceability/
GET /api/shipping/track/{id}/
```

## Admin

```text
/api/admin/products/
/api/admin/orders/
/api/admin/inventory/
```

---

# 🖥️ Frontend Screens

| Screen | Main Functionality |
|---|---|
| Home | Header, search, categories, banners, offers |
| Product Listing | Filters, sorting, pagination |
| Product Detail | Gallery, variants, pricing, stock |
| Cart | Items, quantities, coupon, price breakdown |
| Checkout | Address, delivery, summary, payment |
| Payment Result | Success, failure, pending states |
| Orders | Order history and tracking |
| Account | Profile, addresses, wishlist, security |
| Admin | Products, orders, inventory, promotions |

---

# 📱 Responsive & UX Requirements

The frontend is designed for:

- Mobile
- Tablet
- Desktop

Every data-heavy screen should provide:

- Loading state
- Empty state
- Error state
- Retry action

Additional UX requirements:

- Graceful JWT expiration handling
- No purchasing out-of-stock variants
- Clear payment failure/pending recovery
- Duplicate checkout protection
- Accessible labels
- Keyboard navigation where applicable
- Readable contrast

---

# 🐳 Local Development

## Prerequisites

- Git
- Docker
- Docker Compose
- Node.js
- Python
- PostgreSQL tools if required

## Clone Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd saajnika
```

---

# ⚙️ Environment Variables

Create environment files according to the project configuration.

Example:

```env
# Django
SECRET_KEY=your_secret_key
DEBUG=True

# Database
POSTGRES_DB=saajnika
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# JWT
JWT_SECRET_KEY=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_HOST_USER=your_email
EMAIL_HOST_PASSWORD=your_password

# Shipping
SHIPPING_API_KEY=your_shipping_key
```

> **Never commit `.env` files or production secrets to Git.**

---

# 🐳 Docker Setup

Expected services:

```text
frontend
backend
postgres
redis
celery
nginx
```

Start the development environment:

```bash
docker compose up --build
```

Run migrations:

```bash
docker compose exec backend python manage.py migrate
```

Create an admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

---

# 🧪 Testing

Saajnika follows a multi-layer testing strategy.

### Unit Tests

- Pricing rules
- Coupon rules
- Inventory rules
- Order transitions
- Utility/service logic

### API Tests

- Authentication
- Products
- Cart
- Checkout
- Orders
- Payment verification
- Admin permissions

### Integration Tests

- PostgreSQL
- Redis
- Celery
- Payment sandbox/mocks
- Shipping sandbox/mocks

Run tests:

```bash
pytest
```

or:

```bash
python manage.py test
```

---

# 🧪 Critical Test Scenarios

### Concurrent Stock Purchase

The system must prevent two users from purchasing more stock than exists.

### Duplicate Payment Webhook

```text
Razorpay
   │
   ├── Webhook #1
   │
   └── Webhook #2
          ↓
     Idempotency Check
          ↓
   Process Only Once
```

Other critical scenarios:

- Payment succeeds but frontend callback fails
- Payment fails after internal order creation
- Expired coupon
- Overused coupon
- JWT expiry during checkout
- Temporary email failure
- Shipping provider timeout
- Unauthorized admin operation

---

# 🚀 Production Deployment

Production architecture:

```text
Internet
   ↓
HTTPS
   ↓
Nginx
   ↓
Gunicorn
   ↓
Django REST API
   ↓
PostgreSQL
   +
Redis
   +
Celery Workers
```

Production requirements:

- HTTPS
- Nginx
- Gunicorn
- PostgreSQL
- Redis
- Celery workers
- Secure environment variables
- Cloudinary
- Automated backups
- Logs
- Error monitoring
- Worker restart handling
- Deployment rollback strategy

---

# 💾 Backup Strategy

PostgreSQL backups should:

- Run regularly
- Be stored separately from the application server
- Maintain multiple restore points
- Have documented restoration procedures
- Be periodically tested

> A backup that has never been restored is not a proven recovery strategy.

---

# 🌿 Git Workflow

Recommended workflow:

```text
main
 │
 ├── feature/authentication
 ├── feature/catalog
 ├── feature/cart
 ├── feature/checkout
 ├── feature/payments
 ├── feature/orders
 ├── feature/shipping
 └── feature/admin
```

Development practices:

- Use feature branches
- Keep commits focused
- Write descriptive commit messages
- Open Pull Requests / Merge Requests
- Do not commit secrets
- Do not commit database dumps
- Keep README updated
- Document architectural decisions
- Track work using issues/tasks
- Resolve lint/test failures before review

---

# 📋 Implementation Roadmap

| Phase | Module | Result |
|---|---|---|
| 1 | Foundation | Docker, Django, React, PostgreSQL, Redis |
| 2 | Authentication | User, OTP, JWT, permissions |
| 3 | Catalog | Products, variants, Cloudinary |
| 4 | Cart | Cart APIs, UI, stock validation |
| 5 | Checkout | Address, coupons, pricing |
| 6 | Payments | Razorpay, verification, webhooks |
| 7 | Orders | History, state machine, admin |
| 8 | Async | Celery, Redis, notifications |
| 9 | Shipping | Serviceability, shipment, tracking |
| 10 | Production | Nginx, Gunicorn, backups, monitoring |

---

# 📊 Definition of Done

The project is considered complete when the critical customer, payment, fulfilment, administration and production workflows are implemented and tested.

### Customer

- [ ] Registration/login
- [ ] JWT-protected APIs
- [ ] Product browsing
- [ ] Search/filter
- [ ] Product variants
- [ ] Wishlist
- [ ] Cart
- [ ] Address management
- [ ] Checkout
- [ ] Order tracking

### Commerce

- [ ] Server-side pricing
- [ ] Coupon validation
- [ ] Inventory validation
- [ ] Transactional order creation

### Payments

- [ ] Razorpay integration
- [ ] Signature verification
- [ ] Webhook verification
- [ ] Idempotency

### Operations

- [ ] Admin product management
- [ ] Inventory management
- [ ] Order management
- [ ] Promotions
- [ ] Shipping integration

### Infrastructure

- [ ] PostgreSQL
- [ ] Redis
- [ ] Celery
- [ ] Docker
- [ ] Nginx
- [ ] Gunicorn
- [ ] Backups
- [ ] Logging
- [ ] Error monitoring

### Documentation

- [ ] README
- [ ] API documentation
- [ ] ER diagram
- [ ] Architecture diagram
- [ ] Testing report
- [ ] Deployment guide

---

# 📦 Final Handoff Package

The final project handoff should contain:

```text
Source Code
├── Frontend
├── Backend
└── Configuration

Documentation
├── README
├── API Documentation
├── ER Diagram
├── Architecture Diagram
├── Test Report
└── Deployment Guide

Demo
└── Complete customer purchase journey
```

---

# 🔒 Security Notice

Never commit the following to Git:

```text
.env
API Keys
Razorpay Secret
Cloudinary Secret
Database Passwords
JWT Secrets
SMTP Passwords
Shipping API Keys
Production Credentials
Database Dumps
```

Use environment variables or an appropriate secret-management solution.

---

# 📚 Project Documentation

Additional documentation should include:

- API Documentation
- ER Diagram
- Architecture Diagram
- Testing Documentation
- Deployment Guide
- Technical Decision Records

---

# 🎯 Project Goal

Saajnika aims to demonstrate how a real production-oriented e-commerce platform can be designed and implemented with:

```text
Modern Frontend
       +
REST API
       +
Relational Database
       +
Authentication
       +
Payments
       +
Inventory
       +
Shipping
       +
Background Processing
       +
Caching
       +
Security
       +
Testing
       +
Production Deployment
```

---

# 👨‍💻 Development

**Project:** Saajnika  
**Type:** Women's Fashion E-Commerce Platform  
**Architecture:** React + Django REST + PostgreSQL + Redis + Celery  
**Payment:** Razorpay  
**Media:** Cloudinary  
**Shipping:** Shiprocket / Equivalent  
**Deployment:** Docker + Nginx + Gunicorn

---

## ⭐ Status

🚧 **Under Active Development**

Implementation follows the defined milestone sequence:

**Foundation → Authentication → Catalog → Cart → Checkout → Payments → Orders → Async Processing → Shipping → Production**

---

## 📄 License

Add the applicable project license here.
