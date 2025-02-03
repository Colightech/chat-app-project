const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const getUserDetailsFromToken = require('../helpers/GetUserDetailsFromToken')
const userModel = require('../models/UserModel')


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
    socket.join(user?._id)
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