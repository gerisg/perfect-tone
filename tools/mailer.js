var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secureConnection: process.env.SMTP_SECURE,
    port: process.env.SMTP_PORT,
    auth: {
          user: process.env.SMTP_AUTH_USER,
          pass: process.env.SMTP_AUTH_PASS
    }
});

module.exports = {
    sendPerfectTone: (to, suggested) => {
        let mailOptions = {
            from: 'Cobeauty <info@cobeauty.store>',
            to: to,
            subject: 'Tu Tono Perfecto',
            html: `<html>
                    <head><meta charset="UTF-8"></head>
                    <body>
                        <table width="600" border="0" align="center" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td>
                                        <img width="205" height="35" src="https://cobeauty.store/wp-content/uploads/2020/08/logo-color.png" alt="Cobeauty" style="margin: 10px 0">
                                    </td>
                                </tr>
                                <tr style="background-color:#632a77">
                                    <td style="border-bottom:5px solid #ef5378;border-top:1px solid #ccc;border:1px solid #dbdbdb">
                                        <h2 style="font-family:Roboto;font-size:18px;color:#FFF;margin:5px 5px 10px">¡Encontraste Tu Tono Perfecto!</h2>
                                    </td>
                                </tr>
                                <tr style="background:#fff">
                                    <td style="border:1px solid #dbdbdb;border-top:none;border-bottom: 10px solid #ef5378;font-family:Arial,Sans-serif;color:#535353;padding:5px;text-align:center;">
                                        <h3 style="font-family:Arial,Sans-serif;font-size:16px;margin:5px 5px 10px;text-align:left;line-height: 1.75;">Completaste las preguntas para encontrar tu tono perfecto y en el siguiente link podés obtener más información.</h3>
                                        <p><a href="${suggested}" style="text-decoration: none;padding: 14px 10px;margin: 18px;display: inline-block;background-color: #632a77;color: white;font-weight: 700;box-shadow: 3px 3px 6px black;">Ingresar a mi Tono Perfecto</a></p>	
                                    </td>
                                </tr>
                                <tr style="background:#f0f0f0">
                                    <td style="font-family:Arial,Sans-serif;font-size:12px;color:#535353;border-bottom:1px solid #fff;border-top:none;border:1px solid #dbdbdb;padding:5px">
                                        <p>Si tenés alguna duda, comentario o sugerencia, envianos un e-mail a <a href="mailto:info@cobeauty.store" style="color:#5092bd;text-decoration:none" target="_blank">info@cobeauty.store</a>.</p>
                                        <p><b>Equipo Cobeauty</b></p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>
                </html>`
        };
        transporter.sendMail(mailOptions)
            .then((info) => console.log(info.response))
            .catch(error => console.error(error));
    }
}