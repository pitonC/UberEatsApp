import { Restaurant } from "./order-state"

export const sampleRestaurants: Restaurant[] = [
  {
    id: "rest-1",
    name: "La Taquería Mexicana",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop",
    rating: 4.8,
    deliveryTime: "25-35",
    deliveryFee: 45,
    cuisine: "Mexicana",
    menu: [
      {
        id: "item-1",
        name: "Tacos al Pastor",
        description: "3 tacos con carne al pastor, piña, cebolla y cilantro",
        price: 89,
        image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&h=200&fit=crop",
        category: "Tacos"
      },
      {
        id: "item-2",
        name: "Burrito Supreme",
        description: "Burrito grande con carne, arroz, frijoles, guacamole y crema",
        price: 120,
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop",
        category: "Burritos"
      },
      {
        id: "item-3",
        name: "Nachos con Queso",
        description: "Totopos crujientes con queso fundido, jalapeños y salsa",
        price: 80,
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=200&h=200&fit=crop",
        category: "Aperitivos"
      },
      {
        id: "item-4",
        name: "Quesadilla de Pollo",
        description: "Tortilla de harina con pollo, queso y pimientos",
        price: 100,
        image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=200&h=200&fit=crop",
        category: "Quesadillas"
      }
    ]
  },
  {
    id: "rest-2",
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop",
    rating: 4.9,
    deliveryTime: "30-45",
    deliveryFee: 60,
    cuisine: "Japonesa",
    menu: [
      {
        id: "item-5",
        name: "Combo Sushi Mix",
        description: "12 piezas variadas de sushi y maki rolls",
        price: 400,
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=200&h=200&fit=crop",
        category: "Combos"
      },
      {
        id: "item-6",
        name: "Ramen Tonkotsu",
        description: "Ramen con caldo de cerdo, huevo, chashu y nori",
        price: 180,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop",
        category: "Ramen"
      },
      {
        id: "item-7",
        name: "Gyozas (6 piezas)",
        description: "Empanadillas japonesas de cerdo y verduras",
        price: 140,
        image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200&h=200&fit=crop",
        category: "Aperitivos"
      }
    ]
  },
  {
    id: "rest-3",
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    rating: 4.6,
    deliveryTime: "20-30",
    deliveryFee: 28,
    cuisine: "Americana",
    menu: [
      {
        id: "item-8",
        name: "Classic Cheeseburger",
        description: "Hamburguesa con queso cheddar, lechuga, tomate y salsa especial",
        price: 190,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop",
        category: "Burgers"
      },
      {
        id: "item-9",
        name: "Bacon BBQ Burger",
        description: "Hamburguesa con bacon, cebolla caramelizada y salsa BBQ",
        price: 155,
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&h=200&fit=crop",
        category: "Burgers"
      },
      {
        id: "item-10",
        name: "Papas Fritas",
        description: "Porción grande de papas fritas crujientes",
        price: 77,
        image: "https://images.unsplash.com/photo-1630384060421-cb20aed44f8c?w=200&h=200&fit=crop",
        category: "Sides"
      }
    ]
  },
  {
    id: "rest-4",
    name: "Pizza Napoli",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
    rating: 4.7,
    deliveryTime: "25-40",
    deliveryFee: 40,
    cuisine: "Italiana",
    menu: [
      {
        id: "item-11",
        name: "Pizza Margherita",
        description: "Salsa de tomate, mozzarella fresca y albahaca",
        price: 210,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=200&h=200&fit=crop",
        category: "Pizzas"
      },
      {
        id: "item-12",
        name: "Pizza Pepperoni",
        description: "Salsa de tomate, mozzarella y pepperoni",
        price: 240,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=200&fit=crop",
        category: "Pizzas"
      },
      {
        id: "item-13",
        name: "Pasta Carbonara",
        description: "Spaghetti con salsa carbonara, bacon y parmesano",
        price: 235,
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop",
        category: "Pastas"
      }
    ]
  }
]
