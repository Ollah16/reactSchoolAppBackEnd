const { ObjectId } = require('mongodb')
const { connect, model, Schema } = require('mongoose')
connect(process.env.MONGODB_URI)
    .then(res => console.log('connected'))
    .catch(err => console.error(err))

let tutorSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    dob: String,
    homeAddress: String,
    mobileNumber: Number,
    moduleCode: Number,
    moduleName: String,
    edit: Boolean,
    mobileNumber: Number
})
let Tutors = model("allTutors", tutorSchema)

let studentSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    dob: String,
    homeAddress: String,
    mobileNumber: Number,
    edit: Boolean,
    studentGrades: [{
        assesmentTitle: String,
        moduleName: String,
        moduleCode: Number,
        grade: Number,
        assesmentId: {
            type: Schema.Types.ObjectId,
            ref: Tutors
        }
    }],
    studentModules: [{
        moduleName: String,
        moduleCode: Number,
        moduleId: {
            type: Schema.Types.ObjectId,
            ref: Tutors
        }
    }]
})

let Students = model("allStudents", studentSchema)

let announcementSchema = new Schema({
    information: String,
    title: String,
    displayForStudents: Boolean,
    showInformation: Boolean,
    edit: Boolean,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Students
    }
})
let Announcements = model("announcements", announcementSchema)

let gradesSchema = new Schema({
    assesmentId: {
        type: Schema.Types.ObjectId,
        ref: Students
    },
    assesmentTitle: String,
    displayGrade: Boolean,
    showResults: Boolean,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Students
    },
    grades: [{
        moduleName: String,
        moduleCode: Number,
        grade: Number,
        studentName: String,
        studentId: {
            type: Schema.Types.ObjectId,
            ref: Students
        }
    }]
})
let AllGrades = model('allGrades', gradesSchema)

let moduleSchema = new Schema({
    moduleName: String,
    moduleCode: Number,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Students
    },
})

let AllModules = model('allModules', moduleSchema)

let allQuestionsSchema = new Schema({
    testTitle: String,
    showQuestion: Boolean,
    displayForStudents: Boolean,
    allQuestions: [{
        question: String,
        optionA: String,
        optionB: String,
        optionC: String,
        optionD: String,
        answer: String,
        edit: Boolean
    }],
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Students
    },
    duration: Number
})

let AllQuestions = model('allQuestions', allQuestionsSchema)

module.exports = { Announcements, AllQuestions, Students, Tutors, AllGrades, AllModules }