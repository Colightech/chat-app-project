const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/GetUserDetailsFromToken')
const userModel = require('../models/UserModel')
const { conversationModel, messageModel } = require('../models/ConversationModel')


const app = express()

// Socket Connection
const server = http.createServer(app)
const io = new Server(server,{
    cors : {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
})


// Socket Running at http://localhost:8080/

// To Check if user is online
const onlineUser = new Set()

io.on('connection', async (socket)=>{
    console.log("connect user", socket.id)

    const token = socket.handshake.auth.token

    // Current User Detail
    const user = await getUserDetailsFromToken(token)

    // Create a Room
    socket.join(user?._id.toString())
    onlineUser.add(user?._id?.toString())

    // To sent this online user from the client side in the form array
    io.emit('onlineuser',Array.from(onlineUser))

    socket.on('message-page', async (userId)=>{
        console.log('userId',userId)
        const userDetails = await userModel.findById(userId).select('-password')

        const payload = {
            _id : userDetails?._id,
            name : userDetails?.name,
            email : userDetails?.email,
            profile_pic : userDetails?.profile_pic,
            online : onlineUser.has(userId)
        }

        socket.emit('message-page',payload)
    })

    socket.on('new-message', async (data) => {
        // Check if Conversation is available
        let conversation = await conversationModel.findOne({
            "$or" : [
                {sender : data?.sender, receiver : data?.receiver},
                {sender : data?.receiver, receiver : data?.sender}
            ]
        })

        if (!conversation) {
            const createConversation = new conversationModel({
                sender : data?.sender,
                receiver : data?.receiver
            })
            conversation = await createConversation.save()
        }
        const createMessage = new messageModel({
            text : data.text,
            imageUrl : data.imageUrl,
            videoUrl : data.videoUrl,
            msgByUserId : data?.msgByUserId
        })
        const saveMessage = await createMessage.save()

        const updateConversation = await conversationModel.updateOne({_id : conversation?._id }, {
            "$push" : { message : saveMessage?._id}
        })

        const getConversationMessage = await conversationModel.findOne({
            "$or" : [
                {sender : data?.sender, receiver : data?.receiver},
                {sender : data?.receiver, receiver : data?.sender}
            ]
        }).populate('message').sort({ updatedAt : -1 })

        io.to(data?.sender).emit('message',getConversationMessage.message)
        io.to(data?.receiver).emit('message',getConversationMessage.message)
        
    })




    // Disconnect User
    socket.on('disconnect', ()=>{
        onlineUser.delete(user?._id)

        console.log("Disconnect User", socket.id)
    })
})

module.exports = {
    app,
    server
}