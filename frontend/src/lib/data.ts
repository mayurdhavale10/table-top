import connectToDatabase from "./mongodb";
import Cafe from "../models/Cafe";
import MenuItem from "../models/MenuItem";

export type CafeData = {
  id: string;
  _id: string;
  slug: string;
  name: string;
  location: string;
  theme: { primaryColor: string; accentColor: string };
};

export type MenuItemData = {
  id: string;
  _id: string;
  cafe_id: string;
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
  type?: string;
};

export async function getCafeBySlug(slug: string): Promise<CafeData | null> {
  await connectToDatabase();
  const cafe = await Cafe.findOne({ slug }).lean();
  if (!cafe) return null;

  const plain = JSON.parse(JSON.stringify(cafe));
  return { ...plain, id: plain._id };
}

export async function getMenuByCafeId(cafeId: string): Promise<MenuItemData[]> {
  await connectToDatabase();
  const items = await MenuItem.find({ cafe_id: cafeId }).lean();

  const plain = JSON.parse(JSON.stringify(items));
  return plain.map((item: any) => ({ ...item, id: item._id }));
}
