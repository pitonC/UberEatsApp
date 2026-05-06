"use client"

import { X, Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartItem, Restaurant } from "@/lib/order-state"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  restaurant: Restaurant | null
  onUpdateQuantity: (itemId: string, delta: number) => void
  onCheckout: () => void
}

export function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  restaurant,
  onUpdateQuantity,
  onCheckout 
}: CartDrawerProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = restaurant?.deliveryFee || 0
  const total = subtotal + deliveryFee

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Tu Carrito</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <ShoppingBag className="w-16 h-16 mb-4" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {restaurant && (
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-secondary-foreground">{restaurant.name}</h3>
                    <p className="text-xs text-muted-foreground">{restaurant.deliveryTime} min</p>
                  </div>
                </div>
              )}

              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-card-foreground">{item.name}</h4>
                    <p className="text-sm text-primary font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="w-7 h-7"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-5 text-center text-sm text-card-foreground">{item.quantity}</span>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="w-7 h-7"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-foreground">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg"
              onClick={onCheckout}
            >
              Realizar Pedido
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
