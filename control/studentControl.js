const { AllModules, Students, AllQuestions, Announcements, AllGrades } = require("../model/schoolData")

const handleFetchPInfo = async (req, res) => {
    try {
        const { id } = req.userId
        const personalInformation = await Students.findById(id)
        res.json({ personalInformation })
    }
    catch (err) { console.error(err) }
}

const handleChosenModule = async (req, res) => {
    try {
        const { id } = req.userId
        const { data } = req.body
        await Students.findByIdAndUpdate(id, { studentModules: data })
        const allMyModules = await Students.findById(id)
        res.json({ allMyModules })
    }
    catch (err) { console.error(err) }
}

const handleFetchMyModule = async (req, res) => {
    try {
        const { id } = req.userId
        const findStudent = await Students.findById(id)
        const allModules = await AllModules.find()
        const { studentModules } = findStudent
        if (studentModules.length > 0) return res.json({ allMyModules: studentModules })
        if (studentModules.length <= 0) return res.json({ allModules })
    }
    catch (err) { console.error(err) }
}

const handlePullModuleData = async (req, res) => {
    try {
        const { id } = req.userId
        const { moduleId } = req.params
        const findStudent = await Students.findById(id)
        const { studentModules } = findStudent
        const allQuestions = await AllQuestions.find({ moduleId, displayForStudents: true })
        const information = await Announcements.find()
        const allInformations = [];
        for (const std of studentModules) {
            const modId = std.moduleId
            const findModules = information.find(info => info.moduleId.toString() === modId.toString())
            if (findModules) {
                for (const inf of information) {
                    const { moduleId } = findModules
                    if (inf.moduleId.toString() === moduleId.toString() && inf.displayForStudents) {
                        allInformations.push({ title: inf.title, information: inf.information })
                    }
                }
            }
        }
        res.json({ allQuestions, allInformations })
    }
    catch (err) { console.error(err) }
}

const handlePullAssesment = async (req, res) => {
    try {
        const { questionId } = req.params
        const myAssessment = await AllQuestions.findOne({ _id: questionId, displayForStudents: true })
        res.json({ myAssessment })
    }
    catch (err) { console.error(err) }
}

const handleCountdown = async (req, res) => {
    try {
        let { assessmentId } = req.params
        let findAssessment = await AllQuestions.findOne({ _id: assessmentId })
        let { duration } = findAssessment
        const countdownInterval = setInterval(() => {
            duration -= 1
            if (duration < 1) {
                res.json({ duration })
                clearInterval(countdownInterval)
            }
        }, 1000);
    } catch (err) {
        console.error(err);
    }
}

