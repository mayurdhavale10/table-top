"use client";

import Link from "next/link";

export default function SaaSLandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5", color: "#1A1817", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "800px" }}>
        <h1 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "48px", marginBottom: "16px" }}>
          Table-Top SaaS Platform
        </h1>
        <p style={{ fontSize: "18px", color: "#7A7571", marginBottom: "40px" }}>
          The ultimate digital menu and ordering system for restaurants. 
        </p>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/super-admin" style={{ textDecoration: "none" }}>
            <div style={{ background: "#1A1817", color: "white", padding: "24px", borderRadius: "16px", width: "250px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", transition: "0.2s" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>👑</div>
              <h3 style={{ margin: "0 0 8px 0" }}>Super Admin</h3>
              <p style={{ margin: "0", fontSize: "14px", opacity: 0.8 }}>Manage all cafes on the platform.</p>
            </div>
          </Link>

          <Link href="/admin/sips-and-bites" style={{ textDecoration: "none" }}>
            <div style={{ background: "#FDFBF9", color: "#1A1817", border: "1px solid #D5D1CB", padding: "24px", borderRadius: "16px", width: "250px", boxShadow: "0 8px 24px rgba(0,0,0,0.05)", transition: "0.2s" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>🧑‍🍳</div>
              <h3 style={{ margin: "0 0 8px 0" }}>Cafe Admin</h3>
              <p style={{ margin: "0", fontSize: "14px", color: "#7A7571" }}>Manage Sips & Bites menu.</p>
            </div>
          </Link>

          <Link href="/sips-and-bites" style={{ textDecoration: "none" }}>
            <div style={{ background: "#FDF3F3", color: "#C62828", border: "1px solid rgba(220, 38, 38, 0.15)", padding: "24px", borderRadius: "16px", width: "250px", boxShadow: "0 8px 24px rgba(220, 38, 38, 0.05)", transition: "0.2s" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>📱</div>
              <h3 style={{ margin: "0 0 8px 0" }}>Customer View</h3>
              <p style={{ margin: "0", fontSize: "14px", opacity: 0.8 }}>View the Sips & Bites menu.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
