
const userModel = require("../models/UserModel")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const checkPassword = async (req, res) => {
    try {
        const { userId, password} = req.body

        const user = await userModel.findById(userId)

        const passCheck = await bcryptjs.compare(password, user.password)

        if (!passCheck) {
            res.status(500).json({
                message: "Wrong Password",
                error: true
            })
        }

        const tokenData = {
            id: user._id,
            email: user.email
        }

        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn : "1d"})

        const cookieOption = {
            http: true,
            secure: true
        }
        
        return res.cookie('token',token,cookieOption).status(200).json({
            message: "Login Successfully",
            token: token,
            success: true
        })

    } catch (error) {
        res.status(400).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = checkPassword