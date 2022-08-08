const express = require('express');
const router = express.Router();
const UserSchema = require('../models/User');
const ChallengeSchema = require('../models/Challenge');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "AbhiIsASexyFuckin*GoodB$oy";




// Route 1: Sending A New Challenge: POST: http://localhost:5000/api/sendchallenge/:id. Login Required
router.post('/sendchallenge/:id', fetchuser, async (req, res) => {

    try {
        const checkAlreadySentByMe = await ChallengeSchema.findOne({ challengeBy: req.user.id, challengeTo: req.params.id });
        if (checkAlreadySentByMe) {
            return res.status(403).json({ error: "You Have Already sent a challenge to this user" });
        }
        const checkAlreadySentByHim = await ChallengeSchema.findOne({ challengeBy: req.params.id, challengeTo: req.user.id });
        if (checkAlreadySentByHim) {
            return res.status(403).json({ error: "He/She has sent you a challenge. You have to respond to that first" });
        }

        const user1 = await UserSchema.findById(req.user.id);
        const user2 = await UserSchema.findById(req.params.id);

        const theName1 = user1.fname + " " + user1.lname;
        const theName2 = user2.fname + " " + user2.lname;

        const thePFPURI1 = user1.imageURI;
        const thePFPURI2 = user2.imageURI;

        const challenge = await ChallengeSchema.create({
            challengeBy: req.user.id,
            challengeTo: req.params.id,
            challengeByName: theName1,
            challengeToName: theName2,
            challengeByPFPURI: thePFPURI1,
            challengeToPFPURI: thePFPURI2,
            subjects: req.body.subjects,
            difficulty: req.body.difficulty,
            noOfQuestions: req.body.noOfQuestions,
            timeNeeded: req.body.timeNeeded,
        });
        res.status(200).json(challenge);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error. Please Try Again Later" })
    }
    
})






























// Route 2: Getting all my pending received challenges: GET: http://localhost:5000/api/getpendingreceivedchallenges. Login Required
router.get('/getpendingreceivedchallenges', fetchuser, async (req, res) => {

    try {
        if (!req.query.id) {
            const pending = await ChallengeSchema.find({ $and: [{ challengeTo: req.user.id }, { CompletedByReceiver: false }] });
        
            return res.status(200).json(pending);
        }

        else {
            const pending = await ChallengeSchema.find({  })
        }
        


        // const pending = await ChallengeSchema.find({ $or: [
        //     { $and: [{ challengeBy: req.user.id }, {  }] },
        //     { $and: [{ challengeTo: req.user.id }, {  }] }
        // ] })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error. Please Try Again Later" })
    }

});






























// Route 3: Getting a specific challenge using it's id: GET: http://localhost:5000/api/challenge/getchallengebyid/:id. Login Required
router.get('/getchallengebyid/:id', fetchuser, async (req, res) => {

    try {
        const challenge = await ChallengeSchema.findById(req.params.id);
        
        res.status(200).json(challenge);


        // const pending = await ChallengeSchema.find({ $or: [
        //     { $and: [{ challengeBy: req.user.id }, {  }] },
        //     { $and: [{ challengeTo: req.user.id }, {  }] }
        // ] })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error. Please Try Again Later" })
    }

})






























// Route 4: Validating A Test: POST: http://localhost:5000/api/challenge/checkvalidtest. Login Required
router.post('/checkvalidtest', fetchuser, async (req, res) => {

    try {
        const challenge = await ChallengeSchema.findById(req.body.challengeid);

        if (challenge) {
            if ((challenge.challengeBy === req.body.hisid && challenge.challengeTo === req.user.id) || (challenge.challengeBy === req.user.id && challenge.challengeTo === req.body.hisid)) {
                return res.status(200).json({ badguy: false });
            }
            else {
                return res.status(403).json({ badguy: true });
            }
        }
        else {
            return res.status(403).json({ error: "Some Error Occurred" });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error. Please Try Again Later" })
    }

});




















// Route 5: Getting number of pending received challenges: GET: http://localhost:5000/api/getnoofpendingreceivedchallenges. Login Required
router.get('/getnoofpendingreceivedchallenges', fetchuser, async (req, res) => {

    try {
            const pending = await ChallengeSchema.find({ $and: [{ challengeTo: req.user.id }, { CompletedByReceiver: false }] });
        
            return res.status(200).json(pending.length);
        


        // const pending = await ChallengeSchema.find({ $or: [
        //     { $and: [{ challengeBy: req.user.id }, {  }] },
        //     { $and: [{ challengeTo: req.user.id }, {  }] }
        // ] })

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error. Please Try Again Later" })
    }

});




















// Route 6: Getting full challenge history of a single user: GET: http://localhost:5000/api/challengehistory. Login Required
router.get('/challengehistory', fetchuser, async (req, res) => {

    try {
        const history = await ChallengeSchema.find({ $or: [
            { challengeBy: req.user.id },
            { challengeTo: req.user.id }
        ] });

        res.send(history);

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error. Please Try Again Later" })
    }

});


module.exports = router;