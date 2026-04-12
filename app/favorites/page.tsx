"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import { productService, Product } from "@/lib/firebase/productService"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Instagram, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const WHATSAPP_NUMBER = "919370015472"
const INSTAGRAM_URL = "https://www.instagram.com/just__artist.things?igsh=MTVoa3FiM2I0YXBhZQ=="

export default function FavoritesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { favorites, removeFromFavorites } = useFavorites()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/home')
      return
    }
    loadFavoriteProducts()
  }, [user, favorites])

  const loadFavoriteProducts = async () => {
    try {
      const allProducts = await productService.getAllProducts()
      const favoriteProducts = allProducts.filter(p => favorites.includes(p.id))
      setProducts(favoriteProducts)
    } catch (error) {
      console.error('Error loading favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppInquiry = () => {
    const productNames = products.map(p => p.name).join(', ')
    const message = encodeURIComponent(`Hi! I'm interested in these products from my favorites:\\n\\n${productNames}\\n\\nCould you provide more details?`)
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`, '_blank')
  }

  const handleInstagramInquiry = () => {
    window.open(INSTAGRAM_URL, '_blank')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/home')}
          className="mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-serif font-bold mb-2">My Favorites ❤️</h1>
          <p className="text-foreground/60">
            {products.length} {products.length === 1 ? 'product' : 'products'} saved
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Heart size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-foreground/60 mb-6">Start adding products to your favorites!</p>
            <Button onClick={() => router.push('/home')}>Browse Products</Button>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Card className="overflow-hidden bg-card border-0 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="relative overflow-hidden bg-white aspect-[5/4]">
                      <button
                        onClick={() => removeFromFavorites(product.id)}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white shadow-md"
                      >
                        <Heart size={20} className="fill-red-500 text-red-500" />
                      </button>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-serif font-bold mb-2">{product.name}</h3>
                      <p className="text-foreground/70 text-sm flex-grow">{product.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-lg p-6 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Inquire About Your Favorites</h3>
              <p className="text-foreground/60 mb-6">
                Contact us to get more details about these products
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BA5A] text-white"
                >
                  <MessageCircle className="mr-2" size={20} />
                  Inquire on WhatsApp
                </Button>
                <Button
                  onClick={handleInstagramInquiry}
                  className="flex-1 bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white"
                >
                  <Instagram className="mr-2" size={20} />
                  Inquire on Instagram
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
