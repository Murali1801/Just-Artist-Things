"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { productService } from "@/lib/firebase/productService"

interface StockStatusProps {
  stock: number
  variant?: 'badge' | 'text' | 'detailed'
  className?: string
}

export function StockStatus({ stock, variant = 'badge', className = '' }: StockStatusProps) {
  const { status, message, color } = productService.getStockStatus(stock)

  const getIcon = () => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4" />
      case 'low':
        return <AlertTriangle className="w-4 h-4" />
      case 'out':
        return <XCircle className="w-4 h-4" />
    }
  }

  const getBadgeVariant = () => {
    switch (status) {
      case 'available':
        return 'default'
      case 'low':
        return 'secondary'
      case 'out':
        return 'destructive'
    }
  }

  if (variant === 'badge') {
    return (
      <Badge variant={getBadgeVariant()} className={`flex items-center gap-1 ${className}`}>
        {getIcon()}
        {message}
      </Badge>
    )
  }

  if (variant === 'text') {
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${color} ${className}`}>
        {getIcon()}
        {message}
      </span>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`flex items-center gap-1 ${color}`}>
          {getIcon()}
          <span className="font-medium">{message}</span>
        </div>
        {status !== 'out' && (
          <span className="text-sm text-muted-foreground">
            ({stock} in stock)
          </span>
        )}
      </div>
    )
  }

  return null
}