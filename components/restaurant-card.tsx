"use client"

import { Star, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Restaurant } from "@/lib/order-state"

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: () => void
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 bg-card border-border"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-foreground">{restaurant.deliveryTime} min</span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-card-foreground">{restaurant.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-medium text-card-foreground">{restaurant.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">{restaurant.cuisine}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Envío ${restaurant.deliveryFee.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  )
}
