const getUserDetailsFromToken = require("../helpers/GetUserDetailsFromToken")
const userModel = require("../models/UserModel")

const updateUserDetails = async (req,res) => {
    try {

        const token = req.cookies.token || ""

        const user = await getUserDetailsFromToken(token)

        const {name, profile_pic} = req.body

        const updateUser = await userModel.updateOne({ _id: user._id},{ 
            name, 
            profile_pic 
        })

        const updatesInfo = await userModel.findById(user._id)

        return res.status(200).json({
            message: "User Updated Successfully",
            data: updatesInfo,
            success: true
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: tru,
        })
    }
}

module.exports = updateUserDetails