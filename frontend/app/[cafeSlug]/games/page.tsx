"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function GamesHubPage() {
  const params = useParams();
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5" }}>
      <div style={{ background: "white", padding: "20px", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #EAE6DF", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href={`/${cafeSlug}`} style={{ color: "#1A1817" }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ margin: 0, fontSize: "20px", fontFamily: "var(--font-playfair), serif" }}>Arcade</h1>
      </div>

      <div style={{ padding: "24px" }}>
        <h2 style={{ fontSize: "24px", margin: "0 0 24px 0", color: "#1A1817", fontFamily: "var(--font-playfair), serif" }}>
          Games Hub
        </h2>

        <Link href={`/${cafeSlug}/games/baddie-detector`} style={{ textDecoration: "none", display: "block", marginBottom: "16px" }}>
          <div style={{
            background: "linear-gradient(145deg, #ffffff, #fdfbf9)",
            border: "1px solid rgba(0,0,0,0.04)",
            borderRadius: "24px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
            transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s"
          }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "#FDF3F3",
              borderRadius: "20px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "36px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              border: "1px solid rgba(236, 72, 153, 0.15)",
              flexShrink: 0
            }}>
              💅
            </div>
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "#1A1817", fontFamily: "var(--font-playfair), serif", fontWeight: "700" }}>
                Baddie Detector
              </h3>
              <p style={{ margin: "0", color: "#7A7571", fontSize: "14px", lineHeight: "1.5" }}>
                Are you a certified baddie? Let the AI scan your face and decide your fate.
              </p>
            </div>
          </div>
        </Link>

        <Link href={`/${cafeSlug}/games/tic-tac-toe`} style={{ textDecoration: "none", display: "block" }}>
          <div style={{
            background: "linear-gradient(145deg, #ffffff, #fdfbf9)",
            border: "1px solid rgba(0,0,0,0.04)",
            borderRadius: "24px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
            transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s"
          }}>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "#F0F7FF",
              borderRadius: "20px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "36px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
              border: "1px solid rgba(59, 130, 246, 0.15)",
              flexShrink: 0
            }}>
              ❌
            </div>
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "22px", color: "#1A1817", fontFamily: "var(--font-playfair), serif", fontWeight: "700" }}>
                Tic Tac Toe
              </h3>
              <p style={{ margin: "0", color: "#7A7571", fontSize: "14px", lineHeight: "1.5" }}>
                The classic X and O. Challenge a friend to a quick match while you wait.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
