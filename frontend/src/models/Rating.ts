import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRating extends Document {
  cafe_id: mongoose.Types.ObjectId;
  menuItemId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  stars: number;
  comment?: string;
}

const RatingSchema: Schema = new Schema({
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
}, { timestamps: true });

// A customer can only rate a given dish once per order -- prevents duplicate
// submissions if the rating screen is hit twice for the same order.
RatingSchema.index({ orderId: 1, menuItemId: 1, customerId: 1 }, { unique: true });

const Rating: Model<IRating> = mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);

export default Rating;
