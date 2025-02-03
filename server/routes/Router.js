const express = require("express")
const registration = require("../controller/RegisterUser")
const checkEmail = require("../controller/CheckEmail")
const fetchUser = require("../controller/FetchAllUser")
const checkPassword = require("../controller/CheckPassword")
const userDetails = require("../controller/UserDetails")
const logOut = require("../controller/LogOut")
const updateUserDetails = require("../controller/UpdateUserDetails")
const searchUser = require("../controller/searchUser")


const router = express.Router()

//User SignUp/Registration API Endpoint
router.post('/signup',registration)

//Check User API Endpoint
router.post('/checkemail',checkEmail)

//Fetch All User API Endpoint
router.get('/fetchalluser',fetchUser)

//Password Check API Endpoint
router.post('/checkpassword',checkPassword)

//Login User Details API Endpoint
router.get('/userdetails',userDetails)

//Logout user API Endpoint
router.get('/logout',logOut)

// Update User API Endpoint
router.post('/updateuser',updateUserDetails)

// Search User API Endpoint
router.post('/search-user',searchUser)

module.exports = router