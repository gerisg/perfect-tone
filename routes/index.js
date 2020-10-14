var express = require('express');
var router = express.Router();
var controller = require('../controllers/indexController');

router.post('/', controller.save);
router.get('/', controller.index);
router.get('/rules', controller.rules);

module.exports = router;