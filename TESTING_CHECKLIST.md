# 🧪 PakCards - Pre-Client Demo Testing Checklist

## ✅ Before Starting

- [ ] Local PostgreSQL installed and running
- [ ] Database seeded with test data
- [ ] Dev server running (`npm run dev`)
- [ ] Clear browser cache / use incognito mode

---

## 🏠 Homepage Tests

### Product Display

- [ ] **6 gift cards visible** (not template products)

  - Steam Wallet ₨1000
  - PlayStation Store ₨5000
  - Netflix Premium ₨500/Month
  - Amazon Gift Card ₨10000
  - Spotify Premium ₨300/Month
  - Google Play ₨2000

- [ ] **Product cards show**:
  - Card name and description
  - Price in PKR (₨)
  - Category badge
  - "Add to Cart" button
  - Product images load

### Navigation

- [ ] PakCards logo displays correctly (not GoCart)
- [ ] Navbar links work (Home, Shop, About, Contact)
- [ ] Search bar functional
- [ ] Cart icon shows correct count
- [ ] User profile/sign-in button works

### Hero Section

- [ ] Hero banner displays
- [ ] CTA buttons work
- [ ] Smooth animations

---

## 🛍️ Shop Page Tests

### Product Listing

- [ ] All 6 products display
- [ ] Search functionality works
- [ ] Filter by category works
- [ ] Product grid responsive (mobile + desktop)

### Product Details Page

- [ ] Click product opens detail page
- [ ] Product info complete
- [ ] Image gallery works
- [ ] Quantity selector works
- [ ] "Add to Cart" button functional
- [ ] Shows delivery type (Instant/Manual)
- [ ] Shows available codes count

---

## 🛒 Cart & Checkout Tests

### Cart Page

- [ ] Added products appear in cart
- [ ] Quantity update works
- [ ] Remove from cart works
- [ ] Cart total calculates correctly
- [ ] Coupon code input visible
- [ ] Apply coupon: WELCOME10 (10% off)
- [ ] Apply coupon: SAVE200 (₨200 off)

### Checkout Flow

- [ ] "Proceed to Checkout" button works
- [ ] Address form appears
- [ ] Can add/edit delivery address
- [ ] Order summary correct
- [ ] Payment proof upload works (ImageKit)
- [ ] Place order button functional

### Order Confirmation

- [ ] Order created successfully
- [ ] Order ID generated
- [ ] Order status: "pending"
- [ ] Redirects to orders page

---

## 📦 Orders Page Tests

- [ ] Order appears in "My Orders"
- [ ] Shows order details:
  - Order ID
  - Products ordered
  - Total amount
  - Order status
  - Delivery address
- [ ] Can view order details
- [ ] For instant delivery: codes visible when approved
- [ ] For manual delivery: awaiting seller approval

---

## 👨‍💼 Seller Dashboard Tests

### Access

- [ ] Navigate to `/create-store`
- [ ] Store registration form works
- [ ] Can create a new store
- [ ] Store status: "pending" (awaiting admin approval)

### Store Owner (Use test account: ahmed@pakcards.com)

- [ ] Can access `/store` dashboard
- [ ] See store statistics
- [ ] View orders
- [ ] Can add new products
- [ ] Can edit products
- [ ] Can toggle product stock
- [ ] Can manage orders
- [ ] Can deliver codes for manual orders

---

## 👑 Admin Dashboard Tests

### Access (Use admin@pakcards.com)

- [ ] Can access `/admin` dashboard
- [ ] See admin statistics
- [ ] View all stores
- [ ] Can approve pending stores
- [ ] Can reject/suspend stores
- [ ] View all orders
- [ ] View all coupons
- [ ] Can create new coupons

### Store Approval

- [ ] Pending store appears in "Approve Stores"
- [ ] Can approve store
- [ ] Store becomes active after approval
- [ ] Seller can now add products

---

## 🔐 Authentication Tests

### Sign Up

