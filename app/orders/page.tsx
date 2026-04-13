"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Package, Calendar, CreditCard, Truck, Clock, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { orderService, Order } from "@/lib/firebase/orderService"
import { useAuth } from "@/contexts/AuthContext"

const FLOWPAY_API_URL = (
  process.env.NEXT_PUBLIC_FLOWPAY_API_URL || "https://flow-pay-api.vercel.app"
).replace(/\/$/, "")

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Track which FlowPay order IDs have already been synced so we never
  // re-process an already-confirmed payment (even across re-renders).
  const syncedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      router.push("/home")
      return
    }

    // Real-time subscription to user's orders
    const unsubscribe = orderService.subscribeToUserOrders(user.uid, (updatedOrders) => {
      setOrders(updatedOrders)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, router])

  // ── Sync pending FlowPay orders ──────────────────────────────────────────
  // Fires only when orders list changes. Uses syncedRef to prevent duplicate
  // processing across re-renders or Firestore real-time updates.
  useEffect(() => {
    if (orders.length === 0) return

    const pendingFlowPayOrders = orders.filter(
      (o) =>
        o.paymentStatus === "Pending (FlowPay)" &&
        o.externalOrderId &&
        o.id &&
        !syncedRef.current.has(o.externalOrderId)
    )

    if (pendingFlowPayOrders.length === 0) return

    pendingFlowPayOrders.forEach(async (order) => {
      const extId = order.externalOrderId!
      // Optimistically mark as "in progress" so we don't retry immediately
      syncedRef.current.add(extId)

      try {
        const res = await fetch(`${FLOWPAY_API_URL}/api/orders/${extId}`)
        if (!res.ok) {
          // Server error — remove from synced so we retry next time
          syncedRef.current.delete(extId)
          return
        }
        const data = await res.json()

        if (data.status === "Paid") {
          // ─ Payment confirmed! Update status + deduct stock ─
          await orderService.confirmAndDeductStock(
            order.id!, // local Firestore document ID
            order.items,
            {
              paymentStatus: "Paid (FlowPay)",
              orderStatus: "Processing",
            }
          )
          // Keep in synced set — order is confirmed, no need to re-check
        } else {
          // Still pending — remove from synced so we retry next cycle
          syncedRef.current.delete(extId)
        }
      } catch (e) {
        console.error("[Orders] Failed to sync FlowPay status:", e)
        syncedRef.current.delete(extId) // Allow retry
      }
    })
  }, [orders])

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("processing") || s.includes("verification")) return <Clock size={14} className="animate-pulse" />
    if (s.includes("shipped")) return <Truck size={14} />
    if (s.includes("delivered")) return <CheckCircle size={14} />
    if (s.includes("pending")) return <AlertCircle size={14} />
    return <Package size={14} />
  }

  const getStatusClass = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("delivered")) return "bg-primary/10 text-primary border-primary/20"
    if (s.includes("shipped")) return "bg-secondary text-white border-secondary/20"
    if (s.includes("processing")) return "bg-primary/5 text-primary/80 border-primary/10"
    return "bg-muted text-muted-foreground border-border"
  }

  const getPaymentBadgeClass = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("paid")) return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
    if (s.includes("pending")) return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"
    return "border-border/50 text-muted-foreground"
  }

  const formatDate = (date: any) => {
    const d = date instanceof Date ? date : date?.toDate ? date.toDate() : new Date(date)
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d)
  }

  if (!user) return null

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 block">
              Account
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold">Your Archive</h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-md">
              Tracking the journey of your curated artistic acquisitions.
            </p>
          </motion.div>

          <Button
            onClick={() => router.push("/home")}
            variant="ghost"
            className="text-[10px] uppercase tracking-widest font-bold group"
          >
            Return to Store{" "}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-10">
            {[1, 2].map((i) => (
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
              onClick={() => router.push("/home")}
              className="px-12 h-14 rounded-xl bg-primary shadow-xl shadow-primary/20 font-bold text-[10px] uppercase tracking-widest"
            >
              Start Curating
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-12">
            {orders.map((order, idx) => {
              const isPendingPayment = order.paymentStatus === "Pending (FlowPay)"
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card rounded-[2.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border-white/5"
                >
                  {/* Status Bar */}
                  <div className="px-10 py-6 border-b border-border/10 flex flex-wrap justify-between items-center gap-6 bg-primary/5">
                    <div className="flex flex-wrap gap-3 items-center">
                      <div
                        className={`px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 ${getStatusClass(order.orderStatus)}`}
                      >
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </div>

                      <div
                        className={`px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 ${getPaymentBadgeClass(order.paymentStatus)}`}
                      >
                        {isPendingPayment && (
                          <span className="relative flex h-2 w-2 mr-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                          </span>
                        )}
                        {order.paymentStatus}
                      </div>

                      {isPendingPayment && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                          Waiting for payment confirmation…
                        </span>
                      )}
                    </div>

                    <div className="flex gap-8 text-[10px] uppercase tracking-widest font-bold">
                      <span className="text-muted-foreground">
                        ID:{" "}
                        <span className="text-foreground ml-2">{order.orderId}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Placed:{" "}
                        <span className="text-foreground ml-2">{formatDate(order.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col md:flex-row gap-12">
                    <div className="flex-1 space-y-6">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-6 group/item">
                          <div className="h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border border-border/10">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform group-hover/item:scale-110"
                            />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-primary mb-1">
                              {item.category}
                            </p>
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
                          <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground block mb-2">
                            Destination
                          </span>
                          <p className="font-bold">{order.shippingAddress.fullName}</p>
                          <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                          </p>
                        </div>
                        <div className="pt-6 border-t border-border/5">
                          <div className="flex justify-between items-baseline">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                              Acquisition Value
                            </span>
                            <span className="text-2xl font-bold text-foreground">
                              ₹{order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* If payment is still pending, show a link back to FlowPay */}
                      {isPendingPayment && order.externalOrderId && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_FLOWPAY_FRONTEND_URL || "https://flow-pay-self.vercel.app"}/pay/${order.externalOrderId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-10 inline-flex items-center justify-center h-14 rounded-xl border border-amber-400 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all text-[10px] uppercase tracking-widest font-bold gap-2"
                        >
                          <RefreshCw size={14} />
                          Complete Payment
                        </a>
                      )}

                      {!isPendingPayment && (
                        <Button
                          variant="outline"
                          className="mt-10 h-14 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all text-[10px] uppercase tracking-widest font-bold"
                        >
                          View Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}