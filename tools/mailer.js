var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
        user: 'simpsocks@gmail.com',
        pass: 'o9QLr?t>'
    }
});

module.exports = {
    sendPerfectTone: (to, suggested) => {
        let mailOptions = {
            from: 'info@cobeauty.store',
            to: to,
            subject: 'Tu Tono Perfecto',
            html: `<h1>Cobeauty</h1>
                <a href='${suggested}'>Conocé Tu Tono Perfecto</a>`
        };
        transporter.sendMail(mailOptions)
            .then((info) => console.log(info.response))
            .catch(error => console.log(error));
    }
}