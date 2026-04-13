"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, CheckCircle, Loader2, ShieldCheck,
  MapPin, Phone, User, Home, Building, AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "sonner"

// ─── FlowPay config ─────────────────────────────────────────────────────────
const FP_API    = (process.env.NEXT_PUBLIC_FLOWPAY_API_URL    || "https://flow-pay-api.vercel.app").replace(/\/$/, "")
const FP_WEB    = (process.env.NEXT_PUBLIC_FLOWPAY_FRONTEND_URL || "https://flow-pay-self.vercel.app").replace(/\/$/, "")
const FP_KEY    = process.env.NEXT_PUBLIC_FLOWPAY_API_KEY    || ""
const FP_MID    = process.env.NEXT_PUBLIC_FLOWPAY_MERCHANT_ID || ""
const SITE_URL  = (process.env.NEXT_PUBLIC_SITE_URL           || "").replace(/\/$/, "")

// ─── Types ───────────────────────────────────────────────────────────────────
type FormData = {
  fullName: string; phone: string
  addressLine1: string; addressLine2: string
  city: string; state: string; pincode: string
}
const EMPTY_FORM: FormData = { fullName:"", phone:"", addressLine1:"", addressLine2:"", city:"", state:"", pincode:"" }

function validate(f: FormData): Record<string, string> {
  const e: Record<string, string> = {}
  if (!f.fullName.trim())     e.fullName     = "Full name is required"
  if (!f.phone.trim())        e.phone        = "Phone number is required"
  else if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter a valid 10-digit number"
  if (!f.addressLine1.trim()) e.addressLine1 = "Address line 1 is required"
  if (!f.city.trim())         e.city         = "City is required"
  if (!f.state.trim())        e.state        = "State is required"
  if (!f.pincode.trim())      e.pincode      = "Pincode is required"
  else if (!/^\d{6}$/.test(f.pincode)) e.pincode = "Enter a valid 6-digit pincode"
  return e
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const { user }                      = useAuth()
  const { cart, getTotalAmount, clearCart } = useCart()
  const [form, setForm]               = useState<FormData>(EMPTY_FORM)
  const [errors, setErrors]           = useState<Record<string, string>>({})
  const [step, setStep]               = useState<"form" | "processing" | "done">("form")
  const [statusMsg, setStatusMsg]     = useState("")

  useEffect(() => {
    if (!user) { router.push("/home"); return }
    if (!cart || cart.items.length === 0) { router.push("/cart"); return }
  }, [user, cart, router])

  const field = (name: keyof FormData, label: string, placeholder = "", icon?: React.ReactNode) => (
    <div className="space-y-1">
      <Label htmlFor={name} className="text-sm font-semibold flex items-center gap-1.5">
        {icon}{label}
      </Label>
      <Input
        id={name}
        name={name}
        value={form[name]}
        onChange={e => {
          setForm(p => ({ ...p, [e.target.name]: e.target.value }))
          if (errors[name]) setErrors(p => { const n = {...p}; delete n[name]; return n })
        }}
        placeholder={placeholder}
        className={errors[name] ? "border-destructive ring-1 ring-destructive" : ""}
        disabled={step !== "form"}
        autoComplete={name === "phone" ? "tel" : name === "pincode" ? "postal-code" : "on"}
      />
      {errors[name] && (
        <p className="text-xs font-medium text-destructive flex items-center gap-1">
          <AlertTriangle size={11} />{errors[name]}
        </p>
      )}
    </div>
  )

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      toast.error("Please fix the errors before continuing.")
      return
    }

    setStep("processing")
    setStatusMsg("Creating your secure payment session…")

    // ── Build exact payload for FlowPay ──────────────────────────────────────
    const total = getTotalAmount()
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (FP_KEY) headers["X-API-Key"] = FP_KEY

    const payload: Record<string, unknown> = {
      amount: total,                            // number, e.g. 1599
      customer_details: {
        name:  form.fullName,                   // exact shipping name — NOT user.displayName
        email: user!.email ?? "",
        phone: form.phone,                      // 10-digit
      },
      shipping_address: {
        full_name:      form.fullName,
        address_line_1: form.addressLine1,
        ...(form.addressLine2.trim() ? { address_line_2: form.addressLine2.trim() } : {}),
        city:    form.city,
        state:   form.state,
        pincode: form.pincode,
      },
      items: (cart!.items ?? []).map(i => ({
        name:     i.name,
        quantity: i.quantity,
        price:    i.price,
        image:    i.image ?? "",
      })),
    }
    if (FP_MID) payload.merchant_id = FP_MID
    if (SITE_URL) payload.return_url = `${SITE_URL}/orders`

    // Debug log — visible in Vercel function logs
    console.log("[Checkout] POST to FlowPay →", JSON.stringify(payload, null, 2))

    let flowPayOrderId: string

    try {
      const res = await fetch(`${FP_API}/api/checkout`, {
        method:  "POST",
        headers,
        body:    JSON.stringify(payload),
      })

      const json = await res.json()
      console.log("[Checkout] FlowPay response →", JSON.stringify(json))

      if (!res.ok) {
        const detail = typeof json?.detail === "string"
          ? json.detail
          : JSON.stringify(json?.detail ?? json)
        throw new Error(detail || `HTTP ${res.status} from FlowPay`)
      }

      if (!json?.order_id) throw new Error("FlowPay did not return an order_id")
      flowPayOrderId = json.order_id as string

    } catch (err) {
      console.error("[Checkout] FlowPay API error:", err)
      toast.error(err instanceof Error ? err.message : "Could not reach payment server. Please try again.")
      setStep("form")
      return
    }

    // ── FlowPay order created. Redirect immediately. ──────────────────────────
    // Cart & local order are cleared AFTER payment is confirmed (see /orders page).
    setStatusMsg("Redirecting to secure payment gateway…")
    setStep("done")

    // Store the FlowPay order ID + shipping data so /orders can sync later
    try {
      sessionStorage.setItem("pendingFlowPayOrder", JSON.stringify({
        flowPayOrderId,
        shippingAddress: form,
        amount: total,
        items: cart!.items,
      }))
    } catch { /* ignored */ }

    // Hard navigation — opens the FlowPay checkout for this exact new order
    window.location.href = `${FP_WEB}/pay/${flowPayOrderId}`
  }

  if (!user || !cart || cart.items.length === 0) return null

  const total = getTotalAmount()
  const items = cart.items

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20 dark:from-slate-900 dark:via-cyan-950/20 dark:to-slate-900">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {step === "form" && (
          <Button variant="ghost" onClick={() => router.push("/cart")} className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Button>
        )}

        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

        <AnimatePresence mode="wait">
          {step !== "form" ? (
            /* ── Processing / Done overlay ── */
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-72 text-center gap-4"
            >
              {step === "done" ? (
                <CheckCircle className="h-16 w-16 text-primary animate-pulse" />
              ) : (
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              )}
              <p className="text-xl font-semibold">{statusMsg}</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                {step === "done"
                  ? "You will be taken to FlowPay's secure gateway. Do not close this tab."
                  : "Please wait while we connect to the payment server…"}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handlePay}
            >
              <div className="grid lg:grid-cols-5 gap-8">
                {/* ── Left: Shipping form ── */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-border/60 shadow-sm p-6">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                      <MapPin size={18} className="text-primary" /> Shipping Address
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        {field("fullName", "Full Name *", "As on courier label", <User size={13} className="text-muted-foreground"/>)}
                      </div>
                      <div className="sm:col-span-2">
                        {field("phone", "Mobile Number *", "10-digit number", <Phone size={13} className="text-muted-foreground"/>)}
                      </div>
                      <div className="sm:col-span-2">
                        {field("addressLine1", "Address Line 1 *", "House No., Building, Street", <Home size={13} className="text-muted-foreground"/>)}
                      </div>
                      <div className="sm:col-span-2">
                        {field("addressLine2", "Address Line 2 (optional)", "Area, Colony, Landmark", <Building size={13} className="text-muted-foreground"/>)}
                      </div>
                      {field("city",    "City *",    "e.g. Mumbai")}
                      {field("state",   "State *",   "e.g. Maharashtra")}
                      <div className="sm:col-span-2">
                        {field("pincode", "Pincode *", "6-digit PIN code")}
                      </div>
                    </div>
                  </div>

                  {/* ── FlowPay pill ── */}
                  <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-primary/20 shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">FlowPay Secure Checkout</p>
                        <p className="text-xs text-muted-foreground">UPI · QR · Scan with any app</p>
                      </div>
                    </div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {["100% Encrypted & Secure", "Scan QR with GPay, PhonePe, Paytm, BHIM", "Order confirmed only after payment clears", "Cart cleared only after payment is verified"].map(t => (
                        <li key={t} className="flex items-center gap-2">
                          <CheckCircle size={13} className="text-green-500 flex-shrink-0" />{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Right: Order summary ── */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-border/60 shadow-sm p-6 sticky top-24">
                    <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-1.5 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium text-green-600">FREE</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
                      Pay ₹{total.toFixed(2)} via FlowPay
                    </Button>
                    <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
                      You will be redirected to FlowPay's secure gateway.<br/>
                      Your cart is cleared <strong>only after payment is confirmed</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  )
}
