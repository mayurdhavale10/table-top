"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { UtensilsCrossed, ChefHat, Gamepad2 } from "lucide-react";

type OrderItem = { menuItemId: string; name: string };

export default function OrderStatusPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";

  const [orderId, setOrderId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("tabletop_last_order");
    if (raw) {
      const parsed = JSON.parse(raw);
      setOrderId(parsed.orderId);
      setPhone(parsed.phone);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!orderId) return;

    let active = true;
    const poll = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (active && res.ok) setOrder(data.order);
      } catch (err) {
        console.error("Failed to load order status", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    poll();
    const interval = setInterval(poll, 4000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [orderId]);

  const isReady = order && (order.status === "ready" || order.status === "completed");

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !phone) return;

    setSubmitting(true);
    try {
      const payload = Object.entries(ratings).map(([menuItemId, stars]) => ({
        menuItemId,
        stars,
        comment,
      }));
      if (payload.length === 0) return;

      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, customerPhone: phone, ratings: payload }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit rating");
      }

      setSubmitted(true);
      sessionStorage.removeItem("tabletop_last_order");
      setTimeout(() => router.push(`/${cafeSlug}`), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF8F5", display: "flex", alignItems: "center", justifyContent: "center", color: "#7A7571" }}>
        Loading your order...
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAF8F5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "24px", color: "#1A1817", marginBottom: "12px" }}>No order found</h2>
        <p style={{ color: "#7A7571", marginBottom: "24px" }}>We couldn't find a recent order to track.</p>
        <Link href={`/${cafeSlug}`} style={{ background: "#1A1817", color: "white", padding: "14px 28px", borderRadius: "32px", textDecoration: "none", fontWeight: "bold" }}>
          Browse Menu
        </Link>
      </div>
    );
  }

  if (!isReady) {
    const statusCopy: Record<string, string> = {
      new: "Your order has been received...",
      preparing: "Preparing your order...",
    };
    return (
      <div style={{ minHeight: "100vh", background: "#FAF8F5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div className="pulse-circle" style={{ width: "120px", height: "120px", background: "#fef3c7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
          <ChefHat size={48} color="#92400E" strokeWidth={1.5} />
        </div>
        <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", color: "#1A1817", marginBottom: "12px" }}>
          {statusCopy[order.status] || "Your order is on its way..."}
        </h2>
        <p style={{ color: "#7A7571", textAlign: "center", marginBottom: "40px", maxWidth: "300px" }}>
          Sit tight! Our chefs are on it. This page updates automatically.
        </p>

        <Link href={`/${cafeSlug}/games`} style={{ textDecoration: "none" }}>
          <div style={{ background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", padding: "20px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 8px 16px rgba(161,196,253,0.3)", color: "#1A1817" }}>
            <Gamepad2 size={32} />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>Play Games</div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>While you wait</div>
            </div>
          </div>
        </Link>

        <style>{`
          @keyframes pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(251, 191, 36, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); } }
          .pulse-circle { animation: pulse 2s infinite; }
        `}</style>
      </div>
    );
  }

  const items: OrderItem[] = order.items || [];
  const allRated = items.length > 0 && items.every((it) => ratings[it.menuItemId] > 0);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", minHeight: "100vh", background: "#FAF8F5", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", alignSelf: "flex-start", marginBottom: "40px" }}>
        <Link href={`/${cafeSlug}`} style={{ color: "#0f9d58", textDecoration: "none", fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
          ← Back to Menu
        </Link>
      </div>

      <div style={{ width: "100%", animation: "slideUp 0.5s ease-out" }}>
        {!submitted ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#FDFBF9", border: "1px solid #D5D1CB", padding: "20px", borderRadius: "50%", marginBottom: "16px", boxShadow: "0 8px 16px rgba(0,0,0,0.04)" }}>
                <UtensilsCrossed size={48} color="#1A1817" strokeWidth={1.5} />
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "32px", color: "#1A1817", margin: "0 0 8px 0" }}>
                Order Ready!
              </h1>
              <p style={{ color: "#7A7571", fontSize: "16px", margin: "0" }}>
                Rate each dish — your review counts as a verified diner.
              </p>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
                {items.map((item) => (
                  <div key={item.menuItemId} style={{ background: "#FDFBF9", padding: "20px", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ fontWeight: 600, color: "#1A1817", marginBottom: "10px" }}>{item.name}</div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatings((prev) => ({ ...prev, [item.menuItemId]: star }))}
                          style={{ background: "none", border: "none", fontSize: "28px", cursor: "pointer", padding: 0, color: (ratings[item.menuItemId] || 0) >= star ? "#fbbf24" : "#e5e7eb" }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#FDFBF9", padding: "24px", borderRadius: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you love? What could we improve? (optional)"
                  style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #D5D1CB", fontSize: "16px", minHeight: "100px", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "24px" }}
                />

                <button
                  type="submit"
                  disabled={!allRated || submitting}
                  style={{
                    width: "100%",
                    background: allRated ? "#1A1817" : "#9ca3af",
                    color: "white",
                    border: "none",
                    padding: "16px",
                    borderRadius: "32px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: allRated ? "pointer" : "not-allowed",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    transition: "0.2s"
                  }}
                >
                  {submitting ? "Submitting..." : "SUBMIT RATINGS"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign: "center", background: "#FDFBF9", padding: "40px 24px", borderRadius: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.06)", marginTop: "40px" }}>
            <h2 style={{ fontSize: "24px", color: "#1A1817", marginBottom: "8px" }}>Thank you!</h2>
            <p style={{ color: "#7A7571" }}>Your ratings help other diners — and the cafe.</p>
          </div>
        )}
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
