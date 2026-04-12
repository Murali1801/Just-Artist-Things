import { collection, doc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';
import { Product } from './productService';

export interface FavoriteItem {
  userId: string;
  productId: string;
  addedAt: number;
}

const FAVORITES_COLLECTION = 'favorites';

export const favoritesService = {
  async addToFavorites(userId: string, productId: string): Promise<void> {
    const favoriteId = `${userId}_${productId}`;
    await setDoc(doc(db, FAVORITES_COLLECTION, favoriteId), {
      userId,
      productId,
      addedAt: Date.now(),
    });
  },

  async removeFromFavorites(userId: string, productId: string): Promise<void> {
    const favoriteId = `${userId}_${productId}`;
    await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteId));
  },

  async getUserFavorites(userId: string): Promise<string[]> {
    const q = query(collection(db, FAVORITES_COLLECTION), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().productId);
  },

  async isFavorite(userId: string, productId: string): Promise<boolean> {
    const favorites = await this.getUserFavorites(userId);
    return favorites.includes(productId);
  },
};
