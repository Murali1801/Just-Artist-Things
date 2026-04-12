"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

interface Product {
  id: string
  name: string
  category: string
  image: string
  description: string
}

interface ProductCarouselProps {
  products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const featuredProducts = products.filter(p => p.featured).slice(0, 9)

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-teal-100/30 via-cyan-100/30 to-blue-100/30 dark:from-teal-950/10 dark:via-cyan-950/10 dark:to-blue-950/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Discover our handpicked selection of premium art supplies
          </p>
        </div>

        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent className="-ml-4">
            {featuredProducts.map((product) => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-teal-200/50 dark:border-teal-800/50 hover:border-teal-400 dark:hover:border-teal-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="inline-block px-3 py-1 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full mb-2">
                      {product.category}
                    </div>
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900" />
          <CarouselNext className="border-teal-300 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900" />
        </Carousel>
      </div>
    </section>
  )
}
