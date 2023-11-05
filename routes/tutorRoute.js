const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {
    getModuleInfo,
    getQuestions,
    editQuestion,
    saveChanges,
    deleteQuestion,
    sendAssesment,
    addQuestions,
    handleCancelChanges,
    cancelChanges,
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
router.get('/getQuestions', jwtMiddleWare, getQuestions)
router.post('/addQuestions', jwtMiddleWare, addQuestions)
router.patch('/editQuestion/:questionId', jwtMiddleWare, editQuestion)
router.post('/saveQuestionChanges/:questionId', jwtMiddleWare, saveQuestionChanges)
router.patch('/cancelQuestionChanges/:questionId', jwtMiddleWare, cancelQuestionChanges)
router.delete('/deleteQuestion/:questionId', jwtMiddleWare, deleteQuestion)
router.patch('/sendAssessment/:assessmentId', sendAssessment)
router.delete('/deleteAssessment/:assessmentId', deleteAssessment)

router.post('/addInformation', jwtMiddleWare, addInformations)
router.get('/getInformations', jwtMiddleWare, getInformations)
router.patch('/editInformation/:infoId', editInformation)
router.patch('/cancelInfoChanges/:infoId', cancelInfoChanges)
router.post('/saveInformation/:infoId', saveInfoChanges)
router.delete('/deleteInformation/:infoId', deleteInfo)
router.patch('/sendInformation/:infoId', sendInfo)


// router.get('/fetchResults', jwtMiddleWare, handleAllResult)
// router.patch('/editPersonalInformation', jwtMiddleWare, handleEditPersonalInformation)
// router.patch('/cancelPersonalEdit', jwtMiddleWare, handlePersonalInfoCancelEdit)
// router.post('/savePersonalInformation', jwtMiddleWare, handleSavePersonalInfoChanges)
// router.patch('/displayResults/:assesmentId', jwtMiddleWare, handleDisplayResults)
// router.patch('/displayInfo/:infoId', jwtMiddleWare, handleDisplayInfo)
module.exports = router


