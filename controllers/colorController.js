let mediumTones = [
    {id:'14.A.1', text:'Negro amarronado', tone:3, category:'negros'},
    {id:'14.A.2', text:'Negro', tone:2, category:'negros'},
    {id:'14.B.1', text:'Marrón cobrizo muy claro', tone:8, category:'marrones'},
    {id:'14.B.2', text:'Marrón claro', tone:7, category:'marrones'},
    {id:'14.B.3', text:'Marrón medio', tone:6, category:'marrones'},
    {id:'14.B.4', text:'Marrón oscuro', tone:5, category:'marrones'},
    {id:'14.B.5', text:'Marrón más oscuro', tone:4, category:'marrones'},
    {id:'14.B.6', text:'Negro marrón', tone:3, category:'marrones'},
    {id:'14.C.1', text:'Rubio extra clarísimo', tone:10, category:'rubios'},
    {id:'14.C.2', text:'Rubio muy claro', tone:9,category:'rubios'},
    {id:'14.C.3', text:'Rubio claro', tone:8,category:'rubios'},
    {id:'14.C.4', text:'Rubio medio', tone:7,category:'rubios'},
    {id:'14.C.5', text:'Rubio oscuro', tone:6,category:'rubios'},
    {id:'14.D.1', text:'Rojo claro', tone:7,category:'rojos'},
    {id:'14.D.2', text:'Rojo medio', tone:6,category:'rojos'},
    {id:'14.D.3', text:'Rojo oscuro', tone:5,category:'rojos'},
];

let rootTones = [
    {id:'15.A.1', text:'Negro amarronado', tone:3, category:'negros'},
    {id:'15.A.2', text:'Negro', tone:2, category:'negros'},
    {id:'15.B.1', text:'Marrón claro', tone:7, category:'marrones'},
    {id:'15.B.2', text:'Marrón medio', tone:6, category:'marrones'},
    {id:'15.B.3', text:'Marrón oscuro', tone:5, category:'marrones'},
    {id:'15.B.4', text:'Marrón más oscuro', tone:4, category:'marrones'},
    {id:'15.B.5', text:'Negro marrón', tone:3, category:'marrones'},
    {id:'15.C.1', text:'Rubio claro', tone:10, category:'rubios'},
    {id:'15.C.2', text:'Rubio medio', tone:9, category:'rubios'},
    {id:'15.C.3', text:'Rubio oscuro', tone:8, category:'rubios'},
    {id:'15.C.4', text:'Rubio más oscuro', tone:7, category:'rubios'},
    {id:'15.D.1', text:'Rojo claro', tone:7, category:'rojos'},
    {id:'15.D.2', text:'Rojo medio', tone:6, category:'rojos'},
    {id:'15.D.3', text:'Rojo oscuro', tone:5, category:'rojos'},
];

let desiredTones = [
    {id:'19.A', text:'Más claro', tone:1},
    {id:'19.B', text:'Igual', tone:0},
    {id:'19.C', text:'Más oscuro', tone:-1},
    {id:'19.D', text:'No lo sé', tone:'*'}
];

let reflex = [
    {id:'21.A', text:'Azulado', tones:[1]},
    {id:'21.B', text:'Naturales', tones:[1,2,3,4,5,6,7,8,9]},
    {id:'21.C', text:'Cenizas', tones:[6,7,8]},
    {id:'21.D', text:'Dorados y Beiges', tones:[6,7,8]},
    {id:'21.E', text:'Marrones y Chocolates', tones:[5,6]},
    {id:'21.F', text:'Caobas', tones:[5]},
    {id:'21.G', text:'Violetas', tones:[5]},
    {id:'21.H', text:'Rojos', tones:[6,7]}
];

function calculateTone(desired, rootTone) {
    let suggestedtones = [];
    if (desired.tone == '*') {
        // Si no sabe le voy a mostrar un tono más, un tono igual y un tono menos 
        suggestedtones.push(rootTone.tone - 1, rootTone.tone, rootTone.tone + 1);
    }
    else {
        // Si sabe, le suma o resta un tono, o lo deja igual
        suggestedtones.push(rootTone.tone + desired.tone);
    }
    console.log("suggested: " + suggestedtones);
    let filteredReflex = reflex.filter(r => suggestedtones.map(suggestion => r.tones.includes(suggestion)).reduce((result, current) => result || current));
    console.log("Filtered: " + JSON.stringify(filteredReflex));
    return { tones: suggestedtones, reflexes: filteredReflex };
}


function calculateColored (mediumToneSelected, rootToneSelected, desiredToneSelected) {
    let mediumTone = mediumTones.find(color => color.id == mediumToneSelected);
    console.log('Medium Tone: ' + mediumTone.tone);

    let rootTone = rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);

    let desired = desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.tone);

    let diff = mediumTone.tone - rootTone.tone;
    if(diff == 0) {
        return calculateTone(desired, rootTone);
    } else if (Math.abs(diff) <= 2) {
        return calculateTone(desired, mediumTone);
    }

    throw new Error("This feature has not been implemented yet.");
}

function calculateNatural (rootToneSelected, desiredToneSelected) {
    let rootTone = rootTones.find(color => color.id == rootToneSelected);
    console.log('Root Tone: ' + rootTone.tone);

    let desired = desiredTones.find(desired => desired.id == desiredToneSelected);
    console.log('Desired Tone: ' + desired.tone);

    return calculateTone(rootTone, desired);
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