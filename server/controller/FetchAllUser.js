const userModel = require("../models/UserModel")

const fetchUser = async (req, res) => {
    try {
        const {name, email, password, profile_pic} = req.body

        const fetchAllUser = await userModel.find({}).select("-password")
        return res.status(200).json({
            message: "All User Fetched",
            success: true,
            data: fetchAllUser
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = fetchUser