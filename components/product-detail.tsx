"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Instagram, X, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext"
import { StockStatus } from "@/components/stock-status"

const WHATSAPP_NUMBER = "919370015472"
const INSTAGRAM_URL = "https://www.instagram.com/just__artist.things?igsh=MTVoa3FiM2I0YXBhZQ=="

interface Product {
  id: string
  name: string
  category: string
  image: string
  description: string
  price?: number
  stock?: number
  soldCount?: number
}

interface ProductDetailProps {
  product: Product | null
  onClose: () => void
  allProducts: Product[]
  onProductSelect: (product: Product) => void
}

export default function ProductDetail({ product, onClose, allProducts, onProductSelect }: ProductDetailProps) {
  const { addToCart } = useCart()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const { user } = useAuth()

  if (!product) return null

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please sign in to add items to cart')
      return
    }

    if (product.stock !== undefined && product.stock <= 0) {
      alert('This item is out of stock')
      return
    }

    await addToCart(
      product.id,
      product.name,
      product.image,
      product.price || 0,
      product.category
    )
  }

  const handleFavoriteToggle = async () => {
    if (!user) {
      alert('Please sign in to add favorites')
      return
    }
    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id)
    } else {
      await addToFavorites(product.id)
    }
  }

  const relatedProducts = allProducts
    ?.filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3) || []

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(`Hi! I'm interested in the signature piece: ${product.name}\n\nCould you provide more details regarding its availability?`)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="glass shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] max-w-7xl w-full h-[95vh] md:h-[85vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row relative border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close - Absolute */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-2xl glass hover:bg-white/20 transition-all z-50 group border-white/10"
          >
            <X className="h-6 w-6 text-foreground/70 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Left: Visual Focus */}
          <div className="md:w-3/5 h-[40vh] md:h-full relative bg-[#020617] group overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-12 left-12">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-2 block">
                Artistic Detail
              </span>
              <h3 className="text-white text-3xl font-serif font-bold italic opacity-80">
                Crafted with intention.
              </h3>
            </div>
          </div>

          {/* Right: Curatory Information */}
          <div className="md:w-2/5 h-full flex flex-col p-10 md:p-16 overflow-y-auto custom-scrollbar">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary glass px-4 py-1.5 rounded-full border-primary/20">
                  {product.category}
                </span>
                {product.stock !== undefined && (
                  <div className="scale-90 origin-left">
                    <StockStatus stock={product.stock} variant="detailed" />
                  </div>
                )}
              </div>
              
              <h2 className="text-5xl font-serif font-bold text-foreground mb-8 leading-[1.1]">
                {product.name}
              </h2>
              
              <p className="text-muted-foreground text-lg leading-relaxed font-sans mb-10">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4 mb-12">
                {product.price && (
                  <span className="text-4xl font-bold text-foreground">
                    ₹{product.price.toFixed(2)}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Inc. GST & Shipping</span>
              </div>

              {/* Interaction Block */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock !== undefined && product.stock <= 0}
                    className="flex-[4] h-16 rounded-2xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <ShoppingCart className="mr-3 h-4 w-4" />
                    {product.stock !== undefined && product.stock <= 0 ? 'Exhausted' : 'Acquire Piece'}
                  </Button>
                  <Button
                    onClick={handleFavoriteToggle}
                    className={`flex-1 h-16 rounded-2xl glass border-primary/10 hover:bg-primary/5 transition-all ${
                      isFavorite(product.id) ? 'text-primary' : 'text-foreground/50'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${isFavorite(product.id) ? 'fill-primary' : ''}`} />
                  </Button>
                </div>

                <Button
                  onClick={handleWhatsAppInquiry}
                  variant="outline"
                  className="w-full h-16 rounded-2xl border-border/50 hover:bg-muted font-bold text-[10px] uppercase tracking-[0.25em]"
                >
                  <MessageCircle className="mr-3 h-4 w-4" />
                  Request Bespoke Customization
                </Button>
              </div>
            </div>

            {/* Related/Complementary */}
            {relatedProducts.length > 0 && (
              <div className="mt-auto pt-10 border-t border-border/30">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground mb-6">Complementary Works</h4>
                <div className="grid grid-cols-3 gap-4">
                  {relatedProducts.map((related) => (
                    <motion.div
                      key={related.id}
                      whileHover={{ y: -5 }}
                      className="group cursor-pointer"
                      onClick={() => onProductSelect(related)}
                    >
                      <div className="aspect-square relative rounded-2xl overflow-hidden mb-2 bg-muted border border-border/50">
                        <Image
                          src={related.image}
                          alt={related.name}
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-wider truncate text-muted-foreground group-hover:text-primary transition-colors">
                        {related.name}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
