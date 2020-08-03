let mediumTones = [
    {id:'14.A.1', text:'Negro amarronado', tone:'3', category:'negros'},
    {id:'14.A.2', text:'Negro', tone:'2', category:'negros'},
    {id:'14.B.1', text:'Marrón cobrizo muy claro', tone:'8/34', category:'marrones'},
    {id:'14.B.2', text:'Marrón claro', tone:'7', category:'marrones'},
    {id:'14.B.3', text:'Marrón medio', tone:'6', category:'marrones'},
    {id:'14.B.4', text:'Marrón oscuro', tone:'5', category:'marrones'},
    {id:'14.B.5', text:'Marrón más oscuro', tone:'4', category:'marrones'},
    {id:'14.B.6', text:'Negro marrón', tone:'3', category:'marrones'},
    {id:'14.C.1', text:'Rubio extra clarísimo', tone:'10',category:'rubios'},
    {id:'14.C.2', text:'Rubio muy claro', tone:'9',category:'rubios'},
    {id:'14.C.3', text:'Rubio claro', tone:'8',category:'rubios'},
    {id:'14.C.4', text:'Rubio medio', tone:'7',category:'rubios'},
    {id:'14.C.5', text:'Rubio oscuro', tone:'6',category:'rubios'},
    {id:'14.D.1', text:'Rojo claro', tone:'7',category:'rojos'},
    {id:'14.D.2', text:'Rojo medio', tone:'6',category:'rojos'},
    {id:'14.D.3', text:'Rojo oscuro', tone:'5',category:'rojos'},
];

let rootColors = [
    {id:'15.A.1', text:'Negro amarronado', tone:'3', category:'negros'},
    {id:'15.A.2', text:'Negro', tone:'2', category:'negros'},
    {id:'15.B.1', text:'Marrón claro', tone:'7', category:'marrones'},
    {id:'15.B.2', text:'Marrón medio', tone:'6', category:'marrones'},
    {id:'15.B.3', text:'Marrón oscuro', tone:'5', category:'marrones'},
    {id:'15.B.4', text:'Marrón más oscuro', tone:'4', category:'marrones'},
    {id:'15.B.5', text:'Negro marrón', tone:'3', category:'marrones'},
    {id:'15.C.1', text:'Rubio claro', tone:'10',category:'rubios'},
    {id:'15.C.2', text:'Rubio medio', tone:'9',category:'rubios'},
    {id:'15.C.3', text:'Rubio oscuro', tone:'8',category:'rubios'},
    {id:'15.C.4', text:'Rubio más oscuro', tone:'7',category:'rubios'},
    {id:'15.D.1', text:'Rojo claro', tone:'7',category:'rojos'},
    {id:'15.D.2', text:'Rojo medio', tone:'6',category:'rojos'},
    {id:'15.D.3', text:'Rojo oscuro', tone:'5',category:'rojos'},
];

let kbs = [
    {id:1, question:'Tiene el cabello teñido?', options:[
        {id:'10.A', text:'si'},
        {id:'10.B', text:'no'}
    ]},
    {id:2, question:'Tono en los medios', show: 'hidden', options: mediumTones},
    {id:3, question:'Tono en las raíces', show: 'hidden', options: rootColors},
    {id:4, question:'Resultado deseado', show: 'hidden', options: [
        {id:'19.A', text:'Más claro'},
        {id:'19.B', text:'Igual'},
        {id:'19.C', text:'Más oscuro'},
        {id:'19.D', text:'No lo sé'}
    ]},
    {id:5, question:'Reflejos buscados', show: 'hidden', options: [
        {id:'21.A', text:'Azulado', tones:[1]},
        {id:'21.B', text:'Naturales', tones:[1,2,3,4,5,6,7,8,9]},
        {id:'21.C', text:'Cenizas', tones:[6,7,8]},
        {id:'21.D', text:'Dorados y Beiges', tones:[6,7,8]},
        {id:'21.E', text:'Marrones y Chocolates', tones:[5,6]},
        {id:'21.F', text:'Caobas', tones:[5]},
        {id:'21.G', text:'Violetas', tones:[5]},
        {id:'21.H', text:'Rojos', tones:[6,7]}
    ]}
];

let reflex = [
    {id:'21.A', text:'Azulado', tones:[1], products:['1.A']},
    {id:'21.B', text:'Naturales', tones:[1,2,3,4,5,6,7,8,9], products:['1','2','3','4','5','6','7','8','9']},
    {id:'21.C', text:'Cenizas', tones:[6,7,8], products:['6.11', '7.11', '8.1']},
    {id:'21.D', text:'Dorados y Beiges', tones:[6,7,8], products:['6.13', '7.3', '8.13']},
    {id:'21.E', text:'Marrones y Chocolates', tones:[5,6], products:['5.7', '6.23', '6.73']},
    {id:'21.F', text:'Caobas', tones:[5], products:['5.5']},
    {id:'21.G', text:'Violetas', tones:[5], products:['5.20']},
    {id:'21.H', text:'Rojos', tones:[6,7], products:['6.66', '7.60']}
]

function getText(id) {
    let text = "";
    let qa = kbs.forEach(kb => {
        let options = kb.options.filter(option => option.id == id);
        if (options.length > 0) {
            let option = options[0];
            text = option.tone ? `${option.text} (${option.tone})` : `${option.text}`;
        }
    });
    return text;
}

function getSuggestion(tonesSelected, reflexId) {
    let reflexSelected = reflex.find(item => item.id == reflexId);
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