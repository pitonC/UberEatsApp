// ============================================
// ARQUITECTURA EN CAPAS - CAPA DE INFRAESTRUCTURA
// ============================================
// La Capa de Infraestructura contiene implementaciones concretas
// de los repositorios y adaptadores para sistemas externos.
// Maneja persistencia, APIs externas, etc.

import {
  OrderEntity,
  RestaurantEntity,
  OrderStateType
} from "../domain/entities"
import {
  IOrderRepository,
  IRestaurantRepository
} from "../application/services"

// ============================================
// REPOSITORIO EN MEMORIA (In-Memory Repository)
// ============================================
// Implementación para desarrollo y pruebas

export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Map<string, OrderEntity> = new Map()
  
  async save(order: OrderEntity): Promise<void> {
    this.orders.set(order.id, { ...order })
  }
  
  async findById(id: string): Promise<OrderEntity | null> {
    const order = this.orders.get(id)
    return order ? { ...order } : null
  }
  
  async findAll(): Promise<OrderEntity[]> {
    return Array.from(this.orders.values()).map(o => ({ ...o }))
  }
  
  async update(order: OrderEntity): Promise<void> {
    if (!this.orders.has(order.id)) {
      throw new Error(`Pedido no encontrado: ${order.id}`)
    }
    this.orders.set(order.id, { ...order })
  }
  
  // Métodos adicionales para el repositorio en memoria
  async findByState(state: OrderStateType): Promise<OrderEntity[]> {
    return Array.from(this.orders.values())
      .filter(o => o.state === state)
      .map(o => ({ ...o }))
  }
  
  async delete(id: string): Promise<void> {
    this.orders.delete(id)
  }
  
  clear(): void {
    this.orders.clear()
  }
}

export class InMemoryRestaurantRepository implements IRestaurantRepository {
  private restaurants: RestaurantEntity[] = []
  
  constructor(initialData: RestaurantEntity[] = []) {
    this.restaurants = initialData.map(r => ({ ...r }))
  }
  
  async findById(id: string): Promise<RestaurantEntity | null> {
    const restaurant = this.restaurants.find(r => r.id === id)
    return restaurant ? { ...restaurant } : null
  }
  
  async findAll(): Promise<RestaurantEntity[]> {
    return this.restaurants.map(r => ({ ...r }))
  }
  
  async findByCuisine(cuisine: string): Promise<RestaurantEntity[]> {
    return this.restaurants
      .filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase())
      .map(r => ({ ...r }))
  }
  
  // Métodos adicionales
  async findByRating(minRating: number): Promise<RestaurantEntity[]> {
    return this.restaurants
      .filter(r => r.rating >= minRating)
      .map(r => ({ ...r }))
  }
  
  async search(query: string): Promise<RestaurantEntity[]> {
    const lowerQuery = query.toLowerCase()
    return this.restaurants
      .filter(r => 
        r.name.toLowerCase().includes(lowerQuery) ||
        r.cuisine.toLowerCase().includes(lowerQuery)
      )
      .map(r => ({ ...r }))
  }
}

// ============================================
// REPOSITORIO LOCAL STORAGE (Browser Storage)
// ============================================
// Implementación para persistencia en el navegador

export class LocalStorageOrderRepository implements IOrderRepository {
  private readonly STORAGE_KEY = "uber_eats_orders"
  
  private getStoredOrders(): OrderEntity[] {
    if (typeof window === "undefined") return []
    
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return []
    
    try {
      const orders = JSON.parse(stored)
      return orders.map((o: OrderEntity) => ({
        ...o,
        createdAt: new Date(o.createdAt)
      }))
    } catch {
      return []
    }
  }
  
