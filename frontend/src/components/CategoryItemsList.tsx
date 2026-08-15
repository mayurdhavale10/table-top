"use client";

import React from "react";
import Link from "next/link";
import MenuCard from "./MenuCard";
import NativeAdCard from "./NativeAdCard";
import InlineAdBanner from "./InlineAdBanner";
import { useCart } from "../context/CartContext";
import type { MenuItemData } from "../lib/data";

export default function CategoryItemsList({
  items,
  cafeSlug,
}: {
  items: MenuItemData[];
  cafeSlug: string;
}) {
  const { cart } = useCart();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
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
    </>
  );
}
