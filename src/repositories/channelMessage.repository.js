import ChannelMessage from "../models/ChannelMessage.model.js";

class ChannelMessageRepository {
  static async create(content, channel_id, member_id) {
    const msg = await ChannelMessage.create({
      content,
      channel: channel_id,
      member: member_id
    })
    return msg
  }

  static async getAllByChannelId(channel_id) {
    return ChannelMessage.find({ channel: channel_id }).sort({ created_at: 1 }).populate({
      path: "member",
      populate: { path: "user", model: "User" }
    })
  }
}

export default ChannelMessageRepository;