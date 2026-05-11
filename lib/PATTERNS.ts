// ============================================
// DOCUMENTACIÓN DE PATRONES DE DISEÑO
// ============================================
// Este archivo documenta los patrones implementados en el proyecto

/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║                    PATRONES DE DISEÑO                              ║
 * ║                    UberEats Clone App                              ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * Este proyecto implementa los siguientes patrones de diseño:
 * 
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ 1. PATRÓN DE COMPORTAMIENTO: ESTADO (State Pattern)                │
 * │    Ubicación: lib/order-state.ts                                   │
 * │    Hook: hooks/use-order.ts                                        │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ Descripción:                                                        │
 * │ Permite que un objeto cambie su comportamiento cuando cambia su    │
 * │ estado interno. Implementado para el ciclo de vida del pedido:     │
 * │                                                                     │
 * │ Pendiente → Confirmado → Preparando → Listo → En Camino → Entregado│
 * │                                                                     │
 * │ Componentes:                                                        │
 * │ - OrderState (interfaz): Define operaciones comunes                │
 * │ - Estados concretos: PendingState, ConfirmedState, etc.           │
 * │ - createState(): Fábrica de estados                                │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ 2. PATRÓN CREACIONAL: FACTORY METHOD                               │
 * │    Ubicación: lib/patterns/factory/menu-item-factory.ts           │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ Descripción:                                                        │
 * │ Define una interfaz para crear objetos, pero deja que las         │
 * │ subclases decidan qué clase instanciar.                           │
 * │                                                                     │
 * │ Tipos de productos:                                                 │
 * │ - FoodItem: Comida principal                                       │
 * │ - DrinkItem: Bebidas (con tamaño y tipo)                          │
 * │ - DessertItem: Postres                                             │
 * │ - ComboItem: Combos con descuento                                  │
 * │ - AppetizerItem: Aperitivos                                        │
 * │                                                                     │
 * │ Uso:                                                                │
 * │ const food = createMenuItem("food", { ... })                       │
 * │ const drink = createMenuItem("drink", { sizeML: 500 })            │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ 3. PATRÓN ESTRUCTURAL: FACADE                                      │
 * │    Ubicación: lib/patterns/facade/order-facade.ts                 │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ Descripción:                                                        │
 * │ Proporciona una interfaz unificada a un conjunto de subsistemas,  │
 * │ haciéndolos más fáciles de usar.                                  │
 * │                                                                     │
 * │ Subsistemas encapsulados:                                          │
 * │ - CartManager: Gestión del carrito                                 │
 * │ - PriceCalculator: Cálculo de precios                             │
 * │ - OrderValidator: Validación de pedidos                           │
 * │ - OrderStateManager: Gestión de estados                           │
 * │ - OrderGenerator: Creación de pedidos                             │
 * │                                                                     │
 * │ Uso:                                                                │
 * │ const facade = new OrderFacade()                                   │
 * │ facade.addToCart(item)                                             │
 * │ facade.checkout(address)                                           │
 * │ facade.advanceOrderState()                                         │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ 4. PATRÓN DE ARQUITECTURA: CAPAS (Layered Architecture)           │
 * │    Ubicación: lib/layers/                                          │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ Descripción:                                                        │
 * │ Organiza el código en capas con responsabilidades específicas,    │
 * │ donde cada capa solo depende de las capas inferiores.             │
 * │                                                                     │
 * │ Estructura:                                                         │
 * │                                                                     │
 * │ ┌─────────────────────────────────────────────────┐                │
 * │ │           CAPA DE PRESENTACIÓN                   │                │
 * │ │   lib/layers/presentation/hooks.ts              │                │
 * │ │   - useCartLayer, useOrderLayer                 │                │
 * │ │   - useApplicationLayer (coordinador)           │                │
 * │ └───────────────────┬─────────────────────────────┘                │
 * │                     │                                               │
 * │ ┌───────────────────▼─────────────────────────────┐                │
 * │ │           CAPA DE APLICACIÓN                     │                │
 * │ │   lib/layers/application/services.ts            │                │
 * │ │   - CartService, OrderService                   │                │
 * │ │   - RestaurantService                           │                │
 * │ │   - ApplicationCoordinator                      │                │
 * │ └───────────────────┬─────────────────────────────┘                │
 * │                     │                                               │
 * │ ┌───────────────────▼─────────────────────────────┐                │
 * │ │           CAPA DE DOMINIO                        │                │
 * │ │   lib/layers/domain/entities.ts                 │                │
 * │ │   - Entidades: Order, Cart, Restaurant          │                │
 * │ │   - Objetos de Valor: Money, DeliveryAddress    │                │
 * │ │   - Reglas de transición de estados             │                │
 * │ └───────────────────┬─────────────────────────────┘                │
 * │                     │                                               │
 * │ ┌───────────────────▼─────────────────────────────┐                │
 * │ │         CAPA DE INFRAESTRUCTURA                  │                │
 * │ │   lib/layers/infrastructure/repositories.ts     │                │
 * │ │   - InMemoryOrderRepository                     │                │
 * │ │   - LocalStorageRepository                      │                │
 * │ │   - Adaptadores de pago y notificaciones       │                │
 * │ └─────────────────────────────────────────────────┘                │
 * │                                                                     │
 * └─────────────────────────────────────────────────────────────────────┘
 * 
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║                         USO RECOMENDADO                            ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 * 
 * // Importar desde los índices
 * import { createMenuItem, OrderFacade } from "@/lib/patterns"
 * import { useApplicationLayer, Money } from "@/lib/layers"
 * import { createState } from "@/lib/order-state"
 * 
 * // Usando Factory Method
 * const hamburger = createMenuItem("food", {
 *   id: "item-1",
 *   name: "Hamburguesa",
 *   description: "Deliciosa hamburguesa",
 *   price: 150,
 *   image: "/burger.jpg",
 *   category: "Burgers",
 *   calories: 650
 * })
 * 
 * // Usando Facade
 * const facade = new OrderFacade()
 * facade.selectRestaurant(restaurant)
 * facade.addToCart(item)
 * const order = facade.checkout("Mi dirección")
 * facade.advanceOrderState()
 * 
 * // Usando Arquitectura en Capas (en componentes React)
 * function MyComponent() {
 *   const {
 *     cartItems,
 *     addToCart,
 *     checkout,
 *     currentOrder
 *   } = useApplicationLayer(restaurants)
 *   
 *   // ...
 * }
 * 
 * // Usando Patrón Estado
 * const state = createState("preparing")
 * console.log(state.displayName)     // "Preparando"
 * console.log(state.canMarkReady())  // true
 * console.log(state.canCancel())     // false
 */

// Este archivo es solo documentación, no exporta nada
export {}
