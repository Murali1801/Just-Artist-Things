"use client"

import { motion } from "framer-motion"

const categories = [
  {
    id: "pigments",
    title: "Pigments",
    description: "Rich, vibrant colors that inspire creativity",
    color: "from-violet-100 to-purple-100",
    size: "md:col-span-2 md:row-span-2",
  },
  {
    id: "instruments",
    title: "Instruments",
    description: "Precision tools for perfect execution",
    color: "from-blue-100 to-cyan-100",
    size: "md:col-span-1",
  },
  {
    id: "surfaces",
    title: "Surfaces",
    description: "Premium papers and canvases",
    color: "from-amber-100 to-yellow-100",
    size: "md:col-span-1",
  },
  {
    id: "mediums",
    title: "Mediums",
    description: "Enhance and transform your art",
    color: "from-rose-100 to-pink-100",
    size: "md:col-span-2",
  },
]

export default function CategoryGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Explore Our Collections</h2>
        <p className="text-stone-600 text-lg max-w-2xl">
          Thoughtfully curated categories designed to meet every artist&apos;s needs and inspiration.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-4 md:grid-rows-3 gap-4 auto-rows-max"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            id={category.id}
            className={`${category.size} bg-gradient-to-br ${category.color} rounded-2xl p-8 md:p-12 flex flex-col justify-between min-h-52 cursor-pointer group hover:shadow-lg transition-shadow duration-300`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-3">{category.title}</h3>
              <p className="text-stone-700">{category.description}</p>
            </div>
            <div className="text-sm font-light text-stone-600 group-hover:text-stone-900 transition-colors">
              Explore →
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
