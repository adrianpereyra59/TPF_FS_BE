import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
  invitedEmail: { type: String, required: true },
  invitedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  inviter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  created_at: { type: Date, default: Date.now },
  expires_at: { type: Date, default: null }
});

const Invitation = mongoose.model("Invitation", invitationSchema);
export default Invitation;