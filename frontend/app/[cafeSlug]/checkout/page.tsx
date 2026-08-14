"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../../../src/context/CartContext";

export default function CheckoutPage() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const params = useParams();
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const serviceCharge = subtotal * 0.05; // 5% service charge
  const grandTotal = subtotal + tax + serviceCharge;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call for payment & order placement
    setTimeout(() => {
      clearCart();
      router.push(`/${cafeSlug}/order-status`);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", minHeight: "100vh", background: "#FAF8F5" }}>
        <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px" }}>Your cart is empty</h2>
        <p style={{ color: "#7A7571", marginBottom: "32px" }}>Add some delicious items to get started!</p>
        <Link href={`/${cafeSlug}`} style={{ background: "#1A1817", color: "white", padding: "16px 32px", borderRadius: "32px", textDecoration: "none", fontWeight: "bold" }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5", padding: "0 0 100px 0" }}>
      <div style={{ background: "white", padding: "20px", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #EAE6DF", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href={`/${cafeSlug}`} style={{ color: "#1A1817" }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ margin: 0, fontSize: "20px", fontFamily: "var(--font-playfair), serif" }}>Checkout</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <h3 style={{ fontSize: "18px", color: "#1A1817", marginBottom: "16px", marginTop: 0 }}>Order Summary</h3>
        <div style={{ background: "white", borderRadius: "16px", padding: "16px", border: "1px solid #EAE6DF", marginBottom: "24px" }}>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px dashed #EAE6DF" }}>
              <div>
                <div style={{ fontWeight: "600", color: "#1A1817" }}>{item.name}</div>
                <div style={{ fontSize: "14px", color: "#7A7571" }}>Qty: {item.quantity} × ₹{item.price}</div>
              </div>
              <div style={{ fontWeight: "bold" }}>₹{item.price * item.quantity}</div>
            </div>
          ))}
          
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#7A7571", fontSize: "14px", paddingTop: "8px" }}>
            <span>Subtotal</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#7A7571" }}>
            <span>Taxes (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#7A7571" }}>
            <span>Service Charge (5%)</span>
            <span>₹{serviceCharge.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "20px", color: "#1A1817", marginTop: "12px", borderTop: "1px solid #Eae6df", paddingTop: "12px" }}>
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div style={{ background: "#FDFBF9", padding: "24px", borderRadius: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", margin: "0 0 16px 0" }}>Details</h2>
        <input type="text" placeholder="Table Number" style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #D5D1CB", marginBottom: "16px", fontSize: "16px", boxSizing: "border-box" }} />
        <textarea placeholder="Any special cooking instructions?" style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #D5D1CB", fontSize: "16px", minHeight: "100px", fontFamily: "inherit", boxSizing: "border-box" }}></textarea>
      </div>

      <button onClick={handlePayment} style={{
        width: "100%",
        background: "#1A1817",
        color: "white",
        border: "none",
        padding: "20px",
        borderRadius: "32px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        transition: "0.2s"
      }}>
        PAY & PLACE ORDER — ₹{grandTotal.toFixed(2)}
      </button>
    </div>
  );
}
