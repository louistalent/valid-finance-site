const mongoose = require('mongoose');

const TokenVotingSchema = mongoose.Schema({
    symbol: {
        type: String,
    },
    address: {
        type: String,
    },
    logoURI: {
        type: String
    },
    voters: {
        type: Array
    },
});

const TokenVoting = mongoose.model('TokenVoting', TokenVotingSchema)

module.exports = TokenVoting;
