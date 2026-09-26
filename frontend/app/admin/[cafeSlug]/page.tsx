"use client";

import { useState, useRef } from "react";
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
  Camera
} from "lucide-react";

import { getCafeBySlug, getMenuByCafeId } from "../../../src/data/saasDb";
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
  const cafe = getCafeBySlug(slug);

  const [activeTab, setActiveTab] = useState("menu");
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

      const newItems = data.items.map((item: any, i: number) => ({
        id: `scanned_${Date.now()}_${i}`,
        cafe_id: cafe?.id,
        category: item.category?.toLowerCase() || "other",
        name: item.name,
        price: item.price,
        description: item.description,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
        type: item.type || "Veg"
      }));

      setMenuItemsList(prev => [...newItems, ...prev]);
      alert(`Successfully scanned ${newItems.length} items! Please review them.`);
      
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  // Local menu state for instant reactivity
  const initialMenu = cafe ? getMenuByCafeId(cafe.id) : [];
  const [menuItemsList, setMenuItemsList] = useState(initialMenu);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "starters",
    type: "Veg",
    price: "",
    description: "",
    image: ""
  });

  // Mock live orders data
  const [orders, setOrders] = useState([
    { id: "ORD-101", table: "Table 04", items: ["2x Garlic Potato Shots", "1x Cold Coffee"], total: 458, status: "new", time: "2 mins ago" },
    { id: "ORD-102", table: "Table 09", items: ["1x Chicken Tikka", "1x Margherita Pizza"], total: 550, status: "preparing", time: "8 mins ago" },
    { id: "ORD-103", table: "Table 02", items: ["1x Brownie", "2x Virgin Mojito"], total: 478, status: "ready", time: "15 mins ago" }
  ]);

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

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingItem) {
      // Edit existing
      setMenuItemsList(prev => prev.map(item => item.id === editingItem.id ? {
        ...item,
        name: formData.name,
        category: formData.category,
        type: formData.type,
        price: Number(formData.price),
        description: formData.description,
        image: formData.image || item.image
      } : item));
    } else {
      // Add new
      const newItem = {
        id: `item_${Date.now()}`,
        cafe_id: cafe.id,
        name: formData.name,
        category: formData.category,
        type: formData.type,
        price: Number(formData.price),
        description: formData.description,
        image: formData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"
      };
      setMenuItemsList(prev => [newItem, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (itemId) => {
    if (confirm("Are you sure you want to remove this item from your menu?")) {
      setMenuItemsList(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const copyMenuUrl = () => {
    const url = `https://table-top-inky.vercel.app/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
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
        </div>

        <nav className="admin-nav-group">
          <div className="admin-nav-label">Management</div>
          
          <button 
            onClick={() => setActiveTab("menu")} 
            className={`admin-tab ${activeTab === "menu" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><BookOpen size={18} /></span>
            <span>Menu Manager</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("orders")} 
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
            onClick={() => setActiveTab("qr")} 
            className={`admin-tab ${activeTab === "qr" ? "active" : ""}`}
          >
            <span className="admin-tab-icon"><QrIcon size={18} /></span>
            <span>QR Codes</span>
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
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid var(--adm-card-border)" }}>
                <BookOpen size={40} style={{ color: "var(--adm-text-muted)", marginBottom: "12px" }} />
                <h3 style={{ fontFamily: "var(--font-playfair), serif" }}>No menu items found</h3>
                <p style={{ color: "var(--adm-text-secondary)", fontSize: "14px" }}>Try adjusting your search query or category filter.</p>
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

            <div className="orders-grid">
              {orders.map(ord => (
                <div key={ord.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "16px", color: "var(--adm-text-primary)" }}>{ord.table}</div>
                      <div style={{ fontSize: "12px", color: "var(--adm-text-muted)" }}>{ord.id} &bull; {ord.time}</div>
                    </div>
                    <span className={`order-badge ${ord.status}`}>
                      {ord.status}
                    </span>
                  </div>

                  <div style={{ margin: "14px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {ord.items.map((it, idx) => (
                      <div key={idx} style={{ fontSize: "13.5px", color: "var(--adm-text-secondary)", display: "flex", justifyContent: "space-between" }}>
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ paddingTop: "12px", borderTop: "1px solid var(--adm-card-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontWeight: "700", fontFamily: "var(--font-playfair), serif", color: "var(--adm-accent)", fontSize: "16px" }}>
                      ₹{ord.total}
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
                      <div style={{ fontSize: "12px", color: "#2E7D32", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Check size={14} /> Ready to Serve
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
                <button type="submit" className="btn-primary">
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