- [ ] Can create new account (Clerk)
- [ ] Profile image uploads
- [ ] User data saves to database

### Sign In

- [ ] Can sign in with existing account
- [ ] Session persists across pages
- [ ] User profile displays in navbar

### Sign Out

- [ ] Sign out works
- [ ] Redirects to homepage
- [ ] Cart data persists (Redux)

---

## 📱 Responsive Design Tests

### Mobile (< 768px)

- [ ] Navbar collapses to hamburger menu
- [ ] Product grid shows 2 columns
- [ ] Cart responsive
- [ ] Checkout form readable
- [ ] Footer compact

### Tablet (768px - 1024px)

- [ ] Product grid shows 3-4 columns
- [ ] Layout adjusts properly
- [ ] Navigation accessible

### Desktop (> 1024px)

- [ ] Product grid shows 5 columns
- [ ] Full navbar visible
- [ ] Optimal spacing

---

## ⚡ Performance Tests

- [ ] Page loads in < 3 seconds
- [ ] Images load/optimize correctly
- [ ] No console errors
- [ ] No hydration warnings (except browser extensions)
- [ ] Smooth transitions

---

## 🐛 Bug Checks

### Common Issues

- [ ] ✅ No dummy/template products showing
- [ ] ✅ Logo says "PakCards" not "GoCart"
- [ ] ✅ Prices in PKR (₨) not $ or other currency
- [ ] ✅ All API endpoints responding
- [ ] ✅ Database connection stable
- [ ] ✅ ImageKit uploads working
- [ ] ✅ Clerk authentication working
- [ ] ✅ No 404 errors on navigation

### Error Handling

- [ ] Invalid product ID shows error
- [ ] Out of stock handled gracefully
- [ ] Failed API calls show user-friendly message
- [ ] Form validation works

---

## 📊 Data Verification

Open Prisma Studio: `npx prisma studio`

### Check Tables

- [ ] **Users**: 6 total (1 admin, 2 sellers, 3 customers)
- [ ] **Stores**: 3 total (2 approved, 1 pending)
- [ ] **Products**: 6 gift cards with correct data
- [ ] **Coupons**: 2 active (WELCOME10, SAVE200)
- [ ] **Orders**: Empty initially (will populate during testing)

---

## 🎯 Client Demo Flow Recommendation

### Demo Script (10-15 minutes):

1. **Homepage** (2 min)

   - Show 6 gift cards
   - Explain categories
   - Show search

2. **Product Detail** (2 min)

   - Click Steam card
   - Show instant delivery badge
   - Show code availability
   - Add to cart

3. **Cart & Checkout** (3 min)

   - Show cart
   - Apply coupon WELCOME10
   - Fill address
   - Upload payment proof
   - Place order

4. **Orders** (2 min)

   - Show order in "My Orders"
   - Explain approval process
   - Show order details

5. **Seller Dashboard** (3 min)

   - Switch to seller account
   - Show store dashboard
   - Add new product
   - Process order
   - Deliver gift code

6. **Admin Dashboard** (3 min)
   - Switch to admin account
   - Show pending store approval
   - Approve new store
   - Show statistics
   - Manage coupons

---

## ✅ Final Checks Before Client Meeting

- [ ] All tests passed
- [ ] No console errors
- [ ] Branding consistent (PakCards everywhere)
- [ ] Test data realistic
- [ ] Responsive on client's device
- [ ] Demo flow practiced
- [ ] Backup plan if live demo fails (screen recording?)

---

## 🚨 Emergency Contacts

### If something breaks:

1. Check console for errors
2. Restart dev server
3. Clear `.next` folder: `Remove-Item -Recurse -Force .next`
4. Regenerate Prisma: `npx prisma generate`
5. Re-seed database: `npm run seed`

### Support:

- **Developer**: Check GitHub issues
- **Database**: Verify PostgreSQL running
- **API**: Check `/api` endpoints individually

---

**Good luck with your client demo! 🚀**
