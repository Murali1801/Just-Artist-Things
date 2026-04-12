"use client"

import { useEffect, Suspense } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShieldAlert, LogIn, Loader2, Home } from "lucide-react"
import Link from "next/link"

function AdminLoginContent() {
  const { user, signInWithGoogle, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const isAdmin = user?.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()).includes(user.email)

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/admin')
    }
  }, [user, isAdmin, loading, router])

  return (
    <div className="glass-card max-w-md w-full mx-auto p-12 rounded-[3rem] relative overflow-hidden text-center z-10 border-white/10 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 blur-[80px] -z-10" />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6"
      >
        <ShieldAlert className="w-10 h-10 text-primary" />
      </motion.div>

      <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Admin Access</h1>
      <p className="text-muted-foreground text-sm mb-8">Authenticate with an authorized account to access the control panel.</p>
      
      {error === 'unauthorized' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm font-medium mb-8"
        >
          Your account does not have admin privileges.
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          <Button 
            onClick={signInWithGoogle} 
            className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-xs uppercase tracking-widest shadow-xl group transition-all"
          >
            <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Sign in with Google
          </Button>
          <Link href="/home" className="block w-full">
            <Button variant="ghost" className="w-full h-14 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <Home className="w-4 h-4 mr-2" />
              Return to Store
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      }>
        <AdminLoginContent />
      </Suspense>
    </div>
  )
}
