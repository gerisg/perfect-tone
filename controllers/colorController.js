const data = require('../database/data');

let dark = (tone, qty) => --tone;
let light = (tone, qty) => ++tone;

function avoidInvalidTone(tone, operation) {
    let newTone = operation(tone);
    if(newTone == 2) { newTone = operation(newTone); }
    return newTone;
}

function calculateTone(desired, tone, whiteHair, colored) {
    let suggestedtones = [];
    switch (desired.value) {
        case 'equal':
            suggestedtones.push(tone.tone);
            break;
        case 'light':
            suggestedtones.push(avoidInvalidTone(tone.tone, light));
            if(!colored && tone.tone >= 5) { suggestedtones.push(avoidInvalidTone(tone.tone + 1, light)); }
            break;
        case 'dark':
            suggestedtones.push(avoidInvalidTone(tone.tone, dark));
            break;
        default:
            if(!colored) { suggestedtones.push(avoidInvalidTone(tone.tone, light)); }
            suggestedtones.push(tone.tone);
            suggestedtones.push(avoidInvalidTone(tone.tone, dark));
    }

    console.log("suggested: " + suggestedtones);

    // Filtro los reflejos que tienen al menos uno de los tonos sugeridos
    let filteredReflex = data.reflex.filter(
        reflex => suggestedtones.map(
            suggestion => reflex.tones.includes(suggestion)).reduce(
                (result, current) => result || current)); // Puede devolver múltiples true/false entonces los reduzco
    
    // Filtro los reflejos según si aplican a rojos o no
    filteredReflex = tone.category == 'rojos' ? 
        filteredReflex.filter(reflex => reflex.onlyRedBased) : 
        filteredReflex.filter(reflex => typeof(reflex.onlyRedBased) == 'undefined' || !reflex.onlyRedBased);

    // Filtro los reflejos según el porcentaje de canas
    filteredReflex = filteredReflex.filter(reflex => {
        let configuredToRemove = reflex.filterWhiteHair ? reflex.filterWhiteHair[whiteHair] : undefined;

        // Si el reflejo no tiene colores para remover según el porcentaje de canas sigue en la lista de reflejos sugeridos
        if (!configuredToRemove || configuredToRemove.length == 0) {
            return true; 
        }

        // Si el reflejo fue elegido por un producto que no corresponde al porcentaje de canas del usuario, debo removerlo de los reflejos sugeridos
        console.log('Tiene para remover ', reflex.text);
        let foundToRemove = configuredToRemove.find( prodToRemove => {
            let tone = parseInt(prodToRemove.split('.')[0]);
            return suggestedtones.includes(tone);
        });
        console.log(foundToRemove);
        return !foundToRemove;
    });

    console.log("Filtered: " + JSON.stringify(filteredReflex));

    return { tones: suggestedtones, reflexes: filteredReflex };
}

function calculateColored (mediumToneSelected, rootToneSelected, desiredToneSelected, whiteHairSelected) {
    let mediumTone = data.mediumTones.find(color => color.id == mediumToneSelected);
    console.log('Medium Tone: ' + mediumTone.tone);
    
    let rootTone = data.rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);
    
    let desired = data.desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.value);
    
    let whiteHair = data.whiteHair.find(wh => wh.id == whiteHairSelected).value;
    console.log('Existent whiteHair: ' + whiteHair);

    let diff = mediumTone.tone - rootTone.tone;
    if(diff == 0) {
        return calculateTone(desired, rootTone, whiteHair, true);
    }
    
    return calculateTone(desired, mediumTone, whiteHair, true);
}

function calculateNatural (rootToneSelected, desiredToneSelected, whiteHairSelected) {
    let rootTone = data.rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);

    let desired = data.desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.value);

    let whiteHair = data.whiteHair.find(wh => wh.id == whiteHairSelected);
    console.log('Existent whiteHair: ' + whiteHair.value);

    return calculateTone(desired, rootTone, whiteHair.value, false);
}

module.exports = {
    options: function(req, res) {
        if (req.params.q1 === '10.A') {
            res.send(calculateColored(req.params.q2, req.params.q3, req.params.q4, req.params.q5));
        } else {
            res.send(calculateNatural(req.params.q3, req.params.q4, req.params.q5));
        }
    }
}