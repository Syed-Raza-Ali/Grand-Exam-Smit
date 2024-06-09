const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const cors = require("cors");
var nodemailer = require('nodemailer');
const { Config } = require('twilio/lib/twiml/VoiceResponse');

const app = express();
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 8080;


app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add("Hello, I'm assistant of SMIT please let me know how can i help you?")
    }

    function Details(agent) {
        agent.add("Alright, tell me your name")
    }

    function Fallback(agent) {
        console.log(`intent  =>  Default Fallback Intent`);
        agent.add("")
    }

    function email(agent) {
        console.log(`intent  =>  email`);

        const { person, email, number, } = agent.parameters

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'itsrazaalishah303@gmail.com',
                pass: "nyqgwvimxmuadhwy"
            }
        });
        agent.add(`
        Congratuation you have succesfully enroll in SMIT!
        `)

        var mailOptions = {
            from: 'itsrazaalishah303@gmail.com',
            to: [email, "hammadn788@gmail.com"],
            subject: 'Sending Email from Node.js server',
            html: `  Dear student you have succefully enroll in saylani mass it training here is your id card :
              <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saylani Mass IT Training</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9;">
    <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Saylani Mass IT Training</h1>
        <p>
            Your Profile Picture
        </p>
        <h2 style="color: #333;">Name : ${person.name}</h2>
        <h3 style="color: #555;">Email : ${email}</h3>
        <h3 style="color: #555;">Roll NUmber : ${number}</h3>
        `
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }

    let intentMap = new Map();
    intentMap.set('email', email);
    intentMap.set('Default Welcome Intent', hi);
    intentMap.set('Default Fallback Intent', Fallback);
    intentMap.set('Details', Details);

    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
