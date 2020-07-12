// TODO: implement processTrendsAndSend function
const sgMail = require("@sendgrid/mail");
const moment = require("moment");
const { listS3Files } = require("../helpers/s3");

module.exports.processTrendsAndSend = (event, context, callback) => {
  const formattedDate = moment().format("dddd MMMM Do, YYYY"); // ex. Saturday April 25th, 2020
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // let trendsCounter = {};

  listS3Files()
    .then((response) => {
      // response.Content.forEach((trend) => {
      //   trendsCounter[trend]
      // });
      console.log(response.Content);
    })
    .catch((error) => callback(error, null));

  // Send email
  const msg = {
    to: "jacksonjwatkins@gmail.com",
    from: "jacksonjwatkins@gmail.com",
    subject: `Trending on Twitter Today - ${formattedDate}`,
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail.send(msg).then((response) => {
    callback(null, response);
  });
};
