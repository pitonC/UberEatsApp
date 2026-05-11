// ============================================
// ARQUITECTURA EN CAPAS - CAPA DE APLICACIÓN
// ============================================
// La Capa de Aplicación contiene los servicios que orquestan
// la lógica de negocio. Coordina entre capas pero no contiene
// lógica de dominio ni de infraestructura.

import {
  CartItemEntity,
  RestaurantEntity,
  OrderEntity,
  OrderStateType,
  Money,
  DeliveryAddress,
  STATE_TRANSITIONS,
  ORDER_STATE_CONFIG,
  OrderStateInfo
} from "../domain/entities"

// ============================================
// INTERFACES DE REPOSITORIOS (Repository Interfaces)
// ============================================
// Definidas en la capa de aplicación, implementadas en infraestructura

export interface IOrderRepository {
  save(order: OrderEntity): Promise<void>
  findById(id: string): Promise<OrderEntity | null>
  findAll(): Promise<OrderEntity[]>
  update(order: OrderEntity): Promise<void>
}

export interface IRestaurantRepository {
  findById(id: string): Promise<RestaurantEntity | null>
  findAll(): Promise<RestaurantEntity[]>
  findByCuisine(cuisine: string): Promise<RestaurantEntity[]>
}

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface CreateOrderDTO {
  restaurantId: string
  items: { itemId: string; quantity: number }[]
  deliveryAddress: string
}

export interface OrderSummaryDTO {
  orderId: string
  restaurantName: string
  itemCount: number
  total: string
  state: OrderStateType
  stateDisplayName: string
  estimatedDelivery: string
}

export interface CartSummaryDTO {
  items: CartItemEntity[]
  itemCount: number
  subtotal: string
  deliveryFee: string
  total: string
}

// ============================================
// SERVICIO DE CARRITO (Cart Service)
// ============================================
// 3-capas. Servicio de aplicación para gestión del carrito

export class CartService {
  private items: CartItemEntity[] = []
  private selectedRestaurant: RestaurantEntity | null = null
  
  selectRestaurant(restaurant: RestaurantEntity): void {
    // Si cambia el restaurante, limpiar el carrito
    if (this.selectedRestaurant?.id !== restaurant.id) {
      this.items = []
    }
    this.selectedRestaurant = restaurant
  }
  
  getSelectedRestaurant(): RestaurantEntity | null {
    return this.selectedRestaurant
  }
  
  addItem(item: CartItemEntity): void {
    const existing = this.items.find(i => i.id === item.id)
    if (existing) {
      existing.quantity += item.quantity
    } else {
      this.items.push({ ...item })
    }
  }
  
  removeItem(itemId: string): void {
    const index = this.items.findIndex(i => i.id === itemId)
    if (index !== -1) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity--
      } else {
        this.items.splice(index, 1)
      }
    }
  }
  
  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.items = this.items.filter(i => i.id !== itemId)
      return
    }
    
    const item = this.items.find(i => i.id === itemId)
    if (item) {
      item.quantity = quantity
    }
  }
  
  getItems(): CartItemEntity[] {
    return [...this.items]
  }
  
  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  }
  
  clear(): void {
    this.items = []
  }
  
  isEmpty(): boolean {
    return this.items.length === 0
  }
  
  getSummary(): CartSummaryDTO {
    const subtotal = Money.fromNumber(
      this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    )
    const deliveryFee = Money.fromNumber(this.selectedRestaurant?.deliveryFee || 0)
    const total = subtotal.add(deliveryFee)
    
    return {
      items: this.getItems(),
      itemCount: this.getItemCount(),
      subtotal: subtotal.format(),
      deliveryFee: deliveryFee.format(),
      total: total.format()
    }
  }
}

// ============================================
// SERVICIO DE PEDIDOS (Order Service)
// ============================================
// Servicio de aplicación para gestión de pedidos

export class OrderService {
  private currentOrder: OrderEntity | null = null
  private orderHistory: OrderEntity[] = []
  private stateLog: { state: OrderStateType; timestamp: Date }[] = []
  private orderCounter = 0
  
  createOrder(
    restaurant: RestaurantEntity,
    items: CartItemEntity[],
    deliveryAddress: string
  ): OrderEntity | null {
    // Validar dirección
    const address = DeliveryAddress.create(deliveryAddress)
    if (!address) {
      console.error("Dirección de entrega inválida")
      return null
    }
    
    // Validar items
    if (items.length === 0) {
      console.error("El carrito está vacío")
      return null
    }
    
    // Calcular total
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = Money.fromNumber(subtotal + restaurant.deliveryFee)
    
    // Generar ID
    this.orderCounter++
    const orderId = `ORD-${Date.now()}-${this.orderCounter.toString().padStart(4, '0')}`
    
    // Calcular tiempo estimado
    const baseTime = parseInt(restaurant.deliveryTime) || 30
    const estimatedDelivery = `${baseTime + 10}-${baseTime + 25} min`
    
    // Crear pedido
    this.currentOrder = {
      id: orderId,
      restaurant,
      items: [...items],
      state: "pending",
      total: total.getValue(),
      createdAt: new Date(),
      estimatedDelivery,
      deliveryAddress: address.getValue()
    }
    
    this.stateLog = [{ state: "pending", timestamp: new Date() }]
    
    return this.currentOrder
  }
  
