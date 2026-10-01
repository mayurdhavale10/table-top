import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../src/lib/mongodb';
import Cafe from '../../../src/models/Cafe';

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'slug query param is required' }, { status: 400 });
    }

    await connectToDatabase();

    const cafe = await Cafe.findOne({ slug }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    const plain = JSON.parse(JSON.stringify(cafe));
    return NextResponse.json({ cafe: { ...plain, id: plain._id } });
  } catch (error: any) {
    console.error('Get Cafe Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, upiId } = body;

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    await connectToDatabase();

    const update: Record<string, any> = {};
    if (upiId !== undefined) update.upiId = upiId.trim();

    const cafe = await Cafe.findOneAndUpdate({ slug }, update, { new: true }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    const plain = JSON.parse(JSON.stringify(cafe));
    return NextResponse.json({ cafe: { ...plain, id: plain._id } });
  } catch (error: any) {
    console.error('Update Cafe Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
