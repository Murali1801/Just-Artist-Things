"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Palette, Truck, Shield, Star, Heart } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 dark:from-slate-900 dark:via-cyan-950/30 dark:to-slate-800 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center justify-center px-6 py-20">
        {/* Decorative floating shapes */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-1/4 w-48 h-48 bg-blue-200/15 dark:bg-blue-500/10 rounded-full blur-2xl"
        />

        <div className="max-w-6xl w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/80 dark:bg-teal-900/40 backdrop-blur-sm border border-teal-200/50 dark:border-teal-700/30 text-teal-700 dark:text-teal-300 text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              Handcrafted with Love in India
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Handcrafted Art
              <br />
              <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                & Decor
              </span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Custom frames, resin art, and personalized accessories crafted with care —
              each piece tells a unique story.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/home">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-10 py-6 text-base rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-700 dark:text-slate-200 hover:bg-white hover:dark:bg-slate-700 px-10 py-6 text-base rounded-xl transition-all"
                onClick={() => {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-slate-500 dark:text-slate-400"
          >
            {[
              { icon: <Star className="h-4 w-4 fill-amber-400 text-amber-400" />, text: "200+ Happy Customers" },
              { icon: <Heart className="h-4 w-4 text-rose-400" />, text: "Made with Love" },
              { icon: <Truck className="h-4 w-4 text-teal-500" />, text: "Pan-India Delivery" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-y border-white/20 dark:border-slate-700/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4">Our Story</span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
              About Us
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              We create handmade art pieces, custom frames, and personalized accessories. Each item is carefully crafted to add a personal touch to your space.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Based in Boisar, Palghar, Maharashtra, we take pride in delivering quality handcrafted products across India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">What Makes Us Special</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {[
              {
                title: "Handcrafted",
                description: "Every piece is made by hand with meticulous attention to detail and passion",
                icon: <Palette className="h-7 w-7" />,
                gradient: "from-teal-500 to-emerald-500",
              },
              {
                title: "Custom Orders",
                description: "Personalize your items with names, dates, or custom designs of your choice",
                icon: <Shield className="h-7 w-7" />,
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                title: "Pan-India Delivery",
                description: "Fast and reliable shipping across India from Maharashtra with care",
                icon: <Truck className="h-7 w-7" />,
                gradient: "from-blue-500 to-indigo-500",
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50 dark:border-slate-700/50 text-center"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 via-cyan-600/5 to-blue-600/5 dark:from-teal-600/10 dark:via-cyan-600/10 dark:to-blue-600/10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-12 md:p-16 rounded-3xl border border-white/30 dark:border-slate-700/30 shadow-xl">
            <span className="inline-block text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-4">Get Started</span>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Order?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 max-w-lg mx-auto">
              Browse our collection and contact us for custom orders via WhatsApp or Instagram.
            </p>
            <Link href="/home">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button size="lg" className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-10 py-6 text-base rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 transition-all">
                  View Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}