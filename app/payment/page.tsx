"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Loader2, QrCode } from "lucide-react"
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

  const handleSimulatedPayment = async () => {
    setProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500))

    try {
      const newOrderId = await orderService.createOrder({
        userId: user!.uid,
        userEmail: user!.email || '',
        userName: user!.displayName || 'Guest',
        items: checkoutData.items,
        totalAmount: checkoutData.totalAmount,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: 'Simulated Online Payment',
        paymentStatus: 'Paid (Simulated)',
        orderStatus: 'Processing'
      })

      setOrderId(newOrderId)
      await clearCart()
      sessionStorage.removeItem('checkoutData')
      setShowSuccess(true)
      toast.success('Payment successful!')
    } catch (error) {
      console.error('Error creating order:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
      if (errorMessage.includes('Insufficient stock')) {
        toast.error('Some items are out of stock. Please update your cart.')
        router.push('/cart')
      } else {
        toast.error(errorMessage)
      }
      setProcessing(false)
    }
  }

  const handleUPIPayment = () => {
    setShowQR(true)
  }

  const handleUPIConfirmation = async () => {
    setProcessing(true)

    try {
      const newOrderId = await orderService.createOrder({
        userId: user!.uid,
        userEmail: user!.email || '',
        userName: user!.displayName || 'Guest',
        items: checkoutData.items,
        totalAmount: checkoutData.totalAmount,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: 'UPI QR Payment',
        paymentStatus: 'Manual Verification Pending',
        orderStatus: 'Payment Verification'
      })

      setOrderId(newOrderId)
      await clearCart()
      sessionStorage.removeItem('checkoutData')
      setShowSuccess(true)
      toast.success('Order placed! Payment verification pending')
    } catch (error) {
      console.error('Error creating order:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
      if (errorMessage.includes('Insufficient stock')) {
        toast.error('Some items are out of stock. Please update your cart.')
        router.push('/cart')
      } else {
        toast.error(errorMessage)
      }
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
                  {checkoutData.paymentMethod === 'simulated' 
                    ? 'Your payment has been processed successfully.'
                    : 'Your order is placed. Payment verification is pending.'}
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
          ) : showQR ? (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-serif font-bold mb-8">UPI Payment</h1>
              
              <Card className="p-8">
                <div className="text-center mb-6">
                  <QrCode className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-2">Scan QR Code to Pay</h2>
                  <p className="text-muted-foreground">Use any UPI app to complete payment</p>
                </div>

                <div className="bg-white p-8 rounded-lg border-2 border-dashed max-w-sm mx-auto mb-6">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="w-32 h-32 mx-auto mb-4 text-gray-400" />
                      <p className="text-sm text-gray-500">QR Code Placeholder</p>
                      <p className="text-xs text-gray-400 mt-2">In production, display actual UPI QR</p>
                    </div>
                  </div>
                </div>

                <div className="bg-accent p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Amount to Pay</span>
                    <span className="font-bold text-xl">₹{checkoutData.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    After completing the payment, click the button below
                  </p>
                  
                  <Button 
                    onClick={handleUPIConfirmation} 
                    size="lg" 
                    className="w-full"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'I have completed the payment'
                    )}
                  </Button>

                  <Button 
                    onClick={() => setShowQR(false)} 
                    variant="outline" 
                    className="w-full"
                    disabled={processing}
                  >
                    Back
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
              <h1 className="text-4xl font-serif font-bold mb-8">Payment</h1>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Simulated Payment */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Simulated Payment</h3>
                      <p className="text-sm text-muted-foreground">Instant payment demo</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Instant order confirmation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      No real money involved
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Perfect for demo/testing
                    </li>
                  </ul>

                  <Button 
                    onClick={handleSimulatedPayment} 
                    className="w-full" 
                    size="lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pay ₹{checkoutData.totalAmount.toFixed(2)}
                      </>
                    )}
                  </Button>
                </Card>

                {/* UPI Payment */}
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">UPI QR Payment</h3>
                      <p className="text-sm text-muted-foreground">Scan & pay manually</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Scan QR with any UPI app
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Manual verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Secure payment
                    </li>
                  </ul>

                  <Button 
                    onClick={handleUPIPayment} 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    disabled={processing}
                  >
                    <QrCode className="mr-2 h-5 w-5" />
                    Pay via UPI
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
