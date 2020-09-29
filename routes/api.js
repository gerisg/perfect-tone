var express = require('express');
var router = express.Router();
var controller = require('../controllers/apiController');

router.post('/reflexes', controller.families);

module.exports = router;