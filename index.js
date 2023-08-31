if (process.env.Node_ENV != "production") require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
app.use(express.urlencoded({ extended: true }))
const signInReg = require("./routes/signInReg")
// const tutor = require("./routes/tutorRoute")
// const student = require('./routes/studentRoute')
// app.use('/signInReg', signInReg)
// app.use('/tutor', tutor)
// app.use('/student', student)
app.get('/', (req, res) => {
    res.send('success')
})
const port = process.env.PORT || 9090
app.listen(port, () => {
})
