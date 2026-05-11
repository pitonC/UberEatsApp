// ============================================
// PATRÓN CREACIONAL: FACTORY METHOD
// ============================================
// El patrón Factory Method define una interfaz para crear objetos,
// pero permite a las subclases decidir qué clase instanciar.
// Factory Method permite que una clase delegue la instanciación a subclases.

import { MenuItem } from "@/lib/order-state"

// ============================================
// PRODUCTO ABSTRACTO (Abstract Product)
// ============================================
// Define la interfaz para los objetos que la factoría crea

export interface IMenuItem {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly price: number
  readonly image: string
  readonly category: string
  readonly type: MenuItemType
  
  // Métodos específicos del producto
  getDisplayPrice(): string
  getPreparationTime(): number
  isAvailable(): boolean
  getCalories(): number | null
}

// Tipos de items del menú
export type MenuItemType = 
  | "food"        // Comida principal
  | "drink"       // Bebidas
  | "dessert"     // Postres
  | "combo"       // Combos/Paquetes
  | "appetizer"   // Aperitivos

// ============================================
// PRODUCTOS CONCRETOS (Concrete Products)
// ============================================

// Producto: Comida Principal
class FoodItem implements IMenuItem {
  readonly type: MenuItemType = "food"
  
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly image: string,
    readonly category: string,
    private readonly calories: number = 500,
    private readonly preparationMinutes: number = 15
  ) {}
  
  getDisplayPrice(): string {
    return `$${this.price.toFixed(2)}`
  }
  
  getPreparationTime(): number {
    return this.preparationMinutes
  }
  
  isAvailable(): boolean {
    return true // Lógica de disponibilidad
  }
  
  getCalories(): number {
    return this.calories
  }
}

// Producto: Bebida
class DrinkItem implements IMenuItem {
  readonly type: MenuItemType = "drink"
  
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly image: string,
    readonly category: string,
    private readonly sizeML: number = 500,
    private readonly isAlcoholic: boolean = false
  ) {}
  
  getDisplayPrice(): string {
    return `$${this.price.toFixed(2)} (${this.sizeML}ml)`
  }
  
  getPreparationTime(): number {
    return 2 // Las bebidas son rápidas
  }
  
  isAvailable(): boolean {
    return true
  }
  
  getCalories(): number | null {
    return null // Las bebidas no muestran calorías por defecto
  }
  
  isAlcoholicBeverage(): boolean {
    return this.isAlcoholic
  }
}

// Producto: Postre
class DessertItem implements IMenuItem {
  readonly type: MenuItemType = "dessert"
  
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly image: string,
    readonly category: string,
    private readonly calories: number = 350
  ) {}
  
  getDisplayPrice(): string {
    return `$${this.price.toFixed(2)}`
  }
  
  getPreparationTime(): number {
    return 5
  }
  
  isAvailable(): boolean {
    return true
  }
  
  getCalories(): number {
    return this.calories
  }
}

// Producto: Combo
class ComboItem implements IMenuItem {
  readonly type: MenuItemType = "combo"
  
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly image: string,
    readonly category: string,
    private readonly originalPrice: number,
    private readonly itemsIncluded: string[]
  ) {}
  
  getDisplayPrice(): string {
    const savings = this.originalPrice - this.price
    return `$${this.price.toFixed(2)} (Ahorras $${savings.toFixed(2)})`
  }
  
  getPreparationTime(): number {
    return 20 // Los combos tardan más
  }
  
  isAvailable(): boolean {
    return true
  }
  
  getCalories(): number | null {
    return null // Los combos no muestran calorías individuales
  }
  
  getIncludedItems(): string[] {
    return this.itemsIncluded
  }
  
  getSavingsPercentage(): number {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
  }
}

// Producto: Aperitivo
class AppetizerItem implements IMenuItem {
  readonly type: MenuItemType = "appetizer"
  
  constructor(
    readonly id: string,
    readonly name: string,
    readonly description: string,
    readonly price: number,
    readonly image: string,
    readonly category: string,
    private readonly servings: number = 2
  ) {}
  
  getDisplayPrice(): string {
    return `$${this.price.toFixed(2)} (${this.servings} porciones)`
  }
  
  getPreparationTime(): number {
    return 10
  }
  
