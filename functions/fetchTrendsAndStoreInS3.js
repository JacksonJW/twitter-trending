const { fetchTrends } = require('../helpers/twitter');
const { storeInS3 } = require('../helpers/s3');
// const moment = require('moment')

module.exports.fetchTrendsAndStoreInS3 = (event, context, callback) => {
  fetchTrends() // eslint-disable-next-line consistent-return
    .then((response) => {
      // const status = response._headers.status[0];
      const { _headers: { status } } = response;
      if (status[0] !== '200 OK') {
        callback(null, {
          statusCode: status,
          body: JSON.stringify({
            error: 'Could not fetch twitter GET trends/place api'
          }),
        });
      }
      return response;
    })

    .then((json) => {
      const dateTime = new Date().toLocaleString();
      storeInS3(json, dateTime)
        .then((response) => callback(null, response))
        .catch((error) => callback(error, null));
    })
    .catch((error) => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error }) });
    });
};
