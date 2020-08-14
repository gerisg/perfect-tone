const fs = require('fs');
const path = require('path');

function save(feedback) {
    const filename = path.join(__dirname, '/../data/feedback.json');
    let fileContent = fs.readFileSync(filename, 'utf8');
    let currentFeedback = JSON.parse(fileContent);
    let newRegister = {
        q1: feedback.q1,
        q2: feedback.q2,
        q3: feedback.q3,
        q4: feedback.q4,
        q5: feedback.q5,
        q6: feedback.q6,
        products: feedback.products,
        accept: feedback.agree,
        comment: feedback.comment
    }
    currentFeedback.push(newRegister);
    fs.writeFileSync(filename, JSON.stringify(currentFeedback, null, 1));
}

module.exports = {
    save: (req, res) => {
        save(req.body);
        res.render('feedback/thanks');    
    }
}