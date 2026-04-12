import { productService } from './productService';
import { orderService } from './orderService';

export interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalSoldItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
  popularProducts: Array<{
    id: string;
    name: string;
    category: string;
    soldCount: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  categoryStats: Array<{
    category: string;
    products: number;
    revenue: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    category: string;
    stock: number;
    price: number;
  }>;
  inventoryTurnover: Array<{
    category: string;
    turnoverRate: number;
    totalSold: number;
    averageStock: number;
  }>;
}

export const analyticsService = {
  async getAnalyticsData(): Promise<AnalyticsData> {
    try {
      const [products, orders, orderStats] = await Promise.all([
        productService.getAllProducts(),
        orderService.getAllOrders(),
        orderService.getOrderStats()
      ]);

      const popularProducts = products
        .filter(p => p.soldCount && p.soldCount > 0)
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          soldCount: p.soldCount || 0,
          revenue: (p.soldCount || 0) * (p.price || 0)
        }))
        .sort((a, b) => b.soldCount - a.soldCount)
        .slice(0, 5);

      const revenueByMonth = this.calculateRevenueByMonth(orders);
      const categoryStats = this.calculateCategoryStats(products, orders);
      
      const totalSoldItems = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
      const lowStockProducts = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
      const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;
      const totalStockValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0);
      const inventoryTurnover = this.calculateInventoryTurnover(products);
      
      const uniqueUsers = new Set(orders.map(o => o.userId)).size;

      return {
        totalProducts: products.length,
        totalOrders: orderStats.totalOrders,
        totalRevenue: orderStats.totalRevenue,
        pendingOrders: orderStats.pendingOrders,
        completedOrders: orderStats.completedOrders,
        totalUsers: uniqueUsers,
        totalSoldItems,
        lowStockCount: lowStockProducts.length,
        outOfStockCount,
        totalStockValue,
        popularProducts,
        revenueByMonth,
        categoryStats,
        lowStockProducts: lowStockProducts.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          stock: p.stock || 0,
          price: p.price || 0
        })),
        inventoryTurnover
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
    }
  },

  calculateRevenueByMonth(orders: any[]): Array<{ month: string; revenue: number; orders: number }> {
    const monthlyData: { [key: string]: { revenue: number; orders: number } } = {};
    
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months.push({ key: monthKey, name: monthName });
      monthlyData[monthKey] = { revenue: 0, orders: 0 };
    }

    orders.forEach(order => {
      if (order.paymentStatus.toLowerCase().includes('paid')) {
        let orderDate: Date;
        
        if (order.createdAt instanceof Date) {
          orderDate = order.createdAt;
        } else if (order.createdAt?.toDate) {
          orderDate = order.createdAt.toDate();
        } else if (order.createdAt?.seconds) {
          orderDate = new Date(order.createdAt.seconds * 1000);
        } else if (typeof order.createdAt === 'string') {
          orderDate = new Date(order.createdAt);
        } else {
          return;
        }
        
        if (isNaN(orderDate.getTime())) {
          return;
        }
        
        const monthKey = orderDate.toISOString().slice(0, 7);
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].revenue += order.totalAmount;
          monthlyData[monthKey].orders += 1;
        }
      }
    });

    return months.map(month => ({
      month: month.name,
      revenue: monthlyData[month.key].revenue,
      orders: monthlyData[month.key].orders
    }));
  },

  calculateCategoryStats(products: any[], orders: any[]): Array<{ category: string; products: number; revenue: number }> {
    const categoryData: { [key: string]: { products: number; revenue: number } } = {};

    // Count products by category
    products.forEach(product => {
      if (!categoryData[product.category]) {
        categoryData[product.category] = { products: 0, revenue: 0 };
      }
      categoryData[product.category].products += 1;
    });

    // Calculate revenue by category
    orders.forEach(order => {
      if (order.paymentStatus.toLowerCase().includes('paid')) {
        order.items.forEach((item: any) => {
          if (!categoryData[item.category]) {
            categoryData[item.category] = { products: 0, revenue: 0 };
          }
          categoryData[item.category].revenue += item.price * item.quantity;
        });
      }
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      products: data.products,
      revenue: data.revenue
    }));
  },

  calculateInventoryTurnover(products: any[]): Array<{ category: string; turnoverRate: number; totalSold: number; averageStock: number }> {
    const categoryData: { [key: string]: { totalSold: number; totalStock: number; count: number } } = {};

    products.forEach(product => {
      if (!categoryData[product.category]) {
        categoryData[product.category] = { totalSold: 0, totalStock: 0, count: 0 };
      }
      categoryData[product.category].totalSold += product.soldCount || 0;
      categoryData[product.category].totalStock += product.stock || 0;
      categoryData[product.category].count += 1;
    });

    return Object.entries(categoryData).map(([category, data]) => {
      const averageStock = data.count > 0 ? data.totalStock / data.count : 0;
      const turnoverRate = averageStock > 0 ? data.totalSold / averageStock : 0;
      
      return {
        category,
        turnoverRate: Math.round(turnoverRate * 100) / 100,
        totalSold: data.totalSold,
        averageStock: Math.round(averageStock * 100) / 100
      };
    }).sort((a, b) => b.turnoverRate - a.turnoverRate);
  }
};