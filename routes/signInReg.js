const express = require('express')
// const { handleRegistration, handleLogin } = require('../control/loginSignUpControl')
const router = express.Router()
// router.post('/register', handleRegistration)
// router.post('/login', handleLogin)
router.post('/login', (req, res) => {
    res.send('success')
})

module.exports = router