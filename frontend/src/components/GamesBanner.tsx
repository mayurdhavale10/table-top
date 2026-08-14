"use client";

import Link from "next/link";
import "../styles/GamesBanner.css";

export default function GamesBanner({ cafeSlug = "sips-and-bites" }: { cafeSlug?: string }) {
  return (
    <Link href={`/${cafeSlug}/games`} style={{ textDecoration: "none" }}>
      <div className="games-banner">
        <div className="games-icon">
          <div style={{ background: "#2C2A29", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontWeight: "bold" }}>
            N
          </div>
        </div>
        <div className="games-text">
          <h3>Play games until you<br/>wait for your order</h3>
        </div>
      </div>
    </Link>
  );
}
