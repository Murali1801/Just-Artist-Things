import { collection, getDocs, doc, getDoc, addDoc, updateDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { productService } from './productService';

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'restock' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdAt: Date;
  createdBy?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  alertType: 'low' | 'out';
  createdAt: Date;
  resolved: boolean;
}

const TRANSACTIONS_COLLECTION = 'inventoryTransactions';
const ALERTS_COLLECTION = 'stockAlerts';

export const inventoryService = {
  async recordTransaction(
    productId: string,
    type: InventoryTransaction['type'],
    quantity: number,
    reason?: string,
    userId?: string
  ): Promise<string> {
    const product = await productService.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const previousStock = product.stock || 0;
    let newStock = previousStock;

    if (type === 'restock' || type === 'return') {
      newStock = previousStock + quantity;
    } else if (type === 'sale' || type === 'adjustment') {
      newStock = Math.max(0, previousStock - quantity);
    }

    await productService.updateProduct(productId, { stock: newStock });

    const transaction = {
      productId,
      productName: product.name,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      createdAt: Timestamp.now(),
      createdBy: userId
    };

    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), transaction);
    
    await this.checkAndCreateAlert(productId);
    
    return docRef.id;
  },

  async getTransactionHistory(productId?: string, limit: number = 50): Promise<InventoryTransaction[]> {
    const transactionsRef = collection(db, TRANSACTIONS_COLLECTION);
    let q = query(transactionsRef, orderBy('createdAt', 'desc'));
    
    if (productId) {
      q = query(transactionsRef, where('productId', '==', productId), orderBy('createdAt', 'desc'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as InventoryTransaction));
  },

  async checkAndCreateAlert(productId: string): Promise<void> {
    const product = await productService.getProductById(productId);
    if (!product) return;

    const stock = product.stock || 0;
    const threshold = 5;

    if (stock === 0 || stock <= threshold) {
      const alertsRef = collection(db, ALERTS_COLLECTION);
      const q = query(
        alertsRef,
        where('productId', '==', productId),
        where('resolved', '==', false)
      );
      const existingAlerts = await getDocs(q);

      if (existingAlerts.empty) {
        await addDoc(collection(db, ALERTS_COLLECTION), {
          productId,
          productName: product.name,
          currentStock: stock,
          threshold,
          alertType: stock === 0 ? 'out' : 'low',
          createdAt: Timestamp.now(),
          resolved: false
        });
      }
    }
  },

  async getActiveAlerts(): Promise<StockAlert[]> {
    const alertsRef = collection(db, ALERTS_COLLECTION);
    const q = query(alertsRef, where('resolved', '==', false), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as StockAlert));
  },

  async resolveAlert(alertId: string): Promise<void> {
    await updateDoc(doc(db, ALERTS_COLLECTION, alertId), { resolved: true });
  },

  async bulkRestock(items: { productId: string; quantity: number; reason?: string }[], userId?: string): Promise<void> {
    const promises = items.map(item =>
      this.recordTransaction(item.productId, 'restock', item.quantity, item.reason, userId)
    );
    await Promise.all(promises);
  },

  async getInventoryReport(): Promise<{
    totalValue: number;
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    recentTransactions: number;
  }> {
    const products = await productService.getAllProducts();
    const alerts = await this.getActiveAlerts();
    const transactions = await this.getTransactionHistory(undefined, 100);

    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(t => t.createdAt >= last7Days);

    return {
      totalValue: products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0),
      totalItems: products.reduce((sum, p) => sum + (p.stock || 0), 0),
      lowStockItems: alerts.filter(a => a.alertType === 'low').length,
      outOfStockItems: alerts.filter(a => a.alertType === 'out').length,
      recentTransactions: recentTransactions.length
    };
  }
};
