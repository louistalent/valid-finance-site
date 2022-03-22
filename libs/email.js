require("dotenv").config()
const isDev = process.env.NODE_ENV === "development"
const { default: axios } = require("axios")
const nodemailer = require('nodemailer')


const SMTPHOST = process.env.SMTP || ''
const SMTPPORT = Number(process.env.SMTP_PORT)
const SMTPUSER = process.env.SMTP_USER || ''
const SMTPPASS = process.env.SMTP_PASS || ''
const supportEmail = process.env.SUPPORT_EMAIL || ''


const sendRawMail = async (to, contents, html) => {
    return await new Promise(resolve => {
        try {

            const smtpTransport = nodemailer.createTransport({
                host: SMTPHOST,
                port: SMTPPORT,
                auth: {
                    user: SMTPUSER,
                    pass: SMTPPASS
                }
            });

            smtpTransport.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject,
                html
            }, (error, info) => {
                console.log('smtpTransport.sendMail info :', info)
                if (error) {
                    console.log('smtpTransport.sendMail', error)
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        } catch (error) {
            console.log(error)
            res.json({ error: "error" })
        }

    })
}

module.exports = sendRawMail