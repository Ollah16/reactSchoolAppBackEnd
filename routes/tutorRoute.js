const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {
    getModuleInfo,
    editQuestion,
    deleteQuestion,
    deleteAssessment,
    sendInfo,
    deleteInfo,
    saveInfoChanges,
    cancelInfoChanges,
    editInformation,
    getInformations,
    addInformations,
    saveQuestionChanges,
    cancelQuestionChanges,
    sendAssessment,
    getGrades,
    sendStatus,
    getBioData,
    saveBioChanges,
    cancelBioChanges,
    editBioData,
    getAssessment,
    addAssessment,
} = require('../control/tutorControl')

const jwtMiddleWare = async (req, res, next) => {
    let { authorization } = req.headers
    let [, myJwt] = authorization.split(' ')
    let userId = await jwt.verify(myJwt, process.env.JWTSECRETKEY)
    if (userId) {
        req.userId = userId
        next()
    }
}

router.get('/moduleInformation', jwtMiddleWare, getModuleInfo)
router.get('/getAssessments', jwtMiddleWare, getAssessment)

router.post('/addAssessment', jwtMiddleWare, addAssessment)
router.patch('/editQuestion/:questionId', jwtMiddleWare, editQuestion)
router.post('/saveQuestionChanges/:questionId', jwtMiddleWare, saveQuestionChanges)
router.patch('/cancelQuestionChanges/:questionId', jwtMiddleWare, cancelQuestionChanges)
router.delete('/deleteQuestion/:questionId', jwtMiddleWare, deleteQuestion)
router.patch('/sendAssessment/:assessmentId', jwtMiddleWare, sendAssessment)
router.delete('/deleteAssessment/:assessmentId', jwtMiddleWare, deleteAssessment)

router.post('/addInformation', jwtMiddleWare, addInformations)
router.get('/getInformations', jwtMiddleWare, getInformations)
router.patch('/editInformation/:infoId', jwtMiddleWare, editInformation)
router.patch('/cancelInfoChanges/:infoId', jwtMiddleWare, cancelInfoChanges)
router.post('/saveInformation/:infoId', jwtMiddleWare, saveInfoChanges)
router.delete('/deleteInformation/:infoId', jwtMiddleWare, deleteInfo)
router.patch('/sendInformation/:infoId', jwtMiddleWare, sendInfo)

router.get('/getGrades', jwtMiddleWare, getGrades)
router.patch('/sendStatus/:assessmentId', jwtMiddleWare, sendStatus)
router.get('/getBioData', jwtMiddleWare, getBioData)


router.patch('/editBio', jwtMiddleWare, editBioData)
router.post('/saveBioChanges', jwtMiddleWare, saveBioChanges)
router.patch('/cancelBioChanges', jwtMiddleWare, cancelBioChanges)


module.exports = router


