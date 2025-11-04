# 🚀 PakCards - Quick Reference Card

## 🎯 BEFORE CLIENT DEMO - DO THIS!

### 1. Setup Local Database (5 minutes)

```powershell
# Run the automated script
.\setup-local-db.ps1
```

**OR** manually follow `LOCAL_DB_SETUP.md`

### 2. Start Development Server

```powershell
npm run dev
```

### 3. Verify Everything Works

- [ ] Open: http://localhost:3000
- [ ] See 6 gift cards (NOT template products)
- [ ] Logo says "**PakCards**" (NOT GoCart)
- [ ] Add to cart works
- [ ] No console errors

---

## 📧 Test Accounts

| Role              | Email              | Purpose                          |
| ----------------- | ------------------ | -------------------------------- |
| 👑 **Admin**      | admin@pakcards.com | Approve stores, manage coupons   |
| 🏪 **Seller 1**   | ahmed@pakcards.com | Has approved store with products |
| 🏪 **Seller 2**   | sara@giftcards.pk  | Has approved store with products |
| 👤 **Customer 1** | hassan@example.com | Has pending store application    |
| 👤 **Customer 2** | ayesha@example.com | Regular customer                 |
| 👤 **Customer 3** | ali@example.com    | Regular customer                 |

---

## 🎴 Products in Database

| Product           | Price   | Category      | Codes | Delivery   |
| ----------------- | ------- | ------------- | ----- | ---------- |
| Steam Wallet      | ₨1,000  | Gaming        | 3     | ⚡ Instant |
| PlayStation Store | ₨5,000  | Gaming        | 2     | 📦 Manual  |
| Netflix Premium   | ₨500    | Entertainment | 4     | ⚡ Instant |
| Amazon Gift Card  | ₨10,000 | Shopping      | 1     | 📦 Manual  |
| Spotify Premium   | ₨300    | Entertainment | 2     | ⚡ Instant |
| Google Play       | ₨2,000  | Shopping      | 3     | ⚡ Instant |

---

## 🎟️ Active Coupons

| Code          | Discount  | For         |
| ------------- | --------- | ----------- |
| **WELCOME10** | 10% off   | New users   |
| **SAVE200**   | ₨200 flat | All members |

---

## 🔧 Emergency Fixes

### Products Not Showing?

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Database Error?

```powershell
npx prisma generate
npx prisma db push
```

### Everything Broken?

```powershell
# Nuclear option - reset everything
Remove-Item -Recurse -Force .next
npx prisma generate
npx prisma migrate reset
npm run seed
npm run dev
```

---

## 📂 Important Files

| File                   | Purpose             |
| ---------------------- | ------------------- |
| `CLIENT_DEMO_READY.md` | Complete demo guide |
| `TESTING_CHECKLIST.md` | Testing procedures  |
| `LOCAL_DB_SETUP.md`    | Database setup      |
| `.env`                 | Environment config  |
| `prisma/seed.js`       | Test data script    |

---

## 🎬 15-Minute Demo Script

1. **Homepage** (2 min) - Show 6 gift cards
2. **Product Detail** (2 min) - Steam card, add to cart
3. **Cart & Checkout** (3 min) - Apply WELCOME10, place order
4. **Orders** (2 min) - Show order tracking
5. **Seller Dashboard** (3 min) - Manage products, deliver codes
6. **Admin Dashboard** (3 min) - Approve stores, manage platform

---

## 🚨 During Demo - Watch For

✅ **GOOD SIGNS:**

- Products load within 2 seconds
- "PakCards" branding everywhere
- No console errors (except hydration warning - that's OK)
- Cart count updates correctly
- Orders appear in dashboard

❌ **BAD SIGNS & FIXES:**

- Template products showing → Clear `.next` folder
- GoCart logo appearing → Hard refresh browser (Ctrl+Shift+R)
- Database error → Check PostgreSQL running
- 500 API errors → Check `.env` file
- Images not loading → Check ImageKit credentials

---

## 💾 Database Quick Commands

```powershell
# View data in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Re-seed data
npm run seed

# Check connection
npx prisma db push
```

---

## 📞 If Client Asks...

**Q: "Can I pay with credit card?"**  
A: Payment gateway integration is in roadmap. Currently using bank transfer with payment proof upload.

**Q: "How long for instant delivery?"**  
A: Gift codes delivered within 10 minutes automatically for instant products.

**Q: "Can sellers set their own prices?"**  
A: Yes! Each seller controls their product pricing independently.

**Q: "Is this production-ready?"**  
A: Yes! Already deployed on Vercel. Just needs payment gateway for going fully live.

**Q: "Mobile app?"**  
A: Responsive web design works on all devices. Native app in roadmap.

---

## ✅ Success Checklist

Before client arrives:

- [ ] Database seeded
- [ ] Dev server running
- [ ] Tested one complete order flow
- [ ] Prisma Studio ready to show data
- [ ] Browser cache cleared

During demo:

- [ ] Show homepage with 6 products
- [ ] Complete one purchase
- [ ] Show seller dashboard
- [ ] Show admin approval workflow
- [ ] Highlight instant delivery feature

---

## 🎯 Key Selling Points

1. ✅ **Multi-vendor marketplace** - Anyone can become a seller
2. ✅ **Instant delivery** - Automated code delivery for digital products
3. ✅ **Secure payments** - Payment proof verification system
4. ✅ **Admin controls** - Full platform oversight
5. ✅ **Scalable** - Built with modern tech (Next.js 15, Prisma, PostgreSQL)
6. ✅ **Mobile-first** - Responsive design for all devices

---

## 📊 Tech Highlights (If Client is Technical)

- **Performance**: Next.js 15 with Turbopack (5x faster)
- **Database**: PostgreSQL with Prisma ORM (type-safe)
- **Auth**: Clerk (enterprise-grade security)
- **Background Jobs**: Inngest (reliable async processing)
- **Deployment**: Vercel (zero-downtime, auto-scaling)
- **Storage**: ImageKit (optimized image delivery)

---

## 🎉 Final Checklist

5 minutes before demo:

- [ ] ✅ Close all unnecessary browser tabs
- [ ] ✅ Dev server running (no errors in terminal)
- [ ] ✅ Have Prisma Studio open in background tab
- [ ] ✅ Test account credentials ready
- [ ] ✅ Screen recording started (backup if live demo fails)
- [ ] ✅ Coffee ready ☕

---

**YOU'VE GOT THIS! 🚀**

_For detailed testing: See `TESTING_CHECKLIST.md`_  
_For complete setup: See `CLIENT_DEMO_READY.md`_
