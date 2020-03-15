const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const dateTime = new Date().toISOString();
const filename = `twitter-trends${dateTime}.json`;

const storeInS3 = obj => {
  return s3
    .putObject({
      Bucket: process.env.BUCKET,
      Key: filename,
      Body: JSON.stringify(obj)
    })
    .promise();
};

// const removeS3Files = () => {};

module.exports = {
  storeInS3
};
