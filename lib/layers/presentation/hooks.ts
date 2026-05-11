// ============================================
// ARQUITECTURA EN CAPAS - CAPA DE PRESENTACIÓN
// ============================================
// La Capa de Presentación contiene hooks y lógica de UI.
// Conecta la interfaz de usuario con la capa de aplicación.

"use client"

import { useState, useCallback, useMemo } from "react"
import {
  CartItemEntity,
  RestaurantEntity,
  OrderEntity,
  OrderStateType,
  ORDER_STATE_CONFIG,
  OrderStateInfo
} from "../domain/entities"
import {
  CartService,
  OrderService,
  RestaurantService,
  ApplicationCoordinator,
  CartSummaryDTO,
  OrderSummaryDTO
} from "../application/services"

// ============================================
// HOOK: useCartLayer
// ============================================
// 3-capas. Hook para gestión del carrito usando arquitectura en capas

export function useCartLayer() {
  const [cartService] = useState(() => new CartService())
  const [, forceUpdate] = useState({})
  
  const refresh = useCallback(() => forceUpdate({}), [])
  
  const selectRestaurant = useCallback((restaurant: RestaurantEntity) => {
    cartService.selectRestaurant(restaurant)
    refresh()
  }, [cartService, refresh])
  
  const addItem = useCallback((item: CartItemEntity) => {
    cartService.addItem(item)
    refresh()
  }, [cartService, refresh])
  
  const removeItem = useCallback((itemId: string) => {
    cartService.removeItem(itemId)
    refresh()
  }, [cartService, refresh])
  
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    cartService.updateQuantity(itemId, quantity)
    refresh()
  }, [cartService, refresh])
  
  const clear = useCallback(() => {
    cartService.clear()
    refresh()
  }, [cartService, refresh])
  
  const summary = useMemo((): CartSummaryDTO => 
    cartService.getSummary()
  , [cartService])
  
  return {
    // Estado
    items: cartService.getItems(),
    itemCount: cartService.getItemCount(),
    isEmpty: cartService.isEmpty(),
    selectedRestaurant: cartService.getSelectedRestaurant(),
    summary,
    
    // Acciones
    selectRestaurant,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    
    // Servicio directo (para casos avanzados)
    service: cartService
  }
}

// ============================================
// HOOK: useOrderLayer
// ============================================
// Hook para gestión de pedidos usando arquitectura en capas

export function useOrderLayer() {
  const [orderService] = useState(() => new OrderService())
  const [, forceUpdate] = useState({})
  
  const refresh = useCallback(() => forceUpdate({}), [])
  
  const createOrder = useCallback((
    restaurant: RestaurantEntity,
    items: CartItemEntity[],
    deliveryAddress: string
  ): OrderEntity | null => {
    const order = orderService.createOrder(restaurant, items, deliveryAddress)
    refresh()
    return order
  }, [orderService, refresh])
  
  const advanceState = useCallback((): boolean => {
    const result = orderService.advanceState()
    refresh()
    return result
  }, [orderService, refresh])
  
  const transitionState = useCallback((newState: OrderStateType): boolean => {
    const result = orderService.transitionState(newState)
    refresh()
    return result
  }, [orderService, refresh])
  
  const cancelOrder = useCallback((): boolean => {
    const result = orderService.cancelOrder()
    refresh()
    return result
  }, [orderService, refresh])
  
  const reset = useCallback(() => {
    orderService.reset()
    refresh()
  }, [orderService, refresh])
  
  const currentState = useMemo((): OrderStateInfo | null => 
    orderService.getCurrentStateInfo()
  , [orderService])
  
  return {
    // Estado
    currentOrder: orderService.getCurrentOrder(),
    stateLog: orderService.getStateLog(),
    orderHistory: orderService.getOrderHistory(),
    currentState,
    summary: orderService.getOrderSummary(),
    
    // Acciones
    createOrder,
    advanceState,
    transitionState,
    cancelOrder,
    reset,
    
    // Servicio directo
    service: orderService
  }
}

