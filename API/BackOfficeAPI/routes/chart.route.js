var express = require('express');
var router = express.Router();



var chartController = require('../controllers/chart.controller');

router.get('/getDataFromDayToDayChartBar',  chartController.getDataFromDayToDayChartBar);
router.get('/getDataMonthFromMonth',  chartController.getDataMonthFromMonth);
router.get('/getDataYear',  chartController.getDataYear);
router.get('/getDataWeek',  chartController.getDataWeek);
module.exports = router;
