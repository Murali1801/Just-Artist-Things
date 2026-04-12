"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { productService, Product } from "@/lib/firebase/productService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, ArrowLeft, Star, BarChart3, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import AnalyticsDashboard from "@/components/analytics-dashboard-new"

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: '',
    description: '',
    price: 0,
    stock: 10,
    featured: false,
  })

  const isAdmin = user?.email && process.env.NEXT_PUBLIC_ADMIN_EMAIL?.split(',').map(e => e.trim()).includes(user.email)

  useEffect(() => {
    if (!user) {
      router.push('/home')
      return
    }
    if (!isAdmin) {
      alert('Access denied. Admin only.')
      router.push('/home')
      return
    }
    loadProducts()
  }, [user, isAdmin])

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts()
      const sortedData = data.sort((a, b) => (a.order || 0) - (b.order || 0))
      setProducts(sortedData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData)
      } else {
        await productService.addProduct(formData)
      }
      setFormData({ name: '', category: '', image: '', description: '', featured: false })
      setShowForm(false)
      setEditingProduct(null)
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image,
      description: product.description,
      price: product.price || 0,
      stock: product.stock || 10,
      featured: product.featured || false,
    })
    setShowForm(true)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await productService.deleteProduct(id)
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const toggleFeatured = async (product: Product) => {
    try {
      await productService.updateProduct(product.id, { featured: !product.featured })
      loadProducts()
    } catch (error) {
      console.error('Error updating featured status:', error)
      alert('Error updating featured status')
    }
  }

  const handleDragStart = (product: Product) => {
    setDraggedProduct(product)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetProduct: Product) => {
    if (!draggedProduct || draggedProduct.id === targetProduct.id) return

    const draggedIndex = products.findIndex(p => p.id === draggedProduct.id)
    const targetIndex = products.findIndex(p => p.id === targetProduct.id)

    const newProducts = [...products]
    newProducts.splice(draggedIndex, 1)
    newProducts.splice(targetIndex, 0, draggedProduct)

    setProducts(newProducts)

    try {
      for (let i = 0; i < newProducts.length; i++) {
        await productService.updateProduct(newProducts[i].id, { order: i })
      }
    } catch (error) {
      console.error('Error updating order:', error)
      loadProducts()
    }

    setDraggedProduct(null)
  }

  if (!user || !isAdmin) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <Button variant="ghost" onClick={() => router.push('/home')} className="mb-3 sm:mb-4 -ml-2 sm:ml-0">
              <ArrowLeft size={20} className="mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold">Admin Panel</h1>
            <p className="text-sm sm:text-base text-foreground/60">Manage your store and view analytics</p>
          </div>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-sm sm:text-base">
              <BarChart3 size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 text-sm sm:text-base">
              <Package size={16} />
              Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => { setShowForm(true); setEditingProduct(null); setFormData({ name: '', category: '', image: '', description: '', price: 0, stock: 10, featured: false }) }} className="w-full sm:w-auto">
                <Plus size={20} className="mr-2" />
                Add Product
              </Button>
            </div>

            {showForm && (
              <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Frames, Decor, Accessories"
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/image.jpg or full URL"
                      required
                      className="h-10 sm:h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                      className="resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (₹)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                        className="h-10 sm:h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        required
                        className="h-10 sm:h-11"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 sm:w-4 sm:h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Featured in Carousel
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                    <Button type="submit" className="w-full sm:w-auto">{editingProduct ? 'Update' : 'Add'} Product</Button>
                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingProduct(null) }} className="w-full sm:w-auto">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-20">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`group overflow-hidden cursor-move hover:shadow-lg transition-all ${
                      draggedProduct?.id === product.id ? 'opacity-50 scale-95' : ''
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(product)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(product)}
                  >
                    <div className="relative aspect-square bg-white">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFeatured(product)}
                        className="absolute top-2 right-2 p-1.5 sm:p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all sm:opacity-0 sm:group-hover:opacity-100"
                        title={product.featured ? "Remove from carousel" : "Add to carousel"}
                      >
                        <Star 
                          size={16} 
                          className={product.featured ? "fill-yellow-500 text-yellow-500" : "text-gray-400"} 
                        />
                      </button>
                      {product.stock !== undefined && (
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-[11px] sm:text-xs font-medium ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? `${product.stock}` : 'Out'}
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute bottom-2 left-2">
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                            ⭐
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase mb-1 truncate">{product.category}</p>
                      <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 truncate" title={product.name}>{product.name}</h3>
                      <p className="text-xs sm:text-sm text-foreground/70 mb-2 sm:mb-3 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">{product.description}</p>
                      
                      <div className="mb-3">
                        {product.price && product.price > 0 && (
                          <p className="text-lg sm:text-xl font-bold text-primary">₹{product.price.toFixed(0)}</p>
                        )}
                        <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mt-1">
                          <span>Stock: {product.stock || 0}</span>
                          <span>Sold: {product.soldCount || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="flex-1 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3">
                          <Edit size={14} className="sm:mr-1" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)} className="h-8 sm:h-9 px-2 sm:px-3">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
