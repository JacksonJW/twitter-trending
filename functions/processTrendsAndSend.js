// TODO: implement processTrendsAndSend function
const sgMail = require('@sendgrid/mail');
const moment = require('moment');

module.exports.processTrendsAndSend = (event, context, callback) => {
  const formattedDate = moment().format('dddd MMMM Do, YYYY');

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: 'jacksonjwatkins@gmail.com',
    from: 'jacksonjwatkins@gmail.com',
    subject: `Trending on Twitter Today - ${formattedDate}`,
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  sgMail.send(msg).then((response) => {
    callback(null, response);
  });
};
