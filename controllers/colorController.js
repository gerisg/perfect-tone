const data = require('../data/data');

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

    let filteredReflex = data.reflex.filter( // Filtro los reflejos que tienen al menos uno de los tonos sugeridos
        reflex => suggestedtones.map(
            suggestion => reflex.tones.includes(suggestion)).reduce( 
                // Puede devolver múltiples true/false entonces los reduzco
                (result, current) => result || current)); 
    
    // Filtrar sólo reflejos para rojos
    if (rootTone.category == 'rojos') {
        filteredReflex = filteredReflex.filter(reflex => reflex.redBased );
    }

    console.log("Filtered: " + JSON.stringify(filteredReflex));

    return { tones: suggestedtones, reflexes: filteredReflex };
}


function calculateColored (mediumToneSelected, rootToneSelected, desiredToneSelected) {
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

function calculateNatural (rootToneSelected, desiredToneSelected) {
    let rootTone = data.rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);

    let desired = data.desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.value);

    return calculateTone(desired, rootTone, false);
}

module.exports = {
    options: function(req, res) {
        if (req.params.q1 === '10.A') {
            res.send(calculateColored(req.params.q2, req.params.q3, req.params.q4));
        } else {
            res.send(calculateNatural(req.params.q3, req.params.q4));
        }
    }
}