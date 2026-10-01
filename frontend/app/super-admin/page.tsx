"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, Settings, ArrowLeft, Plus, Shield, CheckCircle2, UtensilsCrossed, Menu as MenuIcon, X } from "lucide-react";
import "../../src/styles/Admin.css";

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState("cafes");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [cafes, setCafes] = useState<any[]>([]);
  const [cafesLoading, setCafesLoading] = useState(true);

  const goToTab = (tab: string) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  useEffect(() => {
    fetch("/api/cafes")
      .then((res) => res.json())
      .then((data) => setCafes(data.cafes || []))
      .catch((err) => console.error("Failed to load cafes", err))
      .finally(() => setCafesLoading(false));
  }, []);

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
          <button
            className="admin-mobile-menu-toggle"
            onClick={() => setMobileNavOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>

        <nav className={`admin-nav-group ${mobileNavOpen ? "mobile-open" : ""}`}>
          <div className="admin-nav-label">Platform Controls</div>

          <button
            onClick={() => goToTab("cafes")}
            className={`admin-tab ${activeTab === "cafes" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><Building2 size={18} /></span>
            <span>Manage Cafes</span>
          </button>

          <button
            onClick={() => goToTab("settings")}
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

            {cafesLoading ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--adm-text-secondary)" }}>Loading cafes...</div>
            ) : cafes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)" }}>
                <Building2 size={40} style={{ color: "var(--adm-text-muted)", marginBottom: "12px" }} />
                <h3 style={{ fontFamily: "var(--font-playfair), serif" }}>No cafes onboarded yet</h3>
              </div>
            ) : (
              <div style={{ background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)", boxShadow: "0 4px 16px rgba(0,0,0,0.02)", overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "600px", borderCollapse: "collapse", textAlign: "left" }}>
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
                          {cafe.menuItemCount} items
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
            )}
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
