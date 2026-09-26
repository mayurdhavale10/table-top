"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Settings, ArrowLeft, Plus, Shield, CheckCircle2, UtensilsCrossed } from "lucide-react";
import { cafes, menuItems as mockMenu } from "../../src/data/saasDb";
import "../../src/styles/Admin.css";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("cafes");

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon" style={{ background: "linear-gradient(135deg, #1A1817 0%, #8B2E2E 100%)" }}>
            <Shield size={20} />
          </div>
          <div>
            <h2 className="admin-sidebar-title">Super Admin</h2>
            <div className="admin-sidebar-subtitle">Table Top Platform</div>
          </div>
        </div>

        <nav className="admin-nav-group">
          <div className="admin-nav-label">Platform Controls</div>
          
          <button 
            onClick={() => setActiveTab("cafes")} 
            className={`admin-tab ${activeTab === "cafes" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><Building2 size={18} /></span>
            <span>Manage Cafes</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("settings")} 
            className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><Settings size={18} /></span>
            <span>Platform Settings</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-back-link">
            <ArrowLeft size={16} />
            <span>Back to Landing Page</span>
          </Link>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="admin-main">
        {activeTab === "cafes" && (
          <>
            <div className="admin-header">
              <div className="admin-header-title">
                <h1>Cafe Directory & Management</h1>
                <p>Onboard new partner cafes and manage white-labeled digital menu instances.</p>
              </div>
              <button className="btn-primary" onClick={() => alert("Onboarding form coming soon!")}>
                <Plus size={18} />
                <span>Onboard New Cafe</span>
              </button>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.02)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#FAF8F5", borderBottom: "1px solid var(--adm-card-border)", color: "var(--adm-text-secondary)", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    <th style={{ padding: "16px 24px", fontWeight: "700" }}>Cafe Name</th>
                    <th style={{ padding: "16px 24px", fontWeight: "700" }}>Location</th>
                    <th style={{ padding: "16px 24px", fontWeight: "700" }}>Menu Items</th>
                    <th style={{ padding: "16px 24px", fontWeight: "700" }}>Status</th>
                    <th style={{ padding: "16px 24px", fontWeight: "700" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cafes.map(cafe => (
                    <tr key={cafe.id} style={{ borderBottom: "1px solid var(--adm-card-border)" }}>
                      <td style={{ padding: "18px 24px", fontWeight: "600", fontFamily: "var(--font-playfair), serif", fontSize: "16px", color: "var(--adm-text-primary)" }}>
                        {cafe.name}
                      </td>
                      <td style={{ padding: "18px 24px", color: "var(--adm-text-secondary)", fontSize: "13.5px" }}>
                        {cafe.location}
                      </td>
                      <td style={{ padding: "18px 24px", color: "var(--adm-text-secondary)", fontSize: "13.5px" }}>
                        {mockMenu.filter(m => m.cafe_id === cafe.id).length} items
                      </td>
                      <td style={{ padding: "18px 24px" }}>
                        <span style={{ background: "#E8F5E9", color: "#2E7D32", padding: "4px 10px", borderRadius: "999px", fontSize: "11.5px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={12} /> Active
                        </span>
                      </td>
                      <td style={{ padding: "18px 24px" }}>
                        <Link 
                          href={`/admin/${cafe.slug}`} 
                          className="btn-icon-action"
                          style={{ textDecoration: "none", display: "inline-flex" }}
                        >
                          Manage Dashboard &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <div>
            <div className="admin-header">
              <div className="admin-header-title">
                <h1>Platform Settings</h1>
                <p>Global configuration for white-labeled restaurant domains and API connections.</p>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "32px", border: "1px solid var(--adm-card-border)", maxWidth: "600px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <UtensilsCrossed size={24} style={{ color: "var(--adm-accent)" }} />
                <h3 style={{ fontFamily: "var(--font-playfair), serif", margin: 0, fontSize: "20px" }}>Table Top Platform Core v1.0</h3>
              </div>
              <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px", lineHeight: 1.6 }}>
                All cafes are currently set up with zero-install direct QR routing, boutique parchment editorial styling, and live JSON-persisted menu manager.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
