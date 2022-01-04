const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  apiKeys: {
    firebase: process.env.FIREBASE_API_KEY,
  },
};
