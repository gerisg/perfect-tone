var express = require('express');
var router = express.Router();
var controller = require('../controllers/rulesController');

router.get('/', controller.index);

module.exports = router;
