const port = process.env.PORT  || 8000;
const express = require("express");
const cors = require("cors");
require("dotenv").config()
const connectDB = require("./config/connectDB");
const router = require("./routes/Router");
const cookiesParser = require("cookie-parser")
const { app, server} = require('./socket/index')


// const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookiesParser())

app.get('/', (req,res)=>{
    res.send(
        "Express App is Now working and Running on Port "+port
    )
})

//All API Endpoint routers
app.use('/api', router)

connectDB().then(()=>{
    server.listen(port, ()=>{
        console.log("Server Running on Port "+port)
    })
})