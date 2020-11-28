// TODO: implement processTrendsAndSend function
const sgMail = require("@sendgrid/mail");
const moment = require("moment");
const { listS3Files, getS3Object } = require("../helpers/s3");

module.exports.processTrendsAndSend = (event, context, callback) => {
  const formattedDate = moment().format("dddd MMMM Do, YYYY"); // ex. Saturday April 25th, 2020
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  listS3Files()
    .then((response) => {
      const s3Objects = response.Contents;
      const s3KeyArray = s3Objects.map((o) => {
        return { Key: o.Key };
      });
      console.log("s3KeyArray: ", s3KeyArray);
      return s3KeyArray;
    })
    .then((s3KeyArray) => {
      if (!s3KeyArray.length) {
        callback(null, {
          body: JSON.stringify({
            error: "Bucket is empty!",
          }),
        });
      }
      return s3KeyArray;
    })
    .then((s3KeyArray) => {
      const firstItemKey = s3KeyArray[0].Key;
      const trendsCounter = {};
      console.log("firstItemKey: ", firstItemKey);

      // TODO: use async here or something else to loop through the objects

      // const trends = await getS3Object(firstItemKey).then((response) =>
      //   JSON.parse(response.Body.toString()));

      // run this below in the context of a loop:
      const countTrendsByKey = (key) =>
        getS3Object(key).then((response) => {
          const [{ trends }] = JSON.parse(response.Body.toString());

          console.log("trends:", trends);
          console.log("1st trend: ", trends[0]);

          trends.forEach((trend) => {
            if (trendsCounter[trend.name]) {
              trendsCounter[trend.name] += 1;
            } else {
              trendsCounter[trend.name] = 1;
            }
            console.log("trendsCounterInLoop: ", trendsCounter);
          });

          // TODO: Figure out a way to get trendsCounter outside the context of this promise above

          console.log("trendsCounterRightOutsideLoop: ", trendsCounter);

          // console.log("trendsCounter2: ", trendsCounter2);

          return trendsCounter;
          // callback(trendsCounter);
        });

      for 

      console.log(
        "trendsCounter right outside the context of the loop: ",
        trendsCounter
      );
        console.log("trendsCounter.toString(): ", trendsCounter.toString());
        console.log(
          "Object.getOwnPropertyNames(trendsCounter): ",
          Object.getOwnPropertyNames(trendsCounter)
        );
      console.log("trendsCounterFirst: ", trendsCounter);

      return trendsCounter;
    })
    .then((trendsCounter) => {
      console.log("trendsCounterSecond: ", trendsCounter);

      console.log("Object.keys(trendsCounter): ", Object.keys(trendsCounter));

      console.log("Object.keys(trendsCounter)[0]: ",
        Object.keys(trendsCounter)[0]
      );

      console.log(
        "typeof trendsCounter.keys()[0]: ",
        typeof Object.keys(trendsCounter)[0]
      );
      // Send email
      const msg = {
        to: "jacksonjwatkins@gmail.com",
        from: "jacksonjwatkins@gmail.com",
        subject: `Trending on Twitter Today in the US - ${formattedDate}`,
        // text: "and easy to do anywhere, even with Node.js",
        html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      };
      sgMail.send(msg).then((response) => {
        callback(null, response);
      });
    })
    .catch((error) => callback(error, null));

};
