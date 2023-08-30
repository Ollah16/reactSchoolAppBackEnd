const express = require('express')
const { handleFetchPInfo, handleFetchMyModule, handleChosenModule, handlePullModuleData, handlePullAssesment, handleStudentAnswer, handleCheckStudentAttempt, handleFetchInformations, handleFetchResult, handleEditPInformation, handlePersonalInfoCancelEdit, handleSavePersonalInfoChanges, handleCountdown, handleStartAndFinish } = require('../control/studentControl')
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
router.get('/fetchpInfo', jwtMiddleWare, handleFetchPInfo)
router.post('/selectedModule', jwtMiddleWare, handleChosenModule)
router.get('/fecthMyModules', jwtMiddleWare, handleFetchMyModule)
router.get('/pullModuleData/:moduleId', jwtMiddleWare, handlePullModuleData)
router.get('/pullAssesment/:questionId', jwtMiddleWare, handlePullAssesment)
router.post('/pushStudentAnswer', jwtMiddleWare, handleStudentAnswer)
router.get('/validateStudentAttempt/:assesmentId', jwtMiddleWare, handleCheckStudentAttempt)
router.get('/getAllInformations', jwtMiddleWare, handleFetchInformations)
router.get('/fetchResults', jwtMiddleWare, handleFetchResult)
router.patch('/editPersonalInformation', jwtMiddleWare, handleEditPInformation)
router.patch('/cancelPersonalEdit', jwtMiddleWare, handlePersonalInfoCancelEdit)
router.post('/savePersonalInformation', jwtMiddleWare, handleSavePersonalInfoChanges)
router.get('/countdown/:assessmentId', handleCountdown)
router.get('/startandsubmit/:beginEnd', jwtMiddleWare, handleStartAndFinish)
module.exports = router
