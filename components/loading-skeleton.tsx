import { Card, CardContent } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-card border-0 shadow-sm h-full flex flex-col">
      <div className="relative overflow-hidden bg-slate-200 dark:bg-slate-700 aspect-[5/4] animate-pulse" />
      <div className="p-6 flex flex-col flex-grow space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4 animate-pulse" />
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6 animate-pulse" />
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse mt-auto" />
      </div>
    </Card>
  )
}

export function CarouselSkeleton() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-teal-100/30 via-cyan-100/30 to-blue-100/30 dark:from-teal-950/10 dark:via-cyan-950/10 dark:to-blue-950/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-teal-200/50 dark:border-teal-800/50">
              <CardContent className="p-4">
                <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 animate-pulse" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-2 animate-pulse" />
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
