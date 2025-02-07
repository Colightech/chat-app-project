const { conversationModel } = require("../models/ConversationModel")

//A Helper Function To Get Conversation for Conversation Sidebar
const GetConversation = async (CurrentUserId) => {
    if (CurrentUserId) {

        const currentUserConversation = await conversationModel.find({
            "$or" : [
                {sender : CurrentUserId},
                {receiver : CurrentUserId}
            ]
        }).sort({updatedAt : -1 }).populate('message').populate('sender').populate('receiver')

        const conversation = currentUserConversation.map((converse) => {
            const countUnseenMsg = converse.message.reduce((prev,curr) => prev + (curr.seen ? 0 : 1),0)
            return {
                _id : converse?._id,
                sender : converse?.sender,
                receiver : converse?.receiver,
                unSeenMsg : countUnseenMsg,
                lastMsg : converse.message[converse?.message?.length - 1]
            }
        })

        return conversation
       
    }
    else {
        return []
    }
}

module.exports = GetConversation