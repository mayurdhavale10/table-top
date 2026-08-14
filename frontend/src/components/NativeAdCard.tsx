import React from 'react';
import "../styles/MenuCard.css"; // Reuse the exact same CSS so it adapts natively!

function NativeAdCard({ sponsorName, description, tag, ctaText }) {
  return (
    <div className="menu-card" style={{ border: "1px solid #EAE6DF", background: "#FDFBF9" }}>
      {/* Ad Tag to ensure compliance */}
      <div style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        fontSize: "10px",
        padding: "4px 8px",
        borderRadius: "4px",
        fontWeight: "bold",
        textTransform: "uppercase",
        zIndex: 2
      }}>
        Sponsored
      </div>

      <div className="image-container">
        {/* Placeholder for Sponsor Image */}
        <div style={{ width: "100%", height: "100%", background: "#EAE6DF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "32px" }}>✨</span>
        </div>
      </div>

      <div className="menu-content">
        <h3 className="menu-title">{sponsorName}</h3>
        
        {/* Mimicking the Health Bar layout for the Ad tagline */}
        <div className="health-bar" style={{ background: "#F3EFEA", color: "#8A8581", justifyContent: "center" }}>
          <span>{tag}</span>
        </div>
        
        <p className="menu-description" style={{ marginTop: "12px", marginBottom: "16px" }}>
          {description}
        </p>

        <button className="add-button" onClick={() => alert("Ad clicked!")} style={{ background: "#1A1817", color: "#FAF8F5" }}>
          {ctaText}
        </button>
      </div>
    </div>
  );
}

export default NativeAdCard;
