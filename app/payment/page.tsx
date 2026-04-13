"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Smartphone, CheckCircle, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { orderService } from "@/lib/firebase/orderService"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "sonner"

// FlowPay configuration — set these in .env.local / Vercel env vars
const FLOWPAY_API_URL = (
  process.env.NEXT_PUBLIC_FLOWPAY_API_URL || "https://flow-pay-api.vercel.app"
).replace(/\/$/, "")

const FLOWPAY_FRONTEND_URL = (
  process.env.NEXT_PUBLIC_FLOWPAY_FRONTEND_URL || "https://flow-pay-self.vercel.app"
).replace(/\/$/, "")

// These must exist in Vercel env vars for the brochure project
const FLOWPAY_API_KEY = process.env.NEXT_PUBLIC_FLOWPAY_API_KEY || ""
const FLOWPAY_MERCHANT_ID = process.env.NEXT_PUBLIC_FLOWPAY_MERCHANT_ID || ""

// The URL FlowPay will link back to after successful payment
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || ""
).replace(/\/$/, "")

export default function PaymentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { clearCart } = useCart()

  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/home")
      return
    }
    const data = sessionStorage.getItem("checkoutData")
    if (!data) {
      router.push("/cart")
      return
    }
    setCheckoutData(JSON.parse(data))
  }, [user, router])

  const handleFlowPayCheckout = async () => {
    if (!checkoutData || processing) return
    setProcessing(true)

    try {
      // ── Step 1: Create order in FlowPay backend ─────────────────────────
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (FLOWPAY_API_KEY) headers["X-API-Key"] = FLOWPAY_API_KEY

      // Build the return URL: after payment, FlowPay success page will link here
      const returnUrl = SITE_URL ? `${SITE_URL}/orders` : null

      const body: Record<string, unknown> = {
        amount: checkoutData.totalAmount,
        customer_details: {
          name: user!.displayName || checkoutData.shippingAddress.fullName,
          email: user!.email,
          phone: checkoutData.shippingAddress.phone,
        },
        shipping_address: {
          full_name: checkoutData.shippingAddress.fullName,
          address_line_1: checkoutData.shippingAddress.addressLine1,
          address_line_2: checkoutData.shippingAddress.addressLine2 || undefined,
          city: checkoutData.shippingAddress.city,
          state: checkoutData.shippingAddress.state,
          pincode: checkoutData.shippingAddress.pincode,
        },
        items: checkoutData.items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
      }

      // Attach merchant ID only if configured — ensures orders are linked to the merchant
      if (FLOWPAY_MERCHANT_ID) body.merchant_id = FLOWPAY_MERCHANT_ID
      if (returnUrl) body.return_url = returnUrl

      const response = await fetch(`${FLOWPAY_API_URL}/api/checkout`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(
          (err as any)?.detail || "Failed to create FlowPay payment session"
        )
      }

      const { order_id: flowPayOrderId } = await response.json()

      // ── Step 2: Create local order in brochure Firebase ──────────────────
      // paymentStatus is set to Pending — stock will be deducted ONLY after payment confirmed.
      await orderService.createOrder({
        userId: user!.uid,
        userEmail: user!.email || "",
        userName: user!.displayName || checkoutData.shippingAddress.fullName || "Guest",
        items: checkoutData.items,
        totalAmount: checkoutData.totalAmount,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: "FlowPay (UPI)",
        paymentStatus: "Pending (FlowPay)",
        orderStatus: "Payment Verification",
        externalOrderId: flowPayOrderId,
      })

      // ── Step 3: Clear cart, wipe session data, redirect to FlowPay ───────
      await clearCart()
      sessionStorage.removeItem("checkoutData")

      // Hard redirect — user leaves our domain and enters FlowPay checkout
      window.location.href = `${FLOWPAY_FRONTEND_URL}/pay/${flowPayOrderId}`
    } catch (error) {
      console.error("[FlowPay] Checkout error:", error)
      const msg =
        error instanceof Error ? error.message : "Failed to initiate payment"
      toast.error(msg)
      setProcessing(false)
    }
  }

  if (!user || !checkoutData) return null

  const total: number = checkoutData.totalAmount

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!processing && (
          <Button
            variant="ghost"
            onClick={() => router.push("/checkout")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </Button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-serif font-bold mb-8">Secure Payment</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* FlowPay Payment Card */}
            <Card className="p-6 border-primary/50 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">FlowPay Checkout</h3>
                  <p className="text-sm text-muted-foreground">UPI · Scan QR · Instant AI Verification</p>
                </div>
              </div>

              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  100% Encrypted &amp; Secure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Scan QR with GPay, PhonePe, Paytm, BHIM
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  Order confirmed automatically after payment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  You&apos;ll be returned here after paying
                </li>
              </ul>

              {/* Amount banner */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold">₹{total.toFixed(2)}</p>
                <p className="text-xs text-green-600 mt-1">FREE delivery included</p>
              </div>

              <Button
                onClick={handleFlowPayCheckout}
                className="w-full"
                size="lg"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Opening FlowPay…
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-5 w-5" />
                    Pay ₹{total.toFixed(2)} with FlowPay
                  </>
                )}
              </Button>

              {processing && (
                <p className="text-xs text-center text-muted-foreground mt-3 animate-pulse">
                  Connecting to secure payment servers…
                </p>
              )}
            </Card>

            {/* Right: Order summary */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {checkoutData.items.map((item: any) => (
                  <div key={item.id} className="flex gap-3">
                    {item.image && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="text-sm">
                <p className="font-medium mb-2">Shipping to:</p>
                <p className="text-muted-foreground leading-relaxed">
                  {checkoutData.shippingAddress.fullName}<br />
                  {checkoutData.shippingAddress.addressLine1}<br />
                  {checkoutData.shippingAddress.addressLine2 && (
                    <>{checkoutData.shippingAddress.addressLine2}<br /></>
                  )}
                  {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state} — {checkoutData.shippingAddress.pincode}<br />
                  📞 {checkoutData.shippingAddress.phone}
                </p>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