const handleStudentAnswer = async (req, res) => {
    try {
        const { id } = req.userId;
        const { studentGrade } = req.body;

        const studentDetail = await Students.findById(id);
        const { firstName } = studentDetail;

        const findAssesment = await AllQuestions.find();

        let score = 0;
        let testTitle = ''
        let newAssId = ''
        let modId = ''
        for (const data of studentGrade) {
            const assessmentId = data.assessmentId;
            const questionId = data.questionId
            const answer = data.answer
            for (const ass of findAssesment) {
                if (assessmentId.toString() === ass._id.toString()) {
                    testTitle = ass.testTitle
                    newAssId = ass._id
                    modId = ass.moduleId
                    for (const quest of ass.allQuestions) {
                        if (questionId.toString() === quest._id.toString() && quest.answer === answer) {
                            score += 1;
                        }
                    }
                }
            }
        }

        const findModInAllModule = await AllModules.findOne({ moduleId: modId });
        const { moduleName, moduleId, moduleCode } = findModInAllModule;

        const newGrade = {
            assesmentTitle: testTitle,
            assesmentId: newAssId,
            displayGrade: false,
            showResults: false,
            moduleId,
            grades: {
                moduleName,
                moduleCode,
                grade: score,
                studentId: id,
                studentName: firstName
            }
        };

        const ifAssessmentExist = await AllGrades.findOne({ assesmentId: newAssId });

        if (ifAssessmentExist) {
            const { grades } = ifAssessmentExist;
            const checkStudent = grades.find(std => std.studentId.toString() === id.toString())
            if (!checkStudent) {
                grades.push({ moduleName, moduleCode, grade: score, studentId: id, studentName: firstName });
                await AllGrades.findOneAndUpdate({ assesmentId: newAssId }, { grades });
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

const handleCheckStudentAttempt = async (req, res) => {
    try {
        const { assesmentId } = req.params
        const { id } = req.userId
        const findAssesment = await AllGrades.findOne({ assesmentId })
        if (findAssesment) {
            const { grades } = findAssesment
            const findStudentAttmp = grades.find(grad => grad.studentId.toString() === id.toString())
            if (findStudentAttmp) {
                return res.send('attempted')
            }
        }
        return res.send('unattempted')
    }
    catch (err) { console.error(err) }
}

const handleFetchInformations = async (req, res) => {
    try {
        const { id } = req.userId
        const findStudent = await Students.findById(id)
        const { studentModules } = findStudent

        const information = await Announcements.find()
        const allInformations = [];

        for (const std of studentModules) {
            const stdId = std.moduleId
            const findModules = information.find(info => info.moduleId.toString() === stdId.toString())
            if (findModules) {
                for (const info of information) {
                    const { moduleId } = findModules
                    if (info.moduleId.toString() === moduleId.toString() && info.displayForStudents) {
                        allInformations.push({ title: info.title, information: info.information })
                    }
                }
            }
        }
        if (allInformations.length) res.json({ allInformations })
    }
    catch (err) { console.error(err) }
}

const handleFetchResult = async (req, res) => {
    try {
        const { id } = req.userId;

        const findAllGrades = await AllGrades.find({ displayGrade: true });
        const studentCheck = await Students.findById(id);
        const { studentGrades } = studentCheck
        if (findAllGrades) {
            for (const grade of findAllGrades) {
                for (const grad of grade.grades) {
                    const checkAssessment = studentCheck.studentGrades.find(stdAss => stdAss.assesmentId ? stdAss.assesmentId.toString() === grade.assesmentId.toString() : null);
                    if (grad.studentId.toString() === id.toString() && !checkAssessment) {
                        const newGrade = {
                            assesmentId: grade.assesmentId,
                            assesmentTitle: grade.assesmentTitle,
                            moduleName: grad.moduleName,
                            moduleCode: grad.moduleCode,
                            grade: grad.grade
                        };
                        studentGrades.push(newGrade);
                        await Students.findByIdAndUpdate(id, { studentGrades })
                        return res.json({ allMyResults: studentGrades });
                    }
                }
            }
        }

        res.json({ allMyResults: studentCheck.studentGrades })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

const handleEditPInformation = async (req, res) => {
    try {
        const { id } = req.userId
        await Students.findByIdAndUpdate(id, { edit: true })
        const personalInformation = await Students.findById(id)
        res.json({ personalInformation })
    } catch (err) { console.error(err) }
}

const handlePersonalInfoCancelEdit = async (req, res) => {
    try {
        const { id } = req.userId
        await Students.findByIdAndUpdate(id, { edit: false })
        const personalInformation = await Students.findById(id)
        res.json({ personalInformation })
    } catch (err) { console.error(err) }
}

const handleSavePersonalInfoChanges = async (req, res) => {
    try {
        const { id } = req.userId
        const { firstName, lastName, dob, homeAddy, mobileNumber, email } = req.body
        await Students.findByIdAndUpdate(id, { firstName: firstName, email: email, lastName: lastName, dob: dob, homeAddress: homeAddy, mobileNumber: mobileNumber, edit: false })
        const personalInformation = await Students.findById(id)
        res.json({ personalInformation })
    } catch (err) { console.error(err) }
}

module.exports = {
    handleSavePersonalInfoChanges,
    handlePersonalInfoCancelEdit,
    handleEditPInformation,
    handleFetchResult,
    handleFetchInformations,
    handleCheckStudentAttempt,
    handleStudentAnswer,
    handlePullAssesment,
    handlePullModuleData,
    handleFetchPInfo,
    handleFetchMyModule,
    handleChosenModule,
    handleCountdown
}