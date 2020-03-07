// TODO: implement fetchTrendsAndStoreInS3 function
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const s3 = new AWS.S3();
const { getTrends } = require("../helpers/twitter");

module.exports.fetchTrendsAndStoreInS3 = async (event, context, callback) => {
  const dateTime = new Date().toISOString();
  filename = `twitter-trends${dateTime}.json`;
  getTrends() // eslint-disable-next-line consistent-return
    .then(json => {
      // console.log("JSON.stringify(json): " + JSON.stringify(json));
      // console.log(
      //   "typeof JSON.stringify(json): " + typeof JSON.stringify(json)
      // );
      // console.log("json[0]: " + json[0]);
      console.log("\njson[0].trends: " + json[0].trends + "\n");
      console.log("typeof json[0].trends: " + typeof json[0].trends + "\n");
      // console.log("Object.keys(json[0]): " + Object.keys(json[0]));
      // console.log("json[0].status: " + json[0].status);
      console.log(
        "JSON.stringify(json[0].trends): " +
          JSON.stringify(json[0].trends + "\n")
      );
      // console.log("typeof json[0]: " + typeof json[0]);
      // console.log("json[0][0]: " + json[0][0]);
      // console.log("typeof json.status: " + typeof json.status);
      // console.log("typeof json: " + typeof json);
      console.log("Object.keys(json): " + Object.keys(json) + "\n");
      // console.log("json: " + json);
      // console.log("json.status: " + json.status);
      // console.log(
      //   "Object.keys(json[0].trends): " + Object.keys(json[0].trends)
      // );
      console.log("json._headers.status[0]: " + json._headers.status[0] + "\n");

      status = json._headers.status[0];

      if (status !== "200 OK") {
        return callback(null, {
          statusCode: json.status,
          body: JSON.stringify({
            error: "Could not fetch twitter GET trends/place api"
          })
        });
      }
      // Grab the list of trends object from the json
      const { trends } = json[0];
      console.log(`trends api response: ${trends}`);
      return callback(null, {
        statusCode: json._headers.status[0],
        body: JSON.stringify(trends[0])
      });
      console.log("test");

      // Set up s3
      // s3.putObject({
      //   Bucket: process.env.BUCKET,
      //   Key: filename,
      //   Body: trends
      // }).catch(err => {
      //   callback(err, null);
      // });
    })
    .catch(error => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error }) });
    });

  //   fetch("image URL")
  //     .then(res => {
  //       return s3.putObject({ Bucket, Key, Body: res.body }).promise();
  //     })
  //     .then(res => {
  //       callback(null, res);
  //     })
  //     .catch(err => {
  //       callback(err, null);
  //     });
};
