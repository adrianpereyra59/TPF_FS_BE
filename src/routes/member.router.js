import express from 'express'
import MemberController from '../controllers/member.controller.js'
import InvitationController from '../controllers/invitation.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const member_router = express.Router()

member_router.get('/confirm-invitation/:token', InvitationController.acceptByToken)
member_router.post('/accept', authMiddleware, InvitationController.acceptByApi)
member_router.get('/workspace/:workspace_id', authMiddleware, MemberController.listByWorkspace)
member_router.delete('/:member_id', authMiddleware, MemberController.removeMember)
member_router.put('/:member_id/role', authMiddleware, MemberController.updateRole)

export default member_router;