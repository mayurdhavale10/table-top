import RestaurantHeader from "../../src/components/RestaurantHeader";
import CategoryGrid from "../../src/components/CategoryGrid";
import GamesBanner from "../../src/components/GamesBanner";
import Link from "next/link";
import { MessageSquareHeart } from "lucide-react";
import "../../src/styles/Home.css";
import { getCafeBySlug, getMenuByCafeId } from "../../src/lib/data";
import { notFound } from "next/navigation";

export default async function CafeHomePage({
  params,
}: {
  params: Promise<{ cafeSlug: string }>;
}) {
  const { cafeSlug } = await params;

  const cafe = await getCafeBySlug(cafeSlug);
  if (!cafe) notFound();

  const menu = await getMenuByCafeId(cafe._id);
  const uniqueCats = Array.from(new Set(menu.map((m) => m.category)));
  const categories = uniqueCats.map((c, i) => ({
    id: String(i),
    name: c.charAt(0).toUpperCase() + c.slice(1),
  }));

  return (
    <div className="home-container" style={{ position: "relative" }}>
      <RestaurantHeader name={cafe.name} location={cafe.location} />

      <CategoryGrid cafeSlug={cafeSlug} categories={categories} />
      <GamesBanner cafeSlug={cafeSlug} />

      <div style={{ padding: "0 20px 40px 20px" }}>
        <Link href={`/${cafeSlug}/feedback`} style={{ textDecoration: "none", display: "block" }}>
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
