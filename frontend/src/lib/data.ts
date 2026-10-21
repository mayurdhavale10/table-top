import mongoose from "mongoose";
import connectToDatabase from "./mongodb";
import Cafe from "../models/Cafe";
import MenuItem from "../models/MenuItem";
import Rating from "../models/Rating";

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
  rating?: RatingSummary;
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

export type RatingSummary = { avgStars: number; count: number };

export async function getRatingsByCafeId(cafeId: string): Promise<Record<string, RatingSummary>> {
  await connectToDatabase();
  const agg = await Rating.aggregate([
    { $match: { cafe_id: new mongoose.Types.ObjectId(cafeId) } },
    { $group: { _id: '$menuItemId', avgStars: { $avg: '$stars' }, count: { $sum: 1 } } },
  ]);

  const byItem: Record<string, RatingSummary> = {};
  agg.forEach((a: any) => {
    byItem[a._id.toString()] = { avgStars: Math.round(a.avgStars * 10) / 10, count: a.count };
  });
  return byItem;
}
