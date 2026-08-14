"use client";

import { useEffect, useState } from "react";
import SearchBar from "../../src/components/SearchBar";
import RestaurantHeader from "../../src/components/RestaurantHeader";
import CategoryBar from "../../src/components/CategoryBar";
import GamesBanner from "../../src/components/GamesBanner";
import Link from "next/link";
import { MessageSquareHeart } from "lucide-react";
import "../../src/styles/Home.css";
import { getCafeBySlug } from "../../src/data/saasDb";
import { useParams } from "next/navigation";

function CafeHomePage() {
  const params = useParams();
  const slug = Array.isArray(params?.cafeSlug) ? params.cafeSlug[0] : params?.cafeSlug || "sips-and-bites";
  const [cafe, setCafe] = useState<any>(null);

  useEffect(() => {
    // Mock fetching cafe data from DB
    const cafeData = getCafeBySlug(slug as string);
    setCafe(cafeData);
  }, [slug]);

  if (!cafe) return <div style={{ padding: "40px", textAlign: "center" }}>Loading Cafe...</div>;

  return (
    <div className="home-container" style={{ position: "relative" }}>


      {/* Passing dynamic cafe data down */}
      <RestaurantHeader name={cafe.name} location={cafe.location} />
      <SearchBar />
      
      <CategoryBar cafeSlug={slug} />
      <GamesBanner cafeSlug={slug} />

      <div style={{ padding: "0 20px 40px 20px" }}>
        <Link href={`/${slug}/feedback`} style={{ textDecoration: "none" }}>
          <div style={{ 
            background: "#FDFBF9", 
            border: "1px solid #EAE6DF", 
            padding: "16px", 
            borderRadius: "16px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: "#FDF3F3", padding: "10px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MessageSquareHeart size={24} color="#C62828" />
              </div>
              <div>
                <div style={{ fontWeight: "bold", color: "#1A1817", fontSize: "16px", marginBottom: "2px" }}>Leave Feedback</div>
                <div style={{ color: "#7A7571", fontSize: "12px" }}>Rate your food and experience</div>
              </div>
            </div>
            <div style={{ color: "#0f9d58", fontWeight: "bold" }}>→</div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default CafeHomePage;
