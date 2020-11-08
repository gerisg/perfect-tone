let currentTones = [
    {id:'3', text:'Castaño Oscuro', value:3, category:'negros', img:'3'},
    {id:'1', text:'Negro', value:1, category:'negros', img:'1'},
    {id:'7.7', text:'Rubio Marrón', value:7.7, category:'marrones', img:'7-7'},
    {id:'6.7', text:'Rubio Oscuro Marrón', value:6.7, category:'marrones', img:'6-7'},
    {id:'5', text:'Castaño Claro', value:5, category:'marrones', img:'5'},
    {id:'4', text:'Castaño', value:4, category:'marrones', img:'4'},
    {id:'10', text:'Rubio extra claro', value:10, category:'rubios', img:'10'},
    {id:'9', text:'Rubio muy claro', value:9, category:'rubios', img:'9'},
    {id:'8', text:'Rubio claro', value:8, category:'rubios', img:'8'},
    {id:'7', text:'Rubio', value:7, category:'rubios', img:'7'},
    {id:'6', text:'Rubio oscuro', value:6, category:'rubios', img:'6'},
    {id:'7.60', text:'Rubio rojizo intenso', value:7.60, category:'rojos y cobrizos', img:'7-60'},
    {id:'6.66', text:'Rubio oscuro rojo profundo', value:6.66, category:'rojos y cobrizos', img:'6-66'},
    {id:'7.4', text:'Rubio cobrizo', value:7.4, category:'rojos y cobrizos', img:'7-4'},
    {id:'6.46', text:'Rubio oscuro cobre rojizo', value:6.46, category:'rojos y cobrizos', img:'6-46'},
    {id:'5.46', text:'Castaño claro cobre rojizo', value:5.46, category:'rojos y cobrizos', img:'5-46'},
    {id:'5.5', text:'Castaño claro caoba', value:5.5, category:'caobas y violetas', img:'5-5'},
    {id:'5.20', text:'Castaño claro malva intenso', value:5.20, category:'caobas y violetas', img:'5-20'}
];

let naturalTones = [
    {id:'3', text:'Castaño Oscuro', value:3, category:'negros', img:'3'},
    {id:'1', text:'Negro', value:1, category:'negros', img:'1'},
    {id:'7.7', text:'Rubio Marrón', value:7.7, category:'marrones', img:'7-7'},
    {id:'6.7', text:'Rubio Oscuro Marrón', value:6.7, category:'marrones', img:'6-7'},
    {id:'5', text:'Castaño Claro', value:5, category:'marrones', img:'5'},
    {id:'4', text:'Castaño', value:4, category:'marrones', img:'4'},
    {id:'10', text:'Rubio extra claro', value:10, category:'rubios', img:'10'},
    {id:'9', text:'Rubio muy claro', value:9, category:'rubios', img:'9'},
    {id:'8', text:'Rubio claro', value:8, category:'rubios', img:'8'},
    {id:'7', text:'Rubio', value:7, category:'rubios', img:'7'},
    {id:'6', text:'Rubio oscuro', value:6, category:'rubios', img:'6'},
    {id:'7.4', text:'Rubio cobrizo', value:7.4, category:'rojos y cobrizos', img:'7-4'},
    {id:'6.46', text:'Rubio oscuro cobre rojizo', value:6.46, category:'rojos y cobrizos', img:'6-46'},
    {id:'5.46', text:'Castaño claro cobre rojizo', value:5.46, category:'rojos y cobrizos', img:'5-46'}
];

let desired = [
    {text:'Más claro', value:'light', img:'heart-light'},
    {text:'Más oscuro', value:'dark', img:'heart-dark'},
    {text:'Igual', value:'equal', img:'heart-current'},
    {text:'No lo sé', value:'unknown', img:'heart-color'}
];

let greys = [
    {text:'0%-10%', value:0, img:'00'},
    {text:'10-60%', value:1, img:'10'},
    {text:'60-90%', value:2, img:'60'},
    {text:'90-100%', value:3, img:'90'}
];

let noWhiteHairColors = [];

let onlyRedColors = ['8.1'];

