"use client"

import { ArrowLeft, Star, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MenuItemCard } from "./menu-item-card"
import { Restaurant, CartItem } from "@/lib/order-state"

interface RestaurantMenuProps {
  restaurant: Restaurant
  cart: CartItem[]
  onBack: () => void
  onAddItem: (item: CartItem) => void
  onRemoveItem: (itemId: string) => void
}

export function RestaurantMenu({ 
  restaurant, 
  cart,
  onBack, 
  onAddItem,
  onRemoveItem 
}: RestaurantMenuProps) {
  const categories = [...new Set(restaurant.menu.map(item => item.category))]

  const handleAddItem = (menuItem: typeof restaurant.menu[0]) => {
    const cartItem: CartItem = {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      quantity: 1,
      image: menuItem.image
    }
    onAddItem(cartItem)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-48 md:h-64">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 left-4 bg-background/80 hover:bg-background"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Restaurant Info */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
          <h1 className="text-2xl font-bold text-card-foreground">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-medium text-card-foreground">{restaurant.rating}</span>
              <span className="text-muted-foreground">(200+)</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>2.5 km</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">
              {restaurant.cuisine}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              Envío ${restaurant.deliveryFee.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-4 py-6">
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">{category}</h2>
            <div className="space-y-3">
              {restaurant.menu
                .filter(item => item.category === category)
                .map(item => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    cartItem={cart.find(c => c.id === item.id)}
                    onAdd={() => handleAddItem(item)}
                    onRemove={() => onRemoveItem(item.id)}
                  />
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
