import mongoose, { Document, Schema } from 'mongoose';

export interface IExecutionLog extends Document {
  flowId: mongoose.Types.ObjectId;
  agentName?: string;
  message: string;
  level: 'info' | 'warn' | 'error';
  createdAt: Date;
}

const ExecutionLogSchema = new Schema<IExecutionLog>(
  {
    flowId: { type: Schema.Types.ObjectId, ref: 'Flow', required: true },
    agentName: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ['info', 'warn', 'error'],
      default: 'info',
    },
  },
  { timestamps: true }
);

ExecutionLogSchema.index({ flowId: 1 });
ExecutionLogSchema.index({ createdAt: -1 });

export const ExecutionLog = mongoose.model<IExecutionLog>('ExecutionLog', ExecutionLogSchema);
