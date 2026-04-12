import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './config';
import { productService } from './productService';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: string;
}

export interface Order {
  id?: string;
  orderId: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
}

const ORDERS_COLLECTION = 'orders';

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'orderId' | 'createdAt'>): Promise<string> {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Check stock availability for all items
    for (const item of orderData.items) {
      const hasStock = await productService.checkStock(item.productId, item.quantity);
      if (!hasStock) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }
    
    const order: Order = {
      ...orderData,
      orderId,
      createdAt: new Date(),
    };

    // Create the order
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order);
    
    // Update stock for each item (only if payment is successful)
    if (orderData.paymentStatus.toLowerCase().includes('paid')) {
      for (const item of orderData.items) {
        await productService.updateStock(item.productId, item.quantity);
      }
    }
    
    return orderId;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const q = query(collection(db, ORDERS_COLLECTION), where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return null;
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Order;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    
    // Sort in JavaScript instead of Firestore
    return orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  },

  async getAllOrders(): Promise<Order[]> {
    const q = query(collection(db, ORDERS_COLLECTION));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    
    // Sort in JavaScript instead of Firestore
    return orders.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  },

  async getTotalRevenue(): Promise<number> {
    const orders = await this.getAllOrders();
    return orders
      .filter(order => order.paymentStatus.toLowerCase().includes('paid'))
      .reduce((total, order) => total + order.totalAmount, 0);
  },

  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    const orders = await this.getAllOrders();
    const paidOrders = orders.filter(order => order.paymentStatus.toLowerCase().includes('paid'));
    
    return {
      totalOrders: orders.length,
      totalRevenue: paidOrders.reduce((total, order) => total + order.totalAmount, 0),
      pendingOrders: orders.filter(order => 
        order.orderStatus.toLowerCase().includes('pending') || 
        order.orderStatus.toLowerCase().includes('processing')
      ).length,
      completedOrders: orders.filter(order => 
        order.orderStatus.toLowerCase().includes('delivered')
      ).length
    };
  }
};
