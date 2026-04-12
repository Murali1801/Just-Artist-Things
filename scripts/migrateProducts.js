const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PRODUCTS = [
  {
    id: "2",
    name: "Elegant Gold-Trimmed Frame",
    category: "Frames",
    image: "/Custom Portrait Frame (2).jpeg",
    description: "Sophisticated frame with luxurious gold accents",
  },
  {
    id: "3",
    name: "Vintage Ornate Picture Frame",
    category: "Frames",
    image: "/custom-portrait-frame.jpeg",
    description: "Beautifully detailed vintage-style frame with intricate patterns",
  },
  {
    id: "4",
    name: "Golden Diya Decor",
    category: "Decor",
    image: "/Golden Diya Decor.jpeg",
    description: "Elegant golden diya for festive decoration",
  },
  {
    id: "5",
    name: "Handcrafted Resin Diya",
    category: "Decor",
    image: "/Festive Resin Diya.png",
    description: "Artisan-crafted festive diya with unique resin design",
  },
  {
    id: "6",
    name: "Floral Heart Charm Pendant",
    category: "Accessories",
    image: "/Floral & Gold Heart Charm.png",
    description: "Delicate floral and gold heart charm for special occasions",
  },
  {
    id: "7",
    name: "Rose Gold Name Keychain",
    category: "Accessories",
    image: "/Personalized Name Keychain.png",
    description: "Elegant rose gold personalized name keychain",
  },
  {
    id: "8",
    name: "Crystal Acrylic Name Tag",
    category: "Accessories",
    image: "/Personalized Name Keychain (2).png",
    description: "Modern crystal-clear acrylic personalized keychain",
  },
  {
    id: "9",
    name: "Wooden Engraved Keychain",
    category: "Accessories",
    image: "/Personalized Name Keychain (3).png",
    description: "Natural wood keychain with laser-engraved name",
  },
  {
    id: "10",
    name: "Metallic Silver Name Charm",
    category: "Accessories",
    image: "/Personalized Name Keychain (4).png",
    description: "Sleek metallic silver personalized charm keychain",
  },
  {
    id: "11",
    name: "Colorful Resin Name Tag",
    category: "Accessories",
    image: "/Personalized Name Keychain (5).png",
    description: "Vibrant resin keychain with custom name design",
  },
  {
    id: "12",
    name: "Multi-Charm Personalized Set",
    category: "Accessories",
    image: "/Multi-Charm Name Set.png",
    description: "Beautiful collection of personalized charms and accessories",
  },
  {
    id: "13",
    name: "Luxury Charm Collection",
    category: "Accessories",
    image: "/Multi-Charm Name Set (2).png",
    description: "Premium multi-charm set with elegant finish",
  },
  {
    id: "14",
    name: "Birthday's Surprise",
    category: "Decor",
    image: "/Resin Art 1.png",
    description: "Stunning art piece perfect for Birthday celebrations",
  },
  {
    id: "15",
    name: "Valentine's Surprise",
    category: "Decor",
    image: "/Resin Art 2.png",
    description: "Stunning art piece perfect for Valentine's Day decore",
  },
  {
    id: "16",
    name: "Abstract Wall Art Panel",
    category: "Decor",
    image: "/Decorative Item.png",
    description: "Contemporary abstract wall art for modern spaces",
  },
  {
    id: "17",
    name: "Designer Memory Frame",
    category: "Frames",
    image: "/Custom Portrait Frame (3).jpeg",
    description: "Artistic designer frame for your precious memories",
  },
  {
    id: "18",
    name: "Baby Shower Celebration Set",
    category: "Special Occasion",
    image: "/Baby Shower Decor.gif",
    description: "Beautiful handcrafted baby shower decoration set",
  },
];

async function migrateProducts() {
  console.log('🚀 Starting product migration...');
  
  try {
    for (const product of PRODUCTS) {
      const { id, ...productData } = product;
      await setDoc(doc(db, 'products', id), productData);
      console.log(`✅ Migrated: ${product.name}`);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log(`📦 Total products migrated: ${PRODUCTS.length}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

migrateProducts();
