import mongoose, { Document, Schema } from 'mongoose';

export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused';

export interface IAgentExecution extends Document {
  flowId: mongoose.Types.ObjectId;
  agentName: string;
  status: AgentStatus;
  startedAt?: Date;
  completedAt?: Date;
  outputSummary?: string;
  errorMessage?: string;
}

const AgentExecutionSchema = new Schema<IAgentExecution>(
  {
    flowId: { type: Schema.Types.ObjectId, ref: 'Flow', required: true },
    agentName: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed', 'paused'],
      default: 'pending',
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    outputSummary: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AgentExecutionSchema.virtual('id').get(function () {
  return this._id.toString();
});

AgentExecutionSchema.index({ flowId: 1 });
AgentExecutionSchema.index({ agentName: 1 });

export const AgentExecution = mongoose.model<IAgentExecution>('AgentExecution', AgentExecutionSchema);
