"use client";

import { useState } from "react";
import Link from "next/link";
import { cafes, menuItems as mockMenu } from "../../src/data/saasDb";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("cafes");

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#111827", color: "white", padding: "24px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "40px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>👑</span> Super Admin
        </h2>
        
        <button onClick={() => setActiveTab("cafes")} style={{ background: activeTab === "cafes" ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: "white", padding: "12px", textAlign: "left", borderRadius: "8px", cursor: "pointer", marginBottom: "8px", fontSize: "16px" }}>
          🏢 Manage Cafes
        </button>
        <button onClick={() => setActiveTab("settings")} style={{ background: activeTab === "settings" ? "rgba(255,255,255,0.1)" : "transparent", border: "none", color: "white", padding: "12px", textAlign: "left", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
          ⚙️ Settings
        </button>

        <div style={{ marginTop: "auto" }}>
          <Link href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: "14px" }}>
            &larr; Back to App
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#111827" }}>Cafe Management</h1>
          <button style={{ background: "#3b82f6", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            + Onboard New Cafe
          </button>
        </div>

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", textAlign: "left", color: "#6b7280", fontSize: "12px", textTransform: "uppercase" }}>
                <th style={{ padding: "16px 24px" }}>Cafe Name</th>
                <th style={{ padding: "16px 24px" }}>Location</th>
                <th style={{ padding: "16px 24px" }}>Menu Items</th>
                <th style={{ padding: "16px 24px" }}>Status</th>
                <th style={{ padding: "16px 24px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cafes.map(cafe => (
                <tr key={cafe.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "16px 24px", fontWeight: "bold", color: "#111827" }}>{cafe.name}</td>
                  <td style={{ padding: "16px 24px", color: "#4b5563" }}>{cafe.location}</td>
                  <td style={{ padding: "16px 24px", color: "#4b5563" }}>{mockMenu.filter(m => m.cafe_id === cafe.id).length} items</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ background: "#dcfce3", color: "#166534", padding: "4px 8px", borderRadius: "999px", fontSize: "12px", fontWeight: "bold" }}>Active</span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <Link href={`/admin/${cafe.slug}`} style={{ color: "#3b82f6", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
                      Manage &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
