import Invitation from "../models/Invitation.model.js";

class InvitationRepository {
  static async create({ workspaceId, invitedEmail, invitedUserId = null, inviterId, token, expiresAt = null }) {
    const inv = await Invitation.create({
      workspace: workspaceId,
      invitedEmail,
      invitedUser: invitedUserId,
      inviter: inviterId,
      token,
      expires_at: expiresAt
    })
    return inv
  }

  static async findByToken(token) {
    return Invitation.findOne({ token })
  }

  static async getPendingByWorkspace(workspaceId) {
    return Invitation.find({ workspace: workspaceId, status: "pending" })
  }

  static async updateStatus(id, status) {
    return Invitation.findByIdAndUpdate(id, { status }, { new: true })
  }
}

export default InvitationRepository;