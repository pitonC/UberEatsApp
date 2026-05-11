// ============================================
// ÍNDICE DE PATRONES DE DISEÑO
// ============================================
// Exporta todos los patrones implementados en el proyecto

// --------------------------------------------
// PATRÓN CREACIONAL: Factory Method
// --------------------------------------------
// Permite crear objetos sin especificar la clase exacta a crear.
// Usado para crear diferentes tipos de items del menú (comida, bebidas, postres, combos).
export {
  // Tipos
  type IMenuItem,
  type MenuItemType,
  type MenuItemData,
  
  // Creadores
  MenuItemCreator,
  FoodItemCreator,
  DrinkItemCreator,
  DessertItemCreator,
  ComboItemCreator,
  AppetizerItemCreator,
  MenuItemFactoryRegistry,
  
  // Funciones de conveniencia
  createMenuItem,
  createMenuItemValidated,
  convertToEnhancedMenuItem
} from "./factory/menu-item-factory"

// --------------------------------------------
// PATRÓN ESTRUCTURAL: Facade
// --------------------------------------------
// Proporciona una interfaz simplificada a un conjunto de subsistemas.
// Unifica la gestión de carrito, precios, validación y estados.
export {
  // Clase principal
  OrderFacade,
  
  // Funciones de instancia
  getOrderFacade,
  resetOrderFacade,
  
  // Tipos
  type ValidationResult
} from "./facade/order-facade"