  transitionState(newState: OrderStateType): boolean {
    if (!this.currentOrder) return false
    
    const allowedTransitions = STATE_TRANSITIONS[this.currentOrder.state]
    if (!allowedTransitions.includes(newState)) {
      console.error(`Transición no permitida: ${this.currentOrder.state} -> ${newState}`)
      return false
    }
    
    this.currentOrder = { ...this.currentOrder, state: newState }
    this.stateLog.push({ state: newState, timestamp: new Date() })
    
    // Si es estado terminal, agregar al historial
    if (newState === "delivered" || newState === "cancelled") {
      this.orderHistory.push(this.currentOrder)
    }
    
    return true
  }
  
  advanceState(): boolean {
    if (!this.currentOrder) return false
    
    const currentIndex = Object.keys(STATE_TRANSITIONS).indexOf(this.currentOrder.state)
    const allowedTransitions = STATE_TRANSITIONS[this.currentOrder.state]
    
    // Buscar el siguiente estado no-cancelado
    const nextState = allowedTransitions.find(s => s !== "cancelled")
    if (!nextState) return false
    
    return this.transitionState(nextState)
  }
  
  cancelOrder(): boolean {
    return this.transitionState("cancelled")
  }
  
  getCurrentOrder(): OrderEntity | null {
    return this.currentOrder
  }
  
  getStateLog(): { state: OrderStateType; timestamp: Date }[] {
    return [...this.stateLog]
  }
  
  getOrderHistory(): OrderEntity[] {
    return [...this.orderHistory]
  }
  
  getCurrentStateInfo(): OrderStateInfo | null {
    if (!this.currentOrder) return null
    
    const config = ORDER_STATE_CONFIG[this.currentOrder.state]
    return {
      name: this.currentOrder.state,
      ...config
    }
  }
  
  getOrderSummary(): OrderSummaryDTO | null {
    if (!this.currentOrder) return null
    
    const stateConfig = ORDER_STATE_CONFIG[this.currentOrder.state]
    
    return {
      orderId: this.currentOrder.id,
      restaurantName: this.currentOrder.restaurant.name,
      itemCount: this.currentOrder.items.reduce((sum, i) => sum + i.quantity, 0),
      total: Money.fromNumber(this.currentOrder.total).format(),
      state: this.currentOrder.state,
      stateDisplayName: stateConfig.displayName,
      estimatedDelivery: this.currentOrder.estimatedDelivery
    }
  }
  
  reset(): void {
    this.currentOrder = null
    this.stateLog = []
  }
}

// ============================================
// SERVICIO DE RESTAURANTES (Restaurant Service)
// ============================================

export class RestaurantService {
  constructor(private restaurants: RestaurantEntity[]) {}
  
  getAll(): RestaurantEntity[] {
    return [...this.restaurants]
  }
  
  findById(id: string): RestaurantEntity | undefined {
    return this.restaurants.find(r => r.id === id)
  }
  
  findByCuisine(cuisine: string): RestaurantEntity[] {
    return this.restaurants.filter(
      r => r.cuisine.toLowerCase() === cuisine.toLowerCase()
    )
  }
  
  searchByName(query: string): RestaurantEntity[] {
    const lowerQuery = query.toLowerCase()
    return this.restaurants.filter(
      r => r.name.toLowerCase().includes(lowerQuery)
    )
  }
  
  getTopRated(limit: number = 5): RestaurantEntity[] {
    return [...this.restaurants]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }
  
  getFastestDelivery(limit: number = 5): RestaurantEntity[] {
    return [...this.restaurants]
      .sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime))
      .slice(0, limit)
  }
}

// ============================================
// COORDINADOR DE APLICACIÓN (Application Coordinator)
// ============================================
// Coordina todos los servicios de la capa de aplicación

export class ApplicationCoordinator {
  readonly cartService: CartService
  readonly orderService: OrderService
  readonly restaurantService: RestaurantService
  
  constructor(restaurants: RestaurantEntity[]) {
    this.cartService = new CartService()
    this.orderService = new OrderService()
    this.restaurantService = new RestaurantService(restaurants)
  }
  
  // Flujo completo de checkout
  checkout(deliveryAddress: string): OrderEntity | null {
    const restaurant = this.cartService.getSelectedRestaurant()
    if (!restaurant) {
      console.error("No hay restaurante seleccionado")
      return null
    }
    
    const items = this.cartService.getItems()
    const order = this.orderService.createOrder(restaurant, items, deliveryAddress)
    
    if (order) {
      this.cartService.clear()
    }
    
    return order
  }
  
  // Reset completo
  resetAll(): void {
    this.cartService.clear()
    this.orderService.reset()
  }
}
