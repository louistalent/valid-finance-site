const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userCtrl = require('../controller/userCtrl.js');
const sendRawMail = require("../libs/email");
const config = require('../config');
// const MailVerify = require("../models/verifyModel");
const con = require('../mysql/mysql');

const router = express.Router();

// Check if E-mail is Valid or not
// const validateEmail = (email) => {
//     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
// }

const generateCode = () => {
    let code = String(Math.round(Math.rANDom() * 899976 + 10012))
    if (code.length < 6) code = '0'.repeat(6 - code.length) + code
    return code
}

router.post('/proposal-voting', (req, res) => {
    userCtrl.ProposalVoting(req, res);
});
router.post('/getVoters', (req, res) => {
    userCtrl.getVoters(req, res);
});

router.post('/tokenVoting', (req, res) => {
    userCtrl.tokenVoting(req, res);
});
router.post('/getTokenVoting', (req, res) => {
    userCtrl.getTokenVoting(req, res);
});

// mail verify code
router.post('/send-verify-email', async (req, res) => {
    try {
        const { email } = req.body
        const code = generateCode()
        const result = await sendRawMail(
            email,
            "Verify Code",
            `Your email verify code is <b>${code}</b>.`
        )

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const query = `INSERT INTO mailverify (email, code, verified, date) VALUES ('${email}','${code}','${verified}','${dateTime}')`;
        con.query(query, function (err, result) {
            if (err) throw err;
            res.send("success");
        });

        res.json({ status: true })
    } catch (error) {
        console.log(error)
        res.json({ error: "error" })
    }
});
// send code verify
router.post('/send-verify-code', async (req, res) => {
    try {
        const { email, code } = req.body
        const qu = `SELECT * FROM mailverify WHERE address='${email}' AND code='${code}'`;
        con.query(qu, function (err, result) {
            if (result.length > 0) {

                const q = `UPDATE mailverify SET verified = 'true' WHERE address='${email}' AND code='${code}'`;
                con.query(q, function (err, result2) {
                    if (err)
                        res.json({ status: 'failupdate' })
                    res.json({ status: true })
                })

            } else {
                res.json({ status: 'nofind' })
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ error: "error" })
    }
});

router.post('/submit-report', async (req, res) => {
    try {
        const { email, code, contents } = req.body;
        const qu = `SELECT * FROM mailverify WHERE address='${email}' AND code='${code}' AND verified='true'`;
        con.query(qu, function (err, result) {
            if (result) {
                const q = `UPDATE tokenvoting SET contents = '${contents}' WHERE address='${email}' AND code='${code}' AND verified='true'`;
                con.query(qu, async function (err, result) {
                    if (err) {
                        throw new Error('update-err')
                    } else {
                        console.log('send content of users to mail of Admin')
                        res.json({ status: true });

                        // send content of users to mail of Admin
                        const result = await sendRawMail('tarass0131@gmail.com', "Verify Code", `Your email verify code is <b>${code}</b>.`)
                        return res.json({ status: true })
                    }
                })



            } else {
                res.json({ status: 'clientissue' })
            }
        })


    } catch (error) {
        console.log(error)
        res.json({ error: "error" })
    }
});

module.exports = router;