// ============================================
// HOOK: useRestaurantLayer
// ============================================
// Hook para acceso a restaurantes

export function useRestaurantLayer(restaurants: RestaurantEntity[]) {
  const [restaurantService] = useState(() => new RestaurantService(restaurants))
  
  return {
    // Consultas
    getAll: () => restaurantService.getAll(),
    findById: (id: string) => restaurantService.findById(id),
    findByCuisine: (cuisine: string) => restaurantService.findByCuisine(cuisine),
    searchByName: (query: string) => restaurantService.searchByName(query),
    getTopRated: (limit?: number) => restaurantService.getTopRated(limit),
    getFastestDelivery: (limit?: number) => restaurantService.getFastestDelivery(limit),
    
    // Servicio directo
    service: restaurantService
  }
}

// ============================================
// HOOK: useApplicationLayer
// ============================================
// Hook coordinador que integra todos los servicios

export function useApplicationLayer(restaurants: RestaurantEntity[]) {
  const [coordinator] = useState(() => new ApplicationCoordinator(restaurants))
  const [, forceUpdate] = useState({})
  
  const refresh = useCallback(() => forceUpdate({}), [])
  
  // Cart operations
  const selectRestaurant = useCallback((restaurant: RestaurantEntity) => {
    coordinator.cartService.selectRestaurant(restaurant)
    refresh()
  }, [coordinator, refresh])
  
  const addToCart = useCallback((item: CartItemEntity) => {
    coordinator.cartService.addItem(item)
    refresh()
  }, [coordinator, refresh])
  
  const removeFromCart = useCallback((itemId: string) => {
    coordinator.cartService.removeItem(itemId)
    refresh()
  }, [coordinator, refresh])
  
  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    coordinator.cartService.updateQuantity(itemId, quantity)
    refresh()
  }, [coordinator, refresh])
  
  // Order operations
  const checkout = useCallback((deliveryAddress: string): OrderEntity | null => {
    const order = coordinator.checkout(deliveryAddress)
    refresh()
    return order
  }, [coordinator, refresh])
  
  const advanceOrderState = useCallback((): boolean => {
    const result = coordinator.orderService.advanceState()
    refresh()
    return result
  }, [coordinator, refresh])
  
  const cancelOrder = useCallback((): boolean => {
    const result = coordinator.orderService.cancelOrder()
    refresh()
    return result
  }, [coordinator, refresh])
  
  const resetAll = useCallback(() => {
    coordinator.resetAll()
    refresh()
  }, [coordinator, refresh])
  
  return {
    // Estado del carrito
    cartItems: coordinator.cartService.getItems(),
    cartItemCount: coordinator.cartService.getItemCount(),
    isCartEmpty: coordinator.cartService.isEmpty(),
    selectedRestaurant: coordinator.cartService.getSelectedRestaurant(),
    cartSummary: coordinator.cartService.getSummary(),
    
    // Estado del pedido
    currentOrder: coordinator.orderService.getCurrentOrder(),
    orderStateLog: coordinator.orderService.getStateLog(),
    orderHistory: coordinator.orderService.getOrderHistory(),
    currentOrderState: coordinator.orderService.getCurrentStateInfo(),
    orderSummary: coordinator.orderService.getOrderSummary(),
    
    // Restaurantes
    restaurants: coordinator.restaurantService.getAll(),
    findRestaurant: (id: string) => coordinator.restaurantService.findById(id),
    
    // Acciones del carrito
    selectRestaurant,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart: () => { coordinator.cartService.clear(); refresh() },
    
    // Acciones del pedido
    checkout,
    advanceOrderState,
    cancelOrder,
    resetOrder: () => { coordinator.orderService.reset(); refresh() },
    resetAll,
    
    // Coordinador directo
    coordinator
  }
}

// ============================================
// HELPER: Obtener info de estado
// ============================================

export function getStateInfo(stateType: OrderStateType): OrderStateInfo {
  return {
    name: stateType,
    ...ORDER_STATE_CONFIG[stateType]
  }
}
