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
    {id:5, question:'Reflejos buscados', show: 'hidden', options: []}
];

module.exports = {
    index: function(req, res) {
        res.render('index', { kbs });
    }
}