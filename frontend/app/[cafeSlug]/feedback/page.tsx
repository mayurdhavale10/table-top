"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const params = useParams();
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Real app would API POST this review data here
    setTimeout(() => {
      router.push(`/${cafeSlug}`);
    }, 3000);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", minHeight: "100vh", background: "#FAF8F5", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", alignSelf: "flex-start", marginBottom: "40px" }}>
        <Link href={`/${cafeSlug}`} style={{ color: "#0f9d58", textDecoration: "none", fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
          ← Back
        </Link>
      </div>

      <div style={{ width: "100%", animation: "slideUp 0.5s ease-out" }}>
        {!submitted ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#FDFBF9", border: "1px solid #D5D1CB", padding: "20px", borderRadius: "50%", marginBottom: "16px", boxShadow: "0 8px 16px rgba(0,0,0,0.04)" }}>
                <UtensilsCrossed size={48} color="#1A1817" strokeWidth={1.5} />
              </div>
              <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "36px", color: "#1A1817", margin: "0 0 8px 0" }}>
                How was your meal?
              </h1>
              <p style={{ color: "#7A7571", fontSize: "16px", margin: "0" }}>
                We'd love to hear your feedback so we can improve!
              </p>
            </div>

            <div style={{ background: "#FDFBF9", padding: "32px", borderRadius: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    style={{ background: "none", border: "none", fontSize: "48px", cursor: "pointer", color: rating >= star ? "#fbbf24" : "#e5e7eb", transition: "0.2s" }}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you love? What could we improve?" 
                style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #D5D1CB", fontSize: "16px", minHeight: "120px", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "24px" }}
              />

              <button 
                onClick={handleSubmitReview}
                disabled={rating === 0}
                style={{
                  width: "100%",
                  background: rating > 0 ? "#1A1817" : "#9ca3af",
                  color: "white",
                  border: "none",
                  padding: "16px",
                  borderRadius: "32px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: rating > 0 ? "pointer" : "not-allowed",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  transition: "0.2s"
                }}
              >
                SUBMIT REVIEW
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", background: "#FDFBF9", padding: "40px 24px", borderRadius: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.06)", marginTop: "40px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❤️</div>
            <h2 style={{ fontSize: "24px", color: "#1A1817", marginBottom: "8px" }}>Thank you!</h2>
            <p style={{ color: "#7A7571" }}>Your feedback helps us serve you better.</p>
          </div>
        )}
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
