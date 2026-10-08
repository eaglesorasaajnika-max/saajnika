# Changelog

All notable changes to the Saajnika Frontend project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added - 2026-10-08
- Complete multi-page application routing with `react-router-dom` v7:
  - Customer routes: `/`, `/catalog`, `/search`, `/product/:id`, `/cart`, `/checkout`, `/payment/:status`, `/orders`, `/orders/:id`, `/account`, `/wishlist`
  - Executive Operations Suite: `/admin` (Dashboard, Products, Categories, Orders, Inventory, Coupons, Banners, Customers, Audit Log)
- Centralized Context Architecture:
  - `AuthContext`: simpleJWT session management, passwordless OTP dispatch & verification, user profiling
  - `CartContext`: line-item quantity adjustments, optimistic coupon calculation, free shipping progression bar, guest cart session merging
  - `WishlistContext`: optimistic curation toggling, local storage persistence, authenticated backend synchronization
  - `NotificationContext`: toast message alerts
- Centralized API Service Layer with mock fallbacks:
  - `client.js`, `catalogApi.js`, `cartApi.js`, `authApi.js`, `checkoutApi.js`, `paymentApi.js`, `orderApi.js`, `addressApi.js`, `profileApi.js`, `shippingApi.js`, `adminApi.js`
- Automated Vitest Test Suite with 26 passing tests across utilities, common components, and API service integration.
- Initialized official frontend repository foundation tracking `origin/main`.
- Extracted and repositioned React 19 + Vite application to repository root.
- Imported reusable haute-couture UI component suite and luxury design system tokens.
- Established standard frontend engineering documentation and environment configurations.

