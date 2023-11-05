const { AllQuestions, Tutors, Announcements, AllGrades, Tutor, Module, Question, Information, Assessment } = require('../model/schoolData')

exports.getModuleInfo = async (req, res) => {
    try {
        const { id } = req.userId
        const moduleInformation = await Module.findOne({ tutorId: id })
        res.json({ moduleInformation })
    }
    catch (err) { console.error(err) }
}

exports.getQuestions = async (req, res) => {
    try {
        const { id } = req.userId
        const assessments = await Assessment.find({ tutorId: id })
        return res.json({ assessments })
    }
    catch (err) { console.error(err) }
}

exports.addQuestions = async (req, res) => {
    try {
        const { id } = req.userId
        const { testTitle, allQuestions, duration, sendAssessment } = req.body
        const newQuestion = { testTitle, allQuestions, duration, sendAssessment, tutorId: id }
        const addNewQuestion = await Assessment(newQuestion)
        addNewQuestion.save()
    } catch (err) { console.error(err) }
}

exports.editQuestion = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params
        await Assessment.findOne({ moduleId: id })
        await Assessment.updateOne(
            { tutorId: id, "allQuestions._id": questionId },
            { $set: { "allQuestions.$.edit": true } }
        );
    } catch (err) { console.error(err) }
}

exports.saveQuestionChanges = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;
        const { question, optionA, optionB, optionC, optionD, answer } = req.body;

        const assessment = await Assessment.findOne({ tutorId: id });

        const { allQuestions } = assessment;

        for (const quest of allQuestions) {
            if (quest._id.toString() == questionId.toString()) {
                quest.question = question,
                    quest.optionA = optionA,
                    quest.optionB = optionB,
                    quest.optionC = optionC,
                    quest.optionD = optionD,
                    quest.answer = answer,
                    quest.edit = false
            }
        }

        await Assessment.findOneAndUpdate({ tutorId: id }, { allQuestions });

    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};



