const mongoose = require('mongoose');

const MailVerifySchema = mongoose.Schema({
    email: {
        type: String,
    },
    code: {
        type: String
    },
    verified: {
        type: Boolean
    },
    contents: {
        type: String
    },
    date: {
        type: Date
    }
});

const MailVerify = mongoose.model('MailVerify', MailVerifySchema)

module.exports = MailVerify;
