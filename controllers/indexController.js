const data = require('../database/data');

module.exports = {
    index: function(req, res) {
        res.render('index', { kbs: data.kbs });
    }
}