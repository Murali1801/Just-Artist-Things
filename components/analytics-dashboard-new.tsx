"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart
} from 'recharts'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, ShoppingCart, DollarSign, TrendingUp, Users, 
  Star, AlertTriangle, Activity, BarChart3, PieChart as PieChartIcon
} from "lucide-react"
import { analyticsService, AnalyticsData } from "@/lib/firebase/analyticsService"

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#3b82f6']

interface AnalyticsDashboardProps {
  className?: string
}

export default function AnalyticsDashboard({ className = "" }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await analyticsService.getAnalyticsData()
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    )
  }

  const avgOrderValue = analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hero Stats - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="relative overflow-hidden border-l-4 border-l-cyan-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-cyan-600">₹{analytics.totalRevenue.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">From {analytics.totalOrders} orders</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="relative overflow-hidden border-l-4 border-l-purple-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold text-purple-600">{analytics.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">{analytics.completedOrders} completed</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="relative overflow-hidden border-l-4 border-l-orange-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                  <p className="text-3xl font-bold text-orange-600">₹{avgOrderValue.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{analytics.totalSoldItems} items sold</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.totalUsers}</p>
                  <p className="text-xs text-muted-foreground">{analytics.totalProducts} products</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Revenue Trend</h3>
                    <p className="text-sm text-muted-foreground">Last 6 months performance</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analytics.revenueByMonth}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Category Distribution */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Category Distribution</h3>
                    <p className="text-sm text-muted-foreground">Products by category</p>
                  </div>
                  <PieChartIcon className="h-5 w-5 text-blue-600" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.categoryStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, products, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="products"
                    >
                      {analytics.categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Quick Stats Grid */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Quick Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="text-3xl font-bold text-green-600">{analytics.completedOrders}</div>
                <div className="text-sm text-muted-foreground mt-1">Completed</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                <div className="text-3xl font-bold text-orange-600">{analytics.pendingOrders}</div>
                <div className="text-sm text-muted-foreground mt-1">Pending</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="text-3xl font-bold text-blue-600">{analytics.totalSoldItems}</div>
                <div className="text-sm text-muted-foreground mt-1">Items Sold</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <div className="text-3xl font-bold text-purple-600">{analytics.categoryStats.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Categories</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Top Selling Products</h3>
                  <p className="text-sm text-muted-foreground">Best performers</p>
                </div>
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="space-y-4">
                {analytics.popularProducts.length > 0 ? (
                  analytics.popularProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-accent/50 to-transparent hover:from-accent transition-all">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{product.soldCount}</p>
                        <p className="text-sm text-muted-foreground">₹{product.revenue.toFixed(0)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Star className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No sales data yet</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Revenue by Category */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Revenue by Category</h3>
                  <p className="text-sm text-muted-foreground">Category performance</p>
                </div>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.categoryStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="category" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stock Value */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Stock Value</h3>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-4xl font-bold text-green-600">₹{analytics.totalStockValue.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total inventory value</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalProducts - analytics.outOfStockCount}</p>
                    <p className="text-xs text-muted-foreground">In Stock</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{analytics.outOfStockCount}</p>
                    <p className="text-xs text-muted-foreground">Out of Stock</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Low Stock Alert */}
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Low Stock Alert</h3>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="space-y-3">
                {analytics.lowStockProducts.length > 0 ? (
                  <>
                    <div className="text-center py-2">
                      <p className="text-4xl font-bold text-orange-600">{analytics.lowStockCount}</p>
                      <p className="text-sm text-muted-foreground mt-1">Items need restocking</p>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {analytics.lowStockProducts.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex justify-between items-center p-2 bg-white dark:bg-slate-900 rounded-lg text-sm">
                          <span className="font-medium truncate">{product.name}</span>
                          <span className="text-orange-600 font-bold">{product.stock}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-2xl font-bold text-green-600">All Good!</p>
                    <p className="text-sm text-muted-foreground mt-1">No low stock items</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Inventory Turnover */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Turnover</h3>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                {analytics.inventoryTurnover.length > 0 ? (
                  analytics.inventoryTurnover.slice(0, 5).map((category) => (
                    <div key={category.category} className="flex justify-between items-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{category.category}</p>
                        <p className="text-xs text-muted-foreground">{category.totalSold} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{category.turnoverRate}x</p>
                        <p className="text-xs text-muted-foreground">Avg: {category.averageStock}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No turnover data</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
