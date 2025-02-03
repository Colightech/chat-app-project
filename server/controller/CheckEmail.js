const userModel = require("../models/UserModel")

const checkEmail = async (req,res) =>{
    try {
        const {email} = req.body

        const checkEmail = await userModel.findOne({email}).select("-password")
        if (!checkEmail) {
            return res.status(400).json({
                message: "User don not exist",
                error: true
            })
        }
        res.status(200).json({
            message: "User verify",
            success: true,
            data: checkEmail
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = checkEmail