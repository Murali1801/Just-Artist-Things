"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  const scrollToCollection = () => {
    const collectionSection = document.querySelector('section[class*="py-24"]')
    collectionSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[600px] md:min-h-screen flex items-center justify-center px-6 py-20 bg-background overflow-hidden">
      {/* Decorative blobs */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-64 h-64 bg-teal-200/15 dark:bg-teal-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-10 left-10 w-80 h-80 bg-cyan-200/15 dark:bg-cyan-500/10 rounded-full blur-3xl"
      />

      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-900/40 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/30 text-teal-700 dark:text-teal-300 text-xs font-medium mb-6"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Premium Collection
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6 text-foreground">
              Discover
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                Premium Quality
              </span>
            </h1>
            <p className="text-lg text-foreground/70 max-w-md leading-relaxed">
              Explore our curated collection of handpicked products, selected for their exceptional quality and timeless
              design.
            </p>
          </div>
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button onClick={scrollToCollection} size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl transition-all">
                Explore Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl hover:bg-white hover:dark:bg-slate-700 transition-all"
              >
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative aspect-[5/4] w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 dark:from-teal-500/10 dark:to-cyan-500/10 rounded-3xl" />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50 flex items-center justify-center overflow-hidden"
          >
            <Image src="/custom-portrait-frame.jpeg" alt="Product showcase" fill className="object-cover" priority />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
