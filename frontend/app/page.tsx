import Link from "next/link";
import { UtensilsCrossed, ShieldCheck, ChefHat, Smartphone, ArrowRight, ArrowUpRight } from "lucide-react";
import "../src/styles/Landing.css";

const personas = [
  {
    href: "/super-admin",
    icon: ShieldCheck,
    title: "Super Admin",
    description: "Onboard restaurants, manage cafes, and generate ordering QR codes across the platform.",
  },
  {
    href: "/admin/sips-and-bites",
    icon: ChefHat,
    title: "Cafe Admin",
    description: "Manage a single restaurant's live menu, pricing, and categories.",
  },
  {
    href: "/sips-and-bites",
    icon: Smartphone,
    title: "Customer View",
    description: "The ordering experience a guest sees after scanning their table's QR code.",
  },
];

export default function SaaSLandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link href="/" className="landing-logo">
          <span className="landing-logo-mark">
            <UtensilsCrossed size={16} strokeWidth={1.75} />
          </span>
          <span className="landing-logo-text">Table Top</span>
        </Link>

        <div className="landing-nav-actions">
          <Link href="/sips-and-bites" className="landing-nav-link">
            Live Demo
          </Link>
          <Link href="/super-admin" className="landing-nav-cta">
            Super Admin
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <span className="landing-badge">
          <span className="landing-badge-dot" />
          Multi-tenant ordering platform
        </span>

        <h1>
          The digital menu for <span>modern restaurants</span>.
        </h1>

        <p>
          One QR code per table. A live menu that updates in real time. Table Top
          replaces printed menus with an ordering system built for restaurants
          that care about the details.
        </p>

        <div className="landing-hero-actions">
          <Link href="/sips-and-bites" className="landing-btn-primary">
            View Live Demo
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
          <Link href="/super-admin" className="landing-btn-secondary">
            Super Admin
          </Link>
        </div>
      </section>

      <section className="landing-personas">
        {personas.map(({ href, icon: Icon, title, description }) => (
          <Link href={href} key={href} className="landing-card">
            <span className="landing-card-icon">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
            <span className="landing-card-arrow">
              <ArrowUpRight size={16} strokeWidth={2} />
            </span>
          </Link>
        ))}
      </section>

      <footer className="landing-footer">
        <span>© 2026 Table Top</span>
        <span>Built for restaurants that care about the details.</span>
      </footer>
    </div>
  );
}
