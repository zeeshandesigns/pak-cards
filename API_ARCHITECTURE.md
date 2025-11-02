# PakCards API Architecture - Complete Plan

## Overview

Building a complete REST API system for PakCards gift card marketplace with:

- Neon PostgreSQL database
- Prisma ORM with Optimize
- Next.js 15 App Router API routes
- Gift card delivery system (auto + manual verification)
- Admin approval workflows
- Payment proof handling with ImageKit
- Inngest background jobs

---

## 1. PRODUCT APIs

### GET /api/products

- **Purpose**: Fetch all gift cards with filters
- **Query Params**:
  - `category` (optional)
  - `deliveryType` (optional: auto_delivery, manual_verification)
  - `search` (optional)
  - `minPrice`, `maxPrice` (optional)
  - `inStock` (optional boolean)
- **Response**: Array of products with store info
- **Status**: ✅ TO BUILD

### GET /api/products/[productId]

- **Purpose**: Get single product details
- **Response**: Product with store, ratings, available codes count
- **Status**: ✅ TO BUILD

### GET /api/products/featured

- **Purpose**: Get featured/best-selling gift cards
- **Response**: Top 4-8 products by rating
- **Status**: ✅ TO BUILD

---

## 2. CART & CHECKOUT APIs

### POST /api/cart/validate

- **Purpose**: Validate cart items before checkout
- **Body**: Array of {productId, quantity}
- **Checks**: Stock availability, delivery type, product exists
- **Response**: {valid: boolean, errors: [], items: []}
- **Status**: ✅ TO BUILD

---

## 3. ORDER APIs

### POST /api/orders/create

- **Purpose**: Create order with payment proof
- **Body**: FormData with:
  - `items` (JSON string)
  - `address` (JSON string)
  - `paymentMethod` (COD, BANK_TRANSFER)
  - `paymentProof` (file, required for BANK_TRANSFER)
  - `paymentReference` (string, optional)
- **Logic**:
  1. Validate all products exist and have stock
  2. Upload payment proof to ImageKit (if BANK_TRANSFER)
  3. Create order with status based on deliveryType
  4. Trigger Inngest event for code delivery
- **Response**: {orderId, status, message}
- **Status**: ✅ TO BUILD

### GET /api/orders/user

- **Purpose**: Get user's order history
- **Auth**: Required (Clerk userId)
- **Response**: Orders with products and delivered codes
- **Status**: ✅ TO BUILD

### GET /api/orders/[orderId]

- **Purpose**: Get single order details
- **Auth**: User must own order
- **Response**: Order with products, codes (if delivered), status
- **Status**: ✅ TO BUILD

### POST /api/orders/[orderId]/view-code

- **Purpose**: Mark code as viewed (track viewedAt)
- **Body**: {codeId}
- **Response**: {success: boolean}
- **Status**: ✅ TO BUILD

---

## 4. STORE APIs (Update Existing + New)

### POST /api/store/create (UPDATE EXISTING)

- **Current Issues**: Mixed logic, incorrect product creation in store route
- **Fix**: Remove product creation, focus only on store creation
- **Status**: ⚠️ UPDATE NEEDED

### POST /api/store/products/create (NEW)

- **Purpose**: Create gift card product
- **Body**: FormData with:
  - `name`, `description`, `category`
  - `mrp`, `price`
  - `images` (1-4 files)
  - `deliveryType` (auto_delivery, manual_verification)
  - `requiresApproval` (boolean)
  - `digitalCodes` (JSON array: [{code, used: false}])
- **Response**: {productId, message}
- **Status**: ✅ TO BUILD

### GET /api/store/products (UPDATE EXISTING)

- **Current**: Returns all products for seller
- **Update**: Add gift card specific fields
- **Status**: ⚠️ UPDATE NEEDED

### PATCH /api/store/products/[productId]

- **Purpose**: Update product details
- **Body**: Partial product data
- **Status**: ✅ TO BUILD

### POST /api/store/products/[productId]/add-codes

- **Purpose**: Add more gift card codes to existing product
- **Body**: {codes: [{code}]}
- **Logic**: Append to digitalCodes JSON, increment availableCodes
- **Status**: ✅ TO BUILD

### GET /api/store/dashboard (UPDATE EXISTING)

- **Current**: Basic dashboard stats
- **Update**: Add gift card specific metrics (codes delivered, pending verifications)
- **Status**: ⚠️ UPDATE NEEDED

### GET /api/store/orders

- **Purpose**: Get all orders for seller's store
- **Response**: Orders with buyer info, delivery status
- **Status**: ✅ TO BUILD

---

## 5. ADMIN APIs

### GET /api/admin/stores/pending

- **Purpose**: Get stores awaiting approval
- **Auth**: Admin only
- **Response**: Stores with status = 'pending'
- **Status**: ✅ TO BUILD

### POST /api/admin/stores/[storeId]/approve

- **Purpose**: Approve or reject store
- **Body**: {status: 'approved' | 'rejected', reason (optional)}
- **Response**: {success: boolean}
- **Status**: ✅ TO BUILD

### GET /api/admin/orders/pending-verification

