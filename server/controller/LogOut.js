const logOut = async (req,res) =>{
    try {

        const cookiesOption = {
            http: true,
            secure: true
        }

        res.cookie('token','',process.env.JWT_SECRET_KET).status(200).json({
            message: "Logout Successfull",
            success: true
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = logOut