let AWS = require("aws-sdk");
const s3 = new AWS.S3();

const storeInS3 = obj => {
  const dateTime = new Date().toISOString();
  const filename = `twitter-trends${dateTime}.json`;
  return s3
    .putObject({
      Bucket: process.env.BUCKET,
      Key: filename,
      Body: JSON.stringify(obj)
    })
    .promise();
};

const listS3Files = () => {
  const params = { Bucket: process.env.BUCKET };
  return s3.listObjects(params).promise();
}

const removeS3Files = (keysToDelete) => {
  const params = {
    Bucket: process.env.BUCKET,
    Delete: { Objects: keysToDelete }
  };
  return s3.deleteObjects(params).promise();
};

module.exports = {
  storeInS3,
  listS3Files,
  removeS3Files
};
