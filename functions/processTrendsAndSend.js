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
    .then((s3KeyObjectArray) => {
      // Loop through s3 json files and count the occurrences of the trends
      const s3KeyArray = s3KeyObjectArray.map((o) => {
        return o.Key;
      });

      const firstS3Key = s3KeyArray[0];
      console.log("firstItemKey: ", firstS3Key);

      const buildTrendsCounterObject = (s3Key, previousTrendsCounterObject) => {
        const trendsCounter = previousTrendsCounterObject;

        return getS3Object(s3Key).then((response) => {
          const [{ trends }] = JSON.parse(response.Body.toString());

          console.log("trends:", trends);
          console.log("1st trend: ", trends[0]);

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

      // Fill out loop
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
      console.log("trendsCounterSecond: ", trendsCounter);
      console.log("max: ", Math.max(...Object.values(trendsCounter)));

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
