"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Loader2, Home, Package, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import { orderService, Order } from "@/lib/firebase/orderService"
import Link from "next/link"

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "pending">("loading")
  
  const orderId = searchParams.get("orderId")
  const paramStatus = searchParams.get("status") // 'success', 'failed'

  useEffect(() => {
    if (!orderId) {
      router.push("/")
      return
    }

    // Subscribe to real-time updates for this order
    const unsubscribe = orderService.subscribeToOrder(orderId, (updatedOrder) => {
      if (!updatedOrder) {
        setStatus("failed")
        return
      }

      setOrder(updatedOrder)
      
      const pStatus = updatedOrder.paymentStatus.toLowerCase()
      if (pStatus.includes("paid") || pStatus === "completed" || pStatus === "success") {
        setStatus("success")
      } else if (pStatus.includes("failed")) {
        setStatus("failed")
      } else {
        setStatus("pending")
      }
    })

    return () => unsubscribe()
  }, [orderId, router])

  const renderStatus = () => {
    switch (status) {
      case "loading":
        return (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-serif font-bold">Connecting to Studio...</h2>
            <p className="text-muted-foreground mt-2">Retrieving your order details</p>
          </motion.div>
        )
      
      case "pending":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-8">
              <Loader2 className="h-24 w-24 text-primary animate-spin opacity-20" />
              <ShoppingBag className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Awaiting Confirmation</h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We're waiting for FlowPay to confirm your transaction. This usually takes a few seconds.
            </p>
            <div className="mt-10 p-4 glass rounded-2xl border-primary/10 inline-flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Order ID:</span>
              <code className="text-xs font-bold text-primary">{orderId}</code>
            </div>
          </motion.div>
        )

      case "success":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mb-8"
            >
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
              Masterpiece <span className="text-primary italic">Secured.</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed mb-12">
              Your payment was successful. Our artisans have been notified and will begin preparing your collection shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <Link href="/orders" className="flex-1">
                <Button className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary/20">
                  <Package className="mr-2 h-4 w-4" />
                  Track Order
                </Button>
              </Link>
              <Link href="/home" className="flex-1">
                <Button variant="outline" className="w-full h-14 rounded-xl border-border hover:bg-muted font-bold text-xs uppercase tracking-widest">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        )

      case "failed":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="h-24 w-24 bg-destructive/10 rounded-full flex items-center justify-center mb-8">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">Payment Unsuccessful</h2>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed mb-12">
              Something went wrong during the transaction. Don't worry, if any amount was deducted, it will be refunded automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
              <Button 
                onClick={() => router.push('/cart')}
                className="flex-1 h-14 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-widest shadow-xl"
              >
                Retry Payment
              </Button>
              <Button 
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex-1 h-14 rounded-xl font-bold text-xs uppercase tracking-widest"
              >
                Go Home
              </Button>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="glass-card max-w-3xl mx-auto rounded-[3rem] p-12 overflow-hidden relative">
          {/* Background Accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[80px] -z-10" />
          
          <AnimatePresence mode="wait">
            {renderStatus()}
          </AnimatePresence>

          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 pt-12 border-t border-border"
            >
              <div className="grid grid-cols-2 gap-8 text-left">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-2">Deliver To:</span>
                  <p className="text-sm font-bold">{order.shippingAddress.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-2">Total Amount:</span>
                  <p className="text-xl font-bold text-foreground">₹{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
