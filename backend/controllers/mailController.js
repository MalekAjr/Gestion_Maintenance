const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { EMAIL, PASSWORD } = require('../env.js');

/*
const sendmail = async (req, res) => {
    try {
        let testAccount = await nodemailer.createTestAccount();

        let message = {
            from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
            to: "bar@example.com, baz@example.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "M3allam Sa7bi", // plain text body
            html: "<b>M3allam Sa7bi</b>", // html body
        };

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        let info = await transporter.sendMail(message);
        res.status(201).json({ 
            msg: "You should have an email",
            info: info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
*/
/*
const sendemail = (req, res) => {
    const { userEmail } = req.body;
    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: "Daily Tuition",
            intro: "Your bill has arrived!",
            table: {
                data: [
                    {
                        item: "Nodemailer Stack Book",
                        description: "A Backend application",
                        price: "$10.99",
                    }
                ]
            },
            outrou: "Looking forward to do more business"
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Place Order",
        html: mail
    };

    transporter.sendMail(message).then(() => {
        res.status(201).json({ msg: "You should receive a real email" }); // Déplacer ici
    }).catch(error => {
        res.status(500).json({ error });
    });
};

*/

const sendemail = (req, res) => {
    const { userEmail } = req.body;
    let config = {
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Mailgen",
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: "Hpc Group", // Changer le nom ici
            intro: "Le technicien va venir pour corriger votre problème.", // Modifier le message d'introduction
            outrou: "Cordialement, Hpc Group" // Modifier le message de fin
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: EMAIL,
        to: userEmail,
        subject: "Intervention Technique", // Changer le sujet ici
        html: mail
    };

    transporter.sendMail(message).then(() => {
        res.status(201).json({ msg: "Vous devriez recevoir un e-mail réel" });
    }).catch(error => {
        res.status(500).json({ error });
    });
};


module.exports = {
    sendemail,
};
