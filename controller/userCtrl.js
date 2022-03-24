// const UsersVoting = require("../models/usersModel");
// const TokenVoting = require("../models/tokenVotingModel");
const con = require('../mysql/mysql');

// const validateEmail = (email) => {
//     var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(email);
// }

const ProposalVoting = async (req, res) => {
    try {
        const { account, proposal } = req.body;
        if (proposal === '') {
            // return res.send("empty");
            throw new Error('error')("empty");
        }
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        const q = `SELECT * FROM usersvoting WHERE account='${account}'`;
        con.query(q, function (err, result) {
            if (err) throw new Error('error');

            if (result.length > 0) {
                res.send('exist')
            } else {
                const query = `INSERT INTO usersvoting (account, proposal, date) VALUES ('${account}','${proposal}','${dateTime}')`;
                con.query(query, function (err, result) {
                    if (err) throw new Error('error');
                    res.send("success");
                });
            }
        });


    } catch (err) {
        console.log(err)
        res.send(err.message)
    }

}
const getVoters = async (req, res) => {
    try {

        const q = `SELECT * FROM usersvoting ORDER BY date ASC`;
        con.query(q, function (err, result) {
            if (err) throw new Error('error');
            res.send(result);
        });


    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}

// 
const tokenVoting = async (req, res) => {
    try {
        const { tokenInfo, account } = req.body;
        const { symbol, address, logoURI } = tokenInfo;
        // token address search
        const q = `SELECT * FROM tokenvoting WHERE address='${address}'`;
        con.query(q, function (err, result1) {
            if (err) throw new Error('error');
            // address register check
            if (result1.length > 0) {
                const query = `SELECT * FROM users_check_token WHERE account='${account}' AND address ='${address}'`;
                con.query(query, function (err, user) {
                    if (err) throw new Error('error');

                    if (user.length > 0) {
                        res.send('exist');
                    } else {
                        const query = `INSERT INTO users_check_token (address,account) VALUES ('${address}','${account}')`;
                        con.query(query, function (err, result) {
                            if (err) throw new Error('error');
                            const q = `UPDATE tokenvoting SET number = '${result1[0].number + 1}' WHERE address='${address}'`;
                            con.query(q, function (err, result3) {
                                if (err)
                                    throw new Error('error');
                                res.send('success');
                            })
                        });
                    }
                })


            } else {
                const query = `INSERT INTO tokenvoting (number,symbol, address, logoURI) VALUES ('1','${symbol}','${address}','${logoURI}')`;
                con.query(query, function (err, result) {
                    if (err) throw new Error('error');
                    const query = `INSERT INTO users_check_token (address,account) VALUES ('${address}','${account}')`;
                    con.query(query, function (err, result) {
                        if (err) throw new Error('error');
                        res.send("success");
                    });
                })
            }
        });


    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}
const getTokenVoting = async (req, res) => {
    try {

        const q = "SELECT * FROM tokenvoting ORDER BY number DESC";
        con.query(q, function (err, datas) {
            if (err)
                throw new Error('error');
            res.send(datas);
        })
    } catch (err) {
        console.log(err)
        res.send(err.message)
    }
}


module.exports = {
    ProposalVoting,
    getVoters,
    tokenVoting,
    getTokenVoting,
};