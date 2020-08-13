const data = require('../data/data');

function getText(id) {
    let text = "";
    let qa = data.kbs.forEach(kb => {
        let options = kb.options.filter(option => option.id == id);
        if (options.length > 0) {
            let option = options[0];
            text = option.tone ? `${option.text} (${option.tone})` : `${option.text}`;
        }
    });
    return text;
}

function getSuggestion(tonesSelected, reflexId, isRedBased) {
    let reflexSelected = data.reflex.find(item => item.id == reflexId);
    let suggestedProducts = reflexSelected.products.filter(prod => {
        let tone = prod.split('.')[0];
        return tonesSelected.split(',').find(t => t == tone);
    });
    return suggestedProducts;
}

module.exports = {
    result: function(req, res) {
        res.render('result', { 
            q1: getText(req.body['q1']), 
            q2: getText(req.body['q2']), 
            q3: getText(req.body['q3']), 
            q4: getText(req.body['q4']), 
            q5: getText(req.body['q5']),
            products: getSuggestion(req.body['tones'], req.body['q5'])
        });
    }
}