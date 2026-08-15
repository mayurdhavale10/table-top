import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuItem extends Document {
  cafe_id: mongoose.Types.ObjectId;
  category: string;
  name: string;
  price: number;
  description: string;
  image: string;
  type?: string; // Veg, Non Veg
}

const MenuItemSchema: Schema = new Schema({
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  category: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  type: { type: String, default: 'Veg' }
}, { timestamps: true });

// Prevent model overwrite upon hot reload
const MenuItem: Model<IMenuItem> = mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

export default MenuItem;
