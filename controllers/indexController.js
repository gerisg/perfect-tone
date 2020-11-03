const mailer = require('../tools/mailer');
const data = require('../database/data');
const db = require('../database/jsonTable');
const model = db('records');

module.exports = {

    index: (req, res) => {
        // Group currentTones by family
        let currentTones = data.currentTones.reduce(
            (groupByCategory, current) => {
                if(!groupByCategory[current.category])
                    groupByCategory[current.category] = new Array();
                groupByCategory[current.category].push(current);
                return groupByCategory;
            }, {}
        );

        // Group naturalTones by family
        let naturalTones = data.naturalTones.reduce(
            (groupByCategory, current) => {
                if(!groupByCategory[current.category])
                    groupByCategory[current.category] = new Array();
                groupByCategory[current.category].push(current);
                return groupByCategory;
            }, {}
        );

        // Get desired and greys scale values
        let desired = data.desired;
        let greys = data.greys;

        res.render('index', { currentTones, naturalTones, desired, greys });
    },

    save: (req, res) => {
        let record = {
            name: req.body.name,
            email: req.body.email,
            dyed: req.body.dyed,
            currentTone: req.body.currentTone,
            naturalTone: req.body.naturalTone,
            desiredTone: req.body.desiredTone,
            greys: req.body.greyHair,
            reflex: req.body.reflex,
            suggested: req.body.suggested
        }
        
        // Save wizard data
        model.create(record);
        
        // Send suggestion by email
        mailer.sendPerfectTone(record.email, record.suggested);

        res.json({ message: 'success' });
    },

    rules: (req, res) => {
        res.render('rules');
    }
}
