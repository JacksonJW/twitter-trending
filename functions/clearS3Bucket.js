// TODO: implement clearS3Bucket.js function
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const params = { Bucket: process.env.BUCKET };

module.exports.clearS3Bucket = (event, context, callback) => {
  return s3
    .listObjects(params)
    .promise()
    .then(response => callback(null, response));
};
