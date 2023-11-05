const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const {
    getModuleInfo,
    getQuestions,
    editQuestion,
    saveChanges,
    cancelChanges,
    deleteQuestion,
    sendAssesment,
    addQuestions,
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
router.post('/saveChanges/:questionId', jwtMiddleWare, saveChanges)
router.patch('/cancelChanges/:questionId', jwtMiddleWare, cancelChanges)
router.delete('/deleteAssesment/:assesmentId', jwtMiddleWare, deleteQuestion)
router.patch('/sendAssesment/:assesmentId', jwtMiddleWare, sendAssesment)

// router.post('/addInformation', jwtMiddleWare, handleAddInformations)
// router.get('/getAllInformations', jwtMiddleWare, handleFetchInformations)
// router.patch('/editInformation/:infoId', jwtMiddleWare, handleEditInformation)
// router.patch('/cancelInfoEdit/:infoId', jwtMiddleWare, handleCancelEdit)
// router.post('/saveInformation/:infoId', jwtMiddleWare, handleSaveAnnouncementChanges)
// router.delete('/removeInformation/:infoId', jwtMiddleWare, handleDeleteInfo)
// router.get('/fetchResults', jwtMiddleWare, handleAllResult)
// router.patch('/editPersonalInformation', jwtMiddleWare, handleEditPersonalInformation)
// router.patch('/cancelPersonalEdit', jwtMiddleWare, handlePersonalInfoCancelEdit)
// router.post('/savePersonalInformation', jwtMiddleWare, handleSavePersonalInfoChanges)
// router.patch('/displayResults/:assesmentId', jwtMiddleWare, handleDisplayResults)
// router.patch('/displayInfo/:infoId', jwtMiddleWare, handleDisplayInfo)
module.exports = router


