import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import { ServerError } from "../utils/customError.utils.js"

export default function workspaceMiddleware(requiredRoles = []) {
  return async (req, res, next) => {
    try {
      const workspace_id = req.params.workspace_id || req.body.workspace_id
      if (!workspace_id) throw new ServerError(400, 'workspace_id requerido')

      // req.user lo setea auth.middleware (payload del token)
      const userId = req.user && (req.user.id || req.user._id)
      if (!userId) throw new ServerError(401, 'Autenticación requerida')

      const member = await MemberWorkspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(userId, workspace_id)
      if (!member) throw new ServerError(403, 'No eres miembro del workspace')

      // Adjuntamos member y workspace para los controladores
      req.member = member
      req.workspace = member.workspace

      if (requiredRoles.length && !requiredRoles.includes(member.role)) {
        throw new ServerError(403, 'Permisos insuficientes')
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}