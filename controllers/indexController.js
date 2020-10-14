const data = require('../database/data');
const db = require('../database/jsonTable');

const model = db('records');

function getSuggestion(tonesSelected, reflexId, isRedBased, isWhiteHair) {
    let reflexSelected = data.families.find(item => item.id == reflexId);
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
    index: (req, res) => {
        let currentTones = data.currentTones.reduce(
            (groupByCategory, current) => {
                if(!groupByCategory[current.category])
                    groupByCategory[current.category] = new Array();
                groupByCategory[current.category].push(current);
                return groupByCategory;
            }, {}
        );

        let naturalTones = data.naturalTones.reduce(
            (groupByCategory, current) => {
                if(!groupByCategory[current.category])
                    groupByCategory[current.category] = new Array();
                groupByCategory[current.category].push(current);
                return groupByCategory;
            }, {}
        );

        let desired = data.desired;
        let greys = data.greys;

        res.render('index', { currentTones, naturalTones, desired, greys });
    },
    save: (req, res) => {
        // TODO Enviar email al usuario con el resultado / link a la tienda
        let record = {
            name: req.body.name,
            email: req.body.email,
            dyed: req.body.dyed,
            currentTone: req.body.currentTone,
            naturalTone: req.body.naturalTone,
            desiredTone: req.body.desiredTone,
            greys: req.body.greyHair,
            reflex: req.body.reflex
        }
        model.create(record);
        res.send('success');
    }
}
