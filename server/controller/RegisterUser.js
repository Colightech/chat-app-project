const userModel = require("../models/UserModel")
const bcryptjs = require("bcryptjs")

// User SignUp/Registration API Function
const registration = async (req, res) => {
    try {
        const {name, email, password, profile_pic} = req.body

        const checkEmail = await userModel.findOne({email})
        if (checkEmail) {
            return res.status(500).json({
                message: "User with this Email Already Exist",
                error: true
            })
        }
        //Convert password into HashPassword
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            profile_pic,
            password: hashPassword
        }

        const user = new userModel(payload)
        const saveUser = await user.save()

        res.status(200).json({
            message: "User created successfully",
            data: saveUser,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = registration