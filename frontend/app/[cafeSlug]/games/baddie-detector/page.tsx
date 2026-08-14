"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function BaddieDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const cafeSlug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";

  useEffect(() => {
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        setError("Camera access denied or unavailable.");
        console.error("Camera error:", err);
      });

    return () => {
      // Cleanup camera on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setResult(null);
    
    // Simulate scan time
    setTimeout(() => {
      setIsScanning(false);
      // Random result
      const isBaddie = Math.random() > 0.5;
      setResult(isBaddie ? "CERTIFIED BADDIE 💅✨" : "Not a Baddie today 😔");
    }, 3000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", background: "white", padding: "20px", display: "flex", alignItems: "center", gap: "16px", borderBottom: "1px solid #EAE6DF", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href={`/${cafeSlug}/games`} style={{ color: "#1A1817" }}>
          <ArrowLeft size={24} />
        </Link>
        <div style={{ fontWeight: "bold", fontSize: "18px" }}>Baddie Detector</div>
      </div>
      
      <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", flex: 1 }}>
        {error ? (
          <div style={{ background: "#FDF3F3", color: "#C62828", padding: "16px", borderRadius: "12px", textAlign: "center", width: "100%", maxWidth: "300px" }}>
            {error}
          </div>
        ) : (
          <div style={{ position: "relative", width: "100%", maxWidth: "300px", aspectRatio: "3/4", borderRadius: "24px", overflow: "hidden", background: "#000", boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          
          {/* Scanning Animation Overlay */}
          {isScanning && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "6px",
              background: "#16a34a",
              boxShadow: "0 0 24px 6px #16a34a",
              animation: "scan 1.2s infinite linear"
            }}>
              <style>
                {`
                  @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                  }
                `}
              </style>
            </div>
          )}

          {/* Result Overlay */}
          {result && (
            <div style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              background: result.includes("Not") ? "rgba(220, 38, 38, 0.95)" : "rgba(236, 72, 153, 0.95)",
              color: "white",
              padding: "32px 24px",
              textAlign: "center",
              backdropFilter: "blur(12px)",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              animation: "slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.3)"
            }}>
              <h2 style={{ margin: 0, fontSize: "26px", fontWeight: "800", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                {result}
              </h2>
              <style>
                {`
                  @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                  }
                `}
              </style>
            </div>
          )}
        </div>
      )}

      {!error && (
        <button 
          onClick={handleScan}
          disabled={isScanning}
          style={{
            marginTop: "40px",
            background: isScanning ? "#999" : "#1A1817",
            color: "white",
            border: "none",
            padding: "16px 40px",
            borderRadius: "30px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: isScanning ? "not-allowed" : "pointer",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            transition: "0.2s"
          }}
        >
          {isScanning ? "SCANNING..." : "SCAN FACE"}
        </button>
      )}
      </div>
    </div>
  );
}
