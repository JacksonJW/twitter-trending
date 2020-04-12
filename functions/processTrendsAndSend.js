// TODO: implement processTrendsAndSend function
const sgMail = require('@sendgrid/mail');

module.exports.processTrendsAndSend = (event, context, callback) => {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: 'jacksonjwatkins@gmail.com',
        from: 'jacksonjwatkins@gmail.com',
        subject: 'twitter-trending',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail.send(msg)
};
