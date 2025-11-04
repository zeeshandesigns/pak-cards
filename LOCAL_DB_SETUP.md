# 🚀 PakCards - Local PostgreSQL Setup Guide

## Step 1: Install PostgreSQL

### Windows:

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer (choose version 15 or 16)
3. During installation:
   - Port: 5432 (default)
   - Set a password for the postgres user (remember this!)
   - Install pgAdmin 4 (GUI tool)

## Step 2: Create Database

### Option A: Using pgAdmin 4 (GUI)

1. Open pgAdmin 4
2. Connect to PostgreSQL (use your password)
3. Right-click "Databases" → "Create" → "Database"
4. Name: `pakcards_db`
5. Click "Save"

### Option B: Using Command Line

```powershell
# Open PowerShell as Administrator
psql -U postgres

# In psql prompt:
CREATE DATABASE pakcards_db;
\q
```

## Step 3: Update .env File

Replace your Neon connection strings with local PostgreSQL:

```env
# Local PostgreSQL Connection
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pakcards_db"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/pakcards_db"
```

**Replace `YOUR_PASSWORD` with your actual PostgreSQL password!**

## Step 4: Run Migrations and Seed

```powershell
# Generate Prisma Client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init

# Seed the database (adds test data)
npm run seed
```

## Step 5: Verify Setup

```powershell
# Open Prisma Studio to view data
npx prisma studio
```

This will open http://localhost:5555 where you can see all your data!

## Step 6: Start Development Server

```powershell
npm run dev
```

Visit: http://localhost:3000

---

## 🎯 Test Data Included

After seeding, you'll have:

- ✅ 1 Admin user: `admin@pakcards.com`
- ✅ 2 Store owners (sellers)
- ✅ 3 Customers
- ✅ 3 Stores (2 approved, 1 pending)
- ✅ 6 Gift card products with codes
- ✅ 2 Active coupons

## 🔧 Troubleshooting

### Connection Error?

- Check PostgreSQL is running (Services → postgresql-x64-XX)
- Verify password in .env
- Ensure port 5432 is not blocked

### Migration Failed?

```powershell
# Reset database
npx prisma migrate reset
```

### Need to switch back to Neon?

Just restore the original DATABASE_URL in .env file!

---

## 📊 Quick Commands Reference

```powershell
# View database in browser
npx prisma studio

# Reset and re-seed
npx prisma migrate reset

# Check database status
npx prisma db push

# Generate Prisma Client after schema changes
npx prisma generate
```

---

## 🎉 Ready for Client Demo!

Once setup is complete:

1. ✅ Homepage shows 6 gift cards
2. ✅ Shop page fully functional
3. ✅ Cart and checkout working
4. ✅ Admin dashboard accessible
5. ✅ Store dashboard for sellers
6. ✅ All branding updated to PakCards

**Admin Login**: Use Clerk sign-up with `admin@pakcards.com` or use the admin user ID in your code.
