const mongoose = require('mongoose');

const RefferalSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    code: {
        type: String,
        required: true
    },
    refers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
            incentive: {
                type: Number,
                required: true,
                default: 0,
            }
        }
    ],
    referCount: {
        type: Number,
        required: true,
        default: 0,
    }
},
    {
        timestamps: true,
    }
);

const Refferal = mongoose.model('Refferal', RefferalSchema);
module.exports = Refferal;
