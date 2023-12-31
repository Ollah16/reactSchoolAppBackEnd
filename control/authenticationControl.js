const bcrypt = require('bcryptjs');
const securepassword = require('secure-password')
const pwd = securepassword()
const jwt = require('jsonwebtoken');
const { Student, Tutor, Module } = require('../model/schoolData');
const jwtSecretKey = process.env.JWTSECRETKEY;

exports.handleStudentRegistration = async (req, res) => {
    try {
        const { email, password, firstName, lastName, dob, homeAddress, mobileNumber } = req.body;
        const checkStdEmail = await Student.findOne({ email });
        if (!checkStdEmail) {
            const salt = await bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hashSync(password, salt);
            const newStudent = await Student({ email, password: hashedPassword, firstName, lastName, dob, homeAddress, mobileNumber, edit: false });
            await newStudent.save();
            return res.json({ message: 'Registration Successful, Proceed To Sign In' });
        } else {
            return res.json({ error: 'Email already exists' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
}

exports.handleTutorRegistration = async (req, res) => {
    try {
        const { email, password, firstName, lastName, dob, homeAddress, mobileNumber, moduleName, moduleCode } = req.body;
        const userEmail = await Tutor.findOne({ email });
        if (!userEmail) {
            const salt = await bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hashSync(password, salt);
            const newTutor = await Tutor({ email, password: hashedPassword, firstName, lastName, dob, homeAddress, mobileNumber, moduleName, moduleCode, edit: false });
            const savedTutor = await newTutor.save();
            const newModule = await Module({ moduleName, moduleCode, tutorId: savedTutor._id })
            await newModule.save()

            return res.json({ message: 'Registration Successful, Proceed To Sign In' });
        } else {
            return res.json({ error: 'Email already exists' });
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
                const { id } = userEmail;
                const accessToken = jwt.sign({ id }, jwtSecretKey);
                return res.json({ accessToken });
            }
            return res.json({ error: 'Incorrect Password' });
        }
        return res.json({ error: 'Incorrect email or password' });
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
                const { id } = userEmail;
                const accessToken = jwt.sign({ id }, jwtSecretKey);
                return res.json({ accessToken });
            }
            return res.json({ error: 'Incorrect Password' });
        }
        return res.json({ error: 'Incorrect email or password' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
};

