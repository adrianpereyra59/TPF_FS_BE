import Workspaces from "../models/Workspace.model.js";

class WorkspacesRepository {
  static async createWorkspace(name, url_image) {
    const workspace = await Workspaces.create({
      name,
      url_image,
    });
    return workspace;
  }

  static async getAll() {
    const workspaces_get = await Workspaces.find({ active: true });
    return workspaces_get;
  }

  static async getById(workspace_id) {
    const workspace_found = await Workspaces.findById(workspace_id);
    return workspace_found;
  }

  static async deleteById(workspace_id) {
    await Workspaces.findByIdAndDelete(workspace_id);
    return true;
  }

  static async updateById(workspace_id, new_values) {
    const workspace_updated = await Workspaces.findByIdAndUpdate(workspace_id, new_values, {
      new: true,
    });
    return workspace_updated;
  }
}

export default WorkspacesRepository;