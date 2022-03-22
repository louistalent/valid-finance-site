const mongoose = require('mongoose');

const UsersVotingSchema = mongoose.Schema({
    proposal: {
        type: String,
    },
    account: {
        type: String
    },
    status: {
        type: Number
    },
    date: {
        type: Date
    }
},
    {
        timestamps: true
    });

const UsersVoting = mongoose.model('UsersVoting', UsersVotingSchema)

module.exports = UsersVoting;
