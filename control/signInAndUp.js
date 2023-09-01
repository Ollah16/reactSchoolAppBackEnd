const { Students, Tutors, AllModules } = require('../model/schoolData');
// const bcrypt = require('bcrypt');
const securePassword = require('secure-password')
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWTSECRETKEY;
const pwd = securePassword()

const handleSignUp = async (req, res) => {
    res.send('success')
    try {
        const { type, email, password, firstName, lastName, dob, homeAddress, mobileNumber, moduleName, moduleCode, edit } = req.body;

        const checkStdEmail = await Students.findOne({ email });
        const checkTutrEmail = await Tutors.findOne({ email });

        if (!checkStdEmail && type === 'studentsignup') {
            // const salt = await bcrypt.genSalt();
            const myPass = await pwd.hash(password)

            // const myPass = await bcrypt.hash(password, salt);
            const newStudent = await Students({ email, password: myPass, firstName, lastName, dob, homeAddress, mobileNumber, edit: false });
            await newStudent.save();
            return res.send('registered');
        }
        if (!checkTutrEmail && type === 'tutorsignup') {
            // const salt = await bcrypt.genSalt();
            const myPass = await pwd.hash(password)
            const newTutor = await Tutors({ email, password: myPass, firstName, lastName, dob, homeAddress, mobileNumber, moduleName, moduleCode, edit });
            await newTutor.save();
            return res.send('registered');
        } else {
            return res.send('email already exists');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

const handleSignIn = async (req, res) => {
    try {
        const { type, email, password } = req.body;

        if (type === 'student') {
            const checkStdEmail = await Students.findOne({ email });
            if (checkStdEmail) {
                const checkStdPassword = await pwd.verify(password, checkStdEmail.password)
                // const checkStdPassword = await bcrypt.compare(password, checkStdEmail.password);

                if (checkStdPassword) {
                    const { id } = checkStdEmail;
                    const accessToken = jwt.sign({ id }, jwtSecretKey);
                    const { email, firstName, lastName, dob, homeAddress, mobileNumber } = checkStdEmail;
                    const studentData = { email, firstName, lastName, dob, homeAddress, mobileNumber };
                    return res.json({ accessToken, studentData });
                }
                return res.send('That password is not correct');
            }
            return res.send('That email or password is not correct');
        }

        if (type === 'tutor') {
            const checkTutorEmail = await Tutors.findOne({ email });
            if (checkTutorEmail) {
                // const checkTutorPassword = await argon2.verify(checkStdEmail.password, password)

                const checkTutorPassword = await pwd.verify(password, checkTutorEmail.password)
                const { moduleName, moduleCode, _id } = checkTutorEmail;
                const checkModuleID = await AllModules.findOne({ moduleId: _id });
                if (!checkModuleID) {
                    const newModule = await AllModules({ moduleName, moduleCode, moduleId: _id });
                    await newModule.save();
                }
                if (checkTutorPassword) {
                    const { id } = checkTutorEmail;
                    const accessToken = jwt.sign({ id }, jwtSecretKey);
                    const { email, firstName, lastName, dob, homeAddress, mobileNumber, moduleCode, moduleName } = checkTutorEmail;
                    const tutorData = { email, firstName, lastName, dob, homeAddress, mobileNumber, moduleCode, moduleName };
                    return res.json({ accessToken, tutorData });
                }
                return res.send('That password is not correct');
            }
            return res.send('That email or password is not correct');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

module.exports = { handleSignIn, handleSignUp };
