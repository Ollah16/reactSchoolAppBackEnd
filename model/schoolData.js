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

let informationSchema = new Schema({
    information: String,
    title: String,
    sendInformation: Boolean,
    edit: Boolean,
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: Student
    }
})
let Information = model("information", informationSchema)

let gradesSchema = new Schema({
    assesmentId: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    assesmentTitle: String,
    sendGrade: Boolean,
    tutorId: {
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
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: Student
    }
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

let assessmentSchema = new Schema({
    testTitle: String,
    sendAssessment: Boolean,
    allQuestions: [{
        question: String,
        optionA: String,
        optionB: String,
        optionC: String,
        optionD: String,
        answer: String,
        edit: Boolean
    }],
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: Student
    },
    duration: Number
})

let Assessment = model('assessment', assessmentSchema)
module.exports = { Assessment, Module, Grade, Information, Student, Tutor, StudentModule }