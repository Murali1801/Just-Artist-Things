"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Package, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { ProductCardSkeleton } from "@/components/loading-skeleton"
import { StockStatus } from "@/components/stock-status"
import { useFavorites } from "@/contexts/FavoritesContext"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"

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

interface ProductGridProps {
  products: Product[]
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onProductSelect: (product: Product) => void
  isLoading?: boolean
}

export default function ProductGrid({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onProductSelect,
  isLoading = false,
}: ProductGridProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const { user } = useAuth()
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
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

  const handleFavoriteClick = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation()
    if (!user) {
      alert('Please sign in to add favorites')
      return
    }
    if (isFavorite(productId)) {
      await removeFromFavorites(productId)
    } else {
      await addToFavorites(productId)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section id="collection-grid" className="px-6 py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 block">Storefront</span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">Our Collection</h2>
            <p className="text-muted-foreground text-lg font-sans">
              A careful curation of limited-run artistic pieces, each bearing the mark of its creator.
            </p>
          </motion.div>

          {/* Search Bar - Integrated */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative w-full md:w-80 group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-hover:text-primary" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 py-7 bg-muted/30 border-border rounded-2xl focus:ring-1 focus:ring-primary/20 transition-all text-xs uppercase tracking-widest font-bold"
            />
          </motion.div>
        </div>

        {/* Filters - Glass Pills */}
        <div className="flex flex-wrap gap-3 mb-16 px-1">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(category)}
              className={`px-8 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30"
                  : "glass hover:bg-muted text-muted-foreground"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Collection Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group cursor-pointer"
                onClick={() => onProductSelect(product)}
              >
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-8 shadow-sm group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all duration-700 bg-muted">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Actions Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleFavoriteClick(e, product.id)}
                    className="absolute top-6 right-6 p-4 rounded-2xl glass shadow-xl z-20 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500"
                  >
                    <Heart
                      size={18}
                      className={isFavorite(product.id) ? "fill-primary text-primary" : "text-foreground"}
                    />
                  </motion.button>

                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    <Button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-white text-black hover:bg-white/90 rounded-2xl py-7 font-bold text-xs uppercase tracking-widest shadow-2xl"
                      disabled={product.stock !== undefined && product.stock <= 0}
                    >
                      <ShoppingCart size={16} className="mr-3" />
                      {product.stock !== undefined && product.stock <= 0 ? 'Out of Stock' : 'Add to Collection'}
                    </Button>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">
                        {product.category}
                      </span>
                      <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    {product.price && (
                      <span className="text-xl font-bold text-foreground">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  
                  {product.stock !== undefined && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <StockStatus stock={product.stock} variant="detailed" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="py-40 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-6 opacity-20" />
            <h3 className="text-2xl font-serif font-bold">The archives are empty.</h3>
            <p className="text-muted-foreground mt-2">Adjust your search parameters to explore other works.</p>
          </div>
        )}
      </div>
    </section>
  )
}
