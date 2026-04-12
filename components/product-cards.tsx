"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Professional Acrylic Set",
    category: "Pigments",
    badge: "Artist Choice",
    price: "$249",
    image: "/professional-acrylic-paint-set.jpg",
    description:
      "Premium acrylic colors with superior pigmentation and blend-ability. Perfect for both beginners and professionals.",
    specs: "24 colors, 60ml tubes, Professional Grade",
  },
  {
    id: 2,
    name: "Sable Brush Collection",
    category: "Instruments",
    badge: "New Arrival",
    price: "$189",
    image: "/professional-sable-brushes-set.jpg",
    description:
      "Handcrafted sable brushes designed for precision and control. Ideal for watercolor and fine detail work.",
    specs: "12 brushes, Sizes 00-12, Genuine Sable Hair",
  },
  {
    id: 3,
    name: "Cotton Rag Canvas",
    category: "Surfaces",
    badge: "Popular",
    price: "$79",
    image: "/premium-cotton-rag-canvas-sheets.jpg",
    description: "Archival quality cotton rag paper designed for longevity and performance with multiple mediums.",
    specs: "100% Cotton, 300gsm, Pack of 25",
  },
  {
    id: 4,
    name: "Matte Medium",
    category: "Mediums",
    badge: "Essential",
    price: "$34",
    image: "/art-medium-bottle-transparent.jpg",
    description:
      "Extend and enhance your acrylics with this professional-grade matte medium. Improves flow and workability.",
    specs: "500ml Bottle, Non-toxic, Quick-drying",
  },
  {
    id: 5,
    name: "Watercolor Palette",
    category: "Pigments",
    badge: "Artist Choice",
    price: "$159",
    image: "/professional-watercolor-palette.jpg",
    description:
      "Hand-assembled palette featuring 36 vibrant watercolor pigments with superior transparency and mixing capabilities.",
    specs: "36 Colors, Professional Grade, Metal Case",
  },
  {
    id: 6,
    name: "Charcoal Pencil Set",
    category: "Instruments",
    badge: "New Arrival",
    price: "$67",
    image: "/charcoal-drawing-pencil-set.jpg",
    description:
      "Versatile charcoal pencils perfect for sketching, shading, and detail work across all artistic styles.",
    specs: "12 Pencils, Mixed Grades, Eco-friendly",
  },
]

export default function ProductCards({ onProductSelect }) {
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
    <section className="px-6 py-24 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Featured Collection</h2>
          <p className="text-stone-600 text-lg max-w-2xl">
            Handpicked pieces that represent the pinnacle of quality and artistry.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
              <Card className="overflow-hidden bg-stone-50 border-0 shadow-none hover:shadow-md transition-shadow duration-300">
                <div className="relative overflow-hidden bg-gray-200 h-64">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-white text-stone-900 hover:bg-white">
                    {product.badge}
                  </Badge>
                </div>

                <div className="p-6">
                  <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">{product.category}</p>
                  <h3 className="text-lg font-serif font-bold mb-2">{product.name}</h3>
                  <p className="text-stone-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold">{product.price}</span>
                    <span className="text-xs text-stone-500">{product.specs}</span>
                  </div>
                  <Button
                    onClick={() => onProductSelect(product)}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white"
                  >
                    Details
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
