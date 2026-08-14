import React from 'react';

function InlineAdBanner() {
  return (
    <div style={{
      width: "100%",
      background: "#f4f4f4",
      borderTop: "1px solid #e0e0e0",
      borderBottom: "1px solid #e0e0e0",
      padding: "16px 0",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px" // space before next menu item
    }}>
      <span style={{
        letterSpacing: "4px",
        fontSize: "14px",
        color: "#999",
        fontWeight: "bold",
        textTransform: "uppercase"
      }}>
        Ads
      </span>
    </div>
  );
}

export default InlineAdBanner;
