const express = require("express")
const { handleSignUp } = require("../control/signInAndUp")
const router = express.Router()
router.post('/signIn', (req, res) => {
    res.send('hi')
})
router.post('/register', handleSignUp)
module.exports = router