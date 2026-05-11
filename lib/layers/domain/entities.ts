// ============================================
// ARQUITECTURA EN CAPAS - CAPA DE DOMINIO
// ============================================
// La Capa de Dominio contiene las entidades de negocio y la lógica
// de dominio pura. No tiene dependencias de infraestructura.

import { LucideIcon, Clock, CheckCircle, ChefHat, Package, Truck, Home, XCircle } from "lucide-react"

// ============================================
// ENTIDADES DE DOMINIO (Domain Entities)
// ============================================

/**
 * Entidad: MenuItem
 * Representa un artículo del menú de un restaurante
 */
export interface MenuItemEntity {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly price: number
  readonly image: string
  readonly category: string
}

/**
 * Entidad: CartItem
 * Representa un artículo en el carrito de compras
 */
export interface CartItemEntity extends MenuItemEntity {
  quantity: number
}

/**
 * Entidad: Restaurant
 * Representa un restaurante en el sistema
 */
export interface RestaurantEntity {
  readonly id: string
  readonly name: string
  readonly image: string
  readonly rating: number
  readonly deliveryTime: string
  readonly deliveryFee: number
  readonly cuisine: string
  readonly menu: MenuItemEntity[]
}

/**
 * Tipos de estado del pedido
 */
export type OrderStateType = 
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled"

/**
 * Entidad: Order
 * Representa un pedido completo
 */
export interface OrderEntity {
  readonly id: string
  readonly restaurant: RestaurantEntity
  readonly items: CartItemEntity[]
  state: OrderStateType
  readonly total: number
  readonly createdAt: Date
  readonly estimatedDelivery: string
  readonly deliveryAddress: string
}

/**
 * Información del estado
 */
export interface OrderStateInfo {
  readonly name: OrderStateType
  readonly displayName: string
  readonly description: string
  readonly color: string
  readonly icon: LucideIcon
  readonly progress: number
}

// ============================================
// OBJETOS DE VALOR (Value Objects)
// ============================================

/**
 * Objeto de Valor: Money
 * Representa un valor monetario inmutable
 */
export class Money {
  private constructor(private readonly amount: number) {
    if (amount < 0) {
      throw new Error("El monto no puede ser negativo")
    }
  }
  
  static fromNumber(amount: number): Money {
    return new Money(amount)
  }
  
  static zero(): Money {
    return new Money(0)
  }
  
  getValue(): number {
    return this.amount
  }
  
  add(other: Money): Money {
    return new Money(this.amount + other.amount)
  }
  
  subtract(other: Money): Money {
    return new Money(Math.max(0, this.amount - other.amount))
  }
  
  multiply(factor: number): Money {
    return new Money(this.amount * factor)
  }
  
  format(): string {
    return `$${this.amount.toFixed(2)}`
  }
  
  equals(other: Money): boolean {
    return this.amount === other.amount
  }
}

/**
 * Objeto de Valor: DeliveryAddress
 * Representa una dirección de entrega validada
 */
export class DeliveryAddress {
  private constructor(private readonly address: string) {}
  
  static create(address: string): DeliveryAddress | null {
    if (!address || address.trim().length < 10) {
      return null
    }
    return new DeliveryAddress(address.trim())
  }
  
  getValue(): string {
    return this.address
  }
  
  equals(other: DeliveryAddress): boolean {
    return this.address === other.address
  }
}

// ============================================
// CONFIGURACIÓN DE ESTADOS (State Config)
// ============================================

export const ORDER_STATE_CONFIG: Record<OrderStateType, Omit<OrderStateInfo, 'name'>> = {
  pending: {
    displayName: "Pendiente",
    description: "Esperando confirmación del restaurante",
    color: "var(--state-pending)",
    icon: Clock,
    progress: 10
  },
  confirmed: {
    displayName: "Confirmado",
    description: "El restaurante ha aceptado tu pedido",
    color: "var(--state-confirmed)",
    icon: CheckCircle,
    progress: 25
  },
  preparing: {
    displayName: "Preparando",
    description: "Tu pedido está siendo preparado",
    color: "var(--state-preparing)",
    icon: ChefHat,
    progress: 50
  },
  ready: {
    displayName: "Listo",
    description: "Tu pedido está listo para ser recogido",
    color: "var(--state-ready)",
    icon: Package,
    progress: 70
  },
  delivering: {
    displayName: "En Camino",
    description: "Tu pedido va en camino",
    color: "var(--state-delivering)",
    icon: Truck,
    progress: 85
  },
  delivered: {
    displayName: "Entregado",
    description: "¡Tu pedido ha sido entregado!",
    color: "var(--state-delivered)",
    icon: Home,
    progress: 100
  },
  cancelled: {
    displayName: "Cancelado",
    description: "El pedido ha sido cancelado",
    color: "var(--state-cancelled)",
    icon: XCircle,
    progress: 0
  }
}

// ============================================
// REGLAS DE TRANSICIÓN (Transition Rules)
// ============================================

export const STATE_TRANSITIONS: Record<OrderStateType, OrderStateType[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready"],
  ready: ["delivering"],
  delivering: ["delivered"],
  delivered: [],
  cancelled: []
}

export const STATE_SEQUENCE: OrderStateType[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "delivering",
  "delivered"
]
