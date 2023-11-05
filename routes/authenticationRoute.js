const express = require("express")
const { handleStudentRegistration, handleTutorRegistration, handleStudentLogin, handleTutorLogin } = require("../control/authenticationControl")
const router = express.Router()
router.post('/signIn/student', handleStudentLogin)
router.post('/signIn/tutor', handleTutorLogin)
router.post('/register/student', handleStudentRegistration)
router.post('/register/tutor', handleTutorRegistration)
module.exports = router