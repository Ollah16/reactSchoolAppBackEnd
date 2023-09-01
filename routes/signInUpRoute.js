const express = require("express")
const { handleSignIn, handleSignUp } = require("../control/signInAndUp")
const router = express.Router()
router.post('/signIn', handleSignIn)
// router.post('/signIn', (req, res) => {
//     res.send('hi')
// })
router.post('/register', handleSignUp)
module.exports = router