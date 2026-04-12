# 🚀 PHASE 1 SETUP INSTRUCTIONS

## ✅ What We've Done

1. ✅ Created Firebase configuration files
2. ✅ Set up environment variables structure
3. ✅ Created product service layer
4. ✅ Built migration script for 17 products
5. ✅ Updated home page to fetch from Firestore
6. ✅ Updated all Product interfaces

---

## 📋 YOUR ACTION ITEMS

### 1️⃣ Fill in Firebase Credentials

Open `.env.local` and replace placeholders with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=just-artist-things.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=just-artist-things
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=just-artist-things.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 2️⃣ Run the Migration Script

After filling in credentials, migrate your products:

```bash
node scripts/migrateProducts.js
```

You should see:
```
🚀 Starting product migration...
✅ Migrated: Elegant Gold-Trimmed Frame
✅ Migrated: Vintage Ornate Picture Frame
...
🎉 Migration completed successfully!
📦 Total products migrated: 17
```

### 3️⃣ Test Your App

Start the development server:

```bash
npm run dev
```

Visit: http://localhost:3000/home

Your products should now load from Firestore! 🎉

---

## 🏗️ Project Structure (Phase 1)

```
art-things-brochure/
├── lib/
│   └── firebase/
│       ├── config.ts           # Firebase initialization
│       └── productService.ts   # Product database operations
├── scripts/
│   └── migrateProducts.js      # One-time migration script
├── .env.local                  # Your Firebase credentials (DO NOT COMMIT)
└── .env.example                # Template for credentials
```

---

## 🔍 How It Works

### Before (Hardcoded):
```typescript
const PRODUCTS = [{ id: 1, name: "..." }, ...]
```

### After (Cloud-Native):
```typescript
const products = await productService.getAllProducts()
```

### Architecture:
```
Next.js App → Product Service → Firebase SDK → Firestore Database
```

---

## 🛡️ Security Notes

- ✅ `.env.local` is in `.gitignore` (credentials are safe)
- ✅ Firestore is in test mode (we'll secure it in Phase 2)
- ✅ All Firebase keys are prefixed with `NEXT_PUBLIC_` (client-safe)

---

## 🐛 Troubleshooting

### Error: "Firebase config is invalid"
→ Check that all env variables are filled in `.env.local`

### Error: "Permission denied"
→ Ensure Firestore is in "test mode" in Firebase Console

### Products not showing
→ Run migration script again: `node scripts/migrateProducts.js`

---

## ✅ Phase 1 Complete Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] `.env.local` filled with credentials
- [ ] Migration script executed successfully
- [ ] App loads products from Firestore
- [ ] All 17 products visible on homepage

---

## 🎯 Next: PHASE 2

Once Phase 1 is working, we'll add:
- User authentication (login/signup)
- Shopping cart system
- Order placement
- Order history

**Confirm Phase 1 is working before proceeding!**
