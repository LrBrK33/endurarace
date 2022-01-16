import dotenv from 'dotenv';

dotenv.config();

const apiKeys = {
  firebaseAPIKey: process.env.FIREBASE_API_KEY,
};

export default apiKeys;
