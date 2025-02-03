const userModel = require('../models/UserModel')


const searchUser = async (req,res) => {
    try {

        const {search} = req.body

        const Query = new RegExp(search,'i','g')

        const user = await userModel.find({
            "$or" : [
                {name : Query},
                {email : Query}
            ]
        }).select("-password")

        return res.json({
            message: "all user",
            data: user,
            success: true
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = searchUser