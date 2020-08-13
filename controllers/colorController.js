const data = require('../database/data');

let dark = (tone, qty) => --tone;
let light = (tone, qty) => ++tone;

function avoidInvalidTone(tone, operation) {
    let newTone = operation(tone);
    if(newTone == 2) { newTone = operation(newTone); }
    return newTone;
}

function calculateTone(desired, rootTone, colored) {
    let suggestedtones = [];
    switch (desired.value) {
        case 'equal':
            suggestedtones.push(rootTone.tone);
            break;
        case 'light':
            suggestedtones.push(avoidInvalidTone(rootTone.tone, light));
            break;
        case 'dark':
            suggestedtones.push(avoidInvalidTone(rootTone.tone, dark));
            break;
        default:
            if(!colored) { suggestedtones.push(avoidInvalidTone(rootTone.tone, light)); }
            suggestedtones.push(rootTone.tone);
            suggestedtones.push(avoidInvalidTone(rootTone.tone, dark));
    }

    console.log("suggested: " + suggestedtones);

    // Filtro los reflejos que tienen al menos uno de los tonos sugeridos
    let filteredReflex = data.reflex.filter(
        reflex => suggestedtones.map(
            suggestion => reflex.tones.includes(suggestion)).reduce(
                (result, current) => result || current)); // Puede devolver múltiples true/false entonces los reduzco
    
    // Filtro los reflejos según si aplican a rojos o no
    filteredReflex = rootTone.category == 'rojos' ? 
        filteredReflex.filter(reflex => reflex.onlyRedBased) : 
        filteredReflex.filter(reflex => typeof(reflex.onlyRedBased) == 'undefined' || !reflex.onlyRedBased);

    console.log("Filtered: " + JSON.stringify(filteredReflex));

    return { tones: suggestedtones, reflexes: filteredReflex };
}

function calculateColored (mediumToneSelected, rootToneSelected, desiredToneSelected, whitehair) {
    let mediumTone = data.mediumTones.find(color => color.id == mediumToneSelected);
    console.log('Medium Tone: ' + mediumTone.tone);
    
    let rootTone = data.rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);
    
    let desired = data.desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.value);
    
    let diff = mediumTone.tone - rootTone.tone;
    if(diff == 0) {
        return calculateTone(desired, rootTone, true);
    }
    
    return calculateTone(desired, mediumTone, true);
}

function calculateNatural (rootToneSelected, desiredToneSelected, whitehair) {
    let rootTone = data.rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);

    let desired = data.desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.value);

    return calculateTone(desired, rootTone, false);
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