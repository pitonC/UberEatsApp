"use client"

import { useState, useCallback } from "react"
import { 
  Order, 
  OrderStateType, 
  CartItem, 
  Restaurant,
  createState 
} from "@/lib/order-state"

// ============================================
// HOOK PERSONALIZADO PARA GESTIÓN DE PEDIDOS
// Implementa el Patrón Estado para manejar transiciones
// ============================================

export function useOrder() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [orderHistory, setOrderHistory] = useState<Order[]>([])
  const [stateLog, setStateLog] = useState<{ state: OrderStateType; timestamp: Date }[]>([])

  // Crear un nuevo pedido
  const createOrder = useCallback((
    restaurant: Restaurant,
    items: CartItem[],
    deliveryAddress: string
  ) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + restaurant.deliveryFee
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      restaurant,
      items,
      state: "pending",
      total,
      createdAt: new Date(),
      estimatedDelivery: `${parseInt(restaurant.deliveryTime) + 15}-${parseInt(restaurant.deliveryTime) + 30} min`,
      deliveryAddress
    }
    
    setCurrentOrder(newOrder)
    setStateLog([{ state: "pending", timestamp: new Date() }])
    
    return newOrder
  }, [])

  //1-estado. Transición de estado usando el Patrón Estado
  const transitionState = useCallback((newState: OrderStateType) => {
    if (!currentOrder) return false
    
    const currentState = createState(currentOrder.state)
    
    // Verificar si la transición es válida
    let canTransition = false
    
    switch (newState) {
      case "confirmed":
        canTransition = currentState.canConfirm()
        break
      case "preparing":
        canTransition = currentState.canPrepare()
        break
      case "ready":
        canTransition = currentState.canMarkReady()
        break
      case "delivering":
        canTransition = currentState.canStartDelivery()
        break
      case "delivered":
        canTransition = currentState.canDeliver()
        break
      case "cancelled":
        canTransition = currentState.canCancel()
        break
    }
    
    if (canTransition) {
      setCurrentOrder(prev => prev ? { ...prev, state: newState } : null)
      setStateLog(prev => [...prev, { state: newState, timestamp: new Date() }])
      
      // Si el pedido está completado o cancelado, añadir al historial
      if (newState === "delivered" || newState === "cancelled") {
        setOrderHistory(prev => [
          ...prev,
          { ...currentOrder!, state: newState }
        ])
      }
      
      return true
    }
    
    return false
  }, [currentOrder])

  // Avanzar al siguiente estado automáticamente
  const advanceState = useCallback(() => {
    if (!currentOrder) return false
    
    const currentState = createState(currentOrder.state)
    const nextAction = currentState.getNextAction()
    
    if (nextAction) {
      return transitionState(nextAction.nextState)
    }
    
    return false
  }, [currentOrder, transitionState])

  // Cancelar pedido
  const cancelOrder = useCallback(() => {
    return transitionState("cancelled")
  }, [transitionState])

  // Obtener el estado actual como objeto
  const getCurrentState = useCallback(() => {
    if (!currentOrder) return null
    return createState(currentOrder.state)
  }, [currentOrder])

  // Reiniciar (para demo)
  const resetOrder = useCallback(() => {
    setCurrentOrder(null)
    setStateLog([])
  }, [])

  return {
    currentOrder,
    orderHistory,
    stateLog,
    createOrder,
    transitionState,
    advanceState,
    cancelOrder,
    getCurrentState,
    resetOrder
  }
}
