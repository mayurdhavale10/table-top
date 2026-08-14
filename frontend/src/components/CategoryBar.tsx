"use client";
import { useEffect, useState } from "react";
import "../styles/CategoryBar.css";
import { getMenuByCafeId, getCafeBySlug } from "../data/saasDb";

export default function CategoryBar({ cafeSlug = "sips-and-bites" }: { cafeSlug?: string }) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const cafe = getCafeBySlug(cafeSlug);
    if (cafe) {
      const menu = getMenuByCafeId(cafe.id);
      const uniqueCats = Array.from(new Set(menu.map(m => m.category)));
      setCategories(uniqueCats.map(c => c.charAt(0).toUpperCase() + c.slice(1)));
    }
  }, [cafeSlug]);

  if (categories.length === 0) return null;

  return (
    <div className="category-bar">
      <button
        onClick={() => setSelectedCategory("All")}
        className={selectedCategory === "All" ? "active" : ""}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setSelectedCategory(category)}
          className={selectedCategory === category ? "active" : ""}
        >
          {category}
        </button>
      ))}
    </div>
  );
}