// ============================================
// PATRÓN DE DISEÑO ESTADO (STATE PATTERN)
// ============================================
// El patrón Estado permite que un objeto altere su comportamiento
// cuando su estado interno cambia. El objeto parecerá cambiar de clase.

import { LucideIcon, Clock, CheckCircle, ChefHat, Package, Truck, Home, XCircle } from "lucide-react"

// Tipo de estado del pedido
export type OrderStateType = 
  | "pending"      // Pendiente de confirmación
  | "confirmed"    // Confirmado por el restaurante
  | "preparing"    // En preparación
  | "ready"        // Listo para recoger
  | "delivering"   // En camino
  | "delivered"    // Entregado
  | "cancelled"    // Cancelado

// Interfaz del Estado (State Interface)
// Define las operaciones que todos los estados concretos deben implementar
export interface OrderState {
  // Nombre del estado
  readonly name: OrderStateType
  // Descripción para mostrar al usuario
  readonly displayName: string
  // Descripción del estado
  readonly description: string
  // Color CSS del estado
  readonly color: string
  // Icono del estado
  readonly icon: LucideIcon
  // Progreso del pedido (0-100)
  readonly progress: number
  
  // Transiciones de estado
  canConfirm(): boolean
  canPrepare(): boolean
  canMarkReady(): boolean
  canStartDelivery(): boolean
  canDeliver(): boolean
  canCancel(): boolean
  
  // Acción siguiente disponible
  getNextAction(): { label: string; nextState: OrderStateType } | null
}

// ============================================
// ESTADOS CONCRETOS (Concrete States)
// ============================================

// Estado: Pendiente
class PendingState implements OrderState {
  readonly name: OrderStateType = "pending"
  readonly displayName = "Pendiente"
  readonly description = "Esperando confirmación del restaurante"
  readonly color = "var(--state-pending)"
  readonly icon = Clock
  readonly progress = 10
  
  canConfirm() { return true }
  canPrepare() { return false }
  canMarkReady() { return false }
  canStartDelivery() { return false }
  canDeliver() { return false }
  canCancel() { return true }
  
  getNextAction() {
    return { label: "Confirmar Pedido", nextState: "confirmed" as OrderStateType }
  }
}

// Estado: Confirmado
class ConfirmedState implements OrderState {
  readonly name: OrderStateType = "confirmed"
  readonly displayName = "Confirmado"
  readonly description = "El restaurante ha aceptado tu pedido"
  readonly color = "var(--state-confirmed)"
  readonly icon = CheckCircle
  readonly progress = 25
  
  canConfirm() { return false }
  canPrepare() { return true }
  canMarkReady() { return false }
  canStartDelivery() { return false }
  canDeliver() { return false }
  canCancel() { return true }
  
  getNextAction() {
    return { label: "Comenzar Preparación", nextState: "preparing" as OrderStateType }
  }
}

// Estado: Preparando
class PreparingState implements OrderState {
  readonly name: OrderStateType = "preparing"
  readonly displayName = "Preparando"
  readonly description = "Tu pedido está siendo preparado"
  readonly color = "var(--state-preparing)"
  readonly icon = ChefHat
  readonly progress = 50
  
  canConfirm() { return false }
  canPrepare() { return false }
  canMarkReady() { return true }
  canStartDelivery() { return false }
  canDeliver() { return false }
  canCancel() { return false }
  
  getNextAction() {
    return { label: "Marcar como Listo", nextState: "ready" as OrderStateType }
  }
}

// Estado: Listo
class ReadyState implements OrderState {
  readonly name: OrderStateType = "ready"
  readonly displayName = "Listo"
  readonly description = "Tu pedido está listo para ser recogido"
  readonly color = "var(--state-ready)"
  readonly icon = Package
  readonly progress = 70
  
  canConfirm() { return false }
  canPrepare() { return false }
  canMarkReady() { return false }
  canStartDelivery() { return true }
  canDeliver() { return false }
  canCancel() { return false }
  
  getNextAction() {
    return { label: "Iniciar Entrega", nextState: "delivering" as OrderStateType }
  }
}

// Estado: En Camino
class DeliveringState implements OrderState {
  readonly name: OrderStateType = "delivering"
  readonly displayName = "En Camino"
  readonly description = "Tu pedido va en camino"
  readonly color = "var(--state-delivering)"
  readonly icon = Truck
  readonly progress = 85
  
  canConfirm() { return false }
  canPrepare() { return false }
  canMarkReady() { return false }
  canStartDelivery() { return false }
  canDeliver() { return true }
  canCancel() { return false }
  
  getNextAction() {
    return { label: "Confirmar Entrega", nextState: "delivered" as OrderStateType }
  }
}

// Estado: Entregado
class DeliveredState implements OrderState {
  readonly name: OrderStateType = "delivered"
  readonly displayName = "Entregado"
  readonly description = "¡Tu pedido ha sido entregado!"
  readonly color = "var(--state-delivered)"
  readonly icon = Home
  readonly progress = 100
  
  canConfirm() { return false }
  canPrepare() { return false }
  canMarkReady() { return false }
  canStartDelivery() { return false }
  canDeliver() { return false }
  canCancel() { return false }
  
  getNextAction() { return null }
}

// Estado: Cancelado
class CancelledState implements OrderState {
  readonly name: OrderStateType = "cancelled"
  readonly displayName = "Cancelado"
  readonly description = "El pedido ha sido cancelado"
  readonly color = "var(--state-cancelled)"
  readonly icon = XCircle
  readonly progress = 0
  
  canConfirm() { return false }
  canPrepare() { return false }
  canMarkReady() { return false }
  canStartDelivery() { return false }
  canDeliver() { return false }
  canCancel() { return false }
  
  getNextAction() { return null }
}

// ============================================
// CONTEXTO (Context)
// ============================================
// El Contexto mantiene una referencia al estado actual y delega
// las operaciones relacionadas con el estado al objeto de estado actual.

// Fábrica de estados
export function createState(stateType: OrderStateType): OrderState {
  switch (stateType) {
    case "pending": return new PendingState()
    case "confirmed": return new ConfirmedState()
    case "preparing": return new PreparingState()
    case "ready": return new ReadyState()
    case "delivering": return new DeliveringState()
    case "delivered": return new DeliveredState()
    case "cancelled": return new CancelledState()
    default: return new PendingState()
  }
}

// Todos los estados disponibles en orden
export const ALL_STATES: OrderStateType[] = [
  "pending",
  "confirmed", 
  "preparing",
  "ready",
  "delivering",
  "delivered"
]

// Item del carrito
export interface CartItem {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
}

// Restaurante
export interface Restaurant {
  id: string
  name: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  cuisine: string
  menu: MenuItem[]
}

// Item del menú
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

// Pedido completo
export interface Order {
  id: string
  restaurant: Restaurant
  items: CartItem[]
  state: OrderStateType
  total: number
  createdAt: Date
  estimatedDelivery: string
  deliveryAddress: string
}
