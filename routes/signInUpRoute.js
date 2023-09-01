const express = require("express")
const { handleHi } = require("./logInUp")
// const { handleSignIn, handleSignUp } = require("../control/singInUpControl")
const router = express.Router()
// router.post('/signIn', handleSignIn)
// router.post('/register', handleSignUp)
router.post('/', handleHi)
module.exports = router