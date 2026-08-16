import Link from "next/link";
import { UtensilsCrossed, ShieldCheck, Gamepad2, FileText, Smartphone, ArrowRight, TrendingUp } from "lucide-react";
import "../src/styles/Landing.css";

const painPoints = [
  {
    icon: FileText,
    title: "For Cafes: The Reprint Nightmare",
    description: "Prices doubled overnight? Marking an item 'Sold Out' or changing a price shouldn't require a developer or reprinting 50 physical menus.",
  },
  {
    icon: Smartphone,
    title: "For Diners: The Fake Price Tag",
    description: "You never know the real menu or the real prices because third-party delivery apps inflate them by 30% to cover commissions.",
  },
  {
    icon: ShieldCheck,
    title: "For Cafes: Expensive Hardware",
    description: "Why pay ₹50,000 for clunky ordering tablets and rigid ERPs? Your customers already have the best hardware in their pockets.",
  },
];

const features = [
  {
    icon: UtensilsCrossed,
    title: "One QR Code. Live Updates.",
    description: "No app to install. A gorgeous, premium digital menu that perfectly matches your brand and updates instantly from your dashboard.",
  },
  {
    icon: TrendingUp,
    title: "Turn Menus Into Billboards",
    description: "The only platform that lets you sell hyper-local ad space inside your menu. Let the jeweler next door sponsor your appetizers. Your menu now prints money.",
  },
  {
    icon: Gamepad2,
    title: "The 'Boredom Killer'",
    description: "Customers hate waiting for food. Built-in retro arcade games keep them entertained, drastically reducing complaints and bad reviews.",
  },
];

export default function SaaSLandingPage() {
  return (
    <div className="landing">
      {/* Navbar completely removed as requested */}

      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-logo">
             Table Top
             <div className="logo-underline"></div>
          </div>
          
          <div className="landing-hero-text">
            <h1>Simple ordering.<br/>Good food.<br/>Great company.</h1>
            <Link href="/sips-and-bites" className="landing-btn-primary">
              Learn More
            </Link>
          </div>
          
          <div className="landing-hero-scroll">
            <ArrowRight style={{ transform: 'rotate(90deg)' }} size={24} strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* The Broken Experience Section */}
      <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "28px" }}>The Broken Experience</h2>
      </div>
      <section className="landing-personas">
        {painPoints.map(({ icon: Icon, title, description }, idx) => (
          <div key={idx} className="landing-card" style={{ cursor: "default" }}>
            <span className="landing-card-icon" style={{ color: "#8B2E2E", background: "rgba(139, 46, 46, 0.08)", borderColor: "rgba(139, 46, 46, 0.2)" }}>
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

      {/* The Table Top Solution Section */}
      <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "28px", color: "#8B2E2E" }}>The Table Top Solution</h2>
      </div>
      <section className="landing-personas">
        {features.map(({ icon: Icon, title, description }, idx) => (
          <div key={idx} className="landing-card" style={{ cursor: "default" }}>
            <span className="landing-card-icon">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        ))}
      </section>

      <footer className="landing-footer" style={{ marginTop: "60px" }}>
        <span>© 2026 Table Top</span>
        <span>Built for restaurants that care about the details.</span>
      </footer>
    </div>
  );
}
