const { Module, Student, Grade, Information, StudentModule, Assessment } = require("../model/schoolData")

exports.getBioData = async (req, res) => {
    try {
        const { id } = req.userId
        const bioData = await Student.findById(id)
        res.json({ bioData })
    }
    catch (err) { console.error(err) }
}

exports.getModules = async (req, res) => {
    try {
        const modules = await Module.find({})
        return res.json({ modules })
    }
    catch (err) { console.error(err) }
}

exports.getGrades = async (req, res) => {
    try {
        const { id } = req.userId;
        const grades = await Grade.find({ sendGrade: true, studentId: id });
        res.json({ grades })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
}

exports.getInformations = async (req, res) => {
    try {
        const { id } = req.userId

        const studentModule = await StudentModule.find({ studentId: id })
        const informations = await Information.find({})
        let allInformations = [];

        for (const student of studentModule) {
            const moduleId = student.moduleId
            const information = informations.find((info) => info.moduleId.toString() === moduleId.toString())
            if (information) {
                for (const info of informations) {
                    if (info.moduleId.toString() === moduleId.toString() && info.sendInformation) {
                        info.moduleName = student.moduleName
                        allInformations.push(info)
                    }
                }
            }
        }
        res.json({ informations: allInformations })
    }
    catch (err) { console.error(err) }
}

exports.chooseModule = async (req, res) => {
    try {
        const { id } = req.userId
        const { data } = req.body

        for (const doc of data) {
            const studentModules = { moduleName: doc.moduleName, moduleCode: doc.moduleCode, moduleId: doc.moduleId, studentId: id }
            const AddStudentModule = await StudentModule(studentModules)
            await AddStudentModule.save()
        }

        const modules = await StudentModule.find({ studentId: id })
        res.json({ modules })
    }
    catch (err) { console.error(err) }
}

exports.isRegistered = async (req, res) => {

    try {
        const { id } = req.userId;
        const isRegistad = await StudentModule.find({ studentId: id })
        if (isRegistad.length) {
            res.json({ message: 'courses registered' })
            return
        } else {
            res.json({ message: 'courses unRegistered' })
        }
    } catch (err) { console.error(err) }
}

exports.editBioData = async (req, res) => {
    try {
        const { id } = req.userId
        await Student.findByIdAndUpdate(id, { edit: true })
    } catch (err) { console.error(err) }
}

exports.cancelBioChanges = async (req, res) => {
    try {
        const { id } = req.userId
        await Student.findByIdAndUpdate(id, { edit: false })
    } catch (err) { console.error(err) }
}

exports.saveBioChanges = async (req, res) => {
    try {
        const { id } = req.userId
        const { firstName, lastName, dob, homeAddy, mobileNumber, email } = req.body
        const updateBio = { firstName, lastName, dob, homeAddress: homeAddy, mobileNumber, email, edit: false }
        await Student.findByIdAndUpdate(id, updateBio)
    } catch (err) { console.error(err) }
}

exports.getModuleData = async (req, res) => {
    try {
        const { moduleId } = req.params
        const assessments = await Assessment.find({ moduleId, sendAssessment: true })
        const informations = await Information.find({ moduleId, sendInformation: true })
        res.json({ assessments, informations })
    }
    catch (err) { console.error(err) }
}

exports.getAssessment = async (req, res) => {
    try {
        const { assessmentId } = req.params
        const test = await Assessment.findOne({ _id: assessmentId })
        res.json({ test })
    }
    catch (err) { console.error(err) }
}

exports.checkAttempt = async (req, res) => {
    try {
        const { assesmentId } = req.params
        const { id } = req.userId
        const isAttempted = await Grade.findOne({ assesmentId, studentId: id })

        if (isAttempted) {
            return res.json({ message: 'attempted' })
        }
        return res.json({ message: 'unattempted' })
    }
    catch (err) { console.error(err) }
}

exports.pushGrade = async (req, res) => {
    try {
        const { id } = req.userId;
        const { grade } = req.body;

        const assessment = await Assessment.find();

        let score = 0;
        let assessmentTitle;
        let assessmentId;
        let moduleId;

        for (const data of grade) {
            const testId = data.assessmentId;
            const questionId = data.questionId
            const answer = data.answer

            for (const assess of assessment) {
                if (testId.toString() === assess._id.toString()) {
                    assessmentTitle = assess.testTitle
                    assessmentId = assess._id
                    moduleId = assess.moduleId
                    for (const question of assess.allQuestions) {
                        if (questionId.toString() === question._id.toString() && question.answer === answer) {
                            score += 1;
                        }
                    }
                }
            }
        }

        const module = await Module.findOne({ moduleId });

        const newGrade = {
            assessmentTitle,
            assessmentId,
            sendGrade: false,
            moduleId,
            grades: {
                moduleName: module.moduleName,
                moduleCode: module.moduleCode,
                grade: score,
                studentId: id,
            }
        };


        const isGradeExist = await Grade.findOne({ assessmentId });

        if (ifAssessmentExist) {
            const { grades } = isGradeExist;
            const student = grades.find(std => std.studentId.toString() === id.toString())
            if (!student) {
                grades.push({ moduleName, moduleCode: module.moduleCode, grade: score, studentId: id });
                await Grade.findOneAndUpdate({ assessmentId }, { grades });
            }
        } else {
            const newGradePush = await AllGrades(newGrade);
            await newGradePush.save();
        }
        res.status(200).json({ message: "Student answers handled successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};



