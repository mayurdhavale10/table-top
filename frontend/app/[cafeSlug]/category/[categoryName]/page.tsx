"use client";
import React, { useEffect, useState } from "react";
import MenuCard from "../../../../src/components/MenuCard";
import NativeAdCard from "../../../../src/components/NativeAdCard";
import InlineAdBanner from "../../../../src/components/InlineAdBanner";
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
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <MenuCard item={item} />
            {/* Inject Native Ad after the 2nd item */}
            {index === 1 && (
              <NativeAdCard 
                sponsorName="Kalyan Jewelers" 
                description="Special festive offers on Gold and Diamond jewelry. Visit our store near Khadakpada!" 
                tag="Local Sponsor" 
                ctaText="View Offers" 
              />
            )}
          </React.Fragment>
        ))}
        
        {/* Inject Inline Ad Banner at the bottom of the list */}
        {items.length > 0 && <InlineAdBanner />}
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
