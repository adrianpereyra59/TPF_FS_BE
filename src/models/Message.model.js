import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    workspaceId: { type: String, required: true, index: true },
    channelId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    author: { type: String, default: "anonymous" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Compound index to query messages by channel and sort by createdAt fast
MessageSchema.index({ channelId: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);