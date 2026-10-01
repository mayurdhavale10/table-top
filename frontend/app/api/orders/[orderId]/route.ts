import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../src/lib/mongodb';
import Order from '../../../../src/models/Order';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const { status, paymentStatus } = await req.json();

    const update: Record<string, any> = {};
    if (status !== undefined) {
      if (!['new', 'preparing', 'ready', 'completed'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      update.status = status;
    }
    if (paymentStatus !== undefined) {
      if (!['pending', 'paid'].includes(paymentStatus)) {
        return NextResponse.json({ error: 'Invalid paymentStatus' }, { status: 400 });
      }
      update.paymentStatus = paymentStatus;
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(orderId, update, { new: true }).lean();
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: { ...order, id: (order as any)._id.toString() } });
  } catch (error: any) {
    console.error('Update Order Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
