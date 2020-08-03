var express = require('express');
var router = express.Router();
var controller = require('../controllers/resultController');

router.post('/', controller.result);

module.exports = router;
