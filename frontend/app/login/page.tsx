"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import "../../src/styles/Auth.css";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "join">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [joinData, setJoinData] = useState({ name: "", cafeName: "", phone: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(`/admin/${data.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            <UtensilsCrossed size={28} strokeWidth={1.5} className="logo-icon-simple" />
            <span className="auth-logo-text">Table Top</span>
          </Link>
        </div>

        {success ? (
          <div className="auth-success">
            <h3>Thanks for your interest!</h3>
            <p>Our team will contact you shortly at {joinData.phone} to get your cafe onboarded to Table Top.</p>
            <button className="auth-btn" onClick={() => { setSuccess(false); setActiveTab("login"); }} style={{ marginTop: "24px", width: "100%" }}>
              Return to Login
            </button>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                onClick={() => { setActiveTab("login"); setError(""); }}
              >
                Sign In
              </button>
              <button 
                className={`auth-tab ${activeTab === "join" ? "active" : ""}`}
                onClick={() => { setActiveTab("join"); setError(""); }}
              >
                Join Us
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            {activeTab === "login" ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="auth-field">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="Enter your cafe username" 
                    required 
                  />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <input 
                    type="password" 
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Enter your password" 
                    required 
                  />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleJoin}>
                <div className="auth-field">
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    value={joinData.name}
                    onChange={(e) => setJoinData({...joinData, name: e.target.value})}
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="auth-field">
                  <label>Cafe Name</label>
                  <input 
                    type="text" 
                    value={joinData.cafeName}
                    onChange={(e) => setJoinData({...joinData, cafeName: e.target.value})}
                    placeholder="The Coffee House" 
                    required 
                  />
                </div>
                <div className="auth-field">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={joinData.phone}
                    onChange={(e) => setJoinData({...joinData, phone: e.target.value})}
                    placeholder="+91 98765 43210" 
                    required 
                  />
                </div>
                <button type="submit" className="auth-btn">
                  Request Access
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
