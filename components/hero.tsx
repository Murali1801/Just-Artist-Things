"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  const scrollToCollection = () => {
    const collectionSection = document.getElementById('collection-grid') || document.querySelector('section[class*="py-24"]')
    collectionSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden pt-20">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,var(--primary)_0%,transparent_40%)] opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,var(--secondary)_0%,transparent_40%)] opacity-10" />
      
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-10"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-8"
            >
              <Sparkles className="h-3.5 w-3.5" />
              The Curator's Selection
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-serif font-bold leading-[1.1] mb-8 text-foreground">
              Artistry <br />
              <span className="text-primary italic">Redefined.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed font-sans">
              Explore our laboratory of handcrafted wonders. Each piece is a marriage of raw resin and refined imagination.
            </p>
          </div>
          
          <div className="flex gap-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={scrollToCollection} 
                size="lg" 
                className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/20 text-xs uppercase tracking-widest font-bold group"
              >
                View Collection
                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] md:aspect-square w-full lg:max-w-xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/10 rounded-[3rem] -rotate-3" />
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <Image 
              src="/assets/revamp/hero-clock.png" 
              alt="Art Feature" 
              fill 
              className="object-cover" 
              priority 
            />
            <div className="absolute inset-0 glass-card m-6 p-8 flex flex-col justify-end opacity-0 hover:opacity-100 transition-opacity duration-500">
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Limited Edition</span>
              <h3 className="text-2xl font-serif font-bold mt-2">The Emerald Horizon</h3>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
