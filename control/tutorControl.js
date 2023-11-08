const { Tutor, Module, Information, Assessment, Grade, Student } = require('../model/schoolData')

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
        const module = await Module.findOne({ tutorId: id })
        const assessments = await Assessment.find({ moduleId: module._id })

        return res.json({ assessments })
    }
    catch (err) { console.error(err) }
}

exports.addQuestions = async (req, res) => {
    try {
        const { id } = req.userId
        const { assessmentTitle, allQuestions, duration, sendAssessment } = req.body
        const module = await Module.findOne({ tutorId: id })
        const newQuestion = { assessmentTitle, allQuestions, duration, sendAssessment, moduleId: module._id }
        const addNewQuestion = await Assessment(newQuestion)
        addNewQuestion.save()
    } catch (err) { console.error(err) }
}

exports.editQuestion = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;

        const module = await Module.findOne({ tutorId: id });

        await Assessment.updateMany(
            { moduleId: module._id },
            { $set: { 'allQuestions.$[elem].edit': true } },
            { arrayFilters: [{ 'elem._id': questionId }] }
        );
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
}


exports.saveQuestionChanges = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;
        const { question, optionA, optionB, optionC, optionD, answer } = req.body;

        const module = await Module.findOne({ tutorId: id });

        await Assessment.updateMany(
            { moduleId: module._id, 'allQuestions._id': questionId },
            {
                $set: {
                    'allQuestions.$[elem].question': question,
                    'allQuestions.$[elem].optionA': optionA,
                    'allQuestions.$[elem].optionB': optionB,
                    'allQuestions.$[elem].optionC': optionC,
                    'allQuestions.$[elem].optionD': optionD,
                    'allQuestions.$[elem].answer': answer,
                    'allQuestions.$[elem].edit': false
                }
            },
            { arrayFilters: [{ 'elem._id': questionId }] }
        );

    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

exports.cancelQuestionChanges = async (req, res) => {
    try {
        const { id } = req.userId;
        const { questionId } = req.params;

        const module = await Module.findOne({ tutorId: id });

        await Assessment.updateMany(
            { moduleId: module._id },
            { $set: { 'allQuestions.$[elem].edit': false } },
            { arrayFilters: [{ 'elem._id': questionId }] }
        );


    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};


exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.userId
        const { questionId } = req.params
        const module = await Module.findOne({ tutorId: id });
        const assessment = await Assessment.findOneAndUpdate(
            { moduleId: module._id, 'allQuestions._id': questionId },
            {
                $pull: {
                    'allQuestions': { _id: questionId }
                }
            },
            { new: true }
        );
        if (assessment) {
            const { allQuestions, _id } = assessment

            if (allQuestions.length < 1 || allQuestions.length === 0) {
                return await Assessment.findByIdAndDelete(_id)
            }
        }

    } catch (err) { console.error(err) }
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
        const module = await Module.findOne({ tutorId: id })
        const freshInformation = { information, title, sendInformation, edit, moduleId: module._id }
        const newInfo = await Information(freshInformation)
        newInfo.save()
    }
    catch (err) { console.error(err) }
}

exports.getInformations = async (req, res) => {
    try {
        const { id } = req.userId
        const module = await Module.findOne({ tutorId: id })
        const informations = await Information.find({ moduleId: module._id })
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
        const module = await Module.findOne({ tutorId: id })
        let moduleGrade = await Grade.find({ moduleId: module._id })
        const students = await Student.find()

        moduleGrade = moduleGrade.map((grade) => {
            const updatedGrades = grade.grades.map((grad) => {
                const student = students.find((std) => std._id.toString() == grad.studentId.toString());
                if (student) {
                    return {
                        ...grad,
                        studentName: student.firstName
                    };
                }
                return grad;
            });

            return {
                ...grade._doc,
                grades: updatedGrades
            };
        });

        res.json({ grades: moduleGrade })
    }
    catch (err) { console.error(err) }
}

exports.sendStatus = async (req, res) => {
    try {
        const { id } = req.userId;
        const { type } = req.body
        const { assessmentId } = req.params;
        const module = await Module.findOne({ tutorId: id })
        if (type === 'send') {
            await Grade.findOneAndUpdate({ moduleId: module._id, assessmentId }, { sendGrade: true });
        } else if (type === 'cancel') {
            await Grade.findOneAndUpdate({ moduleId: module._id, assessmentId }, { sendGrade: false });
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
