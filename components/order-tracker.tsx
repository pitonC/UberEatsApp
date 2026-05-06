"use client"

import { ArrowLeft, MapPin, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Order, createState, ALL_STATES, OrderStateType } from "@/lib/order-state"
import { cn } from "@/lib/utils"

interface OrderTrackerProps {
  order: Order
  stateLog: { state: OrderStateType; timestamp: Date }[]
  onAdvanceState: () => void    //estado
  onCancelOrder: () => void
  onBack: () => void
}

export function OrderTracker({ 
  order, 
  stateLog,
  onAdvanceState, 
  onCancelOrder,
  onBack 
}: OrderTrackerProps) {
  const currentState = createState(order.state)
  const StateIcon = currentState.icon
  const isFinalState = order.state === "delivered" || order.state === "cancelled"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Seguimiento de Pedido</h1>
              <p className="text-xs text-muted-foreground">{order.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Estado Actual */}
        <Card className="bg-card border-border overflow-hidden">
          <div 
            className="h-2"
            style={{ 
              background: `linear-gradient(to right, ${currentState.color} ${currentState.progress}%, var(--secondary) ${currentState.progress}%)`
            }}
          />
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `color-mix(in oklch, ${currentState.color} 20%, transparent)` }}
              >
                <StateIcon 
                  className="w-8 h-8" 
                  style={{ color: currentState.color }}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-card-foreground">
                  {currentState.displayName}
                </h2>
                <p className="text-muted-foreground">{currentState.description}</p>
                {!isFinalState && (
                  <p className="text-sm text-primary mt-1">
                    Tiempo estimado: {order.estimatedDelivery}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline de Estados */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Progreso del Pedido</h3>
            <div className="relative">
              {ALL_STATES.map((stateType, index) => {
                const state = createState(stateType)
                const StateIcon = state.icon
                const logEntry = stateLog.find(l => l.state === stateType)
                const isActive = stateType === order.state
                const isCompleted = logEntry !== undefined
                const isCurrent = isActive && !isFinalState
                
                return (
                  <div key={stateType} className="flex gap-4 pb-6 last:pb-0">
                    {/* Línea conectora */}
                    <div className="relative flex flex-col items-center">
                      <div 
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                          isCompleted || isActive
                            ? "border-primary bg-primary/20"
                            : "border-border bg-secondary"
                        )}
                      >
                        <StateIcon 
                          className={cn(
                            "w-5 h-5",
                            isCompleted || isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      {index < ALL_STATES.length - 1 && (
                        <div 
                          className={cn(
                            "w-0.5 flex-1 min-h-[24px] mt-2",
                            isCompleted ? "bg-primary" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "font-medium",
                          isCompleted || isActive ? "text-card-foreground" : "text-muted-foreground"
                        )}>
                          {state.displayName}
                        </h4>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground animate-pulse">
                            Actual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{state.description}</p>
                      {logEntry && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {logEntry.timestamp.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detalles del Restaurante */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img 
                src={order.restaurant.image} 
                alt={order.restaurant.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{order.restaurant.name}</h3>
                <p className="text-sm text-muted-foreground">{order.restaurant.cuisine}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dirección de Entrega */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-card-foreground">Dirección de Entrega</h3>
                <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen del Pedido */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-card-foreground mb-4">Resumen del Pedido</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="text-card-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-card-foreground">${order.restaurant.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción (Para Demo) */}
        <Card className="bg-secondary border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-secondary-foreground mb-3">
              Panel de Demostración (Patrón Estado)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Simula las transiciones de estado del pedido. En una aplicación real, 
              estos cambios serían realizados por el restaurante y el repartidor.
            </p>
            <div className="flex gap-3 flex-wrap">
              {currentState.getNextAction() && (
                <Button 
                  onClick={onAdvanceState}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {currentState.getNextAction()?.label}
                </Button>
              )}
              {currentState.canCancel() && (
                <Button 
                  variant="destructive"
                  onClick={onCancelOrder}
                >
                  Cancelar Pedido
                </Button>
              )}
              {isFinalState && (
                <Button onClick={onBack}>
                  Hacer Nuevo Pedido
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
