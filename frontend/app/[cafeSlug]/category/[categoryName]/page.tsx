"use client";
import { useEffect, useState } from "react";
import MenuCard from "../../../../src/components/MenuCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "../../../../src/styles/CategoryPage.css";
import { useCart } from "../../../../src/context/CartContext";
import { useParams } from "next/navigation";
import { getMenuByCafeId, getCafeBySlug } from "../../../../src/data/saasDb";

export default function CategoryPage() {
  const params = useParams();
  const categoryName = Array.isArray(params?.categoryName) ? params.categoryName[0] : params?.categoryName || "";
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";
  
  const [items, setItems] = useState<any[]>([]);
  const { cart } = useCart();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    const cafe = getCafeBySlug(cafeSlug);
    if (cafe) {
      const menu = getMenuByCafeId(cafe.id);
      const categoryItems = menu.filter(item => item.category.toLowerCase() === categoryName.toLowerCase());
      setItems(categoryItems);
    }
  }, [categoryName, cafeSlug]);

  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "";

  return (
    <div className="category-page">
      <div className="category-header">
        <Link href={`/${cafeSlug}`} className="back-button">
          <ArrowLeft size={24} color="#1A1817" />
        </Link>
        <h1>{formattedCategoryName}</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <div className="items-list">
        {items.map((item) => (
          <MenuCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            description={item.description}
            image={item.image}
            type={item.type}
          />
        ))}
      </div>
      
      {/* Sticky Cart Button */}
      {cartItemCount > 0 && (
        <div className="sticky-cart-wrapper">
          <Link href={`/${cafeSlug}/checkout`} className="sticky-cart-button">
            <div className="cart-summary">
              <span className="cart-count">{cartItemCount} item{cartItemCount > 1 ? 's' : ''}</span>
              <span className="cart-total">₹{cartTotal}</span>
            </div>
            <div className="cart-action">
              View Cart &rarr;
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
