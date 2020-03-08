// TODO: implement fetchTrendsAndStoreInS3 function
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const s3 = new AWS.S3();
const { getTrends } = require("../helpers/twitter");

module.exports.fetchTrendsAndStoreInS3 = (event, context, callback) => {
  const dateTime = new Date().toISOString();
  filename = `twitter-trends${dateTime}.json`;

  getTrends() // eslint-disable-next-line consistent-return
    .then(response => {
      status = response._headers.status[0];
      if (status !== "200 OK") {
        return callback(null, {
          statusCode: status,
          body: JSON.stringify({
            error: "Could not fetch twitter GET trends/place api"
          })
        });
      }
      return response;
    })

    .then(json => {
      s3.putObject({
        Bucket: process.env.BUCKET,
        Key: filename,
        Body: JSON.stringify(json)
      })
        .promise()
        .then(response => {
          return callback(null, response);
        })
        .catch(err => {
          return callback(err, null);
        });
    })
    .catch(error => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error }) });
    });
};
