"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Package, Calendar, CreditCard, Truck, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { orderService, Order } from "@/lib/firebase/orderService"
import { useAuth } from "@/contexts/AuthContext"

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/home')
      return
    }

    // Real-time subscription to orders
    const unsubscribe = orderService.subscribeToUserOrders(user.uid, (updatedOrders) => {
      setOrders(updatedOrders)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, router])

  // Sync with FlowPay
  useEffect(() => {
    if (orders.length === 0) return;
    const flowPayApiUrl = process.env.NEXT_PUBLIC_FLOWPAY_API_URL || 'https://flow-pay-api.vercel.app';
    
    orders.forEach(async (order) => {
      if (order.paymentStatus === 'Pending (FlowPay)' && order.externalOrderId && order.id) {
        try {
          const res = await fetch(`${flowPayApiUrl}/api/orders/${order.externalOrderId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'Paid') {
              await orderService.updateOrderStatus(order.id, {
                paymentStatus: 'Paid (FlowPay)',
                orderStatus: 'Processing'
                // NOTE: Stock deduction handled by admin natively in the future,
                // or you could add a serverless function here.
              });
            }
          }
        } catch (e) {
          console.error('Failed to sync FlowPay order status', e);
        }
      }
    });
  }, [orders]);

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('processing')) return <Clock size={14} className="animate-pulse" />
    if (s.includes('shipped')) return <Truck size={14} />
    if (s.includes('delivered')) return <CheckCircle size={14} />
    return <Package size={14} />
  }

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('delivered')) return "bg-primary/10 text-primary border-primary/20"
    if (s.includes('shipped')) return "bg-secondary text-white border-secondary/20"
    if (s.includes('processing')) return "bg-primary/5 text-primary/80 border-primary/10"
    return "bg-muted text-muted-foreground border-border"
  }

  const formatDate = (date: any) => {
    const d = date instanceof Date ? date : (date?.toDate ? date.toDate() : new Date(date))
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d)
  }

  if (!user) return null

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 block">Account</span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold">Your Archive</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-md">
              Tracking the journey of your curated artistic acquisitions.
            </p>
          </motion.div>
          
          <Button 
            onClick={() => router.push('/home')} 
            variant="ghost"
            className="text-[10px] uppercase tracking-widest font-bold group"
          >
            Return to Store <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-10">
            {[1, 2].map(i => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 glass-card rounded-[3rem]"
          >
            <Package className="h-16 w-16 text-primary/20 mx-auto mb-8" />
            <h2 className="text-2xl font-serif font-bold mb-4">No acquisitions found.</h2>
            <p className="text-muted-foreground mb-12">The collection is currently empty.</p>
            <Button 
              onClick={() => router.push('/home')}
              className="px-12 h-14 rounded-xl bg-primary shadow-xl shadow-primary/20 font-bold text-[10px] uppercase tracking-widest"
            >
              Start Curating
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-12">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border-white/5"
              >
                {/* Status Bar */}
                <div className="px-10 py-6 border-b border-border/10 flex flex-wrap justify-between items-center gap-6 bg-primary/5">
                  <div className="flex gap-4">
                    <div className={`px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 ${getStatusClass(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </div>
                    <div className="px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold border-border/50 text-muted-foreground">
                      {order.paymentStatus}
                    </div>
                  </div>
                  <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
                    <span className="text-muted-foreground">ID: <span className="text-foreground ml-2">{order.orderId}</span></span>
                    <span className="text-muted-foreground">Placed: <span className="text-foreground ml-2">{formatDate(order.createdAt)}</span></span>
                  </div>
                </div>

                <div className="p-10 flex flex-col md:flex-row gap-12">
                  <div className="flex-1 space-y-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-6 group/item">
                        <div className="h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border/10">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">{item.category}</p>
                          <h4 className="text-xl font-serif font-bold text-foreground">{item.name}</h4>
                          <span className="text-sm text-muted-foreground">Quantity: {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="md:w-px bg-border/10 self-stretch" />

                  <div className="md:w-80 flex flex-col justify-between pt-2">
                    <div className="space-y-6 text-sm">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-2">Destination</span>
                        <p className="font-bold">{order.shippingAddress.fullName}</p>
                        <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                          {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                        </p>
                      </div>
                      <div className="pt-6 border-t border-border/5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Acquisition Value</span>
                          <span className="text-2xl font-bold text-foreground">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline"
                      className="mt-10 h-14 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all text-[10px] uppercase tracking-widest font-bold"
                    >
                      View Invoice
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}