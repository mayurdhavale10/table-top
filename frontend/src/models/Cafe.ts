import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICafe extends Document {
  slug: string;
  name: string;
  location: string;
  username?: string;
  password?: string;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
}

const CafeSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  theme: {
    primaryColor: { type: String, default: '#1A1817' },
    accentColor: { type: String, default: '#d97706' },
  }
}, { timestamps: true });

// Prevent model overwrite upon hot reload
const Cafe: Model<ICafe> = mongoose.models.Cafe || mongoose.model<ICafe>('Cafe', CafeSchema);

export default Cafe;
