const express = require("express")
// const { handleSignIn } = require("../control/singInUpControl")
const router = express.Router()
// router.post('/signIn', handleSignIn)
// router.post('/register', handleSignUp)
router.post('/logg', (req, res) => {
    res.send('success')
})
module.exports = router