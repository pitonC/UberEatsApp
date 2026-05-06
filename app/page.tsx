"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantMenu } from "@/components/restaurant-menu"
import { CartDrawer } from "@/components/cart-drawer"
import { OrderTracker } from "@/components/order-tracker"
import { useOrder } from "@/hooks/use-order"
import { sampleRestaurants } from "@/lib/sample-data"
import { Restaurant, CartItem } from "@/lib/order-state"
import { Utensils, Timer, Percent, Flame } from "lucide-react"

type View = "home" | "restaurant" | "tracking"

export default function UberEatsApp() {
  const [view, setView] = useState<View>("home")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [deliveryAddress] = useState("Calle Principal 123, Ciudad")

  const { 
    currentOrder, 
    stateLog, 
    createOrder, 
    advanceState,  //estado
    cancelOrder,
    resetOrder 
  } = useOrder()

  // Manejar selección de restaurante
  const handleSelectRestaurant = (restaurant: Restaurant) => {
    // Si ya hay items de otro restaurante, limpiar el carrito
    if (selectedRestaurant && selectedRestaurant.id !== restaurant.id) {
      setCart([])
    }
    setSelectedRestaurant(restaurant)
    setView("restaurant")
  }

  // Añadir item al carrito
  const handleAddItem = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, item]
    })
  }, [])

  // estado remover item del carrito
  const handleRemoveItem = useCallback((itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map(i => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        )
      }
      return prev.filter(i => i.id !== itemId)
    })
  }, [])

  // Actualizar cantidad
  const handleUpdateQuantity = useCallback((itemId: string, delta: number) => {
    if (delta > 0) {
      const item = cart.find(i => i.id === itemId)
      if (item) handleAddItem(item)
    } else {
      handleRemoveItem(itemId)
    }
  }, [cart, handleAddItem, handleRemoveItem])

  // Realizar pedido
  const handleCheckout = () => {
    if (!selectedRestaurant || cart.length === 0) return
    
    createOrder(selectedRestaurant, cart, deliveryAddress)
    setIsCartOpen(false)
    setView("tracking")
  }

  // Volver al inicio
  const handleBackToHome = () => {
    resetOrder()
    setCart([])
    setSelectedRestaurant(null)
    setView("home")
  }

  // Renderizar vista de seguimiento
  if (view === "tracking" && currentOrder) {
    return (
      <OrderTracker
        order={currentOrder}
        stateLog={stateLog}
        onAdvanceState={advanceState}
        onCancelOrder={cancelOrder}
        onBack={handleBackToHome}
      />
    )
  }

  // Renderizar vista de menú del restaurante
  if (view === "restaurant" && selectedRestaurant) {
    return (
      <>
        <RestaurantMenu
          restaurant={selectedRestaurant}
          cart={cart}
          onBack={() => setView("home")}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
        />
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          restaurant={selectedRestaurant}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
        />
        {/* Floating Cart Button */}
        {cart.length > 0 && !isCartOpen && (
          <div className="fixed bottom-6 left-4 right-4 z-30">
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold flex items-center justify-between px-6 shadow-lg hover:bg-primary/90 transition-colors"
            >
              <span>Ver carrito ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>${(cart.reduce((s, i) => s + i.price * i.quantity, 0) + selectedRestaurant.deliveryFee).toFixed(2)}</span>
            </button>
          </div>
        )}
      </>
    )
  }

  // Renderizar vista principal (home)
  return (
    <div className="min-h-screen bg-background">
      <Header 
        cart={cart} 
        onCartClick={() => setIsCartOpen(true)}
        address={deliveryAddress}
      />

      <main className="container mx-auto px-4 py-6">
        {/* Categorías */}
        <section className="mb-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { icon: Flame, label: "Populares" },
              { icon: Timer, label: "Rápido" },
              { icon: Percent, label: "Ofertas" },
              { icon: Utensils, label: "Todo" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-2 px-6 py-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors flex-shrink-0"
              >
                <Icon className="w-6 h-6 text-primary" />
                <span className="text-sm text-secondary-foreground whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Banner del Patrón Estado */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Demo: Patrón de Diseño Estado
            </h2>
            <p className="text-muted-foreground text-sm">
              Esta aplicación implementa el <strong className="text-primary">Patrón de Diseño Estado</strong> para 
              manejar las transiciones del ciclo de vida de un pedido. Haz un pedido y observa cómo 
              el estado del pedido cambia a través de: Pendiente → Confirmado → Preparando → Listo → En Camino → Entregado.
            </p>
          </div>
        </section>

        {/* Restaurantes Destacados */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Restaurantes Cerca de Ti
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sampleRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() => handleSelectRestaurant(restaurant)}
              />
            ))}
          </div>
        </section>
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        restaurant={selectedRestaurant}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
    </div>
  )
}
