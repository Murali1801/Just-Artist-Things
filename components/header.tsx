"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, Moon, Sun, LogIn, LogOut, User, Heart, ShoppingCart, Package } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useCart } from "@/contexts/CartContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user, signInWithGoogle, signOut } = useAuth()
  const { favorites } = useFavorites()
  const { getItemCount } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#home" }
  ]

  const userMenuItems = user ? [
    { name: "My Orders", action: () => router.push('/orders'), icon: Package },
    { name: "Favorites", action: () => router.push('/favorites'), icon: Heart },
    { name: "Cart", action: () => router.push('/cart'), icon: ShoppingCart },
  ] : []

  const isAdmin = user?.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()).includes(user.email)

  // Debug logging
  useEffect(() => {
    if (user?.email) {
      console.log('Current user email:', user.email)
      console.log('Admin emails:', process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      console.log('Is admin:', isAdmin)
    }
  }, [user, isAdmin])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    // If not on landing page, navigate to landing page first
    if (window.location.pathname !== '/landing') {
      router.push('/landing')
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    } else {
      // Already on landing page, just scroll
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    setMobileMenuOpen(false)
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-3" : "py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <nav className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
          isScrolled ? "glass shadow-2xl shadow-primary/5 border-primary/10" : "bg-transparent border-transparent"
        }`}>
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group">
              <img src="/logo.png" alt="Logo" className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-bold tracking-tight text-foreground leading-none">Just Artist Things</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-sans">Curated Craftsmanship</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            {user && (
              <>
                <button
                  onClick={() => router.push('/favorites')}
                  className="text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary transition-all relative group"
                >
                  Favourites
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-3 h-4 w-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {favorites.length}
                    </span>
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
                <button
                  onClick={() => router.push('/orders')}
                  className="text-xs uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary transition-all relative group shadow-sm"
                >
                  Track Orders
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              </>
            )}
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="text-xs uppercase tracking-widest font-bold px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all"
              >
                Studio Panel
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-xl"
            >
              {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            </Button>

            <div className="h-6 w-[1px] bg-border mx-1 hidden md:block" />

            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/cart')}
                className="relative text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl"
              >
                <ShoppingCart size={18} />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center font-bold border-2 border-background">
                    {getItemCount()}
                  </span>
                )}
              </Button>
            )}

            {user ? (
              <div className="flex items-center gap-2 pl-2">
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback><User size={14} /></AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="hidden md:flex text-xs font-bold hover:text-destructive hover:bg-destructive/5"
                >
                  <LogOut size={14} className="mr-2" />
                  Exit
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={signInWithGoogle}
                className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 shadow-xl shadow-primary/20"
              >
                <LogIn size={14} />
                Sign In
              </Button>
            )}

            <button className="md:hidden ml-2 text-foreground p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-x-6 top-24 z-50 overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="glass-card shadow-2xl p-8 rounded-3xl">
              <div className="flex flex-col gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-lg font-bold text-foreground"
                  >
                    {item.name}
                  </a>
                ))}
                {user && (
                  <>
                    <button onClick={() => {router.push('/favorites'); setMobileMenuOpen(false)}} className="text-lg font-bold text-foreground text-left">Favourites</button>
                    <button onClick={() => {router.push('/orders'); setMobileMenuOpen(false)}} className="text-lg font-bold text-foreground text-left">Orders</button>
                  </>
                )}
                {isAdmin && (
                  <button onClick={() => {router.push('/admin'); setMobileMenuOpen(false)}} className="text-lg font-bold text-primary text-left">Studio Panel</button>
                )}
                
                <div className="h-px bg-border my-2" />
                
                {user ? (
                  <Button variant="outline" className="w-full justify-start rounded-xl py-6" onClick={signOut}>
                    <LogOut size={18} className="mr-3 text-destructive" />
                    Sign Out
                  </Button>
                ) : (
                  <Button className="w-full justify-start rounded-xl py-6" onClick={signInWithGoogle}>
                    <LogIn size={18} className="mr-3" />
                    Sign In with Google
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>

  )
}
