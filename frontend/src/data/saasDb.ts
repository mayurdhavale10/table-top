export const cafes = [
  {
    id: "cafe_1",
    slug: "sips-and-bites",
    username: "sips",
    password: "bites123",
    name: "Sips & Bites",
    location: "KHADAKPADA, KALYAN WEST",
    theme: {
      primaryColor: "#1A1817",
      accentColor: "#F59E0B"
    }
  },
  {
    id: "cafe_2",
    slug: "demo-diner",
    name: "Demo Diner",
    location: "DOWNTOWN, NYC",
    theme: {
      primaryColor: "#0f9d58",
      accentColor: "#3b82f6"
    }
  }
];

export const menuItems = [
  // Sips and Bites Menu
  {
    id: "item_1",
    cafe_id: "cafe_1",
    category: "starters",
    name: "Veg Platter",
    price: 150,
    description: "Assorted fresh grilled vegetables and dips",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_2",
    cafe_id: "cafe_1",
    category: "starters",
    name: "Chicken Tikka",
    price: 250,
    description: "Spicy clay-oven roasted chicken skewers",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=400",
    type: "Non Veg"
  },
  {
    id: "item_3",
    cafe_id: "cafe_1",
    category: "starters",
    name: "Bruschetta",
    price: 120,
    description: "Toasted garlic sourdough topped with vine tomatoes and basil",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_4",
    cafe_id: "cafe_1",
    category: "pizza",
    name: "Margherita",
    price: 300,
    description: "Fresh buffalo mozzarella, tomato sauce and organic basil",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_5",
    cafe_id: "cafe_1",
    category: "burgers",
    name: "Classic Veg",
    price: 180,
    description: "Handcrafted potato & herb patty with house special sauce",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_6",
    cafe_id: "cafe_1",
    category: "pasta",
    name: "Arrabiata",
    price: 220,
    description: "Penne pasta tossed in spicy chili garlic pomodoro sauce",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_7",
    cafe_id: "cafe_1",
    category: "drinks",
    name: "Cold Coffee",
    price: 120,
    description: "Slow-brewed dark roast espresso with chilled whole milk",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_8",
    cafe_id: "cafe_1",
    category: "desserts",
    name: "Brownie",
    price: 160,
    description: "Rich dark chocolate fudgy brownie served warm",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476d?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  // Demo Diner Menu
  {
    id: "item_9",
    cafe_id: "cafe_2",
    category: "burgers",
    name: "Classic Cheeseburger",
    price: 350,
    description: "Beef patty with cheddar cheese, lettuce, and tomato.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    type: "Non Veg"
  }
];

export function getCafeBySlug(slug: string) {
  return cafes.find(c => c.slug === slug);
}

export function getMenuByCafeId(cafeId: string) {
  return menuItems.filter(m => m.cafe_id === cafeId);
}
