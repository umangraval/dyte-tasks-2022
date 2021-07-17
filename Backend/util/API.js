/* eslint-disable no-unused-vars */
const axios = require('axios');
const axiosRetry = require('axios-retry');

const MAX_REQUESTS_COUNT = 100; // max batch size
const INTERVAL = 1; // interval time
let PENDING_REQUESTS = 0; // queue

// create new axios instance
const api = axios.create({});
axiosRetry(api, { retries: 5 }); // max retries

// Axios Request Interceptor
api.interceptors.request.use((config) => new Promise((resolve, reject) => {
  const interval = setInterval(() => {
    if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
      PENDING_REQUESTS += 1;
      clearInterval(interval);
      resolve(config);
    }
  }, INTERVAL);
}));

// Axios Response Interceptor
api.interceptors.response.use(
  (response) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1); // decrement queue
    return Promise.resolve(response); // request success
  },
  (error) => {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
    return Promise.reject(error); // request failed
  },
);

module.exports = api;
