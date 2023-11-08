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

exports.getStudentModules = async (req, res) => {
    const { id } = req.userId
    try {
        const modules = await StudentModule.find({ studentId: id })
        return res.json({ modules })
    }
    catch (err) { console.error(err) }
}

exports.getGrades = async (req, res) => {
    try {
        const { id } = req.userId;
        let studentGrades = await Grade.find({ sendGrade: true });
        let grades = []
        studentGrades = studentGrades.map((grad) => {
            const stdGrade = grad.grades.find((std) => std.studentId.toString() === id.toString());
            if (stdGrade) {
                grades.push({
                    assessmentTitle: grad.assessmentTitle,
                    moduleName: stdGrade.moduleName,
                    moduleCode: stdGrade.moduleCode,
                    grade: stdGrade.grade
                })
            }
        });

        res.json({ grades });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
};


exports.getInformations = async (req, res) => {
    try {
        const { id } = req.userId;

        const studentModule = await StudentModule.find({ studentId: id });
        const informations = await Information.find({});

        let allInformations = []

        for (const info of informations) {
            const studentInfo = studentModule.find(stm => stm.moduleId.toString() == info.moduleId.toString());
            if (studentInfo && info.sendInformation) {
                allInformations.push({
                    information: info.information,
                    moduleName: studentInfo.moduleName,
                    title: info.title
                })
            }
        }

        res.json({ informations: allInformations });
    } catch (err) {
        console.error(err);
    }
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
        const studentModule = await StudentModule.find({ studentId: id });

        let allInformations = []
        for (const info of informations) {
            const student = studentModule.find(stm => stm.moduleId.toString() == info.moduleId.toString());
            if (student) {
                allInformations.push({
                    information: info.information,
                    moduleName: studentInfo.moduleName,
                    title: info.title
                })
            }
        }

        let allAssessment = []
        for (const assess of assessments) {
            const student = studentModule.find(stm => stm.moduleId.toString() == assess.moduleId.toString());
            if (student) {
                allAssessment.push({
                    assessmentTitle: assess.assessmentTitle,
                    _id: assess._id
                })
            }
        }
        res.json({ assessments: allAssessment, informations: allInformations })
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
        const { assessmentId } = req.params
        const { id } = req.userId

        let assessmentGrade = await Grade.findOne({ assessmentId })
        if (assessmentGrade) {
            let student = assessmentGrade.grades.find((std) => std.studentId.toString() === id.toString())
            if (student) {
                return res.json({ message: 'attempted' })
            }
            return res.json({ message: 'unattempted' })
        }
        return res.json({ message: 'unattempted' })
    }
    catch (err) { console.error(err) }
}

exports.pushGrade = async (req, res) => {
    try {
        const { id } = req.userId;
        const { studentGrade } = req.body;
        const assessment = await Assessment.find();

        let score = 0;
        let assessmentTitle;
        let assessmentId;
        let moduleId;

        for (const data of studentGrade) {
            const testId = data.assessmentId;
            const questionId = data.questionId
            const answer = data.answer

            for (const assess of assessment) {
                if (testId.toString() === assess._id.toString()) {
                    assessmentTitle = assess.assessmentTitle
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

        const module = await Module.findOne({ _id: moduleId });

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

        if (isGradeExist) {
            const { grades } = isGradeExist;
            const student = grades.find(std => std.studentId.toString() === id.toString())
            if (!student) {
                grades.push({ moduleName, moduleCode: module.moduleCode, grade: score, studentId: id });
                await Grade.findOneAndUpdate({ assessmentId }, { grades });
            }
        } else {
            const newGradePush = await Grade(newGrade);
            await newGradePush.save();
        }
        res.status(200).json({ message: "Student answers handled successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};



