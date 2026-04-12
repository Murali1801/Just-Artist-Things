"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { productService } from "@/lib/firebase/productService"
import { StockStatus } from "@/components/stock-status"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, loading, updateQuantity, removeFromCart, clearCart, getTotalAmount } = useCart()
  const [stockInfo, setStockInfo] = useState<Record<string, number>>({})
  const [stockLoading, setStockLoading] = useState(false)

  // Fetch current stock for all cart items
  useEffect(() => {
    const fetchStockInfo = async () => {
      if (!cart?.items.length) return
      
      setStockLoading(true)
      try {
        const stockData: Record<string, number> = {}
        await Promise.all(
          cart.items.map(async (item) => {
            const product = await productService.getProductById(item.productId)
            stockData[item.productId] = product?.stock || 0
          })
        )
        setStockInfo(stockData)
      } catch (error) {
        console.error('Error fetching stock info:', error)
      } finally {
        setStockLoading(false)
      }
    }

    fetchStockInfo()
  }, [cart?.items])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-24">
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-6">Please sign in to add items to your cart</p>
            <Button onClick={() => router.push('/home')}>Go to Home</Button>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center">Loading cart...</div>
        </div>
        <Footer />
      </div>
    )
  }

  const isEmpty = !cart || cart.items.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Button
          variant="ghost"
          onClick={() => router.push('/home')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

          {isEmpty ? (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to get started</p>
              <Button onClick={() => router.push('/home')}>Start Shopping</Button>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => {
                  const currentStock = stockInfo[item.productId] || 0
                  const isOutOfStock = currentStock === 0
                  const isLowStock = currentStock > 0 && currentStock <= 5
                  const exceedsStock = item.quantity > currentStock
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Card className={`p-4 ${exceedsStock ? 'border-red-200 bg-red-50/50' : ''}`}>
                        {exceedsStock && (
                          <div className="mb-3 p-2 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-700">
                              Only {currentStock} items available. Please reduce quantity.
                            </span>
                          </div>
                        )}
                        
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                {!stockLoading && (
                                  <StockStatus stock={currentStock} variant="text" className="mt-1" />
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="h-8 w-8"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-12 text-center font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.quantity >= currentStock || isOutOfStock}
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                {currentStock > 0 && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    Max: {currentStock}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} each</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}

                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Cart
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  {(() => {
                    const hasStockIssues = cart.items.some(item => {
                      const currentStock = stockInfo[item.productId] || 0
                      return item.quantity > currentStock || currentStock === 0
                    })

                    return (
                      <>
                        <Button 
                          className="w-full mb-3"
                          size="lg"
                          onClick={() => router.push('/checkout')}
                          disabled={hasStockIssues}
                        >
                          {hasStockIssues ? 'Fix Stock Issues' : 'Proceed to Checkout'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => router.push('/home')}
                        >
                          Continue Shopping
                        </Button>
                      </>
                    )
                  })()}
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