- **Purpose**: Get orders awaiting payment verification
- **Auth**: Admin only
- **Response**: Orders with PAYMENT_SUBMITTED status
- **Status**: ✅ TO BUILD

### POST /api/admin/orders/[orderId]/verify-payment

- **Purpose**: Approve or reject payment
- **Body**: {
  action: 'approve' | 'reject',
  rejectionReason (optional)
  }
- **Logic**:
  1. Update order status
  2. If approved: Trigger code delivery (Inngest)
  3. If rejected: Send rejection email
- **Response**: {success: boolean}
- **Status**: ✅ TO BUILD

### GET /api/admin/dashboard

- **Purpose**: Admin dashboard stats
- **Response**: {
  totalStores,
  pendingStores,
  totalOrders,
  pendingPayments,
  totalRevenue,
  codesDelivered
  }
- **Status**: ✅ TO BUILD

---

## 6. RATING APIs (New)

### POST /api/products/[productId]/rate

- **Purpose**: Submit product rating
- **Body**: {rating: 1-5, review: string}
- **Auth**: Required, must have purchased product
- **Status**: ✅ TO BUILD

### GET /api/products/[productId]/ratings

- **Purpose**: Get all ratings for product
- **Response**: Ratings with user info
- **Status**: ✅ TO BUILD

---

## 7. COUPON APIs (New)

### GET /api/coupons/validate

- **Purpose**: Validate coupon code
- **Query**: ?code=XXX&totalAmount=1000
- **Response**: {valid: boolean, discount: number, type: 'fixed'|'percentage'}
- **Status**: ✅ TO BUILD

### GET /api/admin/coupons

- **Purpose**: List all coupons
- **Auth**: Admin only
- **Status**: ✅ TO BUILD

### POST /api/admin/coupons/create

- **Purpose**: Create new coupon
- **Body**: {code, discount, type, expiresAt, minPurchase}
- **Status**: ✅ TO BUILD

---

## 8. INNGEST FUNCTIONS (Update & New)

### gift-card.auto-delivery (NEW)

- **Trigger**: Order created with auto_delivery products
- **Delay**: 5-10 minutes (fraud check window)
- **Logic**:
  1. Check order still valid
  2. For each product, assign unused code
  3. Mark code as used in product.digitalCodes
  4. Create DeliveredCode record
  5. Decrement availableCodes
  6. Update order status to CODE_DELIVERED
  7. Send email with codes
- **Status**: ✅ TO BUILD

### gift-card.manual-delivery (NEW)

- **Trigger**: Payment verified for manual_verification products
- **Logic**: Same as auto-delivery but no delay
- **Status**: ✅ TO BUILD

### email.order-confirmation (NEW)

- **Trigger**: Order created
- **Logic**: Send order confirmation email
- **Status**: ✅ TO BUILD

### email.code-delivery (NEW)

- **Trigger**: Codes delivered
- **Logic**: Send email with gift card codes
- **Status**: ✅ TO BUILD

---

## Priority Order (Build Sequence)

### Phase 1: Core Product APIs (30 mins)

1. GET /api/products
2. GET /api/products/[productId]
3. GET /api/products/featured

### Phase 2: Store APIs (45 mins)

4. Fix POST /api/store/create
5. POST /api/store/products/create
6. GET /api/store/products (update)
7. PATCH /api/store/products/[productId]
8. POST /api/store/products/[productId]/add-codes
9. GET /api/store/dashboard (update)
10. GET /api/store/orders

### Phase 3: Order & Checkout APIs (60 mins)

11. POST /api/cart/validate
12. POST /api/orders/create (with ImageKit upload)
13. GET /api/orders/user
14. GET /api/orders/[orderId]
15. POST /api/orders/[orderId]/view-code

### Phase 4: Admin APIs (45 mins)

16. GET /api/admin/stores/pending
17. POST /api/admin/stores/[storeId]/approve
18. GET /api/admin/orders/pending-verification
19. POST /api/admin/orders/[orderId]/verify-payment
20. GET /api/admin/dashboard

### Phase 5: Additional Features (30 mins)

21. POST /api/products/[productId]/rate
22. GET /api/products/[productId]/ratings
23. GET /api/coupons/validate
24. POST /api/admin/coupons/create

### Phase 6: Inngest Functions (45 mins)

25. gift-card.auto-delivery
26. gift-card.manual-delivery
27. email.order-confirmation
28. email.code-delivery

---

## Total: ~23 API endpoints + 4 Inngest functions

## Estimated Time: 4-5 hours for complete implementation

---

## Key Considerations

1. **Authentication**: All endpoints use Clerk's getAuth()
2. **Authorization**: Check userId matches or admin role
3. **Error Handling**: Try-catch with proper status codes
4. **Validation**: Zod schemas for request bodies
5. **Database**: All queries through Prisma with Optimize
6. **File Upload**: ImageKit for payment proofs and product images
7. **Background Jobs**: Inngest for code delivery and emails
8. **Testing**: Test each endpoint with actual data

---

## Next Steps

1. Start with Phase 1 (Product APIs)
2. Test with existing seed data
3. Move to Phase 2 (Store APIs)
4. Continue sequentially through all phases
