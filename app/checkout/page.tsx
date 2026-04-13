"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, CheckCircle, Loader2, ShieldCheck,
  MapPin, Phone, User, Home, Building2, AlertTriangle, Zap
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

// ─── Types ────────────────────────────────────────────────────────────────────
type Form = {
  fullName: string; phone: string
  addressLine1: string; addressLine2: string
  city: string; state: string; pincode: string
}
const EMPTY: Form = { fullName:"", phone:"", addressLine1:"", addressLine2:"", city:"", state:"", pincode:"" }

function validate(f: Form): Record<string, string> {
  const e: Record<string, string> = {}
  if (!f.fullName.trim())     e.fullName     = "Full name is required"
  if (!f.phone.trim())        e.phone        = "Phone is required"
  else if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter a valid 10-digit number"
  if (!f.addressLine1.trim()) e.addressLine1 = "Address line 1 is required"
  if (!f.city.trim())         e.city         = "City is required"
  if (!f.state.trim())        e.state        = "State is required"
  if (!f.pincode.trim())      e.pincode      = "Pincode is required"
  else if (!/^\d{6}$/.test(f.pincode)) e.pincode = "Enter a valid 6-digit pincode"
  return e
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const { user }                         = useAuth()
  const { cart, getTotalAmount, clearCart } = useCart()
  const [form, setForm]                  = useState<Form>(EMPTY)
  const [errors, setErrors]              = useState<Record<string, string>>({})
  const [processing, setProcessing]      = useState(false)
  const [statusText, setStatusText]      = useState("")

  useEffect(() => {
    if (!user) router.push("/home")
    else if (!cart || cart.items.length === 0) router.push("/cart")
  }, [user, cart, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => { const n = {...p}; delete n[name]; return n })
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) {
      setErrors(errs)
      toast.error("Please fix the highlighted fields.")
      return
    }
    if (!cart || cart.items.length === 0) { toast.error("Your cart is empty."); return }

    setProcessing(true)
    setStatusText("Creating your payment session…")

    try {
      // ── Call our local server-side proxy (no CORS, secure) ────────────────
      const res = await fetch("/api/initiate-payment", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:       getTotalAmount(),
          fullName:     form.fullName,
          phone:        form.phone,
          email:        user!.email ?? "",
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city:         form.city,
          state:        form.state,
          pincode:      form.pincode,
          items:        cart.items.map(i => ({
            name:     i.name,
            quantity: i.quantity,
            price:    i.price,
            image:    i.image || "",
          })),
        }),
      })

      const json = await res.json()

      if (!res.ok || !json.checkout_url) {
        throw new Error(json.error || `Payment session failed (HTTP ${res.status})`)
      }

      // ── Save order info for /orders sync (non-blocking, fire & forget) ────
      try {
        sessionStorage.setItem("pendingPayment", JSON.stringify({
          flowPayOrderId: json.order_id,
          amount:  getTotalAmount(),
          items:   cart.items,
          address: form,
        }))
      } catch { /* ignored */ }

      // ── Cart cleared only after payment confirmed (in /orders page) ───────
      // DO NOT clearCart() here.

      setStatusText(`Redirecting to secure checkout…`)

      // Small visual delay so user sees the status message
      await new Promise(r => setTimeout(r, 400))

      // ── REDIRECT ─────────────────────────────────────────────────────────
      console.log("[Checkout] Redirecting to:", json.checkout_url)
      window.location.href = json.checkout_url

    } catch (err) {
      console.error("[Checkout] Error:", err)
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setProcessing(false)
      setStatusText("")
    }
  }

  if (!user || !cart || cart.items.length === 0) return null
  const total = getTotalAmount()

  const Field = ({ name, label, placeholder, icon }: {
    name: keyof Form; label: string; placeholder?: string; icon?: React.ReactNode
  }) => (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-semibold flex items-center gap-1.5 text-foreground/80">
        {icon} {label}
      </Label>
      <Input
        id={name} name={name} value={form[name]}
        onChange={handleChange} placeholder={placeholder}
        disabled={processing}
        className={`h-11 transition-all ${errors[name]
          ? "border-red-400 ring-1 ring-red-300 focus:ring-red-400"
          : "focus:border-teal-500 focus:ring-teal-200"}`}
      />
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-xs font-medium text-red-500 flex items-center gap-1"
          >
            <AlertTriangle size={11} /> {errors[name]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-cyan-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {!processing && (
          <Button variant="ghost" onClick={() => router.push("/cart")} className="mb-6 -ml-2 text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Button>
        )}

        <h1 className="text-3xl font-serif font-bold mb-8 text-foreground">Secure Checkout</h1>

        <AnimatePresence mode="wait">
          {processing ? (
            /* ── Processing overlay ── */
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-8 py-32"
            >
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <ShieldCheck size={14} className="text-white" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground mb-2">{statusText}</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  You&apos;ll be redirected to FlowPay&apos;s secure payment gateway. Do not close this tab.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
                <Zap size={12} /> Your cart will only be cleared after payment is confirmed.
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handlePay}
            >
              <div className="grid lg:grid-cols-5 gap-8">

                {/* ── Left: Shipping form ── */}
                <div className="lg:col-span-3 space-y-5">

                  {/* Shipping card */}
                  <div className="bg-white dark:bg-slate-800/70 rounded-2xl border border-border/50 shadow-sm p-6">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-foreground">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
                        <MapPin size={14} className="text-teal-600" />
                      </div>
                      Shipping Address
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-4">
                      <div className="sm:col-span-2">
                        <Field name="fullName"     label="Full Name *"         placeholder="As on courier label"         icon={<User size={12} className="text-muted-foreground"/>} />
                      </div>
                      <div className="sm:col-span-2">
                        <Field name="phone"        label="Mobile Number *"     placeholder="10-digit number"             icon={<Phone size={12} className="text-muted-foreground"/>} />
                      </div>
                      <div className="sm:col-span-2">
                        <Field name="addressLine1" label="Address Line 1 *"    placeholder="House No., Building, Street" icon={<Home size={12} className="text-muted-foreground"/>} />
                      </div>
                      <div className="sm:col-span-2">
                        <Field name="addressLine2" label="Address Line 2"      placeholder="Area, Colony, Landmark"      icon={<Building2 size={12} className="text-muted-foreground"/>} />
                      </div>
                      <div>
                        <Field name="city"     label="City *"    placeholder="Mumbai" />
                      </div>
                      <div>
                        <Field name="state"    label="State *"   placeholder="Maharashtra" />
                      </div>
                      <div className="sm:col-span-2">
                        <Field name="pincode"  label="Pincode *" placeholder="6-digit PIN" />
                      </div>
                    </div>
                  </div>

                  {/* Security assurance */}
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/40 dark:to-cyan-950/40 rounded-2xl border border-teal-200/60 dark:border-teal-800/40 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck size={16} className="text-teal-600" />
                      <p className="font-bold text-teal-900 dark:text-teal-100 text-sm">FlowPay Secure Checkout</p>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "100% Encrypted & Secure payment gateway",
                        "Pay via UPI QR — GPay, PhonePe, Paytm, BHIM",
                        "Order confirmed only after payment is verified",
                        "Cart is cleared only after payment succeeds",
                      ].map(t => (
                        <li key={t} className="flex items-center gap-2 text-xs text-teal-800 dark:text-teal-300 font-medium">
                          <CheckCircle size={12} className="text-teal-500 flex-shrink-0" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── Right: Order summary + pay button ── */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-slate-800/70 rounded-2xl border border-border/50 shadow-sm p-6 sticky top-24">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      Order Summary
                    </h2>

                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {cart.items.map(item => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            <p className="text-sm font-bold text-teal-700">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-3" />
                    <div className="space-y-1.5 text-sm mb-5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">₹{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-semibold text-green-600">FREE</span>
                      </div>
                      <Separator className="my-1.5" />
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-13 text-base font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-lg shadow-teal-500/25 border-0"
                      disabled={processing}
                    >
                      {processing ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                      ) : (
                        <><ShieldCheck className="mr-2 h-4 w-4" /> Pay ₹{total.toFixed(2)} via FlowPay</>
                      )}
                    </Button>

                    <p className="text-[11px] text-muted-foreground text-center mt-3 leading-relaxed">
                      You will be redirected to FlowPay&apos;s secure gateway.<br />
                      <strong>Cart clears only after payment is confirmed.</strong>
                    </p>
                  </div>
                </div>

              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {!processing && <Footer />}
    </div>
  )
}
