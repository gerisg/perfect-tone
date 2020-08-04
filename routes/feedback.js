var express = require('express');
var router = express.Router();
var controller = require('../controllers/feedbackController');

router.post('/save', controller.save);

module.exports = router;