  private saveOrders(orders: OrderEntity[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders))
  }
  
  async save(order: OrderEntity): Promise<void> {
    const orders = this.getStoredOrders()
    const existingIndex = orders.findIndex(o => o.id === order.id)
    
    if (existingIndex >= 0) {
      orders[existingIndex] = order
    } else {
      orders.push(order)
    }
    
    this.saveOrders(orders)
  }
  
  async findById(id: string): Promise<OrderEntity | null> {
    const orders = this.getStoredOrders()
    return orders.find(o => o.id === id) || null
  }
  
  async findAll(): Promise<OrderEntity[]> {
    return this.getStoredOrders()
  }
  
  async update(order: OrderEntity): Promise<void> {
    await this.save(order)
  }
  
  clear(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.STORAGE_KEY)
  }
}

// ============================================
// ADAPTADORES DE API (API Adapters)
// ============================================
// Adaptadores para comunicación con servicios externos

export interface NotificationPayload {
  orderId: string
  state: OrderStateType
  message: string
  timestamp: Date
}

export interface INotificationAdapter {
  sendPushNotification(payload: NotificationPayload): Promise<boolean>
  sendEmail(email: string, payload: NotificationPayload): Promise<boolean>
  sendSMS(phone: string, payload: NotificationPayload): Promise<boolean>
}

// Adaptador de notificaciones mock (para desarrollo)
export class MockNotificationAdapter implements INotificationAdapter {
  async sendPushNotification(payload: NotificationPayload): Promise<boolean> {
    console.log("[Notification] Push:", payload)
    return true
  }
  
  async sendEmail(email: string, payload: NotificationPayload): Promise<boolean> {
    console.log("[Notification] Email to", email, ":", payload)
    return true
  }
  
  async sendSMS(phone: string, payload: NotificationPayload): Promise<boolean> {
    console.log("[Notification] SMS to", phone, ":", payload)
    return true
  }
}

// ============================================
// ADAPTADOR DE PAGOS (Payment Adapter)
// ============================================

export interface PaymentResult {
  success: boolean
  transactionId?: string
  errorMessage?: string
}

export interface IPaymentAdapter {
  processPayment(amount: number, paymentMethodId: string): Promise<PaymentResult>
  refund(transactionId: string, amount: number): Promise<PaymentResult>
}

// Adaptador de pagos mock
export class MockPaymentAdapter implements IPaymentAdapter {
  async processPayment(amount: number, paymentMethodId: string): Promise<PaymentResult> {
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log(`[Payment] Processing $${amount} with method ${paymentMethodId}`)
    
    return {
      success: true,
      transactionId: `TXN-${Date.now()}`
    }
  }
  
  async refund(transactionId: string, amount: number): Promise<PaymentResult> {
    console.log(`[Payment] Refunding $${amount} for transaction ${transactionId}`)
    
    return {
      success: true,
      transactionId: `REF-${Date.now()}`
    }
  }
}

// ============================================
// CONFIGURACIÓN DE INFRAESTRUCTURA
// ============================================

export interface InfrastructureConfig {
  orderRepository: IOrderRepository
  restaurantRepository: IRestaurantRepository
  notificationAdapter: INotificationAdapter
  paymentAdapter: IPaymentAdapter
}

// Factory para crear configuración por defecto (desarrollo)
export function createDevelopmentInfrastructure(
  restaurants: RestaurantEntity[]
): InfrastructureConfig {
  return {
    orderRepository: new InMemoryOrderRepository(),
    restaurantRepository: new InMemoryRestaurantRepository(restaurants),
    notificationAdapter: new MockNotificationAdapter(),
    paymentAdapter: new MockPaymentAdapter()
  }
}

// Factory para crear configuración con persistencia local
export function createLocalStorageInfrastructure(
  restaurants: RestaurantEntity[]
): InfrastructureConfig {
  return {
    orderRepository: new LocalStorageOrderRepository(),
    restaurantRepository: new InMemoryRestaurantRepository(restaurants),
    notificationAdapter: new MockNotificationAdapter(),
    paymentAdapter: new MockPaymentAdapter()
  }
}
