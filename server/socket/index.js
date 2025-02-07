const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/GetUserDetailsFromToken')
const userModel = require('../models/UserModel')
const { conversationModel, messageModel } = require('../models/ConversationModel')
const GetConversation = require('../helpers/getConversation')



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
    // Online User
    onlineUser.add(user?._id?.toString())

    // To sent this online user to the client side in the form an array
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

        // To Display Previous Message when Logged in newly or refresh the page
        const getConversationMessage = await conversationModel.findOne({
            "$or" : [
                {sender : user?._id, receiver : userId},
                {sender : userId, receiver : user?._id}
            ]
        }).populate('message').sort({ updatedAt : -1 })

        socket.emit('message',getConversationMessage?.message || [])
    })

    
    // New Conversation
    socket.on('new-message', async (data) => {
        
        let conversation = await conversationModel.findOne({
            "$or" : [
                {sender : data?.sender, receiver : data?.receiver},
                {sender : data?.receiver, receiver : data?.sender}
            ]
        })
        // If Conversation is not available create it
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

        //To Display Message
        const getConversationMessage = await conversationModel.findOne({
            "$or" : [
                {sender : data?.sender, receiver : data?.receiver},
                {sender : data?.receiver, receiver : data?.sender}
            ]
        }).populate('message').sort({ updatedAt : -1 })

        io.to(data?.sender).emit('message',getConversationMessage?.message || [])
        io.to(data?.receiver).emit('message',getConversationMessage?.message || [])

        // Conversation Sidebar Instant Updates, i.e, Message sent should drop on the Sidebar Immediately
        const conversationSender = await GetConversation(data?.sender)
        const conversationReceiver = await GetConversation(data?.receiver)

        io.to(data?.sender).emit('conversation',conversationSender)
        io.to(data?.receiver).emit('conversation',conversationReceiver)
        
    })

    //Receiving Current Message on Sidebar from Frontend
     //sidebar
     socket.on('sidebar', async (CurrentUserId) => {

        const conversation = await GetConversation(CurrentUserId)

         socket.emit('conversation',conversation)

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