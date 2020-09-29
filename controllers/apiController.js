const data = require('../database/data');

let populate = params => {
    return {
        current: params.current ? data.currentTones.find(tone => tone.id == params.current) : undefined,
        natural: params.natural ? data.naturalTones.find(tone => tone.id == params.natural) : undefined,
        desired: params.desired ? data.desired.find(tone => tone.value == params.desired) : undefined,
        greys: params.greys ? data.greys.find(tone => tone.value == params.greys) : undefined,
    }
}

let dark = (tone) => --tone;
let light = (tone) => ++tone;

function avoidInvalidTone(tone, operation) {
    let newTone = operation(tone);
    if(newTone == 2)
        newTone = operation(newTone);
    return newTone;
}

function calculateTone(desired, tone, whiteHair, colored) {
    let suggestedtones = [];
    switch (desired.value) {
        case 'equal':
            suggestedtones.push(parseInt(tone.value));
            break;
        case 'light':
            suggestedtones.push(avoidInvalidTone(parseInt(tone.value), light));
            if(!colored && parseInt(tone.value) >= 5)
                suggestedtones.push(avoidInvalidTone(parseInt(tone.value) + 1, light));
            break;
        case 'dark':
            suggestedtones.push(avoidInvalidTone(parseInt(tone.value), dark));
            break;
        default:
            if(!colored)
                suggestedtones.push(avoidInvalidTone(parseInt(tone.value), light));
            suggestedtones.push(parseInt(tone.value));
            suggestedtones.push(avoidInvalidTone(parseInt(tone.value), dark));
    }

    // Filtro las familias que tienen al menos uno de los tonos sugeridos
    let filteredFamilies = data.families.filter(
        family => suggestedtones.map(
            suggestion => family.tones.includes(suggestion)).reduce(
                (result, current) => result || current)); // Puede devolver múltiples true/false entonces los reduzco
    
    // Filtro las familias según si aplican a rojos o no
    filteredFamilies = tone.category == 'rojos' ? 
        filteredFamilies.filter(family => family.onlyRedBased) : 
        filteredFamilies.filter(family => typeof(family.onlyRedBased) == 'undefined' || !family.onlyRedBased);

    // Filtro las familias según el porcentaje de canas
    filteredFamilies = filteredFamilies.filter(family => {
        let configuredToRemove = family.filterWhiteHair ? family.filterWhiteHair[whiteHair] : undefined;

        // Si la familia no tiene colores para remover según el porcentaje de canas sigue en la lista de familias sugeridas
        if (!configuredToRemove || configuredToRemove.length == 0)
            return true;

        // Si la familia fue elegida por un producto que no corresponde al porcentaje de canas del usuario, debo removerlo de las familias sugeridas
        console.log('Tiene para remover ', family.text);
        let foundToRemove = configuredToRemove.find( prodToRemove => {
            let tone = parseInt(prodToRemove.split('.')[0]);
            return suggestedtones.includes(tone);
        });
        console.log(foundToRemove);
        return !foundToRemove;
    });

    // Filtro los productos de las familias según los tonos sugeridos
    filteredFamilies = filteredFamilies.map(family => {
        return { ...family, products: family.products.filter(
            prod => suggestedtones.includes(parseInt(prod.id.split('.')[0]))
        )}
    });

    return { tones: suggestedtones, reflexes: filteredFamilies };
}

module.exports = {
    families: (req, res) => {
        let families;
        let data = populate(req.body);
        if(data.current) {
            let diff = parseInt(data.current.value) - parseInt(data.natural.value);
            if(diff == 0) {
                families = calculateTone(data.desired, data.natural, data.greys, true);
            } else {
                families = calculateTone(data.desired, data.current, data.greys, true);
            }
        } else {
            families = calculateTone(data.desired, data.natural, data.greys, false);
        }
        res.send(families);
    }
}