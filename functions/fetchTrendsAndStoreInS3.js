const { fetchTrends } = require("../helpers/twitter");
const { storeInS3 } = require("../helpers/s3");

module.exports.fetchTrendsAndStoreInS3 = (event, context, callback) => {
  fetchTrends() // eslint-disable-next-line consistent-return
    .then((response) => {
      const {
        _headers: { status },
      } = response;
      if (status[0] !== "200 OK") {
        callback(null, {
          statusCode: status,
          body: JSON.stringify({
            error: "Could not fetch twitter GET trends/place api",
          }),
        });
      }
      return response;
    })

    .then((json) => {
      storeInS3(json)
        .then((response) => callback(null, response))
        .catch((error) => callback(error, null));
    })
    .catch((error) => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error }) });
    });
};