exports.cancelQuestionChanges = async (req, res) => {

    try {
        const { id } = req.userId;
        const { questionId } = req.params;

        const assessment = await Assessment.findOne({ tutorId: id });

        const { allQuestions } = assessment;

        for (const question of allQuestions) {
            if (question._id.toString() == questionId.toString()) {
                question.edit = false
            }
        }

        await Assessment.findOneAndUpdate({ tutorId: id }, { allQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};


exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params;
        let assessment = await Assessment.findOne({ tutorId: id })
        let { allQuestions } = assessment
        allQuestions = allQuestions.filter((quest) => quest._id.toString() == questionId.toString())
        await Assessment.findOneAndUpdate({ tutorId: id }, { allQuestions })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.sendAssessment = async (req, res) => {
    try {
        const { type } = req.body
        if (type === 'send') {
            const { assessmentId } = req.params;
            await Assessment.findOneAndUpdate({ _id: assessmentId }, { sendAssessment: true }
            );
            return
        } else if (type === 'cancel') {
            const { assessmentId } = req.params;
            await Assessment.findOneAndUpdate({ _id: assessmentId }, { sendAssessment: false }
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.deleteAssessment = async (req, res) => {
    try {
        const { assessmentId } = req.params;
        await Assessment.findOneAndDelete({ _id: assessmentId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};



exports.addInformations = async (req, res) => {
    try {
        const { id } = req.userId
        const { information, title, sendInformation, edit } = req.body
        const freshInformation = { information, title, sendInformation, edit, tutorId: id }
        const newInfo = await Information(freshInformation)
        newInfo.save()
    }
    catch (err) { console.error(err) }
}

exports.getInformations = async (req, res) => {
    try {
        const { id } = req.userId
        const informations = await Information.find({ tutorId: id })
        res.json({ informations })
    }
    catch (err) { console.error(err) }
}

exports.editInformation = async (req, res) => {
    try {
        const { infoId } = req.params
        await Information.findByIdAndUpdate(infoId, { edit: true })
    } catch (err) { console.error(err) }
}

exports.cancelInfoChanges = async (req, res) => {
    try {
        const { infoId } = req.params
        await Information.findByIdAndUpdate(infoId, { edit: false })
    } catch (err) { console.error(err) }
}

exports.saveInfoChanges = async (req, res) => {
    try {
        const { infoId } = req.params
        const { titleNew, informationNew } = req.body
        await Information.findByIdAndUpdate(infoId, { title: titleNew, information: informationNew, edit: false })
    } catch (err) { console.error(err) }
}

exports.deleteInfo = async (req, res) => {
    try {
        const { infoId } = req.params
        await Information.findByIdAndRemove(infoId)
    } catch (err) { console.error(err) }
}

exports.sendInfo = async (req, res) => {
    try {
        const { infoId } = req.params
        await Information.findByIdAndUpdate(infoId, { sendInformation: true })
    } catch (err) { console.error(err) }
}



// const handleAllResult = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const allMyResults = await AllGrades.find({ moduleId: id })
//         res.json({ allMyResults })
//     }
//     catch (err) { console.error(err) }
// }

// const handleEditPersonalInformation = async (req, res) => {
//     try {
//         const { id } = req.userId
//         await Tutors.findByIdAndUpdate(id, { edit: true })
//         const personalInformation = await Tutors.findById(id)
//         res.json({ personalInformation })
//     } catch (err) { console.error(err) }
// }

// const handlePersonalInfoCancelEdit = async (req, res) => {
//     try {
//         const { id } = req.userId
//         await Tutors.findByIdAndUpdate(id, { edit: false })
//         const personalInformation = await Tutors.findById(id)
//         res.json({ personalInformation })
//     } catch (err) { console.error(err) }
// }

// const handleSavePersonalInfoChanges = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const { firstName, lastName, dob, homeAddy, mobileNumber, email } = req.body
//         await Tutors.findByIdAndUpdate(id, { firstName: firstName, email: email, lastName: lastName, dob: dob, homeAddress: homeAddy, mobileNumber: mobileNumber, edit: false })
//         const personalInformation = await Tutors.findById(id)
//         res.json({ personalInformation })
//     } catch (err) { console.error(err) }
// }

// const handleDisplayResults = async (req, res) => {
//     try {
//         const { id } = req.userId;
//         const { assesmentId } = req.params;
//         let disGrade = ''
//         let allMyResults = await AllGrades.find({ moduleId: id });
//         for (const result of allMyResults) {
//             if (result.assesmentId.toString() === assesmentId.toString()) {
//                 disGrade = !result.displayGrade
//                 await AllGrades.findOneAndUpdate({ assesmentId }, { displayGrade: disGrade });
//             }
//         }
//         allMyResults = await AllGrades.find({ moduleId: id });

//         res.status(200).json({ allMyResults });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// const handleDisplayInfo = async (req, res) => {
//     try {
//         const { id } = req.userId;
//         const { infoId } = req.params;
//         const { type } = req.body
//         if (type === 'displayInfo') {
//             await Announcements.findOneAndUpdate({ moduleId: id, _id: infoId }, { displayForStudents: true });
//             const allInformations = await Announcements.find({ moduleId: id })
//             res.json({ allInformations })
//         }
//         if (type === '!displayInfo') {
//             await Announcements.findOneAndUpdate({ moduleId: id, _id: infoId }, { displayForStudents: false });
//             const allInformations = await Announcements.find({ moduleId: id })
//             res.json({ allInformations })
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// const handleDisplayAssesment = async (req, res) => {
//     try {
//         const { id } = req.userId;
//         const { assesmentId } = req.params;
//         const { type } = req.body
//         if (type === 'displayAssessment') {
//             await AllQuestions.findOneAndUpdate({ moduleId: id, _id: assesmentId }, { displayForStudents: true });
//             const allQuestions = await AllQuestions.find({ moduleId: id })
//             res.json({ allQuestions })
//         }
//         if (type === '!displayAssessment') {
//             await AllQuestions.findOneAndUpdate({ moduleId: id, _id: assesmentId }, { displayForStudents: false });
//             const allQuestions = await AllQuestions.find({ moduleId: id })
//             res.json({ allQuestions })
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// module.exports = {
//     handleDisplayAssesment,
//     handleDisplayInfo,
//     handleDisplayResults,
//     handleEditPersonalInformation,
//     handleSavePersonalInfoChanges,
//     handlePersonalInfoCancelEdit,
//     handleFetchPInfo,
//     handleAllResult,
//     handleEditInformation,
//     handleCancelEdit,
//     handleSaveAnnouncementChanges,
//     handleDeleteInfo,
//     handleFetchInformations,
//     handleAddInformations,
//     handleChanges,
//     handleFetchQuestions,
//     handleAddQuestions,
//     handleEditQuestion,
//     handleCancelChanges,
//     handleDeleteQuestion
// }