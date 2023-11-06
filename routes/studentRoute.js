const express = require('express')
const {
    getBioData, getModules,
} = require('../control/studentControl')
const router = express.Router()
const jwt = require('jsonwebtoken')

const jwtMiddleWare = async (req, res, next) => {
    let { authorization } = req.headers
    let [, myJwt] = authorization.split(' ')
    let userId = await jwt.verify(myJwt, process.env.JWTSECRETKEY)
    if (userId) {
        req.userId = userId
        next()
    }
}
router.get('/getbiodata', jwtMiddleWare, getBioData)
router.get('/getmodules', jwtMiddleWare, getModules)
router.get('/getGrades', jwtMiddleWare, handleFetchResult)
router.get('/getInformations', jwtMiddleWare, handleFetchInformations)


// router.post('/selectedModule', jwtMiddleWare, handleChosenModule)
// router.get('/pullModuleData/:moduleId', jwtMiddleWare, handlePullModuleData)
// router.get('/pullAssesment/:questionId', jwtMiddleWare, handlePullAssesment)
// router.post('/pushStudentAnswer', jwtMiddleWare, handleStudentAnswer)
// router.get('/validateStudentAttempt/:assesmentId', jwtMiddleWare, handleCheckStudentAttempt)
// router.patch('/editPersonalInformation', jwtMiddleWare, handleEditPInformation)
// router.patch('/cancelPersonalEdit', jwtMiddleWare, handlePersonalInfoCancelEdit)
// router.post('/savePersonalInformation', jwtMiddleWare, handleSavePersonalInfoChanges)
// router.get('/countdown/:assessmentId', handleCountdown)
module.exports = router
