import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed';

export interface IOrder extends Document {
  cafe_id: mongoose.Types.ObjectId;
  tableNumber: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  grandTotal: number;
  specialInstructions?: string;
  status: OrderStatus;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const OrderSchema: Schema = new Schema({
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  tableNumber: { type: String, default: '' },
  items: { type: [OrderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  serviceCharge: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  specialInstructions: { type: String, default: '' },
  status: { type: String, enum: ['new', 'preparing', 'ready', 'completed'], default: 'new' },
}, { timestamps: true });

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
