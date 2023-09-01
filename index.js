if (process.env.Node_ENV != "production") require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.urlencoded({ extended: true }))
const tutor = require("./routes/tutorRoute")
const student = require('./routes/studentRoute')
// const signupin = require("./routes/signInUpRoute")
app.use('/tutor', tutor)
app.use('/student', student)
// app.use('/signInUp', signupin)

const port = process.env.PORT || 9090
app.listen(port, () => {
})
