import { connectToDatabase } from "../config/db.js";
import Message from "../models/Message.model.js";

class MessageController {

  static async listMessages(req, res, next) {
    try {
      await connectToDatabase();
      const { workspaceId, channelId } = req.params;
      if (!workspaceId || !channelId) {
        return res.status(400).json({ ok: false, status: 400, message: "workspaceId y channelId requeridos" });
      }

      const limit = Math.min(Number(req.query.limit) || 100, 1000);
      const skip = Number(req.query.skip) || 0;

      const messages = await Message.find({ workspaceId: String(workspaceId), channelId: String(channelId) })
        .sort({ createdAt: 1 }) // ascendente por fecha
        .skip(skip)
        .limit(limit)
        .lean();

      return res.json({ ok: true, status: 200, data: { messages } });
    } catch (err) {
      next(err);
    }
  }


  static async createMessage(req, res, next) {
    try {
      await connectToDatabase();
      const { workspaceId, channelId } = req.params;
      const { content } = req.body;
      if (!workspaceId || !channelId) return res.status(400).json({ ok: false, status: 400, message: "workspaceId y channelId requeridos" });
      if (!content || !String(content).trim()) return res.status(400).json({ ok: false, status: 400, message: "content requerido" });

      const author = (req.user && (req.user.id || req.user._id)) || req.body.author || "anonymous";

      const created = await Message.create({
        workspaceId: String(workspaceId),
        channelId: String(channelId),
        content: String(content),
        author: String(author),
      });

      return res.status(201).json({ ok: true, status: 201, data: { message: created } });
    } catch (err) {
      next(err);
    }
  }
}

export default MessageController;