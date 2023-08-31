const express = require('express')
// const { handleLoginFunction, handleRegistration } = require('../control/loginSignUpControl')
const router = express.Router()
// router.post('/register', handleRegistration)
router.post('/loginn', (req, res) => {
    res.send('hi')
})
module.exports = router