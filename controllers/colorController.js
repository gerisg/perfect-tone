const data = require('../data/data');

function calculateTone(colored, desired, rootTone) {
    let suggestedtones = [];
    if (desired.tone == '*') {
        // Si no sabe le voy a mostrar un tono más, un tono igual y un tono menos 
        suggestedtones.push(rootTone.tone -1); // tono más oscuro
        suggestedtones.push(rootTone.tone); // mismo tono
        if(!colored) { suggestedtones.push(rootTone.tone +1); } // tono más claro
    } else {
        // Si sabe, le suma o resta un tono, o lo deja igual
        suggestedtones.push(rootTone.tone + desired.tone);
    }
    console.log("suggested: " + suggestedtones);
    let filteredReflex = data.reflex.filter( // Filtro los reflejos que tienen al menos uno de los tonos sugeridos
        r => suggestedtones.map(
            suggestion => r.tones.includes(suggestion)).reduce( 
                // Puede devolver múltiples true/false entonces los reduzco
                (result, current) => result || current)); 
    console.log("Filtered: " + JSON.stringify(filteredReflex));
    return { tones: suggestedtones, reflexes: filteredReflex };
}


function calculateColored (mediumToneSelected, rootToneSelected, desiredToneSelected) {
    let mediumTone = data.mediumTones.find(color => color.id == mediumToneSelected);
    console.log('Medium Tone: ' + mediumTone.tone);
    
    let rootTone = data.rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);
    
    let desired = data.desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.tone);
    
    let diff = mediumTone.tone - rootTone.tone;
    if(diff == 0) {
        return calculateTone(true, desired, rootTone);
    }
    
    return calculateTone(true, desired, mediumTone);
}

function calculateNatural (rootToneSelected, desiredToneSelected) {
    let rootTone = data.rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);

    let desired = data.desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.tone);

    return calculateTone(false, desired, rootTone);
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