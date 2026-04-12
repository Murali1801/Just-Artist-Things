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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 md:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Just Artist Things" className="h-8 w-8" />
          <span className="text-2xl font-serif font-bold tracking-tight text-foreground">Just Artist Things</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-sm font-medium text-foreground hover:text-foreground/60 transition-colors cursor-pointer"
            >
              {item.name}
            </a>
          ))}
          {user && (
            <>
              <button
                onClick={() => router.push('/favorites')}
                className="text-sm font-medium text-foreground hover:text-foreground/60 transition-colors cursor-pointer relative"
              >
                Favourites
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => router.push('/orders')}
                className="text-sm font-medium text-foreground hover:text-foreground/60 transition-colors cursor-pointer"
              >
                Orders
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => router.push('/admin')}
              className="text-sm font-medium text-foreground hover:text-foreground/60 transition-colors cursor-pointer bg-teal-100 dark:bg-teal-900/30 px-3 py-1 rounded-md text-teal-700 dark:text-teal-300"
            >
              Admin
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push('/cart')}
              className="relative"
            >
              <ShoppingCart size={20} />
              {getItemCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {getItemCount()}
                </Badge>
              )}
            </Button>
          )}

          {user ? (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback><User size={16} /></AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">{user.displayName}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="hidden md:flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={signInWithGoogle}
              className="hidden md:flex items-center gap-2"
            >
              <LogIn size={16} />
              Sign in with Google
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-foreground"
          >
            {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
          </Button>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-card border-t border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {item.name}
              </a>
            ))}
            {user && (
              <button
                onClick={() => router.push('/favorites')}
                className="text-sm font-medium text-foreground cursor-pointer text-left"
              >
                Favourites
              </button>
            )}
            {user && (
              <button
                onClick={() => router.push('/orders')}
                className="text-sm font-medium text-foreground cursor-pointer text-left"
              >
                Orders
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="text-sm font-medium text-foreground cursor-pointer text-left"
              >
                Admin
              </button>
            )}
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2 border-t border-border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback><User size={16} /></AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">{user.displayName}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="w-full"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={signInWithGoogle}
                className="w-full"
              >
                <LogIn size={16} className="mr-2" />
                Sign in with Google
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
