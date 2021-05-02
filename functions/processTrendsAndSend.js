// TODO: implement processTrendsAndSend function
const sgMail = require("@sendgrid/mail");
const moment = require("moment-timezone");
const { listS3Files, getS3Object } = require("../helpers/s3");
const { embedHtmlEmail } = require("../helpers/email.js");

module.exports.processTrendsAndSend = (event, context, callback) => {
  const formattedDate = moment()
    .tz("America/Los_Angeles")
    .format("dddd MMMM Do, YYYY");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  listS3Files()
    .then((response) => {
      const s3Objects = response.Contents;
      const s3KeyObjectArray = s3Objects.map((o) => {
        return { Key: o.Key };
      });
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

      return combinedTrendsPromise;
    })
    .then((trendsCounter) => {
      const sortedTrendsWithLink = Object.entries(trendsCounter)
        .sort(([, a], [, b]) => b - a)
        .map((x) => {
          return {
            trend: x[0],
            trendLink: "https://twitter.com/search?q=".concat(
              x[0].replace("#", "%23")
            ),
          };
        });

      const msg = {
        to: "jacksonjwatkins@gmail.com",
        from: "jacksonjwatkins@gmail.com",
        subject: `Trending on Twitter Today in the US - ${formattedDate}`,
        html: embedHtmlEmail(sortedTrendsWithLink),
      };
      sgMail.send(msg).then((response) => {
        callback(null, response);
      });
    })
    .catch((error) => callback(error, null));
};
