import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChecklistResponse {
  questionId: number;
  answer: 'yes' | 'no' | 'na';
}

export interface IHygieneAudit extends Document {
  cafe_id: mongoose.Types.ObjectId;
  responses: IChecklistResponse[];
  earnedScore: number;
  possibleScore: number;
  percentage: number;
  starRating: number;
  hasCriticalFailure: boolean;
  notes?: string;
}

const ChecklistResponseSchema = new Schema<IChecklistResponse>({
  questionId: { type: Number, required: true },
  answer: { type: String, enum: ['yes', 'no', 'na'], required: true },
}, { _id: false });

const HygieneAuditSchema: Schema = new Schema({
  cafe_id: { type: Schema.Types.ObjectId, ref: 'Cafe', required: true },
  responses: { type: [ChecklistResponseSchema], required: true },
  earnedScore: { type: Number, required: true },
  possibleScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
  starRating: { type: Number, required: true },
  hasCriticalFailure: { type: Boolean, default: false },
  notes: { type: String, default: '' },
}, { timestamps: true });

const HygieneAudit: Model<IHygieneAudit> =
  mongoose.models.HygieneAudit || mongoose.model<IHygieneAudit>('HygieneAudit', HygieneAuditSchema);

export default HygieneAudit;
