
const mysql = require('mysql');

require("dotenv").config()

// const host = process.env.HOST
// const user = process.env.USER
// const password = process.env.PASSWORD
// const database = process.env.DATABASE
// 
const host = '185.25.48.201';
const user = 'root';
const password = 'R123!@#';
const database = 'transhuman';


var con = mysql.createConnection({
  host,
  user,
  password
});

let connection = mysql.createConnection({
  host,
  user,
  password,
  database
});

con.connect(function (err) {
  if (err) {
    console.log('connect failed');
    throw err;
  };
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS transhuman", function (err, result) {
    if (err) throw err;
    console.log("Database created");
    let con2 = connection.connect(function (err) {
      if (err) throw err;

      // ********* mailverify **************
      var mailverify = "CREATE TABLE IF NOT EXISTS `mailverify`(\
    `pk` int(255) unsigned NOT NULL AUTO_INCREMENT,\
    `email` char(255) DEFAULT NULL,\
    `code` char(20) DEFAULT NULL,\
    `verified` tinyint(1) DEFAULT NULL,\
    `date` date DEFAULT NULL,\
    `contents` char(255) DEFAULT NULL,\
    PRIMARY KEY(`pk`)\
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4";

      connection.query(mailverify, function (err, result) {
        if (err) throw err;
        console.log('mailverify table created')
      })

      // ***********************
      var tokenvoting = "CREATE TABLE IF NOT EXISTS `tokenvoting` (\
    `pk` int(255) unsigned NOT NULL AUTO_INCREMENT,\
      `number` int(255) DEFAULT 0,\
        `symbol` char(50) DEFAULT NULL,\
          `address` char(100) DEFAULT NULL,\
            `logoURI` char(255) DEFAULT NULL,\
              PRIMARY KEY(`pk`)\
) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4";

      connection.query(tokenvoting, function (err, result) {
        if (err) throw err;
        console.log('tokenvoting table created')
      })

      // ***********************
      var users_check_token = "CREATE TABLE IF NOT EXISTS `users_check_token` (\
    `pk` int(255) unsigned NOT NULL AUTO_INCREMENT,\
      `address` char(255) DEFAULT NULL,\
        `account` char(255) DEFAULT NULL,\
          PRIMARY KEY(`pk`)\
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4\
";

      connection.query(users_check_token, function (err, result) {
        if (err) throw err;
        console.log('users_check_token table created')
      })

      // ***********************
      var usersvoting = "CREATE TABLE IF NOT EXISTS `usersvoting` (\
    `pk` int(255) unsigned NOT NULL AUTO_INCREMENT,\
      `account` char(255) DEFAULT NULL,\
        `proposal` text DEFAULT NULL,\
          `date` date DEFAULT NULL,\
            PRIMARY KEY(`pk`)\
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4";

      connection.query(usersvoting, function (err, result) {
        if (err) throw err;
        console.log('usersvoting table created')
      })
    });
  });
});




module.exports = connection;
