const express = require('express')
const { handleLoginFunction, handleRegistration } = require('../control/loginSignUpControl')
const router = express.Router()
router.post('/register', handleRegistration)
router.post('/login', handleLoginFunction)
module.exports = router