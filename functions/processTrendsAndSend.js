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
      // Loop through s3 json files and count the occurrences of the trends
      const firstS3Key = s3KeyArray[0].Key;
      console.log("firstItemKey: ", firstS3Key);
      const o = getS3Object(firstS3Key).on();
      console.log("getS3Object(firstS3Key): ", o);
      // const trends = await getS3Object(firstItemKey).then((response) =>
      //   JSON.parse(response.Body.toString()));
      // combinedTrendsCounter = {};

      // Fill out loop
      // s3KeyArray.forEach((key) => {
      //   combinedTrendsCounterPromise = Object.assign(buildTrendsCounterObject(key, combinedTrendsCounter).then((response) => { });
      // });

      // const combinedObject = Object.assign(objectToMergeTo, source1, source2)

      // run this function below in the context of a loop:
      const buildTrendsCounterObject = (s3Key, previousTrendsCounterObject) => {
        const trendsCounter = previousTrendsCounterObject;
        // TODO: return the value generated from this getS3Object promise
        // below within the buildTrendsCounterObject() function context

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

          return trendsCounter;
        });
      };

      // Call buildTrendsCounterObject
      const trendsCounter1 = buildTrendsCounterObject(firstS3Key);
      console.log(
        "trendsCounter after calling buildTrendsCounterObject: ",
        trendsCounter1
      );
      console.log("typeof trendsCounter: ", typeof trendsCounter1);
      console.log(
        "Object.getOwnPropertyNames(trendsCounter): ",
        Object.getOwnPropertyNames(trendsCounter1)
      );
      console.log("trendsCounterFirst: ", trendsCounter1);

      return trendsCounter1;
    })
    .then((trendsCounter) => {
      // Send the results
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
