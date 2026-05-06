"use client"

import { ShoppingCart, MapPin, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CartItem } from "@/lib/order-state"

interface HeaderProps {
  cart: CartItem[]
  onCartClick: () => void
  address: string
}

export function Header({ cart, onCartClick, address }: HeaderProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">UE</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">Uber Eats</span>
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm text-secondary-foreground truncate max-w-[200px]">
              {address || "Selecciona tu dirección"}
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar restaurantes o platillos..." 
                className="pl-10 bg-secondary border-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
