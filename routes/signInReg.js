const express = require('express')
const { handleLoginFunction } = require('../control/loginSignUpControl')
const router = express.Router()
// router.post('/register', handleRegistration)
// router.post('/login', handleLoginFunction)
router.post('/login', (req, res) => {
    res.send('send')
})

module.exports = router