const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ChallengeSchema = new Schema({
    challengeBy: {
        type: String,
        required: true
    },
    challengeTo: {
        type: String,
        required: true
    },
    challengeByName: {
        type: String,
        required: true
    },
    challengeToName: {
        type: String,
        required: true
    },
    challengeByPFPURI: {
        type: String,
        required: true
    },
    challengeToPFPURI: {
        type: String,
        required: true
    },
    subjects: {
       type: Array,
       default: ["physics", "chemistry", "maths"]
    },
    difficulty: {
        type: String,
        default: "mains"
    },
    noOfQuestions: {
        type: Number,
        default: 5
    },
    timeNeeded: {
        type: Number,
        default: 15
    },
    CompletedBySender: {
        type: Boolean,
        default: false
    },
    CompletedByReceiver: {
        type: Boolean,
        default: false
    },
    ReceiverScore: {
        type: Number,
        default: null
    },
    SenderScore: {
        type: Number,
        default: null
    }
}, {timestamps: true});

module.exports = mongoose.model('challenge', ChallengeSchema);