import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../src/lib/mongodb';
import Cafe from '../../../src/models/Cafe';
import MenuItem from '../../../src/models/MenuItem';

export async function GET(req: NextRequest) {
  try {
    const cafeSlug = req.nextUrl.searchParams.get('cafeSlug');
    if (!cafeSlug) {
      return NextResponse.json({ error: 'cafeSlug query param is required' }, { status: 400 });
    }

    await connectToDatabase();

    const cafe = await Cafe.findOne({ slug: cafeSlug }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    const items = await MenuItem.find({ cafe_id: (cafe as any)._id }).sort({ createdAt: -1 }).lean();
    const plain = JSON.parse(JSON.stringify(items)).map((item: any) => ({ ...item, id: item._id }));

    return NextResponse.json({ items: plain });
  } catch (error: any) {
    console.error('List Menu Items Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cafeSlug, name, category, price, description, image, type } = body;

    if (!cafeSlug || !name || price === undefined || price === null) {
      return NextResponse.json({ error: 'cafeSlug, name and price are required' }, { status: 400 });
    }

    await connectToDatabase();

    const cafe = await Cafe.findOne({ slug: cafeSlug }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    const item = await MenuItem.create({
      cafe_id: (cafe as any)._id,
      name,
      category: category || 'other',
      price: Number(price),
      description: description || '',
      image: image || '',
      type: type || 'Veg',
    });

    const plain = JSON.parse(JSON.stringify(item.toObject()));
    return NextResponse.json({ item: { ...plain, id: plain._id } }, { status: 201 });
  } catch (error: any) {
    console.error('Create Menu Item Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
