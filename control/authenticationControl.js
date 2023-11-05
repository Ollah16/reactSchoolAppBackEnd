const bcrypt = require('bcryptjs');
const securepassword = require('secure-password')
const pwd = securepassword()
const jwt = require('jsonwebtoken');
const { Student, Tutor, Module } = require('../model/schoolData');
const jwtSecretKey = process.env.JWTSECRETKEY;

exports.handleStudentRegistration = async (req, res) => {
    res.send('hi')
    // try {
    //     const { email, password, firstName, lastName, dob, homeAddress, mobileNumber } = req.body;
    //     const checkStdEmail = await Students.findOne({ email });
    //     if (!checkStdEmail) {
    //         const salt = await bcrypt.genSaltSync(10);
    //         const myPass = await bcrypt.hashSync(password, salt);
    //         const newStudent = await Student({ email, password: myPass, firstName, lastName, dob, homeAddress, mobileNumber, edit: false });
    //         await newStudent.save();
    //         return res.json({ message: 'Registration Successful' });
    //     } else {
    //         return res.json({ message: 'Email already exists' });
    //     }
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).send('An error occurred');
    // }
}

exports.handleTutorRegistration = async (req, res) => {
    try {
        const { email, password, firstName, lastName, dob, homeAddress, mobileNumber, moduleName, moduleCode } = req.body;
        const checkTutrEmail = await Tutors.findOne({ email });
        if (!checkTutrEmail && type === 'tutorsignup') {
            const salt = await bcrypt.genSaltSync(10);
            const myPass = await bcrypt.hashSync(password, salt);
            const newTutor = await Tutor({ email, password: myPass, firstName, lastName, dob, homeAddress, mobileNumber, moduleName, moduleCode, edit: false });
            const newModule = await Module({ moduleName, moduleCode })
            await newTutor.save();
            await newModule.save()

            return res.json({ message: 'Registration Successful' });
        } else {
            return res.json({ message: 'Email already exists' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

exports.handleStudentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userEmail = await Student.findOne({ email });
        if (userEmail) {
            const comparePassword = await bcrypt.compareSync(password, userEmail.password)

            if (comparePassword) {
                const { _id } = userEmail;
                const accessToken = jwt.sign({ _id }, jwtSecretKey);
                return res.json({ accessToken });
            }
            return res.json({ message: 'Incorrect Password' });
        }
        return res.json({ message: 'Incorrect email or password is not correct' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

exports.handleTutorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userEmail = await Tutor.findOne({ email });
        if (userEmail) {
            const comparePassword = await bcrypt.compareSync(password, userEmail.password)

            if (comparePassword) {
                const { _id } = userEmail;
                const accessToken = jwt.sign({ _id }, jwtSecretKey);
                return res.json({ accessToken });
            }
            return res.json({ message: 'Incorrect Password' });
        }
        return res.json({ message: 'Incorrect email or password is not correct' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

