import { NextResponse } from 'next/server';
import connectToDatabase from '../../../src/lib/mongodb';
import Cafe from '../../../src/models/Cafe';
import MenuItem from '../../../src/models/MenuItem';

export async function GET() {
  try {
    await connectToDatabase();

    const cafes = await Cafe.find({}).sort({ createdAt: -1 }).lean();

    const itemCounts = await MenuItem.aggregate([
      { $group: { _id: '$cafe_id', count: { $sum: 1 } } },
    ]);
    const countMap = new Map(itemCounts.map((c) => [c._id.toString(), c.count]));

    const plain = JSON.parse(JSON.stringify(cafes)).map((c: any) => ({
      ...c,
      id: c._id,
      menuItemCount: countMap.get(c._id) || 0,
    }));

    return NextResponse.json({ cafes: plain });
  } catch (error: any) {
    console.error('List Cafes Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
