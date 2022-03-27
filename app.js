const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
require('./mysql/mysql');
const TrendingApi = require('./routes/apiRoute.js');
const usersRouter = require('./routes/usersRoute.js');
const config = require('./config.js');

const PORT = process.env.PORT;

let app = express();
// Body Parser Middleware
app.use(bodyParser.json({ limit: '200mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(express.static(path.join(__dirname, 'views/')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});

    }
    next();
});
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')

global.appRoot = path.resolve(__dirname);


app.use('/trending', TrendingApi);
app.use('/users', usersRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});