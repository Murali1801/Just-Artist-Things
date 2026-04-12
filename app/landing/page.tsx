"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Palette, Truck, Shield, Star, Heart } from "lucide-react"
import Link from "next/link"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <Header />

      {/* Hero: The Statement */}
      <section id="home" className="relative min-h-screen flex items-center px-6 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,var(--primary)_0%,transparent_50%)] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border-primary/20 text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-8"
            >
              <Sparkles className="h-3 w-3" />
              The Art of Handcrafting
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground leading-[1.1] mb-8">
              Where Art 
              <br />
              <span className="text-primary italic">Breathes Life</span>
              <br />
              into Spaces
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-12 leading-relaxed font-sans">
              Discover a curated collection of resin art, bespoke frames, and avant-garde decor designed for those who appreciate the finer details of craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/home">
                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/20 text-xs uppercase tracking-widest font-bold group">
                  Enter The Studio
                  <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
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

          {/* Visual Piece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative perspective-1000"
          >
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-8 border-white dark:border-white/5 aspect-[4/5] group">
              <img 
                src="/assets/revamp/hero-clock.png" 
                alt="Signature Clock" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-12">
                <div className="text-white">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">Signature Piece</span>
                  <h3 className="text-2xl font-serif font-bold mt-1">Midnight Emerald Clock</h3>
                </div>
              </div>
            </div>

            {/* Floating Accents */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 w-40 h-40 glass rounded-3xl z-20 flex items-center justify-center p-8 shadow-xl hidden lg:flex"
            >
              <Palette className="w-full h-full text-primary/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="about" className="py-32 px-6 bg-muted/30 relative">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-6 block">Our Ethos</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-10 text-foreground">
              Every detail is a deliberate 
              <span className="italic block mt-2 text-muted-foreground/60">work of intention.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Based in the quiet town of Boisar, we began as a small artistic venture fueled by the desire to bring tangible beauty back into digital lives. We believe that handmade art is not just a purchase—it’s an investment in a story.
            </p>
            <div className="h-px w-20 bg-primary/30 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Curated Works */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary mb-4 block">Collections</span>
              <h2 className="text-4xl font-serif font-bold">Curated Explorations</h2>
            </div>
            <Link href="/home" className="group flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors">
              Explore Catalog <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[
              {
                title: "The Frame Series",
                desc: "Capturing memories in sculptural light oak and glass.",
                img: "/assets/revamp/feature-frame.png",
                tag: "Bespoke"
              },
              {
                title: "Alchemy Coasters",
                desc: "Functional art pieces infused with real gold-leaf textures.",
                img: "/assets/revamp/feature-coasters.png",
                tag: "Signature"
              }
            ].map((work, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 border border-border">
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute top-6 left-6 glass px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold">
                    {work.tag}
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2 group-hover:text-primary transition-colors">{work.title}</h3>
                <p className="text-muted-foreground text-sm font-sans">{work.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-16 md:p-24 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 blur-[100px] -z-10" />
            
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8">Ready to initiate </h2>
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-10 text-primary">your commission?</h2>
            
            <p className="text-muted-foreground text-lg mb-12 max-w-sm mx-auto">
              Our studio doors are always open for custom projects that challenge our craft.
            </p>
            
            <Link href="/home">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest font-bold shadow-2xl">
                Browse The Store
              </Button>
            </Link>
            
            <div className="mt-16 flex justify-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-muted-foreground opacity-50">
              <div className="flex items-center gap-2"><Truck className="h-3 w-3" /> Pan-India</div>
              <div className="flex items-center gap-2"><Shield className="h-3 w-3" /> Secure FlowPay</div>
              <div className="flex items-center gap-2"><Heart className="h-3 w-3" /> Artisan Made</div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}