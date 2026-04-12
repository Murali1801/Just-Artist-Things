import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './config';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: Date;
}

const CARTS_COLLECTION = 'carts';

export const cartService = {
  async getCart(userId: string): Promise<Cart | null> {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    return cartSnap.exists() ? cartSnap.data() as Cart : null;
  },

  async addToCart(userId: string, item: Omit<CartItem, 'id'>): Promise<void> {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    let cart: Cart;
    if (cartSnap.exists()) {
      cart = cartSnap.data() as Cart;
      const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex >= 0) {
        cart.items[existingItemIndex].quantity += item.quantity;
      } else {
        cart.items.push({ ...item, id: Date.now().toString() });
      }
    } else {
      cart = {
        userId,
        items: [{ ...item, id: Date.now().toString() }],
        totalAmount: 0,
        updatedAt: new Date()
      };
    }
    
    cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();
    
    await setDoc(cartRef, cart);
  },

  async updateQuantity(userId: string, itemId: string, quantity: number): Promise<void> {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart;
      const itemIndex = cart.items.findIndex(i => i.id === itemId);
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          cart.items[itemIndex].quantity = quantity;
        }
        
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cart.updatedAt = new Date();
        
        await setDoc(cartRef, cart);
      }
    }
  },

  async removeFromCart(userId: string, itemId: string): Promise<void> {
    await this.updateQuantity(userId, itemId, 0);
  },

  async clearCart(userId: string): Promise<void> {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    await deleteDoc(cartRef);
  },

  subscribeToCart(userId: string, callback: (cart: Cart | null) => void) {
    const cartRef = doc(db, CARTS_COLLECTION, userId);
    return onSnapshot(cartRef, (doc) => {
      callback(doc.exists() ? doc.data() as Cart : null);
    });
  }
};