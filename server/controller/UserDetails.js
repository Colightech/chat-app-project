const getUserDetailsFromToken = require("../helpers/GetUserDetailsFromToken")

const userDetails = async (req,res) => {
    try {

        //Extract detail from user cookies/token
        const token = req.cookies.token || ""

        const user = await getUserDetailsFromToken(token)

        return res.status(200).json({
            message: "Users Detail",
            data: user,
            success: true
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = userDetails