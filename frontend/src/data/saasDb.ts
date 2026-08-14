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
    category: "starters",
    name: "Bruschetta",
    price: 150,
    description: "Toasted bread topped with tomatoes, garlic, and fresh basil.",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=400",
    type: "Veg"
  },
  {
    id: "item_2",
    cafe_id: "cafe_1",
    category: "veg",
    name: "Paneer Tikka",
    price: 250,
    description: "Grilled cottage cheese cubes marinated in spices.",
    image: "https://images.unsplash.com/photo-1599487405620-681b67f1b212?auto=format&fit=crop&q=80&w=400",
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
