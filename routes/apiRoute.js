const express = require('express');
const apiCtrl = require('../controller/apiCtrl.js');
const router = express.Router();
const multer = require('multer');
const path = require("path");


router.post("/add", apiCtrl.Addtoken);
router.get("/get", apiCtrl.GetData);
router.post('/remove', apiCtrl.Removetoken);
router.post('/track', apiCtrl.GetPrice);
router.post('/search', apiCtrl.GetToken);
router.post('/optionlist', apiCtrl.GetOptionlist);
router.post('/getChartData', apiCtrl.getChartData);
router.post('/get_trending_history', apiCtrl.get_trending_history);

module.exports = router;