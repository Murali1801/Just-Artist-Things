"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Smartphone, CheckCircle, Loader2, QrCode, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { orderService } from "@/lib/firebase/orderService"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "sonner"

export default function PaymentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { clearCart } = useCart()

  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [processing, setProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/home')
      return
    }

    const data = sessionStorage.getItem('checkoutData')
    if (!data) {
      router.push('/cart')
      return
    }

    setCheckoutData(JSON.parse(data))
  }, [user, router])



  const handleUPIPayment = async () => {
    setProcessing(true)

    try {
      // 1. Create a payment session in FlowPay
      const flowPayApiUrl = process.env.NEXT_PUBLIC_FLOWPAY_API_URL || 'https://flow-pay-api.vercel.app'
      
      const apiKey = process.env.NEXT_PUBLIC_FLOWPAY_API_KEY || ''
      const merchantId = process.env.NEXT_PUBLIC_FLOWPAY_MERCHANT_ID || undefined
      
      const response = await fetch(`${flowPayApiUrl}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { 'X-API-Key': apiKey } : {})
        },
        body: JSON.stringify({
          amount: checkoutData.totalAmount,
          ...(merchantId ? { merchant_id: merchantId } : {})
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create secure FlowPay payment session')
      }

      const { order_id: flowPayOrderId } = await response.json()

      // 2. Create the local order in Firebase for tracking
      const newOrderId = await orderService.createOrder({
        userId: user!.uid,
        userEmail: user!.email || '',
        userName: user!.displayName || 'Guest',
        items: checkoutData.items,
        totalAmount: checkoutData.totalAmount,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: 'FlowPay (UPI)',
        paymentStatus: 'Pending (FlowPay)',
        orderStatus: 'Payment Verification',
        externalOrderId: flowPayOrderId // Store FlowPay ID for reference
      })

      setOrderId(newOrderId)
      await clearCart()
      sessionStorage.removeItem('checkoutData')
      
      // 3. Redirect to FlowPay Checkout
      const flowPayWebUrl = process.env.NEXT_PUBLIC_FLOWPAY_FRONTEND_URL || 'https://flow-pay-self.vercel.app'
      window.location.href = `${flowPayWebUrl}/pay/${flowPayOrderId}`
      
    } catch (error) {
      console.error('Error initiating FlowPay payment:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment'
      toast.error(errorMessage)
      setProcessing(false)
    }
  }


  if (!user || !checkoutData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {!showSuccess && !showQR && (
          <Button
            variant="ghost"
            onClick={() => router.push('/checkout')}
            className="mb-6"
            disabled={processing}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Checkout
          </Button>
        )}

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
                </motion.div>
                
                <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
                <p className="text-muted-foreground mb-6">
                  Your order is placed. Payment verification is pending.
                </p>
                
                <div className="bg-accent p-4 rounded-lg mb-6 inline-block">
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="text-2xl font-bold font-mono">{orderId}</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/orders')} size="lg">
                    View Orders
                  </Button>
                  <Button onClick={() => router.push('/home')} variant="outline" size="lg">
                    Continue Shopping
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-serif font-bold mb-8">Secure Payment</h1>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* FlowPay Payment Only */}
                <Card className="p-6 border-primary/50 shadow-md">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">FlowPay Checkout</h3>
                      <p className="text-sm text-muted-foreground">UPI, Cards, NetBanking</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      100% Encrypted & Secure
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Scan QR with any UPI app
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Instant order verification
                    </li>
                  </ul>

                  <Button 
                    onClick={handleUPIPayment} 
                    className="w-full" 
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Connecting to FlowPay...
                      </>
                    ) : (
                      <>
                        <Smartphone className="mr-2 h-5 w-5" />
                        Pay ₹{checkoutData.totalAmount.toFixed(2)} Securely
                      </>
                    )}
                  </Button>
                </Card>
              </div>

              {/* Order Summary */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {checkoutData.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{checkoutData.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{checkoutData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-sm">
                  <p className="font-medium mb-2">Shipping Address:</p>
                  <p className="text-muted-foreground">
                    {checkoutData.shippingAddress.fullName}<br />
                    {checkoutData.shippingAddress.addressLine1}<br />
                    {checkoutData.shippingAddress.addressLine2 && <>{checkoutData.shippingAddress.addressLine2}<br /></>}
                    {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state} - {checkoutData.shippingAddress.pincode}<br />
                    Phone: {checkoutData.shippingAddress.phone}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}
