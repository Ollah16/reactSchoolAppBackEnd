const { AllQuestions, Tutors, Announcements, AllGrades, Students } = require('../model/schoolData')

const handleFetchQuestions = async (req, res) => {
    try {
        const { id } = req.userId
        const allQuestions = await AllQuestions.find({ moduleId: id })
        if (allQuestions) return res.json({ allQuestions })
        return res.send('empty')
    }
    catch (err) { console.error(err) }
}

const handleAddQuestions = async (req, res) => {
    try {
        const { id } = req.userId
        const { testTitle, showQuestion, allQuestions, duration, displayForStudents } = req.body
        const newQuestion = { testTitle, showQuestion, displayForStudents, allQuestions, moduleId: id, duration }
        const addNewQuestion = await AllQuestions(newQuestion)
        addNewQuestion.save()
    } catch (err) { console.error(err) }
}

const handleDisplayQuestion = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;

        const findTutorQuestion = await AllQuestions.findById(questionId);
        const showQuestion = !findTutorQuestion?.showQuestion || false;

        await AllQuestions.findByIdAndUpdate(questionId, { showQuestion });

        const allQuestions = await AllQuestions.find({ moduleId: id });

        res.status(200).json({ allQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleEditQuestion = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params
        const foundTutor = await AllQuestions.findOne({ moduleId: id })
        const updatedQuestions = await AllQuestions.updateMany(
            { moduleId: id, "allQuestions._id": questionId },
            { $set: { "allQuestions.$.edit": true } }
        );
        const allQuestions = await AllQuestions.find({ moduleId: id })
        res.json({ allQuestions })
    } catch (err) { console.error(err) }
}

const handleCancelChanges = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params
        const foundTutor = await AllQuestions.findOne({ moduleId: id })
        const updatedQuestions = await AllQuestions.updateMany(
            { moduleId: id, "allQuestions._id": questionId },
            { $set: { "allQuestions.$.edit": false } }
        );
        const allQuestions = await AllQuestions.find({ moduleId: id })
        res.json({ allQuestions })
    }
    catch (err) { console.error(err) }
}

const handleDeleteQuestion = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params;
        await AllQuestions.findByIdAndDelete(questionId)
        const allQuestions = await AllQuestions.find({ moduleId: id })
        res.json({ allQuestions })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
};

const handleChanges = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params
        const { question, optionA, optionB, optionC, optionD, answer } = req.body
        await AllQuestions.updateMany({ moduleId: id, "allQuestions._id": questionId },
            {
                $set: {
                    'allQuestions.$.edit': false, 'allQuestions.$.question': question, 'allQuestions.$.optionA': optionA,
                    'allQuestions.$.optionB': optionB, 'allQuestions.$.optionC': optionC, 'allQuestions.$.optionD': optionD,
                    'allQuestions.$.answer': answer
                }
            })
        const allQuestions = await AllQuestions.find({ moduleId: id })
        res.json({ allQuestions })


    } catch (err) { console.error(err) }
}

const handleAddInformations = async (req, res) => {
    try {
        const { id } = req.userId
        const { information, title, displayForStudents, showInformation, edit } = req.body
        const freshInformation = { information, title, displayForStudents, showInformation, edit, moduleId: id }
        const newInfo = await Announcements(freshInformation)
        newInfo.save()
    }
    catch (err) { console.error(err) }
}

const handleFetchInformations = async (req, res) => {
    try {
        const { id } = req.userId
        const allInformations = await Announcements.find({ moduleId: id })
        res.json({ allInformations })
    }
    catch (err) { console.error(err) }
}

const handleEditInformation = async (req, res) => {
    try {
        const { id } = req.userId
        const { infoId } = req.params
        const findInformation = await Announcements.findByIdAndUpdate(infoId, { edit: true })
        const allInformations = await Announcements.find({ moduleId: id })
        res.json({ allInformations })
    } catch (err) { console.error(err) }
}

const handleCancelEdit = async (req, res) => {
    try {
        const { id } = req.userId
        const { infoId } = req.params
        const findInformation = await Announcements.findByIdAndUpdate(infoId, { edit: false })
        const allInformations = await Announcements.find({ moduleId: id })
        res.json({ allInformations })
    } catch (err) { console.error(err) }
}

const handleSaveAnnouncementChanges = async (req, res) => {
    try {
        const { id } = req.userId
        const { infoId } = req.params
        const { titleNew, informationNew } = req.body
        await Announcements.findByIdAndUpdate(infoId, { title: titleNew, information: informationNew, edit: false })
        const allInformations = await Announcements.find({ moduleId: id })
        res.json({ allInformations })
    } catch (err) { console.error(err) }
}

const handleDeleteInfo = async (req, res) => {
    try {
        const { id } = req.userId
        const { infoId } = req.params
        await Announcements.findByIdAndRemove(infoId)
        const allInformations = await Announcements.find({ moduleId: id })
        res.json({ allInformations })
    } catch (err) { console.error(err) }
}

