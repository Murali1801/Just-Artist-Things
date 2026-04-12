"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 dark:from-slate-950 dark:via-teal-950 dark:to-slate-950 text-white overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Just Artist Things
            </h3>
            <p className="text-slate-300 dark:text-slate-400 mb-4">
              Your premier destination for handcrafted art supplies and custom creations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/home" className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors">Shop</Link></li>
              <li><Link href="/" className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="text-slate-300 dark:text-slate-400 hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-300 dark:text-slate-400">
                <Mail className="h-4 w-4 text-primary" />
                <span>diyak7153@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300 dark:text-slate-400">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 9370015472</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Boisar, Palghar, Maharashtra</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-slate-300 dark:text-slate-400 mb-4 text-sm">
              Subscribe for exclusive offers and updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 backdrop-blur-md border-white/10 text-white placeholder:text-slate-400 rounded-lg focus:border-teal-400 transition-all"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow-lg shadow-teal-500/20 px-4">
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-slate-700 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            © 2025 Just Artist Things. All rights reserved.
          </p>
          <div className="flex gap-4">
            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <Link href="#" className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 transition-all duration-300 block shadow-lg shadow-black/10">
                <Facebook className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <Link href="https://www.instagram.com/just__artist.things" className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 transition-all duration-300 block shadow-lg shadow-black/10">
                <Instagram className="h-5 w-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
              <Link href="#" className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 block shadow-lg shadow-black/10">
                <Twitter className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
