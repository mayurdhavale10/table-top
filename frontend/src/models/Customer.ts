import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
  phone: string;
  name?: string;
}

const CustomerSchema: Schema = new Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
}, { timestamps: true });

const Customer: Model<ICustomer> = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
