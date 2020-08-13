const data = require('../data/data');

function getText(id) {
    let text = "";
    data.kbs.forEach(kb => {
        let options = kb.options.filter(option => option.id == id);
        if (options.length > 0) {
            let option = options[0];
            text = option.tone ? `${option.text} (${option.tone})` : `${option.text}`;
        }
    });
    return text;
}

function getSuggestion(tonesSelected, reflexId, isRedBased, isWhiteHair) {
    let reflexSelected = data.reflex.find(item => item.id == reflexId);
    let suggestedProducts = reflexSelected.products.filter(prod => {
        let tone = prod.split('.')[0];
        return tonesSelected.split(',').find(t => t == tone);
    });
    /* Si la base no es roja, filtro productos que son sólo para rojos */
    if(!isRedBased) { 
        suggestedProducts = suggestedProducts.filter(prod => !data.onlyRedProducts.includes(prod));
    }
    /* Si tiene canas, filtro los productos que no aplican */
    if(isWhiteHair) {
        suggestedProducts = suggestedProducts.filter(prod => !data.noWhiteHairProducts.includes(prod));
    }
    return suggestedProducts;
}

function isRedBased(mediumTone, rootTone) {
    let tone = mediumTone ? data.mediumTones.find(item => item.id == mediumTone) : data.rootTones.find(item => item.id == rootTone);
    return tone.category == 'rojos';
}

function isWhiteHair(whiteHair) {
    // TODO use 'value'
    return whiteHair == '17.C' || whiteHair == '17.D';
}

module.exports = {
    result: function(req, res) {
        res.render('result', { 
            q1: getText(req.body['q1']), 
            q2: getText(req.body['q2']), 
            q3: getText(req.body['q3']), 
            q4: getText(req.body['q4']), 
            q5: getText(req.body['q5']),
            q6: getText(req.body['q6']),
            products: getSuggestion(req.body['tones'], req.body['q6'], isRedBased(req.body['q2'], req.body['q3']), isWhiteHair(req.body['q5']))
        });
    }
}