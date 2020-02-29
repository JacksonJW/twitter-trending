// TODO: implement fetchTrendsAndStoreInS3 function
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
// const Twitter = require("twitter");
const s3 = new AWS.S3();

module.exports.fetchTrendsAndStoreInS3 = async (event, context, callback) => {
  const date = new Date();
  const n = date.toISOString();
  filename = `twitter-trends${n}.json`;
  s3.putObject({
    Bucket: process.env.BUCKET,
    Key: filename,
    Body: '{ "jackson":"watkins"}'
  }).promise();
};
