const { removeS3Files } = require("../helpers/s3");
const { listS3Files } = require("../helpers/s3");

module.exports.clearS3Bucket = (event, context, callback) => {
  listS3Files()
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
      return keyArray;
    })
    .then(keyArray => {
      removeS3Files(keyArray)
        .then(response => callback(null, response))
        .catch(error => callback(error, null));
    })
    .catch(error => callback(error, null));
};