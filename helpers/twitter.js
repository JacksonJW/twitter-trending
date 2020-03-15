const Twitter = require("twitter-lite");

let twitterClient = new Twitter({
  subdomain: "api",
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const woeId = "2352824";
const params = { id: woeId };

const fetchTrends = () =>
  new Promise((resolve, reject) => {
    twitterClient
      .get("trends/place", params)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });

module.exports = {
  fetchTrends
};
