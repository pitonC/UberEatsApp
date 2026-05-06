"use client"

import { Plus, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MenuItem, CartItem } from "@/lib/order-state"

interface MenuItemCardProps {
  item: MenuItem
  cartItem?: CartItem
  onAdd: () => void
  onRemove: () => void
}

export function MenuItemCard({ item, cartItem, onAdd, onRemove }: MenuItemCardProps) {
  const quantity = cartItem?.quantity || 0

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-0">
        <div className="flex gap-4">
          <div className="flex-1 p-4">
            <h4 className="font-medium text-card-foreground">{item.name}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-semibold text-primary">
                ${item.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                {quantity > 0 ? (
                  <>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="w-8 h-8"
                      onClick={onRemove}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-6 text-center font-medium text-card-foreground">
                      {quantity}
                    </span>
                    <Button 
                      size="icon" 
                      className="w-8 h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={onAdd}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={onAdd}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="w-28 h-28 flex-shrink-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
