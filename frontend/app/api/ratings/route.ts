import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../src/lib/mongodb';
import Order from '../../../src/models/Order';
import Customer from '../../../src/models/Customer';
import Rating from '../../../src/models/Rating';
import Cafe from '../../../src/models/Cafe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerPhone, ratings } = body;
    // ratings: [{ menuItemId, stars, comment? }]

    if (!orderId || !customerPhone || !Array.isArray(ratings) || ratings.length === 0) {
      return NextResponse.json({ error: 'orderId, customerPhone and at least one rating are required' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(orderId).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // "Verified diner" is the whole point here -- only the phone number that actually
    // placed this order can rate the dishes in it.
    const phone = customerPhone.trim();
    if ((order as any).customerPhone !== phone) {
      return NextResponse.json({ error: 'This order does not belong to that phone number' }, { status: 403 });
    }

    const orderedItemIds = new Set((order as any).items.map((i: any) => i.menuItemId.toString()));
    const invalidItem = ratings.find((r: any) => !orderedItemIds.has(r.menuItemId));
    if (invalidItem) {
      return NextResponse.json({ error: 'Cannot rate an item that was not part of this order' }, { status: 400 });
    }

    const customer = await Customer.findOneAndUpdate(
      { phone },
      { phone },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const results = [];
    for (const r of ratings) {
      const stars = Number(r.stars);
      if (!Number.isInteger(stars) || stars < 1 || stars > 5) continue;
      try {
        const saved = await Rating.findOneAndUpdate(
          { orderId, menuItemId: r.menuItemId, customerId: customer._id },
          {
            cafe_id: (order as any).cafe_id,
            menuItemId: r.menuItemId,
            orderId,
            customerId: customer._id,
            stars,
            comment: r.comment || '',
          },
          { upsert: true, new: true }
        );
        results.push(saved._id);
      } catch (err) {
        console.error('Rating save error for item', r.menuItemId, err);
      }
    }

    return NextResponse.json({ success: true, saved: results.length }, { status: 201 });
  } catch (error: any) {
    console.error('Create Rating Error:', error);
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

    const agg = await Rating.aggregate([
      { $match: { cafe_id: (cafe as any)._id } },
      {
        $group: {
          _id: '$menuItemId',
          avgStars: { $avg: '$stars' },
          count: { $sum: 1 },
        },
      },
    ]);

    const byItem: Record<string, { avgStars: number; count: number }> = {};
    agg.forEach((a) => {
      byItem[a._id.toString()] = { avgStars: Math.round(a.avgStars * 10) / 10, count: a.count };
    });

    return NextResponse.json({ ratings: byItem });
  } catch (error: any) {
    console.error('Get Ratings Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
