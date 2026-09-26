import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../src/lib/mongodb';
import Cafe from '../../../src/models/Cafe';
import Order from '../../../src/models/Order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cafeSlug, tableNumber, specialInstructions, items, subtotal, tax, serviceCharge, grandTotal } = body;

    if (!cafeSlug || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'cafeSlug and at least one item are required' }, { status: 400 });
    }

    await connectToDatabase();

    const cafe = await Cafe.findOne({ slug: cafeSlug }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    const order = await Order.create({
      cafe_id: (cafe as any)._id,
      tableNumber: tableNumber || '',
      items: items.map((item: any) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      tax,
      serviceCharge,
      grandTotal,
      specialInstructions: specialInstructions || '',
      status: 'new',
    });

    return NextResponse.json({ success: true, orderId: order._id.toString() }, { status: 201 });
  } catch (error: any) {
    console.error('Create Order Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

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

    const orders = await Order.find({ cafe_id: (cafe as any)._id }).sort({ createdAt: -1 }).lean();
    const plain = JSON.parse(JSON.stringify(orders)).map((o: any) => ({ ...o, id: o._id }));

    return NextResponse.json({ orders: plain });
  } catch (error: any) {
    console.error('List Orders Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
