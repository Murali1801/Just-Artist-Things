"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Package, CheckCircle, Clock, Truck, AlertCircle, ArrowRight, RefreshCw, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { orderService, Order, OrderItem } from "@/lib/firebase/orderService"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { toast } from "sonner"

const FP_API = (process.env.NEXT_PUBLIC_FLOWPAY_API_URL    || "https://flow-pay-api.vercel.app").replace(/\/$/, "")
const FP_WEB = (process.env.NEXT_PUBLIC_FLOWPAY_FRONTEND_URL || "https://flow-pay-self.vercel.app").replace(/\/$/, "")

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtDate(d: any) {
  const dt = d instanceof Date ? d : d?.toDate ? d.toDate() : new Date(d)
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(dt)
}

function payBadgeClass(s: string) {
  const lc = s.toLowerCase()
  if (lc.includes("paid"))    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400"
  if (lc.includes("pending")) return "bg-amber-100  text-amber-800  border-amber-200  dark:bg-amber-900/30  dark:text-amber-400"
  return "bg-muted text-muted-foreground border-border"
}

function orderBadgeClass(s: string) {
  const lc = s.toLowerCase()
  if (lc.includes("delivered"))  return "bg-primary/10 text-primary border-primary/20"
  if (lc.includes("shipped"))    return "bg-secondary/80 text-white border-secondary/20"
  if (lc.includes("processing")) return "bg-blue-100 text-blue-800 border-blue-200"
  return "bg-muted text-muted-foreground border-border"
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const router          = useRouter()
  const { user }        = useAuth()
  const { clearCart }   = useCart()
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Prevent double-confirming the same external order
  const confirmedRef = useRef<Set<string>>(new Set())
  // Track which external IDs are currently being checked (prevent concurrent requests)
  const inFlightRef  = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!user) { router.push("/home"); return }
    const unsub = orderService.subscribeToUserOrders(user.uid, o => {
      setOrders(o)
      setLoading(false)
    })
    return () => unsub()
  }, [user, router])

  // ── On every orders update: check for any pending FlowPay orders ──────────
  const syncPendingOrders = useCallback(async (pendingOrders: Order[]) => {
    for (const order of pendingOrders) {
      const extId = order.externalOrderId!
      if (confirmedRef.current.has(extId)) continue   // already done
      if (inFlightRef.current.has(extId))  continue   // already checking
      inFlightRef.current.add(extId)

      try {
        const res  = await fetch(`${FP_API}/api/orders/${extId}`)
        if (!res.ok) { inFlightRef.current.delete(extId); continue }
        const data = await res.json()

        if (data.status === "Paid") {
          confirmedRef.current.add(extId)
          inFlightRef.current.delete(extId)

          // ── PAYMENT CONFIRMED ── mark confirmed + deduct stock ───────────
          await orderService.confirmAndDeductStock(
            order.id!,
            order.items as OrderItem[],
            { paymentStatus: "Paid (FlowPay)", orderStatus: "Processing" }
          )

          // ── Clear the cart ONLY now that payment is confirmed ────────────
          try { await clearCart() } catch (e) { console.error("[Orders] clearCart failed:", e) }

          // Clear leftover session data from the checkout flow
          try { sessionStorage.removeItem("pendingFlowPayOrder") } catch { /**/ }

          toast.success("Payment confirmed! Your order is being processed.")
        } else {
          inFlightRef.current.delete(extId)  // still pending — allow retry
        }
      } catch (e) {
        console.error("[Orders] Status check failed for", extId, e)
        inFlightRef.current.delete(extId)
      }
    }
  }, [clearCart])

  useEffect(() => {
    const pending = orders.filter(
      o => o.paymentStatus === "Pending (FlowPay)" && o.externalOrderId && o.id
    )
    if (pending.length > 0) syncPendingOrders(pending)
  }, [orders, syncPendingOrders])

  if (!user) return null

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between items-end gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-3 block">Account</span>
            <h1 className="text-5xl font-serif font-bold">Your Orders</h1>
            <p className="text-muted-foreground mt-3 max-w-md">Track the journey of every acquisition.</p>
          </motion.div>
          <Button variant="ghost" onClick={() => router.push("/home")}
            className="text-[10px] uppercase tracking-widest font-bold group">
            Return to Store <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="grid gap-8">
            {[1,2].map(i => <div key={i} className="h-56 bg-muted animate-pulse rounded-3xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 bg-white/60 dark:bg-slate-800/40 rounded-3xl border border-border/30">
            <ShoppingBag className="h-16 w-16 text-primary/20 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold mb-3">No orders yet</h2>
            <p className="text-muted-foreground mb-10">Start curating your collection.</p>
            <Button onClick={() => router.push("/home")} className="px-12 h-12 font-bold">
              Explore the Store
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-10">
            {orders.map((order, idx) => {
              const isPending = order.paymentStatus === "Pending (FlowPay)"
              const isPaid    = order.paymentStatus?.toLowerCase().includes("paid")
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white dark:bg-slate-800/50 rounded-3xl border border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

                  {/* Status bar */}
                  <div className="px-6 py-4 border-b border-border/20 bg-muted/30 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      {/* Order status pill */}
                      <span className={`px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 ${orderBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus.toLowerCase().includes("processing") ? <Clock size={11} className="animate-pulse" />
                         : order.orderStatus.toLowerCase().includes("shipped")   ? <Truck size={11} />
                         : order.orderStatus.toLowerCase().includes("delivered") ? <CheckCircle size={11} />
                         : <Package size={11} />}
                        {order.orderStatus}
                      </span>
                      {/* Payment pill */}
                      <span className={`px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 ${payBadgeClass(order.paymentStatus)}`}>
                        {isPending && (
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                          </span>
                        )}
                        {order.paymentStatus}
                      </span>
                      {isPending && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium italic">
                          Awaiting payment confirmation…
                        </span>
                      )}
                    </div>

                    <div className="flex gap-6 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground">
                      <span>ID: <span className="text-foreground pl-1 font-mono">{order.orderId}</span></span>
                      <span>Placed: <span className="text-foreground pl-1">{fmtDate(order.createdAt)}</span></span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col md:flex-row gap-8">
                    {/* Items */}
                    <div className="flex-1 space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="w-px bg-border/30 self-stretch hidden md:block" />

                    {/* Shipping + amount */}
                    <div className="md:w-72 flex flex-col justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Ship to</p>
                        <p className="font-semibold">{order.shippingAddress.fullName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {order.shippingAddress.addressLine1}
                          {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`},{" "}
                          {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground">📞 {order.shippingAddress.phone}</p>
                      </div>
                      <div className="border-t border-border/20 pt-4 flex justify-between items-baseline">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Total Paid</span>
                        <span className="text-2xl font-bold">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      {/* Action buttons */}
                      {isPending && order.externalOrderId && (
                        <a
                          href={`${FP_WEB}/pay/${order.externalOrderId}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-amber-400 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-[10px] uppercase tracking-widest font-bold transition-colors">
                          <RefreshCw size={13} /> Complete Payment
                        </a>
                      )}
                      {isPaid && (
                        <Button variant="outline" size="sm"
                          className="h-11 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-white hover:border-primary transition-colors">
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