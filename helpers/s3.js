const AWS = require("aws-sdk");

const s3 = new AWS.S3();

const storeInS3 = (objectToStore) => {
  const tzoffset = new Date().getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset) // current ISO formatted time
    .toISOString()
    .slice(0, -1);
  const filename = `twitter-trends${localISOTime}.json`;
  return s3
    .putObject({
      Bucket: process.env.BUCKET,
      Key: filename,
      Body: JSON.stringify(objectToStore),
    })
    .promise();
};

const listS3Files = () => {
  const params = { Bucket: process.env.BUCKET };
  return s3.listObjects(params).promise();
};

const removeS3Files = (keysToDelete) => {
  const params = {
    Bucket: process.env.BUCKET,
    Delete: { Objects: keysToDelete },
  };
  return s3.deleteObjects(params).promise();
};

module.exports = {
  storeInS3,
  listS3Files,
  removeS3Files,
};
