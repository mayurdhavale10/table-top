"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Smartphone } from "lucide-react";
import QRCode from "react-qr-code";
import { useCart } from "../../../src/context/CartContext";

export default function CheckoutPage() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const params = useParams();
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState("");
  const [cafe, setCafe] = useState<any>(null);
  const [step, setStep] = useState<"details" | "payment">("details");

  useEffect(() => {
    fetch(`/api/cafe?slug=${cafeSlug}`)
      .then((res) => res.json())
      .then((data) => setCafe(data.cafe || null))
      .catch(() => setCafe(null));
  }, [cafeSlug]);

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const serviceCharge = subtotal * 0.05; // 5% service charge
  const grandTotal = subtotal + tax + serviceCharge;

  const hasUpi = Boolean(cafe?.upiId);
  const upiLink = hasUpi
    ? `upi://pay?pa=${encodeURIComponent(cafe.upiId)}&pn=${encodeURIComponent(cafe.name || "Table Top")}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order at ${cafe.name || "cafe"}`)}`
    : "";

  const placeOrder = async (paymentStatus: "paid" | "pending") => {
    setError("");
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cafeSlug,
          tableNumber,
          specialInstructions: instructions,
          items: cart,
          subtotal,
          tax,
          serviceCharge,
          grandTotal,
          paymentStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      clearCart();
      router.push(`/${cafeSlug}/order-status`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleProceed = () => {
    if (hasUpi) {
      setStep("payment");
    } else {
      placeOrder("paid");
    }
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
        <button
          onClick={() => (step === "payment" ? setStep("details") : router.push(`/${cafeSlug}`))}
          style={{ background: "none", border: "none", padding: 0, color: "#1A1817", cursor: "pointer", display: "flex" }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: "20px", fontFamily: "var(--font-playfair), serif" }}>
          {step === "payment" ? "Scan & Pay" : "Checkout"}
        </h1>
      </div>

      {step === "details" && (
        <>
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
            <input
              type="text"
              placeholder="Table Number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #D5D1CB", marginBottom: "16px", fontSize: "16px", boxSizing: "border-box" }}
            />
            <textarea
              placeholder="Any special cooking instructions?"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #D5D1CB", fontSize: "16px", minHeight: "100px", fontFamily: "inherit", boxSizing: "border-box" }}
            ></textarea>
          </div>

          {error && (
            <div style={{ margin: "0 20px 16px 20px", padding: "12px 16px", borderRadius: "12px", background: "#FDF3F3", color: "#C62828", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <button onClick={handleProceed} disabled={isProcessing} style={{
            width: "100%",
            background: "#1A1817",
            color: "white",
            border: "none",
            padding: "20px",
            borderRadius: "32px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.7 : 1,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            transition: "0.2s"
          }}>
            {isProcessing ? "PLACING ORDER..." : hasUpi ? `PROCEED TO PAY — ₹${grandTotal.toFixed(2)}` : `PAY & PLACE ORDER — ₹${grandTotal.toFixed(2)}`}
          </button>
        </>
      )}

      {step === "payment" && (
        <div style={{ padding: "24px 20px" }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "32px 24px", border: "1px solid #EAE6DF", textAlign: "center", boxShadow: "0 12px 32px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#FDF3F3", color: "#8B2E2E", padding: "6px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "20px" }}>
              <Smartphone size={14} /> Scan with any UPI app
            </div>

            <div style={{ display: "inline-flex", padding: "16px", background: "white", border: "1px solid #EAE6DF", borderRadius: "16px", marginBottom: "20px" }}>
              <QRCode value={upiLink} size={200} style={{ height: "auto", maxWidth: "100%", width: "200px" }} viewBox="0 0 256 256" />
            </div>

            <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "32px", fontWeight: 700, color: "#1A1817", marginBottom: "4px" }}>
              ₹{grandTotal.toFixed(2)}
            </div>
            <div style={{ fontSize: "14px", color: "#7A7571", marginBottom: "24px" }}>
              Pay to <strong>{cafe?.upiId}</strong>
            </div>

            {error && (
              <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "12px", background: "#FDF3F3", color: "#C62828", fontSize: "14px", textAlign: "left" }}>
                {error}
              </div>
            )}

            <button onClick={() => placeOrder("pending")} disabled={isProcessing} style={{
              width: "100%",
              background: "#1A1817",
              color: "white",
              border: "none",
              padding: "18px",
              borderRadius: "32px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isProcessing ? "not-allowed" : "pointer",
              opacity: isProcessing ? 0.7 : 1,
              marginBottom: "12px",
            }}>
              {isProcessing ? "Placing order..." : "I've Paid — Confirm Order"}
            </button>
            <p style={{ fontSize: "12px", color: "#9C9791", margin: 0 }}>
              Only tap this after completing the payment in your UPI app.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
