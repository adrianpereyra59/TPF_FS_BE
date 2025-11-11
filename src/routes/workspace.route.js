import express from "express";
import WorkspaceController from "../controllers/workspace.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const workspace_router = express.Router();

// Rutas públicas
workspace_router.get("/", WorkspaceController.getAll);
workspace_router.get("/:workspace_id", WorkspaceController.getById);

// Rutas protegidas
workspace_router.post("/", authMiddleware, WorkspaceController.post);

// Miembros / invitaciones
workspace_router.post("/:workspace_id/users", authMiddleware, WorkspaceController.addUser);
workspace_router.delete("/:workspace_id/users/:member_id", authMiddleware, WorkspaceController.removeUser);
workspace_router.put("/:workspace_id/users/:member_id/role", authMiddleware, WorkspaceController.assignRole);

export default workspace_router;