"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Leaf, Drumstick, Utensils, Pizza, Sandwich, UtensilsCrossed, CupSoda, IceCream } from "lucide-react";
import "../styles/CategoryGrid.css";
import { getMenuByCafeId, getCafeBySlug } from "../data/saasDb";

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n === 'veg') return <Leaf size={24} className="category-icon" />;
  if (n === 'non veg') return <Drumstick size={24} className="category-icon" />;
  if (n === 'starters') return <Utensils size={24} className="category-icon" />;
  if (n === 'pizza') return <Pizza size={24} className="category-icon" />;
  if (n === 'burgers') return <Sandwich size={24} className="category-icon" />;
  if (n === 'pasta') return <UtensilsCrossed size={24} className="category-icon" />;
  if (n === 'drinks') return <CupSoda size={24} className="category-icon" />;
  if (n === 'desserts') return <IceCream size={24} className="category-icon" />;
  return <Utensils size={24} className="category-icon" />;
};

export default function CategoryGrid({ cafeSlug = "sips-and-bites" }: { cafeSlug?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    // Derive categories from the cafe's menu items
    const cafe = getCafeBySlug(cafeSlug);
    if (cafe) {
      const menu = getMenuByCafeId(cafe.id);
      const uniqueCats = Array.from(new Set(menu.map(m => m.category)));
      const catObjects = uniqueCats.map((c, i) => ({
        id: String(i),
        name: c.charAt(0).toUpperCase() + c.slice(1)
      }));
      setCategories(catObjects);
    }
  }, [cafeSlug]);

  return (
    <div className="category-wrapper">
      {categories.map((category) => (
        <div
          className="category-card"
          key={category.id}
          onClick={() => router.push(`/${cafeSlug}/category/${category.name.toLowerCase()}`)}
        >
          <h3>
            {getCategoryIcon(category.name)}
            <span>{category.name}</span>
          </h3>
        </div>
      ))}
    </div>
  );
}
