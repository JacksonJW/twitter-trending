// TODO: implement processTrendsAndSend function
const sgMail = require("@sendgrid/mail");
const moment = require("moment");
const { listS3Files, getS3Object } = require("../helpers/s3");

module.exports.processTrendsAndSend = (event, context, callback) => {
  const formattedDate = moment().format("dddd MMMM Do, YYYY"); // ex. Saturday April 25th, 2020
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // let trendsCounter = {};

  listS3Files()
    .then((response) => {
      // response.Content.forEach((trend) => {
      //   trendsCounter[trend]
      // });
      const s3Objects = response.Contents;
      const keyArray = s3Objects.map((o) => {
        return { Key: o.Key };
      });
      console.log("keyArray: ", keyArray);
      return keyArray;
    })
    .then((keyArray) => {
      if (!keyArray.length) {
        callback(null, {
          body: JSON.stringify({
            error: "Bucket is empty!",
          }),
        });
      }
      return keyArray;
    })
    .then((keyArray) => {
      const firstItemKey = keyArray[0].Key;
      console.log("firstItemKey: ", firstItemKey);

      // TODO: use async here or something else to loop through the objects

      getS3Object(firstItemKey).then((response) => {

        const [{ trends }] = JSON.parse(response.Body.toString());
        console.log("trends:", trends);

        // trends.forEach(() => {
        //   trendsCounter[]
        // });
      });
      return keyArray;
    })
    .catch((error) => callback(error, null));

  // Send email
  const msg = {
    to: "jacksonjwatkins@gmail.com",
    from: "jacksonjwatkins@gmail.com",
    subject: `Trending on Twitter Today in the US - ${formattedDate}`,
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail.send(msg).then((response) => {
    callback(null, response);
  });
};
