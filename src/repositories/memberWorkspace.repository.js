import MemberWorkspace from "../models/MemberWorkspace.model.js";
import { ServerError } from "../utils/customError.utils.js";

class MemberWorkspaceRepository {
  static async getAllByWorkspaceId(workspace_id) {
    return MemberWorkspace.find({ workspace: workspace_id }).populate("user workspace");
  }

  static async getAllByUserId(user_id) {
    return MemberWorkspace.find({ user: user_id }).populate("workspace");
  }

  static async getById(member_id) {
    return MemberWorkspace.findById(member_id).populate("user workspace");
  }

  static async getMemberWorkspaceByUserIdAndWorkspaceId(user_id, workspace_id) {
    const member_workspace = await MemberWorkspace.findOne({ user: user_id, workspace: workspace_id });
    return member_workspace;
  }

  static async create({ user_id = null, email = null, workspace_id, role = "member", status = "pending" }) {
    // Si existe vínculo previo, lanzar error
    if (user_id) {
      const existing = await MemberWorkspace.findOne({ user: user_id, workspace: workspace_id });
      if (existing) throw new ServerError(400, "El usuario ya es miembro del workspace");
    } else if (email) {
      const existingByEmail = await MemberWorkspace.findOne({ email: email, workspace: workspace_id });
      if (existingByEmail) throw new ServerError(400, "Ya existe una invitación para ese email");
    }

    const m = await MemberWorkspace.create({
      user: user_id,
      email,
      workspace: workspace_id,
      role,
      status,
    });

    return m;
  }

  static async deleteById(member_id) {
    await MemberWorkspace.findByIdAndDelete(member_id);
    return true;
  }

  static async updateRole(member_id, newRole) {
    const updated = await MemberWorkspace.findByIdAndUpdate(member_id, { role: newRole, modified_at: new Date() }, { new: true });
    return updated;
  }
}

export default MemberWorkspaceRepository;