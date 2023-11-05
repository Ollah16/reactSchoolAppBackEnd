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
let Tutor = model("tutor", tutorSchema)

let studentSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    dob: String,
    homeAddress: String,
    mobileNumber: Number,
    edit: Boolean
})

let Student = model("student", studentSchema)

let announcementSchema = new Schema({
    information: String,
    title: String,
    displayForStudents: Boolean,
    edit: Boolean,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Student
    }
})
let Announcement = model("announcement", announcementSchema)

let gradesSchema = new Schema({
    assesmentId: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    assesmentTitle: String,
    displayGrade: Boolean,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    grades: [{
        moduleName: String,
        moduleCode: Number,
        grade: Number,
        studentName: String,
        studentId: {
            type: Schema.Types.ObjectId,
            ref: Student
        }
    }]
})
let Grade = model('grade', gradesSchema)

let moduleSchema = new Schema({
    moduleName: String,
    moduleCode: Number,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
})

let Module = model('module', moduleSchema)

let studentModuleSchema = new Schema({
    moduleName: String,
    moduleCode: Number,
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
})

let StudentModule = model('studentmodule', studentModuleSchema)

let questionsSchema = new Schema({
    testTitle: String,
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

let Question = model('question', questionsSchema)
module.exports = { Question, Module, Grade, Announcement, Student, Tutor, StudentModule }