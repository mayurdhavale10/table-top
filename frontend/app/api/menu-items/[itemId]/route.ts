import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../src/lib/mongodb';
import MenuItem from '../../../../src/models/MenuItem';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const body = await req.json();
    const { name, category, price, description, image, type } = body;

    await connectToDatabase();

    const update: Record<string, any> = {};
    if (name !== undefined) update.name = name;
    if (category !== undefined) update.category = category;
    if (price !== undefined) update.price = Number(price);
    if (description !== undefined) update.description = description;
    if (image !== undefined) update.image = image;
    if (type !== undefined) update.type = type;

    const item = await MenuItem.findByIdAndUpdate(itemId, update, { new: true }).lean();
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const plain = JSON.parse(JSON.stringify(item));
    return NextResponse.json({ item: { ...plain, id: plain._id } });
  } catch (error: any) {
    console.error('Update Menu Item Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;

    await connectToDatabase();

    const item = await MenuItem.findByIdAndDelete(itemId).lean();
    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete Menu Item Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
