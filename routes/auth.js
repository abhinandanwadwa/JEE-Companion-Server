const express = require('express');
const router = express.Router();
const UserSchema = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "AbhiIsASexyFuckin*GoodB$oy";



// Route 1: Creating A New User: POST: http://localhost:5000/api/auth/createuser. No Login Required
router.post('/createuser', [
    body('fname', "Your First Name Should Be At Least 4 Characters").isLength({ min: 4 }),
    body('lname', "Your Last Name Should Be At Least 3 Characters").isLength({ min: 3 }),
    body('email', "Please Enter a Vaild Email").isEmail(),
    body('password', "Password Should Be At Least 6 Characters").isLength({ min: 6 }),
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        const checkMultipleUsers = await UserSchema.findOne({ email: req.body.email });
        if (checkMultipleUsers) {
            return res.status(403).json({ error: "A User with this email address already exists" });
        }
        
        var salt = await bcrypt.genSalt(10);
        var hash = await bcrypt.hash(req.body.password, salt);
        const newUser = await UserSchema.create({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: hash,
            imageURI: req.body.imageURI,
        });

        let payload = {
            user: {
                id: newUser.id
            }
        }

        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({authtoken});

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});







































// Route 2: Authenticating an existing user: POST: http://localhost:5000/api/auth/login. No Login Required
router.post('/login', [
    body('email', "Please Enter a Vaild Email").isEmail(),
    body('password', "Password Should Be At Least 6 Characters").isLength({ min: 6 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try {
        const theUser = await UserSchema.findOne({ email: req.body.email });
        if (theUser) {
            // console.log(checkEmailExists);
            let checkHash = await bcrypt.compare(req.body.password, theUser.password);
            if (checkHash) {
                let payload = {
                    user: {
                        id: theUser.id
                    }
                }
                const authtoken = jwt.sign(payload, JWT_SECRET);
                return res.status(200).json({authtoken});
            }
            else {
                return res.status(403).json({ error: "Invalid Credentials" });
            }
        }
        else {
            return res.status(403).json({ error: "Invalid Credentials" });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});







































// Route 3: Getting My Details: POST: http://localhost:5000/api/auth/getMyDetails. Login Required
router.get('/getMyDetails', fetchuser, async (req, res) => {
    try {
        const Meh = await UserSchema.findById(req.user.id).select('-password');
        res.json(Meh);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});












































// Route 4: Getting Everyone Without Me: POST: http://localhost:5000/api/auth/getCompetitors. Login Required
router.get('/getCompetitors', fetchuser, async (req, res) => {
    try {
        const myCompetitors = await UserSchema.find({ _id: { $ne: req.user.id } }).select('-password').sort([['score', 'descending']]);
        res.json(myCompetitors);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});












































// Route 5: Getting A Specific User By ID: GET: http://localhost:5000/api/auth/getMyDetails. Login Required
router.get('/getuser/:id', async (req, res) => {
    try {
        const He = await UserSchema.findById(req.params.id).select('-password');
        res.json(He);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});












































// Route 6: Updating Password With the help of new password: PUT: http://localhost:5000/api/auth/updatepassword. Login Required
router.put('/updatepassword', [
    body('oldpassword', "Please Enter a Vaild Old Password").isLength({ min: 6 }),
    body('newpassword', "New Password Should Be At Least 6 Characters").isLength({ min: 6 }),
    body('confirmnewpassword', "Confirm New Password Should Be At Least 6 Characters").isLength({ min: 6 }),
], fetchuser, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try {
        const theUser = await UserSchema.findById(req.user.id);
        const passCompare = await bcrypt.compare(req.body.oldpassword, theUser.password);

        if (passCompare) {
            const newPassword = req.body.newpassword;
            const newSalt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(newPassword, newSalt);

            await UserSchema.findByIdAndUpdate(req.user.id, { password: newHash });

            res.json({ success: "Password Updated Successfully" });
        }

        else {
            return res.status(403).json({error: "The Old Password you Entered is Wrong"});
        }

        // const He = await UserSchema.findById(req.params.id);
        // res.json(He);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});












































// Route 7: Updating User Details: PUT: http://localhost:5000/api/auth/updatedetails. Login Required
router.put('/updatedetails', [
    body('fname', "Your First Name Should Be At Least 4 Characters").isLength({ min: 4 }),
    body('lname', "Your Last Name Should Be At Least 3 Characters").isLength({ min: 3 }),
    body('email', "Please Enter a Vaild Email").isEmail(),
], fetchuser, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try {
        const theUser = await UserSchema.findById(req.user.id);

        if (theUser) {
            const newFname = req.body.fname;
            const newLname = req.body.lname;
            const newEmail = req.body.email;

            await UserSchema.findByIdAndUpdate(req.user.id, { fname: newFname, lname: newLname, email: newEmail });

            res.json({ success: "User Details Updated Successfully" });
        }

        else {
            return res.status(403).json({error: "Please Authenticate With A Valid Token"});
        }

        // const He = await UserSchema.findById(req.params.id);
        // res.json(He);

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});




module.exports = router;