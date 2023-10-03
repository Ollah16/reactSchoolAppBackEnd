const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { handleFetchQuestions, handleAddQuestions, handleDisplayQuestion, handleEditQuestion, handleCancelChanges, handleDeleteQuestion, handleChanges, handleAddInformations, handleFetchInformations, handleShowInformation, handleEditInformation, handleCancelEdit, handleSaveAnnouncementChanges, handleDeleteInfo, handleFetchPInfo, handleAllResult, handleEditPersonalInformation, handlePersonalInfoCancelEdit, handleSavePersonalInfoChanges, handleShowResults, handleDisplayResults, handleDisplayInfo, handleDisplayAssesment } = require('../control/tutorControl')

const jwtMiddleWare = async (req, res, next) => {
    let { authorization } = req.headers
    let [, myJwt] = authorization.split(' ')
    let userId = await jwt.verify(myJwt, process.env.JWTSECRETKEY)
    if (userId) {
        req.userId = userId
        next()
    }
}

router.get('/fecthQuestions', jwtMiddleWare, handleFetchQuestions)
router.post('/addquestion', jwtMiddleWare, handleAddQuestions)
router.patch('/editOneQuestion/:questionId', jwtMiddleWare, handleEditQuestion)
router.patch('/cancelEdit/:questionId', jwtMiddleWare, handleCancelChanges)
router.post('/editDone/:questionId', jwtMiddleWare, handleChanges)
router.delete('/removeAssesment/:questionId', jwtMiddleWare, handleDeleteQuestion)
router.post('/addInformation', jwtMiddleWare, handleAddInformations)
router.get('/getAllInformations', jwtMiddleWare, handleFetchInformations)
router.patch('/editInformation/:infoId', jwtMiddleWare, handleEditInformation)
router.patch('/cancelInfoEdit/:infoId', jwtMiddleWare, handleCancelEdit)
router.post('/saveInformation/:infoId', jwtMiddleWare, handleSaveAnnouncementChanges)
router.delete('/removeInformation/:infoId', jwtMiddleWare, handleDeleteInfo)
router.get('/fetchpInfo', jwtMiddleWare, handleFetchPInfo)
router.get('/fetchResults', jwtMiddleWare, handleAllResult)
router.patch('/editPersonalInformation', jwtMiddleWare, handleEditPersonalInformation)
router.patch('/cancelPersonalEdit', jwtMiddleWare, handlePersonalInfoCancelEdit)
router.post('/savePersonalInformation', jwtMiddleWare, handleSavePersonalInfoChanges)
router.patch('/displayResults/:assesmentId', jwtMiddleWare, handleDisplayResults)
router.patch('/displayInfo/:infoId', jwtMiddleWare, handleDisplayInfo)
router.patch('/displayAssessment/:assesmentId', jwtMiddleWare, handleDisplayAssesment)
module.exports = router


