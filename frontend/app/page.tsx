import Link from "next/link";
import { UtensilsCrossed, Phone, ArrowRight } from "lucide-react";
import "../src/styles/Landing.css";

export default function SaaSLandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav-new">
        <Link href="/" className="landing-logo-new">
          <UtensilsCrossed size={20} strokeWidth={1.5} className="logo-icon-simple" />
          <span className="landing-logo-text-new">Table Top</span>
        </Link>
        
        <div className="landing-nav-actions">
          <a href="tel:+919137608570" className="landing-contact">
            <Phone size={16} strokeWidth={1.5} />
            <span>+91 91376 08570</span>
          </a>
          <Link href="/admin/sips-and-bites" className="landing-btn-nav">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-text">
            <h1>Simple ordering.<br/>Good food.<br/>Great company.</h1>
            <Link href="/sips-and-bites" className="landing-btn-primary">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
