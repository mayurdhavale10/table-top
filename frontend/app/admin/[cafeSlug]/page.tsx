"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { 
  BookOpen, 
  ChefHat, 
  QrCode as QrIcon, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Check, 
  X, 
  UtensilsCrossed, 
  Store, 
  TrendingUp, 
  Sparkles,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Paperclip,
  Menu as MenuIcon
} from "lucide-react";

import { HYGIENE_CHECKLIST, HYGIENE_MAX_SCORE, STAR_LABELS, computeCriticalEvidenceStats } from "../../../src/data/hygieneChecklist";
import { compressImage } from "../../../src/lib/compressImage";

const ALL_HYGIENE_QUESTIONS = HYGIENE_CHECKLIST.flatMap((s) => s.questions);
const getHygieneQuestionById = (id: number) => ALL_HYGIENE_QUESTIONS.find((q) => q.id === id);
import "../../../src/styles/Admin.css";

// Helper component for handling image loading errors cleanly
function ImageWithFallback({ src, alt, className, style }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="item-img-fallback">
        <UtensilsCrossed size={28} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      style={style}
      onError={() => setError(true)} 
    />
  );
}

export default function CafeAdminDashboard() {
  const params = useParams();
  const slug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "";

  const [cafe, setCafe] = useState<any>(null);
  const [cafeLoading, setCafeLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);

  const fetchCafe = async () => {
    setCafeLoading(true);
    try {
      const res = await fetch(`/api/cafe?slug=${slug}`);
      const data = await res.json();
      setCafe(res.ok ? data.cafe : null);
    } catch (err) {
      console.error("Failed to load cafe", err);
      setCafe(null);
    } finally {
      setCafeLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    setMenuLoading(true);
    try {
      const res = await fetch(`/api/menu-items?cafeSlug=${slug}`);
      const data = await res.json();
      if (res.ok) setMenuItemsList(data.items || []);
    } catch (err) {
      console.error("Failed to load menu items", err);
    } finally {
      setMenuLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchCafe();
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const [activeTab, setActiveTab] = useState("menu");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const goToTab = (tab: string) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanMenu = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/menu/scan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to scan menu");

      // Persist each scanned item to MongoDB so it actually shows up on the live menu
      const createdItems = [];
      for (const item of data.items) {
        const createRes = await fetch("/api/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cafeSlug: slug,
            name: item.name,
            category: item.category?.toLowerCase() || "other",
            price: item.price,
            description: item.description,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
            type: item.type || "Veg",
          }),
        });
        const createData = await createRes.json();
        if (createRes.ok) createdItems.push(createData.item);
      }

      setMenuItemsList(prev => [...createdItems, ...prev]);
      alert(`Successfully scanned and saved ${createdItems.length} items! Please review them.`);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  // Local menu state for instant reactivity
  const [menuItemsList, setMenuItemsList] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [savingItem, setSavingItem] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "starters",
    type: "Veg",
    price: "",
    description: "",
    image: ""
  });

  // Live orders (from MongoDB)
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Analytics (from MongoDB, aggregated)
  const [analytics, setAnalytics] = useState<{ totalOrders: number; totalRevenue: number; topItems: any[]; tip: string | null } | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [insightLoading, setInsightLoading] = useState(false);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?cafeSlug=${slug}`);
      const data = await res.json();
      if (res.ok) setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchAnalytics = async (withInsight = false) => {
    if (withInsight) setInsightLoading(true);
    else setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics?cafeSlug=${slug}${withInsight ? "&insight=true" : ""}`);
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setAnalyticsLoading(false);
      setInsightLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchOrders(); // keeps the sidebar's "new orders" badge accurate at all times
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Hygiene & Safety compliance tracker
  const [hygieneView, setHygieneView] = useState<"history" | "new">("history");
  const [hygieneAudits, setHygieneAudits] = useState<any[]>([]);
  const [hygieneLoading, setHygieneLoading] = useState(false);
  const [checklistResponses, setChecklistResponses] = useState<Record<number, "yes" | "no" | "na">>({});
  const [checklistNotes, setChecklistNotes] = useState("");
  const [submittingHygiene, setSubmittingHygiene] = useState(false);
  const [lastHygieneResult, setLastHygieneResult] = useState<any>(null);
  const [evidenceState, setEvidenceState] = useState<Record<number, { url?: string; validUntil?: string; uploading?: boolean }>>({});
  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  const totalQuestions = HYGIENE_CHECKLIST.flatMap(s => s.questions).length;
  const answeredCount = Object.keys(checklistResponses).length;

  const fetchHygieneAudits = async () => {
    setHygieneLoading(true);
    try {
      const res = await fetch(`/api/hygiene?cafeSlug=${slug}`);
      const data = await res.json();
      if (res.ok) setHygieneAudits(data.audits || []);
    } catch (err) {
      console.error("Failed to load hygiene audits", err);
    } finally {
      setHygieneLoading(false);
    }
  };

  const setAnswer = (questionId: number, answer: "yes" | "no" | "na") => {
    setChecklistResponses(prev => ({ ...prev, [questionId]: answer }));
  };

  const startNewAssessment = () => {
    setChecklistResponses({});
    setChecklistNotes("");
    setEvidenceState({});
    setLastHygieneResult(null);
    setHygieneView("new");
  };

  const handleEvidenceUpload = async (questionId: number, file: File) => {
    setEvidenceState(prev => ({ ...prev, [questionId]: { ...prev[questionId], uploading: true } }));
    try {
      const compressed = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressed);
      formData.append("cafeSlug", slug);

      const res = await fetch("/api/hygiene/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setEvidenceState(prev => ({ ...prev, [questionId]: { ...prev[questionId], url: data.url, uploading: false } }));
    } catch (err: any) {
      alert(err.message);
      setEvidenceState(prev => ({ ...prev, [questionId]: { ...prev[questionId], uploading: false } }));
    }
  };

  const setEvidenceExpiry = (questionId: number, date: string) => {
    setEvidenceState(prev => ({ ...prev, [questionId]: { ...prev[questionId], validUntil: date } }));
  };

  const submitAssessment = async () => {
    setSubmittingHygiene(true);
    try {
      const evidencePayload: Record<number, { url: string; validUntil?: string }> = {};
      Object.entries(evidenceState).forEach(([qid, ev]) => {
        if (ev.url) evidencePayload[Number(qid)] = { url: ev.url, validUntil: ev.validUntil };
      });

      const res = await fetch("/api/hygiene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafeSlug: slug, responses: checklistResponses, evidence: evidencePayload, notes: checklistNotes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit assessment");
      setLastHygieneResult(data);
      setHygieneView("history");
      fetchHygieneAudits();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingHygiene(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "analytics" && !analytics) fetchAnalytics();
    if (activeTab === "hygiene" && hygieneAudits.length === 0) fetchHygieneAudits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, slug]);

  if (cafeLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF8F5", color: "#7A7571" }}>
        Loading dashboard...
      </div>
    );
  }

  if (!cafe) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF8F5", color: "#1A1817" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Store size={48} style={{ color: "#8B2E2E", marginBottom: "16px" }} />
          <h2 style={{ fontFamily: "var(--font-playfair), serif" }}>Cafe Not Found</h2>
          <p style={{ color: "#7A7571" }}>The cafe slug &quot;{slug}&quot; was not found in our records.</p>
          <Link href="/" className="btn-primary" style={{ marginTop: "16px" }}>
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Categories extraction
  const categoriesList = ["All", ...Array.from(new Set(menuItemsList.map(item => item.category)))];

  // Filtering
  const filteredItems = menuItemsList.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Form Handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "starters",
      type: "Veg",
      price: "",
      description: "",
      image: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      type: item.type || "Veg",
      price: item.price,
      description: item.description || "",
      image: item.image || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    setSavingItem(true);
    try {
      if (editingItem) {
        const res = await fetch(`/api/menu-items/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            type: formData.type,
            price: Number(formData.price),
            description: formData.description,
            image: formData.image || editingItem.image,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update item");
        setMenuItemsList(prev => prev.map(item => item.id === editingItem.id ? data.item : item));
      } else {
        const res = await fetch("/api/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cafeSlug: slug,
            name: formData.name,
            category: formData.category,
            type: formData.type,
            price: Number(formData.price),
            description: formData.description,
            image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create item");
        setMenuItemsList(prev => [data.item, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to remove this item from your menu?")) return;
    try {
      const res = await fetch(`/api/menu-items/${itemId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete item");
      }
      setMenuItemsList(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyMenuUrl = () => {
    const url = `https://table-top-inky.vercel.app/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const updateOrderStatus = async (orderId: string, nextStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
    } catch (err) {
      console.error(err);
      fetchOrders(); // revert to server truth on failure
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-brand-icon">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h2 className="admin-sidebar-title">{cafe.name}</h2>
            <div className="admin-sidebar-subtitle">{cafe.location}</div>
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
          <div className="admin-nav-label">Management</div>

          <button
            onClick={() => goToTab("menu")}
            className={`admin-tab ${activeTab === "menu" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><BookOpen size={18} /></span>
            <span>Menu Manager</span>
          </button>

          <button
            onClick={() => goToTab("orders")}
            className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><ChefHat size={18} /></span>
            <span>Live Orders</span>
            {orders.filter(o => o.status === "new").length > 0 && (
              <span style={{ marginLeft: "auto", background: "#8B2E2E", color: "#FFF", fontSize: "11px", fontWeight: "bold", padding: "2px 6px", borderRadius: "99px" }}>
                {orders.filter(o => o.status === "new").length}
              </span>
            )}
          </button>

          <button
            onClick={() => goToTab("qr")}
            className={`admin-tab ${activeTab === "qr" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><QrIcon size={18} /></span>
            <span>QR Codes</span>
          </button>

          <button
            onClick={() => goToTab("analytics")}
            className={`admin-tab ${activeTab === "analytics" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><TrendingUp size={18} /></span>
            <span>Analytics</span>
          </button>

          <button
            onClick={() => goToTab("hygiene")}
            className={`admin-tab ${activeTab === "hygiene" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><ShieldCheck size={18} /></span>
            <span>Hygiene & Safety</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <Link href={`/${slug}`} className="admin-back-link">
            <ArrowLeft size={16} />
            <span>View Public Menu</span>
          </Link>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="admin-main">
        {activeTab === "menu" && (
          <>
            {/* Header */}
            <div className="admin-header">
              <div className="admin-header-title">
                <h1>Menu Manager</h1>
                <p>Manage prices, dish descriptions, and category offerings in real-time.</p>
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  ref={fileInputRef}
                  onChange={handleScanMenu}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="btn-primary"
                  style={{ background: "#1A1817", opacity: isScanning ? 0.7 : 1 }}
                >
                  <Camera size={18} />
                  <span>{isScanning ? "Scanning..." : "Scan Menu"}</span>
                </button>
                <button onClick={handleOpenAddModal} className="btn-primary">
                <Plus size={18} />
                <span>Add New Item</span>
              </button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Total Items</div>
                  <div className="stat-value">{menuItemsList.length}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-info">
                  <div className="stat-label">Categories</div>
                  <div className="stat-value">{categoriesList.length - 1}</div>
                </div>
              </div>

              <div className="stat-card" style={{ "--adm-stat-accent": "#2E7D32" } as React.CSSProperties}>
                <div className="stat-info">
                  <div className="stat-label">Veg Items</div>
                  <div className="stat-value">{menuItemsList.filter(i => i.type?.toLowerCase() === "veg").length}</div>
                </div>
              </div>

              <div className="stat-card" style={{ "--adm-stat-accent": "#C62828" } as React.CSSProperties}>
                <div className="stat-info">
                  <div className="stat-label">Non-Veg Items</div>
                  <div className="stat-value">{menuItemsList.filter(i => i.type?.toLowerCase() === "non veg").length}</div>
                </div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="admin-toolbar">
              <div className="admin-search-box">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search dishes or ingredients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="category-filter-pills">
                {categoriesList.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`pill-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            {menuLoading ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--adm-text-muted)" }}>Loading menu...</div>
            ) : filteredItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)" }}>
                <BookOpen size={40} style={{ color: "var(--adm-text-muted)", marginBottom: "12px" }} />
                <h3 style={{ fontFamily: "var(--font-playfair), serif" }}>No menu items found</h3>
                <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px" }}>{menuItemsList.length === 0 ? "Add your first dish, or scan an existing menu to get started." : "Try adjusting your search query or category filter."}</p>
              </div>
            ) : (
              <div className="admin-menu-grid">
                {filteredItems.map(item => (
                  <div key={item.id} className="admin-menu-item">
                    <div className="item-details">
                      <div>
                        <div className={`item-type-badge ${item.type?.toLowerCase() === 'non veg' ? 'non-veg' : 'veg'}`}>
                          <span className="type-dot"></span>
                          {item.type || 'Veg'} &bull; {item.category}
                        </div>
                        <div className="item-title">{item.name}</div>
                        {item.description && <div className="item-desc">{item.description}</div>}
                      </div>

                      <div className="item-footer">
                        <div className="item-price">₹{item.price}</div>
                        <div className="item-actions">
                          <button 
                            onClick={() => handleOpenEditModal(item)}
                            className="btn-icon-action"
                            title="Edit Item"
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="btn-icon-action btn-icon-delete"
                            title="Remove Item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* QR Code Tab */}
        {activeTab === "qr" && (
          <div>
            <div className="admin-header">
              <div className="admin-header-title">
                <h1>Digital QR Code</h1>
                <p>Print & place this QR code on tables, counter top stands, or table tent cards.</p>
              </div>
            </div>

            <div className="qr-container-card">
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--adm-gold-soft)", color: "var(--adm-accent)", padding: "6px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "16px" }}>
                <Sparkles size={14} /> Official Menu QR Code
              </div>
              <h2 style={{ fontFamily: "var(--font-playfair), serif", fontSize: "26px", margin: "0 0 6px" }}>{cafe.name}</h2>
              <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px", margin: "0 0 24px" }}>Scan to view live zero-install menu</p>

              <div className="qr-preview-box">
                <QRCode 
                  value={`https://table-top-inky.vercel.app/${slug}`} 
                  size={210}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  viewBox={`0 0 256 256`}
                />
              </div>

              <div className="url-badge">
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  table-top-inky.vercel.app/{slug}
                </span>
                <button onClick={copyMenuUrl} style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  {copiedUrl ? <Check size={16} color="#2E7D32" /> : <Copy size={16} />}
                </button>
              </div>

              <div style={{ display: "flex", gap: "12px", width: "100%" }}>
                <a 
                  href={`/${slug}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-primary" 
                  style={{ flex: 1, textDecoration: "none", justifyContent: "center", background: "#1A1817" }}
                >
                  <ExternalLink size={16} />
                  <span>Preview Live</span>
                </a>
                <button 
                  onClick={() => alert("Downloading printable PDF flyer...")} 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Download Printable QR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <div className="admin-header">
              <div className="admin-header-title">
                <h1>Live Kitchen Orders</h1>
                <p>Track incoming customer orders placed directly from table QR codes.</p>
              </div>
            </div>

            {ordersLoading ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--adm-text-muted)" }}>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)" }}>
                <ChefHat size={40} style={{ color: "var(--adm-text-muted)", marginBottom: "12px" }} />
                <h3 style={{ fontFamily: "var(--font-playfair), serif" }}>No orders yet</h3>
                <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px" }}>Orders placed from your live menu will show up here in real time.</p>
              </div>
            ) : (
              <div className="orders-grid">
                {orders.map(ord => (
                  <div key={ord.id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "16px", color: "var(--adm-text-primary)" }}>
                          {ord.tableNumber ? `Table ${ord.tableNumber}` : "No table given"}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--adm-text-muted)" }}>
                          #{ord.id.slice(-6).toUpperCase()} &bull; {new Date(ord.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <span className={`order-badge ${ord.status}`}>
                        {ord.status}
                      </span>
                    </div>

                    <div style={{ margin: "14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {ord.items.map((it: any, idx: number) => (
                        <div key={idx} style={{ fontSize: "13.5px", color: "var(--adm-text-secondary)", display: "flex", justifyContent: "space-between" }}>
                          <span>{it.quantity}x {it.name}</span>
                        </div>
                      ))}
                      {ord.specialInstructions && (
                        <div style={{ fontSize: "12.5px", color: "var(--adm-accent)", fontStyle: "italic", marginTop: "4px" }}>
                          Note: {ord.specialInstructions}
                        </div>
                      )}
                    </div>

                    <div style={{ paddingTop: "12px", borderTop: "1px solid var(--adm-card-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: "700", fontFamily: "var(--font-playfair), serif", color: "var(--adm-accent)", fontSize: "16px" }}>
                        ₹{ord.grandTotal.toFixed(0)}
                      </div>

                      {ord.status === "new" && (
                        <button onClick={() => updateOrderStatus(ord.id, "preparing")} className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px" }}>
                          Mark Preparing
                        </button>
                      )}
                      {ord.status === "preparing" && (
                        <button onClick={() => updateOrderStatus(ord.id, "ready")} className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px", background: "#2E7D32" }}>
                          Mark Ready
                        </button>
                      )}
                      {ord.status === "ready" && (
                        <button onClick={() => updateOrderStatus(ord.id, "completed")} className="btn-primary" style={{ padding: "6px 12px", fontSize: "12px", background: "#2E7D32" }}>
                          Mark Completed
                        </button>
                      )}
                      {ord.status === "completed" && (
                        <div style={{ fontSize: "12px", color: "#2E7D32", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Check size={14} /> Completed
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <div className="admin-header">
              <div className="admin-header-title">
                <h1>Sales Analytics</h1>
                <p>See what's selling, what's not, and get AI-powered tips to grow revenue.</p>
              </div>
            </div>

            {analyticsLoading ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--adm-text-muted)" }}>Loading analytics...</div>
            ) : !analytics || analytics.totalOrders === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)" }}>
                <TrendingUp size={40} style={{ color: "var(--adm-text-muted)", marginBottom: "12px" }} />
                <h3 style={{ fontFamily: "var(--font-playfair), serif" }}>No sales data yet</h3>
                <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px" }}>Once customers start ordering from your live menu, insights will show up here.</p>
              </div>
            ) : (
              <>
                <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                  <div className="stat-card">
                    <div className="stat-info">
                      <div className="stat-label">Total Orders</div>
                      <div className="stat-value">{analytics.totalOrders}</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-info">
                      <div className="stat-label">Total Revenue</div>
                      <div className="stat-value">₹{analytics.totalRevenue.toFixed(0)}</div>
                    </div>
                  </div>
                </div>

                <div className="analytics-panel">
                  <h3 className="analytics-panel-title">Top Selling Items</h3>
                  <div className="analytics-top-list">
                    {analytics.topItems.map((item: any, idx: number) => (
                      <div key={item.name} className="analytics-top-row">
                        <span className="analytics-rank">{idx + 1}</span>
                        <span className="analytics-item-name">{item.name}</span>
                        <span className="analytics-item-qty">{item.totalQuantity} sold</span>
                        <span className="analytics-item-revenue">₹{item.totalRevenue.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ai-insight-card">
                  <div className="ai-insight-header">
                    <Sparkles size={18} />
                    <span>AI Sales Tip</span>
                  </div>
                  {analytics.tip ? (
                    <p className="ai-insight-text">{analytics.tip}</p>
                  ) : (
                    <p className="ai-insight-placeholder">Generate a personalized tip based on your sales data.</p>
                  )}
                  <button onClick={() => fetchAnalytics(true)} disabled={insightLoading} className="btn-primary" style={{ marginTop: "12px" }}>
                    {insightLoading ? "Thinking..." : analytics.tip ? "Regenerate Tip" : "Generate Insight"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Hygiene & Safety Tab */}
        {activeTab === "hygiene" && (
          <div>
            <div className="admin-header">
              <div className="admin-header-title">
                <h1>Hygiene & Safety</h1>
                <p>Self-assessment against FSSAI's official Hygiene Rating checklist. Keep a running audit trail ready for any inspection.</p>
              </div>
              {hygieneView === "history" && (
                <button onClick={startNewAssessment} className="btn-primary">
                  <Plus size={18} />
                  <span>New Self-Assessment</span>
                </button>
              )}
            </div>

            {hygieneView === "new" ? (
              <div>
                <div className="analytics-panel" style={{ position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--adm-text-primary)" }}>Answered {answeredCount} of {totalQuestions}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--adm-text-secondary)" }}>Items marked with a red badge are FSSAI-critical: a "No" here means automatic non-compliance.</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => setHygieneView("history")} className="btn-icon-action" style={{ padding: "10px 18px", fontSize: "14px" }}>
                      Cancel
                    </button>
                    <button
                      onClick={submitAssessment}
                      disabled={submittingHygiene || answeredCount < totalQuestions}
                      className="btn-primary"
                      title={answeredCount < totalQuestions ? "Answer every question to submit" : ""}
                    >
                      {submittingHygiene ? "Submitting..." : "Submit Assessment"}
                    </button>
                  </div>
                </div>

                {HYGIENE_CHECKLIST.map((section) => (
                  <div key={section.section} className="analytics-panel">
                    <h3 className="analytics-panel-title">{section.section}</h3>
                    {section.questions.map((q) => (
                      <div key={q.id} className="checklist-question">
                        <div className="checklist-question-text">
                          <span className="checklist-question-number">{q.id}.</span> {q.text}
                          {q.critical && <span className="critical-badge">Critical</span>}
                          {q.note && <div className="checklist-question-note">{q.note}</div>}
                          {q.evidence && (
                            <div className="evidence-control">
                              <label className="evidence-upload-btn">
                                <Paperclip size={13} />
                                {evidenceState[q.id]?.uploading
                                  ? "Uploading..."
                                  : evidenceState[q.id]?.url
                                  ? "Replace evidence"
                                  : `Attach ${q.evidence.label}`}
                                <input
                                  type="file"
                                  accept={q.evidence.type === "live_photo" ? "image/*" : "image/*,.pdf,application/pdf"}
                                  capture={q.evidence.type === "live_photo" ? "environment" : undefined}
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleEvidenceUpload(q.id, file);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                              {evidenceState[q.id]?.url && (
                                <a href={evidenceState[q.id].url} target="_blank" rel="noreferrer" className="evidence-view-link">
                                  View attached
                                </a>
                              )}
                              {q.evidence.expiryMonths && evidenceState[q.id]?.url && (
                                <input
                                  type="date"
                                  value={evidenceState[q.id]?.validUntil || ""}
                                  onChange={(e) => setEvidenceExpiry(q.id, e.target.value)}
                                  className="evidence-date-input"
                                  title="Valid until"
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="checklist-answer-group">
                          <button
                            onClick={() => setAnswer(q.id, "yes")}
                            className={`checklist-answer-btn yes ${checklistResponses[q.id] === "yes" ? "active" : ""}`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setAnswer(q.id, "no")}
                            className={`checklist-answer-btn no ${checklistResponses[q.id] === "no" ? "active" : ""}`}
                          >
                            No
                          </button>
                          <button
                            onClick={() => setAnswer(q.id, "na")}
                            className={`checklist-answer-btn na ${checklistResponses[q.id] === "na" ? "active" : ""}`}
                          >
                            N/A
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                <div className="analytics-panel">
                  <h3 className="analytics-panel-title">Notes (optional)</h3>
                  <textarea
                    value={checklistNotes}
                    onChange={(e) => setChecklistNotes(e.target.value)}
                    placeholder="Anything specific to flag for this assessment (e.g. pending repairs, staff on leave)..."
                    rows={3}
                    style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid var(--adm-card-border)", fontSize: "14px", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            ) : hygieneLoading ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--adm-text-muted)" }}>Loading hygiene records...</div>
            ) : hygieneAudits.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)" }}>
                <ShieldCheck size={40} style={{ color: "var(--adm-text-muted)", marginBottom: "12px" }} />
                <h3 style={{ fontFamily: "var(--font-playfair), serif" }}>No self-assessments yet</h3>
                <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px" }}>Run your first hygiene self-assessment against the official FSSAI checklist to start building your audit trail.</p>
              </div>
            ) : (
              <>
                {(() => {
                  const latest = hygieneAudits[0];
                  const latestEvidenceMap: Record<number, { url: string }> = {};
                  latest.responses.forEach((r: any) => {
                    if (r.evidenceUrl) latestEvidenceMap[r.questionId] = { url: r.evidenceUrl };
                  });
                  const criticalStats = computeCriticalEvidenceStats(latestEvidenceMap);
                  const now = new Date();
                  const expiredItems = latest.responses.filter(
                    (r: any) => r.validUntil && new Date(r.validUntil) < now
                  );

                  return (
                    <div className="hygiene-summary-card">
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--adm-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "6px" }}>
                          Latest Self-Assessment
                        </div>
                        <div style={{ fontFamily: "var(--font-playfair), serif", fontSize: "28px", fontWeight: 600, color: latest.hasCriticalFailure ? "#C62828" : "var(--adm-text-primary)" }}>
                          {latest.hasCriticalFailure ? "Non-Compliant" : `${latest.starRating} / 5 Stars`}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--adm-text-secondary)", marginTop: "4px" }}>
                          {STAR_LABELS[latest.starRating]} &bull; {latest.earnedScore}/{latest.possibleScore} points ({latest.percentage.toFixed(0)}%)
                          &bull; {new Date(latest.createdAt).toLocaleDateString()}
                        </div>
                        {criticalStats.total > 0 && (
                          <div style={{ fontSize: "12.5px", color: "var(--adm-text-secondary)", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Paperclip size={12} />
                            {criticalStats.verified}/{criticalStats.total} critical items backed by evidence
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {latest.hasCriticalFailure && (
                          <div className="hygiene-critical-warning">
                            <AlertTriangle size={18} />
                            <span>A critical FSSAI item failed. Address it before your next inspection.</span>
                          </div>
                        )}
                        {expiredItems.length > 0 && (
                          <div className="hygiene-critical-warning">
                            <AlertTriangle size={18} />
                            <span>{expiredItems.length} evidence document{expiredItems.length > 1 ? "s have" : " has"} expired — renewal needed.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="analytics-panel">
                  <h3 className="analytics-panel-title">Assessment History</h3>
                  <p style={{ fontSize: "12.5px", color: "var(--adm-text-muted)", marginTop: "-10px", marginBottom: "14px" }}>
                    Click a row to view its attached evidence.
                  </p>
                  <div className="analytics-top-list">
                    {hygieneAudits.map((audit) => {
                      const evidenceResponses = audit.responses.filter((r: any) => r.evidenceUrl);
                      const isExpanded = expandedAuditId === audit.id;
                      return (
                        <div key={audit.id}>
                          <div
                            className="hygiene-history-row"
                            onClick={() => setExpandedAuditId(isExpanded ? null : audit.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <span style={{ fontSize: "13.5px", color: "var(--adm-text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                              {new Date(audit.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                              {evidenceResponses.length > 0 && <Paperclip size={12} />}
                            </span>
                            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--adm-text-primary)" }}>
                              {audit.earnedScore}/{audit.possibleScore} pts ({audit.percentage.toFixed(0)}%)
                            </span>
                            <span className={`hygiene-status-pill ${audit.hasCriticalFailure ? "fail" : ""}`}>
                              {audit.hasCriticalFailure ? "Non-Compliant" : `${audit.starRating}★ ${STAR_LABELS[audit.starRating]}`}
                            </span>
                          </div>
                          {isExpanded && (
                            <div className="hygiene-evidence-panel">
                              {evidenceResponses.length === 0 ? (
                                <span style={{ fontSize: "12.5px", color: "var(--adm-text-muted)", fontStyle: "italic" }}>
                                  No evidence was attached to this submission.
                                </span>
                              ) : (
                                evidenceResponses.map((r: any) => {
                                  const q = getHygieneQuestionById(r.questionId);
                                  const isExpired = r.validUntil && new Date(r.validUntil) < new Date();
                                  return (
                                    <div key={r.questionId} className="hygiene-evidence-item">
                                      <a href={r.evidenceUrl} target="_blank" rel="noreferrer">
                                        <Paperclip size={12} /> {q?.evidence?.label || `Item ${r.questionId}`}
                                      </a>
                                      {r.validUntil && (
                                        <span className={isExpired ? "expired" : ""}>
                                          valid until {new Date(r.validUntil).toLocaleDateString()}
                                          {isExpired && " — EXPIRED"}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p style={{ fontSize: "12px", color: "var(--adm-text-muted)", fontStyle: "italic" }}>
                  This is a self-assessment tool based on FSSAI's published Hygiene Rating checklist. It is not an official government rating — official certification requires validation by a Hygiene Rating Audit Agency or Food Safety Officer.
                </p>
              </>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? "Edit Menu Item" : "Add New Dish"}</h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="modal-form">
              <div className="form-group">
                <label>Dish Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Artisanal Garlic Bread"
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="starters">Starters</option>
                    <option value="pizza">Pizza</option>
                    <option value="burgers">Burgers</option>
                    <option value="pasta">Pasta</option>
                    <option value="drinks">Drinks</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non Veg">Non Veg</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="199"
                  value={formData.price} 
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  rows={3} 
                  placeholder="Short appetizing details about this dish..."
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-icon-action" style={{ padding: "10px 18px", fontSize: "14px" }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={savingItem}>
                  {savingItem ? "Saving..." : editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
