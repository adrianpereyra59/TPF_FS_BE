import WorkspacesRepository from "../repositories/workspace.repository.js";
import { ServerError } from "../utils/customError.utils.js";
import { validarId } from "../utils/validations.utils.js";
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js";
import UserRepository from "../repositories/user.repository.js";

class WorkspaceController {
  static async getAll(request, response) {
    try {
      const workspaces = await WorkspacesRepository.getAll();
      response.json({
        status: "OK",
        message: "Lista de espacios de trabajo obtenida correctamente",
        data: {
          workspaces: workspaces,
        },
      });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      } else {
        return response.status(500).json({
          ok: false,
          status: 500,
          message: "Error interno del servidor",
        });
      }
    }
  }

  static async getById(request, response) {
    try {
      const workspace_id = request.params.workspace_id;

      if (validarId(workspace_id)) {
        const workspace = await WorkspacesRepository.getById(workspace_id);

        if (!workspace) {
          throw new ServerError(400, `Workspace con id ${workspace_id} no encontrado`);
        } else {
          const members = await MemberWorkspaceRepository.getAllByWorkspaceId(workspace_id);

          return response.json({
            ok: true,
            message: `Workspace con id ${workspace._id} obtenido`,
            data: {
              workspace: workspace,
              members: members,
            },
          });
        }
      } else {
        throw new ServerError(400, "el workspace_id debe ser un id valido");
      }
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      } else {
        return response.status(500).json({
          ok: false,
          status: 500,
          message: "Error interno del servidor",
        });
      }
    }
  }

  static async post(request, response) {
    try {
      const name = request.body.name;
      const url_img = request.body.url_img || "";

      if (!name || typeof name !== "string" || name.length > 30) {
        throw new ServerError(400, "el campo 'name' debe ser un string de menos de 30 caracteres");
      }

      const workspace = await WorkspacesRepository.createWorkspace(name, url_img);

      return response.status(201).json({
        ok: true,
        status: 201,
        message: "Workspace creado con exito",
        data: { workspace },
      });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      } else {
        return response.status(500).json({
          ok: false,
          status: 500,
          message: "Error interno del servidor",
        });
      }
    }
  }

  static async addUser(request, response) {
    try {
      const workspace_id = request.params.workspace_id;
      const { email, role = "member" } = request.body;

      if (!validarId(workspace_id)) throw new ServerError(400, "workspace_id inválido");

      if (!email || !String(email).toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new ServerError(400, "Debes enviar un email válido");
      }

      const user = await UserRepository.getByEmail(email);

      let member;
      if (user) {
        member = await MemberWorkspaceRepository.create({ user_id: user._id, workspace_id, role, status: "accepted" });
      } else {
        member = await MemberWorkspaceRepository.create({ user_id: null, email, workspace_id, role, status: "pending" });
        // Opcional: enviar email con link de invitación si lo deseas
      }

      return response.status(201).json({
        ok: true,
        status: 201,
        message: "Invitación / miembro agregado",
        data: { member },
      });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      }
      return response.status(500).json({
        ok: false,
        status: 500,
        message: "Error interno del servidor",
      });
    }
  }

  static async removeUser(request, response) {
    try {
      const workspace_id = request.params.workspace_id;
      const member_id = request.params.member_id;

      if (!validarId(workspace_id)) throw new ServerError(400, "workspace_id inválido");
      if (!validarId(member_id)) throw new ServerError(400, "member_id inválido");

      await MemberWorkspaceRepository.deleteById(member_id);

      return response.json({
        ok: true,
        status: 200,
        message: "Miembro eliminado",
      });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      }
      return response.status(500).json({
        ok: false,
        status: 500,
        message: "Error interno del servidor",
      });
    }
  }

  static async assignRole(request, response) {
    try {
      const workspace_id = request.params.workspace_id;
      const member_id = request.params.member_id;
      const { role } = request.body;

      if (!validarId(workspace_id)) throw new ServerError(400, "workspace_id inválido");
      if (!validarId(member_id)) throw new ServerError(400, "member_id inválido");
      if (!role) throw new ServerError(400, "role requerido");

      const updated = await MemberWorkspaceRepository.updateRole(member_id, role);

      return response.json({
        ok: true,
        status: 200,
        message: "Rol actualizado",
        data: { member: updated },
      });
    } catch (error) {
      console.log(error);
      if (error.status) {
        return response.status(error.status).json({
          ok: false,
          status: error.status,
          message: error.message,
        });
      }
      return response.status(500).json({
        ok: false,
        status: 500,
        message: "Error interno del servidor",
      });
    }
  }
}

export default WorkspaceController;