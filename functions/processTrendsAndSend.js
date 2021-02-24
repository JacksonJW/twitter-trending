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
      const s3KeyObjectArray = s3Objects.map((o) => {
        return { Key: o.Key };
      });
      console.log("s3KeyObjectArray: ", s3KeyObjectArray);
      return s3KeyObjectArray;
    })
    .then((s3KeyObjectArray) => {
      if (!s3KeyObjectArray.length) {
        callback(null, {
          body: JSON.stringify({
            error: "Bucket is empty!",
          }),
        });
      }
      return s3KeyObjectArray;
    })
    .then((s3KeyObjectArray) => {
      const s3KeyArray = s3KeyObjectArray.map((o) => {
        return o.Key;
      });

      // Loop through s3 json files and count the occurrences of the trends
      const buildTrendsCounterObject = (s3Key, previousTrendsCounterObject) => {
        const trendsCounter = previousTrendsCounterObject;

        return getS3Object(s3Key).then((response) => {
          const [{ trends }] = JSON.parse(response.Body.toString());

          trends.forEach((trend) => {
            if (trendsCounter[trend.name]) {
              trendsCounter[trend.name] += 1;
            } else {
              trendsCounter[trend.name] = 1;
            }
          });

          console.log(
            "final trendsCounter object after calling function: ",
            trendsCounter
          );

          return trendsCounter;
        });
      };

      let combinedTrendsPromise = Promise.resolve().then(() => {
        return {};
      });

      s3KeyArray.forEach((key) => {
        combinedTrendsPromise = combinedTrendsPromise.then(
          (trendsCounterObject) =>
            buildTrendsCounterObject(key, trendsCounterObject)
        );
      });

      console.log("combinedTrendsPromise: ", combinedTrendsPromise);

      return combinedTrendsPromise;
    })
    .then((trendsCounter) => {
      // Send the results
      const sortedTrendsWithLink = Object.entries(trendsCounter).sort(
        ([, a], [, b]) => b - a
      );
      // .reduce((a) => {
      //   // insert something here

      // });
      console.log("sortedTrendsCounter: ", sortedTrendsWithLink);
      // const twitterSearchURLTemplate = "https://twitter.com/search?q=%22%22";

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
