const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.post('/uploadXLXS', controller.uploadXLXS);
router.post('/search' , controller.search);
router.post('/policyInfo' , controller.policyInfo)
router.post('/saveMessage' , controller.saveMessage)
router.get('/cpuUsage' ,controller.checkCpu)

module.exports = router;