export const cafes = [
  {
    id: "cafe_1",
    slug: "sips-and-bites",
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
    category: "veg",
    name: "Veg Platter",
    price: 150,
    description: "Assorted vegetables",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_2",
    cafe_id: "cafe_1",
    category: "non veg",
    name: "Chicken Tikka",
    price: 250,
    description: "Spicy chicken",
    image: "https://images.unsplash.com/photo-1599487405620-681b67f1b212?auto=format&fit=crop&q=80&w=400",
    type: "Non Veg"
  },
  {
    id: "item_3",
    cafe_id: "cafe_1",
    category: "starters",
    name: "Bruschetta",
    price: 120,
    description: "Toasted bread",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_4",
    cafe_id: "cafe_1",
    category: "pizza",
    name: "Margherita",
    price: 300,
    description: "Cheese and tomato",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_5",
    cafe_id: "cafe_1",
    category: "burgers",
    name: "Classic Veg",
    price: 180,
    description: "Crispy patty",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_6",
    cafe_id: "cafe_1",
    category: "pasta",
    name: "Arrabiata",
    price: 220,
    description: "Spicy red sauce",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_7",
    cafe_id: "cafe_1",
    category: "drinks",
    name: "Cold Coffee",
    price: 120,
    description: "Chilled coffee",
    image: "https://images.unsplash.com/photo-1599487405620-681b67f1b212?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_8",
    cafe_id: "cafe_1",
    category: "desserts",
    name: "Brownie",
    price: 160,
    description: "Hot fudge brownie",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  // Demo Diner Menu
  {
    id: "item_3",
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
