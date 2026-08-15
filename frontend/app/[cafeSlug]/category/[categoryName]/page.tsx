import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import "../../../../src/styles/CategoryPage.css";
import { getCafeBySlug, getMenuByCafeId } from "../../../../src/lib/data";
import { notFound } from "next/navigation";
import CategoryItemsList from "../../../../src/components/CategoryItemsList";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cafeSlug: string; categoryName: string }>;
}) {
  const { cafeSlug, categoryName } = await params;

  const cafe = await getCafeBySlug(cafeSlug);
  if (!cafe) notFound();

  const menu = await getMenuByCafeId(cafe._id);
  const items = menu.filter(
    (item) => item.category.toLowerCase() === categoryName.toLowerCase()
  );

  const formattedCategoryName = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : "";

  return (
    <div className="category-page">
      <div className="category-header">
        <Link href={`/${cafeSlug}`} className="back-button">
          <ArrowLeft size={24} color="#1A1817" />
        </Link>
        <h1>{formattedCategoryName}</h1>
        <div style={{ width: 24 }}></div>
      </div>

      <CategoryItemsList items={items} cafeSlug={cafeSlug} />
    </div>
  );
}
