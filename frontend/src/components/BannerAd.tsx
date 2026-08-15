"use client";

import React from 'react';

function BannerAd() {
  return (
    <div
      style={{
        background: "transparent",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: "16px",
        padding: "16px 20px",
        margin: "24px 20px 40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.02)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ 
          width: "48px", 
          height: "48px", 
          background: "#F3EFEA", 
          borderRadius: "12px", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          fontSize: "20px" 
        }}>
          ✨
        </div>
        <div>
          <p style={{ margin: "0 0 2px 0", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#8A8581", fontWeight: "600", fontFamily: "var(--font-inter), sans-serif" }}>
            Local Partner
          </p>
          <h3 style={{ margin: "0", fontFamily: "var(--font-playfair), serif", fontSize: "18px", color: "#2C2A29", fontWeight: "600" }}>
            Premium Ad Space
          </h3>
        </div>
      </div>
      <button style={{
        background: "#2C2A29",
        color: "#FAF8F5",
        border: "none",
        padding: "8px 16px",
        borderRadius: "20px",
        fontWeight: "600",
        cursor: "pointer",
        fontSize: "13px",
        fontFamily: "var(--font-inter), sans-serif"
      }}>
        View
      </button>
    </div>
  );
}

export default BannerAd;