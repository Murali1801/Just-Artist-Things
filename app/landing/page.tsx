"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Truck, Shield, Heart, Quote, Hammer, Droplets, Sun, Box, Fingerprint } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import Header from "@/components/header"

// Additional animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const yBg = useTransform(heroProgress, [0, 1], ["0%", "50%"])
  const opacityText = useTransform(heroProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.9])

  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary overflow-x-hidden bg-background">
      <Header />

      {/* Hero Section */}
      <section ref={heroRef} id="home" className="relative min-h-screen flex items-center px-6 pt-20 overflow-hidden">
        <motion.div 
          style={{ y: yBg }} 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)_0%,transparent_50%)] opacity-10 pointer-events-none" 
        />
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <motion.div
            style={{ opacity: opacityText }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-primary/20 text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-8"
            >
              <Sparkles className="h-4 w-4" />
              The Art of Handcrafting
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground leading-[1.1] mb-8">
              Where Art 
              <br />
              <span className="text-primary italic">Breathes Life</span>
              <br />
              into Spaces
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mb-12 leading-relaxed font-sans">
              Discover a curated collection of resin art, bespoke frames, and avant-garde decor designed for those who appreciate the finer details of craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/home">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/20 text-xs uppercase tracking-widest font-bold group overflow-hidden relative">
                  <span className="relative z-10 flex items-center">
                    Enter The Studio
                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="lg"
                className="h-16 px-10 rounded-2xl border border-border hover:bg-muted text-xs uppercase tracking-widest font-bold"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Our Philosophy
              </Button>
            </div>
          </motion.div>

          <motion.div
            style={{ scale: heroScale }}
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative perspective-1000 hidden md:block"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-8 border-white dark:border-white/5 aspect-[4/5] group">
              <img 
                src="/assets/revamp/hero-clock.png" 
                alt="Signature Piece" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-12">
                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Signature Piece</span>
                  <h3 className="text-3xl font-serif font-bold mt-1">Midnight Emerald Clock</h3>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="about" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-4xl relative z-10"
          >
            <motion.span variants={fadeInUp} className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-6 flex items-center justify-center gap-2">
              <Quote className="w-4 h-4" /> Our Ethos
            </motion.span>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold mb-10 text-foreground leading-tight">
              Every detail is a deliberate 
              <span className="italic block mt-2 text-muted-foreground/80">work of intention.</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
              Based in the quiet town of Boisar, we began as a small artistic venture fueled by the desire to bring tangible beauty back into digital lives. We believe that handmade art is not just a purchase—it’s an investment in a story. Each pour of resin, each sanding of wood, connects deeply to a narrative of authentic creation.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-32 px-6 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 block">The Process</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">How Magic is Made</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-border z-0" />
            
            {[
              { icon: <Fingerprint />, title: "Conception", desc: "Sketching dimensions and sourcing premium raw wood." },
              { icon: <Droplets />, title: "The Pour", desc: "Complex chemical blending of resin and pigment." },
              { icon: <Sun />, title: "Curing", desc: "Monitored atmospheric curing for bubble-free clarity." },
              { icon: <Hammer />, title: "Finishing", desc: "Sanding, polishing, and secure bespoke packaging." }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative z-10 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 group-hover:border-primary group-hover:-translate-y-2 transition-all duration-500 shadow-xl text-primary/70 group-hover:text-primary">
                  {step.icon}
                </div>
                <h3 className="text-xl font-serif font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Works */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 block">Collections</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Curated Explorations</h2>
            </div>
            <Link href="/home" className="group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors">
              Explore Complete Catalog <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "The Frame Series",
                desc: "Capturing memories in sculptural light oak and deep, oceanic resin pours.",
                img: "/assets/revamp/feature-frame.png",
                tag: "Bespoke"
              },
              {
                title: "Alchemy Coasters",
                desc: "Functional art pieces infused with real gold-leaf textures and vibrant gradients.",
                img: "/assets/revamp/feature-coasters.png",
                tag: "Signature Essentials"
              }
            ].map((work, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-8 border border-border/50 shadow-lg perspective-1000">
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Floating Tag */}
                  <div className="absolute top-6 left-6 glass px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-foreground">
                    {work.tag}
                  </div>
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="glass text-foreground font-bold px-6 py-3 rounded-full uppercase text-xs tracking-widest shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      Discover Collection
                    </div>
                  </div>
                </div>
                
                <h3 className="text-3xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{work.title}</h3>
                <p className="text-muted-foreground text-base font-sans line-clamp-2 max-w-md">{work.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="glass-card p-16 md:p-32 rounded-[4rem] relative overflow-hidden"
          >
            {/* Animated Gradient Orbs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] -z-10 rounded-full" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 blur-[120px] -z-10 rounded-full" 
            />
            
            <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-foreground leading-tight">
              Ready to initiate <br/>
              <span className="text-primary italic">your commission?</span>
            </h2>
            
            <p className="text-muted-foreground text-xl mb-14 max-w-lg mx-auto leading-relaxed">
              Our studio doors are always open for custom projects that challenge our craft. Let's create something timeless.
            </p>
            
            <Link href="/home">
              <Button size="lg" className="h-20 px-16 rounded-[2rem] bg-foreground text-background hover:bg-foreground/90 text-sm uppercase tracking-[0.2em] font-bold shadow-2xl hover:scale-105 transition-transform duration-300">
                Browse The Store
              </Button>
            </Link>
            
            <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground/60">
              <div className="flex items-center gap-3"><Truck className="h-4 w-4" /> Pan-India</div>
              <div className="flex items-center gap-3"><Shield className="h-4 w-4" /> Secure FlowPay</div>
              <div className="flex items-center gap-3"><Heart className="h-4 w-4" /> Artisan Made</div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}