const handleShowInformation = async (req, res) => {
    try {
        const { id } = req.userId
        const { infoId } = req.params
        const findInfoById = await Announcements.findById(infoId)
        const { showInformation } = findInfoById
        showInformation = !showInformation ? true : false
        const findInformation = await Announcements.findByIdAndUpdate(infoId, { showInformation: showInformation })
        const allInformations = await Announcements.find({ moduleId: id })
        res.json({ allInformations })
    }
    catch (err) { console.error(err) }
}

const handleFetchPInfo = async (req, res) => {
    try {
        const { id } = req.userId
        const personalInformation = await Tutors.findById(id)
        res.json({ personalInformation })
    }
    catch (err) { console.error(err) }
}

const handleAllResult = async (req, res) => {
    try {
        const { id } = req.userId
        const allMyResults = await AllGrades.find({ moduleId: id })
        res.json({ allMyResults })
    }
    catch (err) { console.error(err) }
}

const handleEditPersonalInformation = async (req, res) => {
    try {
        const { id } = req.userId
        await Tutors.findByIdAndUpdate(id, { edit: true })
        const personalInformation = await Tutors.findById(id)
        res.json({ personalInformation })
    } catch (err) { console.error(err) }
}

const handlePersonalInfoCancelEdit = async (req, res) => {
    try {
        const { id } = req.userId
        await Tutors.findByIdAndUpdate(id, { edit: false })
        const personalInformation = await Tutors.findById(id)
        res.json({ personalInformation })
    } catch (err) { console.error(err) }
}

const handleSavePersonalInfoChanges = async (req, res) => {
    try {
        const { id } = req.userId
        const { firstName, lastName, dob, homeAddy, mobileNumber, email } = req.body
        await Tutors.findByIdAndUpdate(id, { firstName: firstName, email: email, lastName: lastName, dob: dob, homeAddress: homeAddy, mobileNumber: mobileNumber, edit: false })
        const personalInformation = await Tutors.findById(id)
        res.json({ personalInformation })
    } catch (err) { console.error(err) }
}

const handleDisplayResults = async (req, res) => {
    try {
        const { id } = req.userId;
        const { assesmentId } = req.params;
        let disGrade = ''
        let allMyResults = await AllGrades.find({ moduleId: id });
        for (const result of allMyResults) {
            if (result.assesmentId.toString() === assesmentId.toString()) {
                disGrade = !result.displayGrade
                await AllGrades.findOneAndUpdate({ assesmentId }, { displayGrade: disGrade });
            }
        }
        allMyResults = await AllGrades.find({ moduleId: id });

        res.status(200).json({ allMyResults });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

const handleShowResults = async (req, res) => {
    try {
        const { id } = req.userId;
        const { assesmentId } = req.params;
        let showRes = ''
        let allMyResults = await AllGrades.find({ moduleId: id });
        for (const result of allMyResults) {
            if (result.assesmentId.toString() === assesmentId.toString()) {
                showRes = !result.showResults
                await AllGrades.findOneAndUpdate({ assesmentId }, { showResults: showRes });
            }
        }
        allMyResults = await AllGrades.find({ moduleId: id });
        res.status(200).json({ allMyResults });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleDisplayInfo = async (req, res) => {
    try {
        const { id } = req.userId;
        const { infoId } = req.params;
        const { type } = req.body
        if (type === 'displayInfo') {
            await Announcements.findOneAndUpdate({ moduleId: id, _id: infoId }, { displayForStudents: true });
            const allInformations = await Announcements.find({ moduleId: id })
            res.json({ allInformations })
        }
        if (type === '!displayInfo') {
            await Announcements.findOneAndUpdate({ moduleId: id, _id: infoId }, { displayForStudents: false });
            const allInformations = await Announcements.find({ moduleId: id })
            res.json({ allInformations })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const handleDisplayAssesment = async (req, res) => {
    try {
        const { id } = req.userId;
        const { assesmentId } = req.params;
        const { type } = req.body
        if (type === 'displayAssessment') {
            await AllQuestions.findOneAndUpdate({ moduleId: id, _id: assesmentId }, { displayForStudents: true });
            const allQuestions = await AllQuestions.find({ moduleId: id })
            res.json({ allQuestions })
        }
        if (type === '!displayAssessment') {
            await AllQuestions.findOneAndUpdate({ moduleId: id, _id: assesmentId }, { displayForStudents: false });
            const allQuestions = await AllQuestions.find({ moduleId: id })
            res.json({ allQuestions })
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    handleDisplayAssesment,
    handleDisplayInfo,
    handleShowResults,
    handleDisplayResults,
    handleEditPersonalInformation,
    handleSavePersonalInfoChanges,
    handlePersonalInfoCancelEdit,
    handleFetchPInfo,
    handleAllResult,
    handleEditInformation,
    handleCancelEdit,
    handleSaveAnnouncementChanges,
    handleDeleteInfo,
    handleShowInformation,
    handleFetchInformations,
    handleAddInformations,
    handleChanges,
    handleFetchQuestions,
    handleAddQuestions,
    handleDisplayQuestion,
    handleEditQuestion,
    handleCancelChanges,
    handleDeleteQuestion
}