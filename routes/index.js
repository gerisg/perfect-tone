var express = require('express');
var router = express.Router();
var controller = require('../controllers/indexController');

router.post('/recommend', controller.recommend);
router.get('/', controller.index);

module.exports = router;