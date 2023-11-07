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
        const grades = await Grade.findOne({ sendGrade: true, studentId: id });
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
        const information = await Information.find({ moduleId, sendInformation: true })
        res.json({ assessments, information })
    }
    catch (err) { console.error(err) }
}

// const handlePullAssesment = async (req, res) => {
//     try {
//         const { questionId } = req.params
//         const myAssessment = await AllQuestions.findOne({ _id: questionId, displayForStudents: true })
//         res.json({ myAssessment })
//     }
//     catch (err) { console.error(err) }
// }

// const handleCountdown = async (req, res) => {
//     try {
//         let { assessmentId } = req.params
//         let findAssessment = await AllQuestions.findOne({ _id: assessmentId })
//         let { duration } = findAssessment
//         const countdownInterval = setInterval(() => {
//             duration -= 1
//             if (duration < 1) {
//                 res.json({ duration })
//                 clearInterval(countdownInterval)
//             }
//         }, 1000);
//     } catch (err) {
//         console.error(err);
//     }
// }

// const handleStudentAnswer = async (req, res) => {
//     try {
//         const { id } = req.userId;
//         const { studentGrade } = req.body;

//         const studentDetail = await Students.findById(id);
//         const { firstName } = studentDetail;

//         const findAssesment = await AllQuestions.find();

//         let score = 0;
//         let testTitle = ''
//         let newAssId = ''
//         let modId = ''
//         for (const data of studentGrade) {
//             const assessmentId = data.assessmentId;
//             const questionId = data.questionId
//             const answer = data.answer
//             for (const ass of findAssesment) {
//                 if (assessmentId.toString() === ass._id.toString()) {
//                     testTitle = ass.testTitle
//                     newAssId = ass._id
//                     modId = ass.moduleId
//                     for (const quest of ass.allQuestions) {
//                         if (questionId.toString() === quest._id.toString() && quest.answer === answer) {
//                             score += 1;
//                         }
//                     }
//                 }
//             }
//         }

//         const findModInAllModule = await AllModules.findOne({ moduleId: modId });
//         const { moduleName, moduleId, moduleCode } = findModInAllModule;

//         const newGrade = {
//             assesmentTitle: testTitle,
//             assesmentId: newAssId,
//             displayGrade: false,
//             showResults: false,
//             moduleId,
//             grades: {
//                 moduleName,
//                 moduleCode,
//                 grade: score,
//                 studentId: id,
//                 studentName: firstName
//             }
//         };

//         const ifAssessmentExist = await AllGrades.findOne({ assesmentId: newAssId });

//         if (ifAssessmentExist) {
//             const { grades } = ifAssessmentExist;
//             const checkStudent = grades.find(std => std.studentId.toString() === id.toString())
//             if (!checkStudent) {
//                 grades.push({ moduleName, moduleCode, grade: score, studentId: id, studentName: firstName });
//                 await AllGrades.findOneAndUpdate({ assesmentId: newAssId }, { grades });
//             }
//         } else {
//             const newGradePush = await AllGrades(newGrade);
//             await newGradePush.save();
//         }

//         res.status(200).json({ message: "Student answers handled successfully." });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

// const handleCheckStudentAttempt = async (req, res) => {
//     try {
//         const { assesmentId } = req.params
//         const { id } = req.userId
//         const findAssesment = await AllGrades.findOne({ assesmentId })
//         if (findAssesment) {
//             const { grades } = findAssesment
//             const findStudentAttmp = grades.find(grad => grad.studentId.toString() === id.toString())
//             if (findStudentAttmp) {
//                 return res.send('attempted')
//             }
//         }
//         return res.send('unattempted')
//     }
//     catch (err) { console.error(err) }
// }





// const handleEditPInformation = async (req, res) => {
//     try {
//         const { id } = req.userId
//         await Students.findByIdAndUpdate(id, { edit: true })
//         const personalInformation = await Students.findById(id)
//         res.json({ personalInformation })
//     } catch (err) { console.error(err) }
// }

// const handlePersonalInfoCancelEdit = async (req, res) => {
//     try {
//         const { id } = req.userId
//         await Students.findByIdAndUpdate(id, { edit: false })
//         const personalInformation = await Students.findById(id)
//         res.json({ personalInformation })
//     } catch (err) { console.error(err) }
// }

// const handleSavePersonalInfoChanges = async (req, res) => {
//     try {
//         const { id } = req.userId
//         const { firstName, lastName, dob, homeAddy, mobileNumber, email } = req.body
//         await Students.findByIdAndUpdate(id, { firstName: firstName, email: email, lastName: lastName, dob: dob, homeAddress: homeAddy, mobileNumber: mobileNumber, edit: false })
//         const personalInformation = await Students.findById(id)
//         res.json({ personalInformation })
//     } catch (err) { console.error(err) }
// }
