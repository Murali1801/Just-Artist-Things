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

    // Check if product is out of stock
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
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section className="px-6 py-24 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Collection</h2>
          <p className="text-foreground/60 text-lg max-w-2xl">
            Discover our handpicked selection of premium products, carefully curated for quality and style.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/40 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-11 py-6 text-foreground bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-white/50 dark:border-slate-700/50 rounded-xl shadow-sm focus:shadow-md focus:border-teal-300 dark:focus:border-teal-700 transition-all"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-wrap gap-3"
        >
          {categories.map((category) => (
            <motion.div key={category} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onCategoryChange(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${selectedCategory === category
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/20 border-0"
                  : "border-slate-200 dark:border-slate-700 text-foreground bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm"
                  }`}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div
            key={selectedCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product) => {
              const isGif = product.image?.endsWith('.gif')
              const staticImage = isGif ? product.image.replace('.gif', '.png') : product.image

              return (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group rounded-2xl">
                    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 aspect-[5/4]">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleFavoriteClick(e, product.id)}
                        className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-700 shadow-md transition-all"
                      >
                        <Heart
                          size={18}
                          className={`transition-colors ${isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-400 dark:text-gray-500"}`}
                        />
                      </motion.button>
                      {isGif ? (
                        <>
                          <Image
                            src={staticImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:opacity-0 transition-opacity duration-300"
                            priority={products.indexOf(product) < 3}
                          />
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            unoptimized={true} // Keep GIFs unoptimized or handled separately
                          />
                        </>
                      ) : (
                        <Image
                          src={product.image || "/placeholder.svg?height=256&width=400&query=product"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          priority={products.indexOf(product) < 6}
                        />
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-base font-serif font-bold mb-1 text-foreground line-clamp-1">{product.name}</h3>
                      <p className="text-foreground/70 text-xs mb-3 flex-grow line-clamp-2">{product.description}</p>

                      {/* Price and Stock Info */}
                      <div className="mb-3">
                        {product.price && product.price > 0 && (
                          <p className="text-lg font-bold text-primary mb-1">₹{product.price.toFixed(2)}</p>
                        )}
                        {product.stock !== undefined && (
                          <StockStatus stock={product.stock} variant="detailed" className="mb-1" />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs h-9 rounded-lg shadow-sm hover:shadow-md transition-all"
                            disabled={product.stock !== undefined && product.stock <= 0}
                          >
                            <ShoppingCart size={14} className="mr-1" />
                            {product.stock !== undefined && product.stock <= 0 ? 'Out' : 'Add'}
                          </Button>
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            onClick={() => onProductSelect(product)}
                            variant="outline"
                            className="w-full text-xs h-9 rounded-lg border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700 transition-all"
                          >
                            Details
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="flex flex-col items-center gap-5">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 flex items-center justify-center shadow-lg shadow-teal-500/10"
              >
                <Package className="w-12 h-12 text-teal-500" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground">No products found</h3>
              <p className="text-foreground/60 text-base max-w-md">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : `No products in ${selectedCategory} category yet.`
                }
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => {
                      onSearchChange("")
                      onCategoryChange("All")
                    }}
                    className="mt-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl px-6 shadow-md"
                  >
                    Show All Products
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
