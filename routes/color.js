var express = require('express');
var router = express.Router();
var controller = require('../controllers/colorController');

router.get('/:q1/:q2?/:q3/:q4', controller.options);

module.exports = router;