let families = [
    {
        id:'1',
        text:'Azulado', 
        tones:[1],
        products:[
            { id: '1.A', wc: 'lorem-ipsum-1A', img:'1a' }
        ]
    },
    {
        id:'2',
        text:'Naturales', 
        tones:[1,3,4,5,6,7,8,9],
        products:[
            { id: '1', wc: 'lorem-ipsum-1', img:'1' },
            { id: '3', wc: 'lorem-ipsum-3', img:'3' },
            { id: '4', wc: 'lorem-ipsum-4', img:'4' },
            { id: '5', wc: 'lorem-ipsum-5', img:'5' },
            { id: '6', wc: 'lorem-ipsum-6', img:'6' },
            { id: '7', wc: 'lorem-ipsum-7', img:'7' },
            { id: '8', wc: 'lorem-ipsum-8', img:'8' },
            { id: '9', wc: 'lorem-ipsum-9', img:'9' }
        ]
    },
    {
        id:'3',
        text:'Cenizas', 
        tones:[6,7,8],
        products:[
            { id: '6.11', wc: 'lorem-ipsum-6.11', img:'6-11' },
            { id: '7.11', wc: 'lorem-ipsum-7.11', img:'7-11' },
            { id: '8.1', wc: 'lorem-ipsum-8.1', img:'8-1' },
            { id: '8.13', wc: 'lorem-ipsum-8.13', img:'8-13' }
        ],
        filterWhiteHair: [
            ['8.13'], // Filter on whitehair 0%
            ['8.13'], // Filter on whitehair 10%
            ['8.13'], // Filter on whitehair 60%
            []
        ]
    },
    {
        id:'4',
        text:'Dorados y Beiges', tones:[6,7,8],
        products:[
            { id: '6.31', wc: 'lorem-ipsum-6.31', img:'6-31' },
            { id: '7.3', wc: 'lorem-ipsum-7.3', img:'7-3' },
            { id: '8.13', wc: 'lorem-ipsum-8.13', img:'8-13' }
        ],
        filterWhiteHair: [
            [],
            [],
            [],
            ['8.13']
        ]
    },
    {
        id:'5',
        text:'Marrones y Chocolates', tones:[5,6],
        products:[
            { id: '5.7', wc: 'lorem-ipsum-5.7', img:'5-7' },
            { id: '6.73', wc: 'lorem-ipsum-6.73', img:'6-73' }
        ]
    },
    {
        id:'6',
        text:'Marrones y Chocolates', tones:[4,5,6,7],
        products:[
            { id: '4', wc: 'lorem-ipsum-4', img:'4' },
            { id: '5', wc: 'lorem-ipsum-5', img:'5' },
            { id: '6.11', wc: 'lorem-ipsum-6.11', img:'6-11' },
            { id: '7.11', wc: 'lorem-ipsum-7.11', img:'7-11' }
        ],
        onlyRedBased: true
    },
    {
        id:'7',
        text:'Caobas', 
        tones:[5],
        products:[
            { id: '5.5', wc: 'lorem-ipsum-5.5', img:'5-5' }
        ]
    },
    {
        id:'8',
        text:'Violetas', 
        tones:[5],
        products:[
            { id: '5.20', wc: 'lorem-ipsum-5.20', img:'5-20' }
        ]
    },
    {
        id:'9',
        text:'Rojos', 
        tones:[6,7],
        products:[
            { id: '6.66', wc: 'lorem-ipsum-6.66', img:'6-66' },
            { id: '7.60', wc: 'lorem-ipsum-7.60', img:'7-60' }
        ]
    },
    {
        id:'10',
        text:'Rojos', 
        tones:[6,7],
        products:[
            { id: '6.66', wc: 'lorem-ipsum-6.66', img:'6-66' },
            { id: '7.60', wc: 'lorem-ipsum-7.60', img:'7-60' }
        ],
        onlyRedBased: true
    },
];

module.exports = { currentTones, naturalTones, desired, greys, families, onlyRedProducts: onlyRedColors, noWhiteHairProducts: noWhiteHairColors };
