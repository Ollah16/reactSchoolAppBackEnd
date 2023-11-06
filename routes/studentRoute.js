const express = require('express')
const {
    getBioData, getModules, getGrades, getInformations, chooseModule, isRegistered, editBioData, saveBioChanges, cancelBioChanges,
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
router.get('/getmodules', getModules)
router.get('/getGrades', jwtMiddleWare, getGrades)
router.get('/getInformations', jwtMiddleWare, getInformations)
router.post('/chooseModules', jwtMiddleWare, chooseModule)
router.get('/ifRegistered', jwtMiddleWare, isRegistered)

router.patch('/editBio', jwtMiddleWare, editBioData)
router.post('/saveBioChanges', jwtMiddleWare, saveBioChanges)
router.patch('/cancelBioChanges', jwtMiddleWare, cancelBioChanges)

// router.get('/pullModuleData/:moduleId', jwtMiddleWare, handlePullModuleData)
// router.get('/pullAssesment/:questionId', jwtMiddleWare, handlePullAssesment)
// router.post('/pushStudentAnswer', jwtMiddleWare, handleStudentAnswer)
// router.get('/validateStudentAttempt/:assesmentId', jwtMiddleWare, handleCheckStudentAttempt)
// router.get('/countdown/:assessmentId', handleCountdown)
module.exports = router
