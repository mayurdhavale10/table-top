"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCafeBySlug, getMenuByCafeId } from "../../../src/data/saasDb";

export default function CafeAdminDashboard() {
  const params = useParams();
  const slug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "";
  const cafe = getCafeBySlug(slug);
  const [activeTab, setActiveTab] = useState("menu");
  
  if (!cafe) return <div style={{ padding: "40px", textAlign: "center" }}>Cafe not found</div>;

  const menu = getMenuByCafeId(cafe.id);

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "white", borderRight: "1px solid #e5e7eb", padding: "24px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "40px", color: "#111827", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", background: cafe.theme.primaryColor, borderRadius: "8px" }}></div>
          {cafe.name}
        </h2>
        
        <button onClick={() => setActiveTab("menu")} style={{ background: activeTab === "menu" ? "#f3f4f6" : "transparent", border: "none", color: "#374151", padding: "12px", textAlign: "left", borderRadius: "8px", cursor: "pointer", marginBottom: "8px", fontSize: "16px", fontWeight: activeTab === "menu" ? "bold" : "normal" }}>
          📋 Menu Manager
        </button>
        <button onClick={() => setActiveTab("orders")} style={{ background: activeTab === "orders" ? "#f3f4f6" : "transparent", border: "none", color: "#374151", padding: "12px", textAlign: "left", borderRadius: "8px", cursor: "pointer", marginBottom: "8px", fontSize: "16px", fontWeight: activeTab === "orders" ? "bold" : "normal" }}>
          👨‍🍳 Live Orders
        </button>
        <button onClick={() => setActiveTab("qr")} style={{ background: activeTab === "qr" ? "#f3f4f6" : "transparent", border: "none", color: "#374151", padding: "12px", textAlign: "left", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: activeTab === "qr" ? "bold" : "normal" }}>
          📱 QR Codes
        </button>

        <div style={{ marginTop: "auto" }}>
          <Link href={`/${slug}`} style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>
            &larr; Back to Menu View
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {activeTab === "menu" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>Menu Manager</h1>
              <button style={{ background: cafe.theme.primaryColor, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                + Add Item
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
              {menu.map(item => (
                <div key={item.id} style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1px solid #e5e7eb", display: "flex", gap: "16px" }}>
                  <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold", color: "#111827", marginBottom: "4px" }}>{item.name}</div>
                    <div style={{ color: "#6b7280", fontSize: "12px", marginBottom: "8px" }}>{item.category.toUpperCase()}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "bold", color: cafe.theme.primaryColor }}>₹{item.price}</span>
                      <button style={{ background: "transparent", border: "1px solid #e5e7eb", padding: "4px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "qr" && (
          <>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", color: "#111827" }}>Cafe QR Code</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Print this QR code and place it anywhere in your cafe. Customers can scan it to view your menu.</p>
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "40px", border: "1px solid #e5e7eb", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "400px", margin: "0 auto" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>{cafe.name} Menu</div>
              
              {/* Mock single QR Code */}
              <div style={{ width: "200px", height: "200px", background: "white", border: "2px solid #000", padding: "12px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(5, 1fr)", gap: "4px", marginBottom: "24px" }}>
                {Array(25).fill(0).map((_, i) => (
                  <div key={i} style={{ background: Math.random() > 0.4 ? "#000" : "#fff" }}></div>
                ))}
                {/* QR Code Eyes */}
                <div style={{ position: "absolute", width: "40px", height: "40px", border: "6px solid #000", margin: "12px" }}></div>
              </div>

              <a href={`https://table-top.vercel.app/${slug}`} target="_blank" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "16px", marginBottom: "24px", wordBreak: "break-all", background: "#f0f7ff", padding: "12px", borderRadius: "8px", width: "100%", boxSizing: "border-box" }}>
                table-top.vercel.app/{slug}
              </a>

              <button style={{ background: cafe.theme.primaryColor, border: "none", padding: "16px 24px", borderRadius: "8px", fontWeight: "bold", color: "white", cursor: "pointer", width: "100%", fontSize: "16px" }}>
                Download High-Res PNG
              </button>
            </div>
          </>
        )}

        {activeTab === "orders" && (
          <div style={{ textAlign: "center", padding: "64px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>👨‍🍳</div>
            <h2 style={{ margin: "0 0 8px 0", color: "#111827" }}>Live Orders Dashboard</h2>
            <p style={{ color: "#6b7280" }}>Orders placed by customers will appear here in real-time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
