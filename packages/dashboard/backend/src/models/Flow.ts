import mongoose, { Document, Schema } from 'mongoose';

export type FlowStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface IFlow extends Document {
  title: string;
  description: string;
  status: FlowStatus;
  modelUsed: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const FlowSchema = new Schema<IFlow>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
    },
    modelUsed: { type: String, default: 'nemotron-3.5-super-vl', trim: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const Flow = mongoose.model<IFlow>('Flow', FlowSchema);
