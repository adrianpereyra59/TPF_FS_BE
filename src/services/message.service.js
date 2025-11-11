import ChannelMessageRepository from "../repositories/channelMessage.repository.js";

class MessageService {
    static async create(content, member_id, channel_id) {
        await ChannelMessageRepository.create(content, channel_id, member_id)
        const new_list = await ChannelMessageRepository.getAllByChannelId(channel_id)
        return new_list
    }
    static async getAllByChannelId(channel_id) {
        return await ChannelMessageRepository.getAllByChannelId(channel_id)
    }
}

export default MessageService;