// TODO: implement clearS3Bucket.js function
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const listParams = { Bucket: process.env.BUCKET };

module.exports.clearS3Bucket = (event, context, callback) => {
  s3.listObjects(listParams)
    .promise()
    .then(response => {
      const objects = response.Contents;
      const keyArray = objects.map(o => {
        return { Key: o.Key };
      });
      return keyArray;
    })
    .then(keyArray => {
      if (!keyArray.length) {
        callback(null, {
          body: JSON.stringify({
            error: "Bucket is empty!"
          })
        });
      }
      return keyArray
    })
    .then(keyArray => {
      s3deleteParams = {
        Bucket: process.env.BUCKET,
        Delete: { Objects: keyArray }
      };
      s3.deleteObjects(s3deleteParams)
        .promise()
        .then(response => callback(null, response))
        .catch(error => callback(error, null));
    })
    .catch(error => callback(error, null));
};
