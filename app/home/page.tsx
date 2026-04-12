"use client"

import { useState, useMemo, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import ProductCarousel from "@/components/product-carousel"
import ProductGrid from "@/components/product-grid"
import ProductDetail from "@/components/product-detail"
import Footer from "@/components/footer"
import { productService, Product } from "@/lib/firebase/productService"

const CATEGORIES = ["All", "Frames", "Decor", "Accessories", "Special Occasion", "Little Treasures"]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts()
        const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0))
        setProducts(sortedData)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filter categories to hide "Little Treasures" if no products
  const availableCategories = useMemo(() => {
    const hasLittleTreasures = products.some(p => p.category === "Little Treasures")
    return hasLittleTreasures ? CATEGORIES : CATEGORIES.filter(c => c !== "Little Treasures")
  }, [products])

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesSearch =
        (product.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    return filtered
  }, [products, selectedCategory, searchQuery])



  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
      <Header />
      <Hero />
      <ProductCarousel products={products} />
      <ProductGrid
        products={filteredProducts}
        categories={availableCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProductSelect={setSelectedProduct}
        isLoading={isLoading}
      />
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          allProducts={products}
          onProductSelect={setSelectedProduct}
        />
      )}
      <Footer />
    </div>
  )
}