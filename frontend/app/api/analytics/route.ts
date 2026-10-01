import { NextRequest, NextResponse } from 'next/server';
import { callGroq, GROQ_TEXT_MODEL } from '../../../src/lib/groq';
import connectToDatabase from '../../../src/lib/mongodb';
import Cafe from '../../../src/models/Cafe';
import Order from '../../../src/models/Order';

export async function GET(req: NextRequest) {
  try {
    const cafeSlug = req.nextUrl.searchParams.get('cafeSlug');
    const wantInsight = req.nextUrl.searchParams.get('insight') === 'true';

    if (!cafeSlug) {
      return NextResponse.json({ error: 'cafeSlug query param is required' }, { status: 400 });
    }

    await connectToDatabase();

    const cafe = await Cafe.findOne({ slug: cafeSlug }).lean();
    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }
    const cafeId = (cafe as any)._id;

    const totalOrders = await Order.countDocuments({ cafe_id: cafeId });

    // Revenue figures only count confirmed-paid orders, so a round of unconfirmed UPI
    // payments never gets reported as money actually collected.
    const topItems = await Order.aggregate([
      { $match: { cafe_id: cafeId, paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, name: '$_id', totalQuantity: 1, totalRevenue: 1 } },
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { cafe_id: cafeId, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    let tip: string | null = null;
    if (wantInsight && topItems.length > 0) {
      try {
        const summary = topItems
          .map((i) => `${i.name}: ${i.totalQuantity} sold, ₹${i.totalRevenue} revenue`)
          .join('; ');
        const prompt = `You are a restaurant business advisor. Based on this sales data for a cafe (${totalOrders} total orders, ₹${totalRevenue} total revenue): ${summary}. Give one short, specific, actionable tip (2-3 sentences max) to help the cafe owner increase sales. Be concrete, mention actual item names from the data. No markdown, no preamble, just the tip.`;

        const raw = await callGroq({ model: GROQ_TEXT_MODEL, content: prompt });
        tip = raw.trim() || null;
      } catch (aiError) {
        console.error('AI Insight Error:', aiError);
      }
    }

    return NextResponse.json({ totalOrders, totalRevenue, topItems, tip });
  } catch (error: any) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
