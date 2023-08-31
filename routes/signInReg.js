const express = require('express')
const { handleLogin, handleRegistration } = require('../control/loginSignUpControl')
const router = express.Router()
router.post('/register', handleRegistration)
router.post('/login', handleLogin)
module.exports = router