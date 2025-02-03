const mongoose = require("mongoose");

// const connectDB = async () =>{

// }

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL)

        const connection = mongoose.connection

        connection.on("connected",()=>{
            console.log("Connect to mongoDB")
        })
        connection.on("error", (error)=>{
            console.log("Something Went Wrong with mongoDb",error)
        })
    } catch (error) {
        console.log("Something Went Wrong", error)
    }

}

module.exports = connectDB