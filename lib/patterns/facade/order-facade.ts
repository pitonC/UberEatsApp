// ============================================
// PATRÓN ESTRUCTURAL: FACADE
// ============================================
// El patrón Facade proporciona una interfaz unificada a un conjunto
// de interfaces en un subsistema. Facade define una interfaz de alto
// nivel que hace que el subsistema sea más fácil de usar.

import { 
  Order, 
  OrderStateType, 
  CartItem, 
  Restaurant,
  createState 
} from "@/lib/order-state"

// ============================================
// SUBSISTEMAS (Subsystems)
// ============================================
// Clases complejas que el Facade simplificará

// Subsistema 1: Gestión del Carrito
class CartManager {
  private items: CartItem[] = []
  
  addItem(item: CartItem): void {
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
    const item = this.items.find(i => i.id === itemId)
    if (item) {
      if (quantity <= 0) {
        this.items = this.items.filter(i => i.id !== itemId)
      } else {
        item.quantity = quantity
      }
    }
  }
  
  getItems(): CartItem[] {
    return [...this.items]
  }
  
  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0)
  }
  
  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
  
  clear(): void {
    this.items = []
  }
  
  isEmpty(): boolean {
    return this.items.length === 0
  }
}

// Subsistema 2: Calculador de Precios
class PriceCalculator {
  calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
  
  calculateDeliveryFee(restaurant: Restaurant | null): number {
    return restaurant?.deliveryFee || 0
  }
  
  calculateTax(subtotal: number, taxRate: number = 0.16): number {
    return subtotal * taxRate
  }
  
  calculateDiscount(subtotal: number, discountPercentage: number): number {
    return subtotal * (discountPercentage / 100)
  }
  
  calculateTotal(
    items: CartItem[],
    restaurant: Restaurant | null,
    discountPercentage: number = 0,
    includeTax: boolean = false
  ): number {
    const subtotal = this.calculateSubtotal(items)
    const deliveryFee = this.calculateDeliveryFee(restaurant)
    const discount = this.calculateDiscount(subtotal, discountPercentage)
    const tax = includeTax ? this.calculateTax(subtotal - discount) : 0
    
    return subtotal + deliveryFee - discount + tax
  }
  
  formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`
  }
}

// Subsistema 3: Validador de Pedidos
class OrderValidator {
  validateCart(items: CartItem[]): ValidationResult {
    const errors: string[] = []
    
    if (items.length === 0) {
      errors.push("El carrito está vacío")
    }
    
    items.forEach(item => {
      if (item.quantity <= 0) {
        errors.push(`Cantidad inválida para ${item.name}`)
      }
      if (item.price <= 0) {
        errors.push(`Precio inválido para ${item.name}`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  validateRestaurant(restaurant: Restaurant | null): ValidationResult {
    const errors: string[] = []
    
    if (!restaurant) {
      errors.push("No se ha seleccionado un restaurante")
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  validateDeliveryAddress(address: string): ValidationResult {
    const errors: string[] = []
    
    if (!address || address.trim().length < 10) {
      errors.push("La dirección de entrega es muy corta o inválida")
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  validateOrder(
    items: CartItem[],
    restaurant: Restaurant | null,
    address: string
  ): ValidationResult {
    const cartValidation = this.validateCart(items)
    const restaurantValidation = this.validateRestaurant(restaurant)
    const addressValidation = this.validateDeliveryAddress(address)
    
    const allErrors = [
      ...cartValidation.errors,
      ...restaurantValidation.errors,
      ...addressValidation.errors
    ]
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    }
  }
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Subsistema 4: Gestor de Estado del Pedido
class OrderStateManager {
  canTransition(currentState: OrderStateType, newState: OrderStateType): boolean {
    const state = createState(currentState)
    
    switch (newState) {
      case "confirmed": return state.canConfirm()
      case "preparing": return state.canPrepare()
      case "ready": return state.canMarkReady()
      case "delivering": return state.canStartDelivery()
      case "delivered": return state.canDeliver()
      case "cancelled": return state.canCancel()
      default: return false
    }
  }
  
  getNextState(currentState: OrderStateType): OrderStateType | null {
    const state = createState(currentState)
    const nextAction = state.getNextAction()
    return nextAction?.nextState || null
  }
  
  getStateInfo(stateType: OrderStateType) {
    return createState(stateType)
  }
  
  isTerminalState(stateType: OrderStateType): boolean {
    return stateType === "delivered" || stateType === "cancelled"
  }
}

// Subsistema 5: Generador de Pedidos
class OrderGenerator {
  private orderCounter = 0
  
  generateOrderId(): string {
    this.orderCounter++
    return `ORD-${Date.now()}-${this.orderCounter.toString().padStart(4, '0')}`
  }
  
  generateEstimatedDelivery(restaurant: Restaurant): string {
    const baseTime = parseInt(restaurant.deliveryTime) || 30
    const minTime = baseTime + 10
    const maxTime = baseTime + 25
    return `${minTime}-${maxTime} min`
  }
  
  createOrder(
    restaurant: Restaurant,
    items: CartItem[],
    total: number,
    deliveryAddress: string
  ): Order {
    return {
      id: this.generateOrderId(),
      restaurant,
      items: [...items],
      state: "pending",
      total,
      createdAt: new Date(),
      estimatedDelivery: this.generateEstimatedDelivery(restaurant),
      deliveryAddress
    }
  }
}

// ============================================
// FACADE (Fachada)
// ============================================
// Proporciona una interfaz simplificada para todo el sistema de pedidos

export class OrderFacade {
  private cartManager: CartManager
  private priceCalculator: PriceCalculator
  private orderValidator: OrderValidator
  private stateManager: OrderStateManager
  private orderGenerator: OrderGenerator
  
  private currentRestaurant: Restaurant | null = null
  private currentOrder: Order | null = null
  private orderHistory: Order[] = []
  private stateLog: { state: OrderStateType; timestamp: Date }[] = []
  
  constructor() {
    // 2-facade. Inicializar todos los subsistemas
    this.cartManager = new CartManager()
    this.priceCalculator = new PriceCalculator()
    this.orderValidator = new OrderValidator()
    this.stateManager = new OrderStateManager()
    this.orderGenerator = new OrderGenerator()
  }
  
  // ============================================
  // MÉTODOS SIMPLIFICADOS (Simplified Interface)
  // ============================================
  
  // Gestión del Restaurante
  selectRestaurant(restaurant: Restaurant): void {
    if (this.currentRestaurant?.id !== restaurant.id) {
      this.cartManager.clear()
    }
    this.currentRestaurant = restaurant
  }
  
  getSelectedRestaurant(): Restaurant | null {
    return this.currentRestaurant
  }
  
  // Gestión del Carrito (delegado al subsistema)
  addToCart(item: CartItem): void {
    this.cartManager.addItem(item)
  }
  
  removeFromCart(itemId: string): void {
    this.cartManager.removeItem(itemId)
  }
  
  updateCartItemQuantity(itemId: string, quantity: number): void {
    this.cartManager.updateQuantity(itemId, quantity)
  }
  
  getCartItems(): CartItem[] {
    return this.cartManager.getItems()
  }
  
  getCartItemCount(): number {
    return this.cartManager.getItemCount()
  }
  
  isCartEmpty(): boolean {
    return this.cartManager.isEmpty()
  }
  
  clearCart(): void {
    this.cartManager.clear()
  }
  
  // Cálculo de Precios
  getSubtotal(): number {
    return this.priceCalculator.calculateSubtotal(this.cartManager.getItems())
  }
  
  getDeliveryFee(): number {
    return this.priceCalculator.calculateDeliveryFee(this.currentRestaurant)
  }
  
  getTotal(discountPercentage: number = 0): number {
    return this.priceCalculator.calculateTotal(
      this.cartManager.getItems(),
      this.currentRestaurant,
      discountPercentage
    )
  }
  
  formatPrice(amount: number): string {
    return this.priceCalculator.formatPrice(amount)
  }
  
  // Validación
  validateCheckout(deliveryAddress: string): ValidationResult {
    return this.orderValidator.validateOrder(
      this.cartManager.getItems(),
      this.currentRestaurant,
      deliveryAddress
    )
  }
  
  // Creación de Pedido
  checkout(deliveryAddress: string): Order | null {
    const validation = this.validateCheckout(deliveryAddress)
    
    if (!validation.isValid) {
      console.error("Validación fallida:", validation.errors)
      return null
    }
    
    if (!this.currentRestaurant) return null
    
    const total = this.getTotal()
    this.currentOrder = this.orderGenerator.createOrder(
      this.currentRestaurant,
      this.cartManager.getItems(),
      total,
      deliveryAddress
    )
    
    this.stateLog = [{ state: "pending", timestamp: new Date() }]
    this.cartManager.clear()
    
    return this.currentOrder
  }
  
  // Gestión de Estado del Pedido
  advanceOrderState(): boolean {
    if (!this.currentOrder) return false
    
    const nextState = this.stateManager.getNextState(this.currentOrder.state)
    if (!nextState) return false
    
    return this.transitionOrderState(nextState)
  }
  
  transitionOrderState(newState: OrderStateType): boolean {
    if (!this.currentOrder) return false
    
    if (!this.stateManager.canTransition(this.currentOrder.state, newState)) {
      return false
    }
    
    this.currentOrder = { ...this.currentOrder, state: newState }
    this.stateLog.push({ state: newState, timestamp: new Date() })
    
    if (this.stateManager.isTerminalState(newState)) {
      this.orderHistory.push(this.currentOrder)
    }
    
    return true
  }
  
  cancelOrder(): boolean {
    return this.transitionOrderState("cancelled")
  }
  
  // Getters del Pedido
  getCurrentOrder(): Order | null {
    return this.currentOrder
  }
  
  getOrderStateLog(): { state: OrderStateType; timestamp: Date }[] {
    return [...this.stateLog]
  }
  
  getOrderHistory(): Order[] {
    return [...this.orderHistory]
  }
  
  getCurrentOrderState() {
    if (!this.currentOrder) return null
    return this.stateManager.getStateInfo(this.currentOrder.state)
  }
  
  // Reset
  reset(): void {
    this.currentOrder = null
    this.stateLog = []
  }
  
  resetAll(): void {
    this.reset()
    this.cartManager.clear()
    this.currentRestaurant = null
  }
}

// ============================================
// INSTANCIA SINGLETON (Opcional)
// ============================================
// Para uso global si es necesario

let facadeInstance: OrderFacade | null = null

export function getOrderFacade(): OrderFacade {
  if (!facadeInstance) {
    facadeInstance = new OrderFacade()
  }
  return facadeInstance
}

export function resetOrderFacade(): void {
  facadeInstance = null
}

// Exportar tipos útiles
export type { ValidationResult }
