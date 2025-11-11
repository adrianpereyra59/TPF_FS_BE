import express from "express";
import MessageController from "../controllers/message.controller.js";

const router = express.Router();

router.get("/workspace/:workspaceId/channels/:channelId/messages", MessageController.listMessages);
router.post("/workspace/:workspaceId/channels/:channelId/messages", MessageController.createMessage);

export default router;