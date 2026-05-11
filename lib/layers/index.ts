// ============================================
// ARQUITECTURA EN CAPAS - ÍNDICE PRINCIPAL
// ============================================
// Exporta todas las capas de la arquitectura

// --------------------------------------------
// CAPA DE DOMINIO (Domain Layer)
// --------------------------------------------
// Contiene entidades de negocio, objetos de valor y reglas de dominio
export {
  // Entidades
  type MenuItemEntity,
  type CartItemEntity,
  type RestaurantEntity,
  type OrderEntity,
  type OrderStateType,
  type OrderStateInfo,
  
  // Objetos de Valor
  Money,
  DeliveryAddress,
  
  // Configuración de estados
  ORDER_STATE_CONFIG,
  STATE_TRANSITIONS,
  STATE_SEQUENCE
} from "./domain/entities"

// --------------------------------------------
// CAPA DE APLICACIÓN (Application Layer)
// --------------------------------------------
// Contiene servicios de aplicación que orquestan la lógica de negocio
export {
  // Interfaces de repositorio
  type IOrderRepository,
  type IRestaurantRepository,
  
  // DTOs
  type CreateOrderDTO,
  type OrderSummaryDTO,
  type CartSummaryDTO,
  
  // Servicios
  CartService,
  OrderService,
  RestaurantService,
  ApplicationCoordinator
} from "./application/services"

// --------------------------------------------
// CAPA DE INFRAESTRUCTURA (Infrastructure Layer)
// --------------------------------------------
// Contiene implementaciones concretas y adaptadores externos
export {
  // Repositorios en memoria
  InMemoryOrderRepository,
  InMemoryRestaurantRepository,
  
  // Repositorio localStorage
  LocalStorageOrderRepository,
  
  // Adaptadores
  MockNotificationAdapter,
  MockPaymentAdapter,
  
  // Tipos
  type NotificationPayload,
  type INotificationAdapter,
  type PaymentResult,
  type IPaymentAdapter,
  type InfrastructureConfig,
  
  // Factories de configuración
  createDevelopmentInfrastructure,
  createLocalStorageInfrastructure
} from "./infrastructure/repositories"

// --------------------------------------------
// CAPA DE PRESENTACIÓN (Presentation Layer)
// --------------------------------------------
// Contiene hooks y lógica de UI
export {
  // Hooks individuales
  useCartLayer,
  useOrderLayer,
  useRestaurantLayer,
  
  // Hook coordinador
  useApplicationLayer,
  
  // Helpers
  getStateInfo
} from "./presentation/hooks"
