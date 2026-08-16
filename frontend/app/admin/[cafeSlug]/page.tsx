"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { getCafeBySlug, getMenuByCafeId } from "../../../src/data/saasDb";

import "../../../src/styles/Admin.css";

export default function CafeAdminDashboard() {
  const params = useParams();
  const slug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "";
  const cafe = getCafeBySlug(slug);
  const [activeTab, setActiveTab] = useState("menu");
  
  if (!cafe) return <div style={{ padding: "40px", textAlign: "center" }}>Cafe not found</div>;

  const menu = getMenuByCafeId(cafe.id);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2 className="admin-sidebar-title">
          <div style={{ width: "32px", height: "32px", background: cafe.theme.primaryColor, borderRadius: "8px", flexShrink: 0 }}></div>
          {cafe.name}
        </h2>
        
        <button onClick={() => setActiveTab("menu")} className={`admin-tab ${activeTab === "menu" ? "active" : ""}`}>
          📋 Menu Manager
        </button>
        <button onClick={() => setActiveTab("orders")} className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}>
          👨‍🍳 Live Orders
        </button>
        <button onClick={() => setActiveTab("qr")} className={`admin-tab ${activeTab === "qr" ? "active" : ""}`}>
          📱 QR Codes
        </button>

        <div className="admin-back-link">
          <Link href={`/${slug}`} style={{ color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>
            &larr; Back to Menu
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {activeTab === "menu" && (
          <>
            <div className="admin-header">
              <h1>Menu Manager</h1>
              <button style={{ background: cafe.theme.primaryColor, color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", flexShrink: 0 }}>
                + Add Item
              </button>
            </div>

            <div className="admin-menu-grid">
              {menu.map(item => (
                <div key={item.id} className="admin-menu-item">
                  <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "bold", color: "#111827", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
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
            <div className="admin-header" style={{ flexDirection: "column", alignItems: "flex-start", gap: "8px" }}>
              <h1>Cafe QR Code</h1>
              <p style={{ color: "#6b7280", margin: 0 }}>Print this QR code and place it anywhere in your cafe.</p>
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "40px", border: "1px solid #e5e7eb", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "400px", margin: "0 auto" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", marginBottom: "24px" }}>{cafe.name} Menu</div>
              
              <div style={{ background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
                <QRCode 
                  value={`https://table-top-inky.vercel.app/${slug}`} 
                  size={200}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>

              <a href={`https://table-top-inky.vercel.app/${slug}`} target="_blank" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "16px", marginBottom: "24px", wordBreak: "break-all", background: "#f0f7ff", padding: "12px", borderRadius: "8px", width: "100%", boxSizing: "border-box" }}>
                table-top-inky.vercel.app/{slug}
              </a>

              <button style={{ background: cafe.theme.primaryColor, border: "none", padding: "16px 24px", borderRadius: "8px", fontWeight: "bold", color: "white", cursor: "pointer", width: "100%", fontSize: "16px" }}>
                Download PNG
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
