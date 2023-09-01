const express = require("express")
const { handleSignIn, handleSignUp } = require("../control/singInUpControl")
const router = express.Router()
router.post('/signIn', handleSignIn)
router.post('/register', handleSignUp)

module.exports = router