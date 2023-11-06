const { AllQuestions, Tutors, Announcements, AllGrades, Tutor, Module, Question, Information, Assessment, Grade } = require('../model/schoolData')

exports.getModuleInfo = async (req, res) => {
    try {
        const { id } = req.userId
        const moduleInformation = await Module.findOne({ tutorId: id })
        res.json({ moduleInformation })
    }
    catch (err) { console.error(err) }
}

exports.getAssessment = async (req, res) => {
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
        let assessment = await Assessment.findOne({ tutorId: id })
        let { allQuestions } = assessment
        for (const quest of allQuestions) {
            if (quest._id == questionId) {
                quest.edit = true
            }
        }
        await Assessment.findOneAndUpdate({ tutorId: id }, { allQuestions })

    } catch (err) { console.error(err) }
}

exports.saveQuestionChanges = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;
        const { question, optionA, optionB, optionC, optionD, answer } = req.body;

        let assessment = await Assessment.findOne({ tutorId: id });

        let { allQuestions } = assessment;

        for (const quest of allQuestions) {
            if (quest._id == questionId) {
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

        let assessment = await Assessment.findOne({ tutorId: id });

        let { allQuestions } = assessment;

        for (const question of allQuestions) {
            if (question._id == questionId) {
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
    const { type } = req.body
    if (type === 'send') {
        try {
            const { infoId } = req.params
            await Information.findByIdAndUpdate(infoId, { sendInformation: true })
        } catch (err) { console.error(err) }
    } else {
        try {
            const { infoId } = req.params
            await Information.findByIdAndUpdate(infoId, { sendInformation: false })
        } catch (err) { console.error(err) }
    }
}

exports.getGrades = async (req, res) => {
    try {
        const { id } = req.userId
        const grades = await Grade.find({ tutorId: id })
        res.json({ grades })
    }
    catch (err) { console.error(err) }
}

exports.sendStatus = async (req, res) => {
    try {
        const { id } = req.userId;
        const { type } = req.body
        const { assesmentId } = req.params;
        if (type === 'send') {
            await Grade.findOneAndUpdate({ tutorId: id, assesmentId }, { sendGrade: true });
        } else if (type === 'cancel') {
            await Grade.findOneAndUpdate({ tutorId: id, assesmentId }, { sendGrade: false });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

exports.getBioData = async (req, res) => {
    try {
        const { id } = req.userId
        const bioData = await Tutor.findById(id)
        res.json({ bioData })
    } catch (err) { console.error(err) }
}


exports.editBioData = async (req, res) => {
    try {
        const { id } = req.userId
        await Tutor.findByIdAndUpdate(id, { edit: true })
    } catch (err) { console.error(err) }
}

exports.cancelBioChanges = async (req, res) => {
    try {
        const { id } = req.userId
        await Tutor.findByIdAndUpdate(id, { edit: false })
    } catch (err) { console.error(err) }
}

exports.saveBioChanges = async (req, res) => {
    try {
        const { id } = req.userId
        const { firstName, lastName, dob, homeAddy, mobileNumber, email } = req.body
        const updateBio = { firstName, lastName, dob, homeAddress: homeAddy, mobileNumber, email, edit: false }
        await Tutor.findByIdAndUpdate(id, updateBio)
    } catch (err) { console.error(err) }
}
