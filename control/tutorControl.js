const { AllQuestions, Tutors, Announcements, AllGrades, Tutor, Module, Question, Assesment } = require('../model/schoolData')

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
        const assesments = await Assesment.find({ tutorId: id })
        return res.json({ assesments })
    }
    catch (err) { console.error(err) }
}

exports.addQuestions = async (req, res) => {
    try {
        const { id } = req.userId
        const { testTitle, allQuestions, duration, sendAssesment } = req.body
        const newQuestion = { testTitle, allQuestions, duration, sendAssesment, tutorId: id }
        const addNewQuestion = await Assesment(newQuestion)
        addNewQuestion.save()
    } catch (err) { console.error(err) }
}

exports.editQuestion = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params
        await Assesment.findOne({ moduleId: id })
        await Assesment.updateOne(
            { tutorId: id, "allQuestions._id": questionId },
            { $set: { "allQuestions.$.edit": true } }
        );
    } catch (err) { console.error(err) }
}

exports.saveChanges = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;
        const { question, optionA, optionB, optionC, optionD, answer } = req.body;

        const assessment = await Assesment.findOne({ tutorId: id });


        const { allQuestions } = assessment;

        const updatedQuestions = allQuestions.map((questions) => {
            if (questions._id == questionId) {
                return {
                    ...questions,
                    question,
                    optionA,
                    optionB,
                    optionC,
                    optionD,
                    answer
                };
            }
            return questions;
        });

        await Assesment.findOneAndUpdate({ tutorId: id }, { allQuestions: updatedQuestions });

    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};



exports.cancelChanges = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;

        const assessment = await Assesment.findOne({ tutorId: id });

        const { allQuestions } = assessment;

        const updatedQuestions = allQuestions.map((question) => {
            if (question._id === questionId) {
                return { ...question, edit: false };
            }
            return question;
        });

        await Assesment.findOneAndUpdate({ tutorId: id }, { allQuestions: updatedQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};


exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params;
        await Assesment.findOneAndDelete({ tutorId: id, "allQuestions._id": questionId }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

exports.sendAssesment = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params;
        await Assesment.findOneAndUpdate({ tutorId: id }, { sendAssesment: true }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};



// const handleAddInformations = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const { information, title, displayForStudents, edit } = req.body
//         const freshInformation = { information, title, displayForStudents, edit, moduleId: id }
//         const newInfo = await Announcements(freshInformation)
//         newInfo.save()
//     }
//     catch (err) { console.error(err) }
// }

// const handleFetchInformations = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const allInformations = await Announcements.find({ moduleId: id })
//         res.json({ allInformations })
//     }
//     catch (err) { console.error(err) }
// }

// const handleEditInformation = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const { infoId } = req.params
//         await Announcements.findByIdAndUpdate(infoId, { edit: true })
//         const allInformations = await Announcements.find({ moduleId: id })
//         res.json({ allInformations })
//     } catch (err) { console.error(err) }
// }

// const handleCancelEdit = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const { infoId } = req.params
//         await Announcements.findByIdAndUpdate(infoId, { edit: false })
//         const allInformations = await Announcements.find({ moduleId: id })
//         res.json({ allInformations })
//     } catch (err) { console.error(err) }
// }

// const handleSaveAnnouncementChanges = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const { infoId } = req.params
//         const { titleNew, informationNew } = req.body
//         await Announcements.findByIdAndUpdate(infoId, { title: titleNew, information: informationNew, edit: false })
//         const allInformations = await Announcements.find({ moduleId: id })
//         res.json({ allInformations })
//     } catch (err) { console.error(err) }
// }

// const handleDeleteInfo = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const { infoId } = req.params
//         await Announcements.findByIdAndRemove(infoId)
//         const allInformations = await Announcements.find({ moduleId: id })
//         res.json({ allInformations })
//     } catch (err) { console.error(err) }
// }



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