# 🎴 PakCards - Pakistan's Digital Gift Card Marketplace

**A modern, full-stack gift card marketplace built with Next.js 15, Prisma, and PostgreSQL.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.18.0-2D3748)](https://www.prisma.io/)

---

## 🚀 Quick Start

### For Client Demo (Ready in 5 minutes!)

```powershell
# 1. Clone and install
git clone <repository-url>
cd pak-cards
npm install

# 2. Set up local database (automated)
.\setup-local-db.ps1

# 3. Start development server
npm run dev
```

Visit: http://localhost:3000

**📖 Detailed Guides:**

- 📋 [Complete Testing Checklist](TESTING_CHECKLIST.md)
- 💾 [Local PostgreSQL Setup](LOCAL_DB_SETUP.md)
- 🎯 [Client Demo Guide](CLIENT_DEMO_READY.md)

---

## ✨ Features

### 🛍️ Customer Features

- Browse 6+ gift card categories (Gaming, Shopping, Entertainment)
- Instant digital code delivery for select products
- Secure checkout with payment proof upload
- Coupon system (10% off, flat discounts)
- Order tracking and history
- Responsive design (mobile-first)

### 🏪 Seller Features

- Create and manage gift card store
- Add/edit products with digital codes
- Order management dashboard
- Manual code delivery system
- Sales analytics
- Store approval workflow

### 👑 Admin Features

- Approve/reject new stores
- Platform-wide order monitoring
- Coupon management
- User management
- Store analytics dashboard
- Revenue tracking

---

## 🛠️ Tech Stack

### Core

- **Framework**: Next.js 15.5.6 with App Router & Turbopack
- **Language**: JavaScript (ES2022+)
- **Styling**: Tailwind CSS + Custom Components
- **State Management**: Redux Toolkit

### Backend

- **Database**: PostgreSQL (Neon Serverless / Local)
- **ORM**: Prisma 6.18.0
- **Authentication**: Clerk 6.34.0
- **File Storage**: ImageKit
- **Background Jobs**: Inngest 3.44.3

### APIs & Services

- **23 REST API Endpoints** (Products, Orders, Stores, Admin, Coupons)
- **9 Inngest Functions** (User sync, email notifications, gift card delivery)
- **Clerk Webhooks** (User lifecycle management)

---

## 📦 Database Schema

```prisma
User (6 sample users - 1 admin, 2 sellers, 3 customers)
├── Store (3 stores - 2 approved, 1 pending)
│   └── Product (6 gift cards with digital codes)
│       ├── Rating (reviews system)
│       └── OrderItem (order line items)
├── Order (customer orders)
│   ├── OrderItem (products in order)
│   ├── Address (delivery addresses)
│   └── DeliveredCode (redeemed gift codes)
└── Coupon (discount codes)
```

**10 Models Total**: User, Store, Product, Order, OrderItem, Rating, Address, Coupon, DeliveredCode

---

## 🎯 Test Data (After Seeding)

### Products (6 Gift Cards)

1. 🎮 **Steam Wallet** - ₨1,000 (3 codes) - Instant ⚡
2. 🎮 **PlayStation Store** - ₨5,000 (2 codes) - Manual 📦
3. 🎬 **Netflix Premium** - ₨500/month (4 codes) - Instant ⚡
4. 🛍️ **Amazon Gift Card** - ₨10,000 (1 code) - Manual 📦
5. 🎵 **Spotify Premium** - ₨300/month (2 codes) - Instant ⚡
6. 🛍️ **Google Play** - ₨2,000 (3 codes) - Instant ⚡

### Coupons

- **WELCOME10** - 10% off for new users
- **SAVE200** - ₨200 flat discount for members

### Users

- **Admin**: admin@pakcards.com (full platform access)
- **Sellers**: ahmed@pakcards.com, sara@giftcards.pk
- **Customers**: 3 test accounts

---

## 🔧 Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+ (or use Neon cloud)
- Git

### Steps

```bash
# 1. Clone repository
git clone https://github.com/zeeshandesigns/pak-cards.git
cd pak-cards

# 2. Install dependencies
npm install

# 3. Environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Database setup
npx prisma generate
npx prisma migrate dev --name init
npm run seed

# 5. Start development
npm run dev
```

---

## 📁 Project Structure

```
pak-cards/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages (homepage, shop, cart)
│   ├── admin/             # Admin dashboard
│   ├── store/             # Seller dashboard
│   └── api/               # API routes (23 endpoints)
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   └── store/            # Seller-specific components
├── lib/                   # Utilities
│   ├── features/         # Redux slices
│   ├── middlewares/      # Auth & authorization
│   └── prisma.js         # Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.js           # Test data seeding
├── inngest/              # Background job functions
└── configs/              # ImageKit, etc.
```

---

## 🌐 API Endpoints

### Public APIs

- `GET /api/products` - List all products
- `GET /api/store/data?username={username}` - Store details
- `POST /api/order/create` - Create order

### Protected APIs (Seller)

- `GET /api/store/dashboard` - Store stats
- `POST /api/store/create` - Create store
- `POST /api/product/create` - Add product
- `POST /api/order/deliver-code` - Deliver gift code

### Protected APIs (Admin)

- `GET /api/admin/dashboard` - Platform stats
- `GET /api/admin/stores/pending` - Pending stores
- `POST /api/admin/stores/approve` - Approve store
- `GET /api/admin/coupons` - Manage coupons

**See full API documentation**: [API.md](API.md) _(create if needed)_

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests (if configured)
npm test

# E2E tests (if configured)
npm run test:e2e

# Manual testing checklist
# See TESTING_CHECKLIST.md for comprehensive guide
```

### Test Coverage

- Homepage product loading
- Cart & checkout flow
- Order creation & tracking
- Seller dashboard operations
- Admin store approval
- Coupon application
- Authentication flows

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repo to Vercel
# Environment variables auto-synced
# Database: Use Neon PostgreSQL

vercel --prod
```

### Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# File Storage
IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
IMAGEKIT_URL_ENDPOINT="https://..."

# Background Jobs
INGEST_EVENT_KEY="..."
INGEST_SIGNIN_KEY="..."

# Optional
OPTIMIZE_API_KEY="..."
PRISMA_CLIENT_ENGINE_TYPE="library"
```

---

## 📚 Documentation

- [🎯 Client Demo Guide](CLIENT_DEMO_READY.md) - Complete setup for demos
- [🧪 Testing Checklist](TESTING_CHECKLIST.md) - Comprehensive testing guide
- [💾 Local DB Setup](LOCAL_DB_SETUP.md) - PostgreSQL configuration
- [🤝 Contributing](CONTRIBUTING.md) - How to contribute
- [📜 License](LICENSE.md) - MIT License

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Prisma** - Type-safe database ORM
- **Clerk** - Authentication solution
- **ImageKit** - Image optimization
- **Inngest** - Background job processing
- **Neon** - Serverless PostgreSQL

---

## 📞 Support

- 📧 Email: support@pakcards.com
- 🐛 Issues: [GitHub Issues](https://github.com/zeeshandesigns/pak-cards/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/zeeshandesigns/pak-cards/discussions)

---

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Mobile app (React Native)
- [ ] Bulk order discounts
- [ ] Seller analytics dashboard enhancements
- [ ] Wishlist functionality
- [ ] Product reviews moderation
- [ ] Email marketing campaigns
- [ ] Multi-language support

---

<div align="center">
  <p>Made with ❤️ in Pakistan</p>
  <p>
    <a href="https://github.com/zeeshandesigns">GitHub</a> •
    <a href="https://pakcards.vercel.app">Demo</a> •
    <a href="CONTRIBUTING.md">Contribute</a>
  </p>
</div>