  isAvailable(): boolean {
    return true
  }
  
  getCalories(): number | null {
    return null
  }
  
  getServings(): number {
    return this.servings
  }
}

// ============================================
// CREADOR ABSTRACTO (Abstract Creator)
// ============================================
// Declara el factory method que retorna objetos de tipo IMenuItem

export abstract class MenuItemCreator {
  // Factory Method - debe ser implementado por subclases
  abstract createMenuItem(data: MenuItemData): IMenuItem
  
  // Operación que usa el factory method
  createAndValidate(data: MenuItemData): IMenuItem | null {
    const item = this.createMenuItem(data)
    
    if (this.validateItem(item)) {
      return item
    }
    
    return null
  }
  
  protected validateItem(item: IMenuItem): boolean {
    return item.price > 0 && item.name.length > 0
  }
}

// Datos para crear un item
export interface MenuItemData {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  // Campos opcionales específicos
  calories?: number
  preparationMinutes?: number
  sizeML?: number
  isAlcoholic?: boolean
  originalPrice?: number
  itemsIncluded?: string[]
  servings?: number
}

// ============================================
// CREADORES CONCRETOS (Concrete Creators)
// ============================================

class FoodItemCreator extends MenuItemCreator {
  createMenuItem(data: MenuItemData): IMenuItem {
    return new FoodItem(
      data.id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.category,
      data.calories,
      data.preparationMinutes
    )
  }
}

class DrinkItemCreator extends MenuItemCreator {
  createMenuItem(data: MenuItemData): IMenuItem {
    return new DrinkItem(
      data.id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.category,
      data.sizeML,
      data.isAlcoholic
    )
  }
}

class DessertItemCreator extends MenuItemCreator {
  createMenuItem(data: MenuItemData): IMenuItem {
    return new DessertItem(
      data.id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.category,
      data.calories
    )
  }
}

class ComboItemCreator extends MenuItemCreator {
  createMenuItem(data: MenuItemData): IMenuItem {
    return new ComboItem(
      data.id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.category,
      data.originalPrice || data.price * 1.2,
      data.itemsIncluded || []
    )
  }
}

class AppetizerItemCreator extends MenuItemCreator {
  createMenuItem(data: MenuItemData): IMenuItem {
    return new AppetizerItem(
      data.id,
      data.name,
      data.description,
      data.price,
      data.image,
      data.category,
      data.servings
    )
  }
}

// ============================================
// FÁBRICA DE FÁBRICAS (Factory Registry)
// ============================================
// Registra y proporciona acceso a los creadores concretos

class MenuItemFactoryRegistry {
  private static creators: Map<MenuItemType, MenuItemCreator> = new Map([
    ["food", new FoodItemCreator()],
    ["drink", new DrinkItemCreator()],
    ["dessert", new DessertItemCreator()],
    ["combo", new ComboItemCreator()],
    ["appetizer", new AppetizerItemCreator()]
  ])
  
  static getCreator(type: MenuItemType): MenuItemCreator {
    const creator = this.creators.get(type)
    if (!creator) {
      throw new Error(`No se encontró creador para el tipo: ${type}`)
    }
    return creator
  }
  
  static registerCreator(type: MenuItemType, creator: MenuItemCreator): void {
    this.creators.set(type, creator)
  }
}

// ============================================
// FUNCIÓN DE CONVENIENCIA (API Pública)
// ============================================

export function createMenuItem(type: MenuItemType, data: MenuItemData): IMenuItem {
  const creator = MenuItemFactoryRegistry.getCreator(type)
  return creator.createMenuItem(data)
}

export function createMenuItemValidated(type: MenuItemType, data: MenuItemData): IMenuItem | null {
  const creator = MenuItemFactoryRegistry.getCreator(type)
  return creator.createAndValidate(data)
}

// Convertir MenuItem simple a IMenuItem usando Factory
export function convertToEnhancedMenuItem(item: MenuItem, type: MenuItemType = "food"): IMenuItem {
  return createMenuItem(type, {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category
  })
}

// Exportar creadores para uso directo si es necesario
export {
  FoodItemCreator,
  DrinkItemCreator,
  DessertItemCreator,
  ComboItemCreator,
  AppetizerItemCreator,
  MenuItemFactoryRegistry
}
