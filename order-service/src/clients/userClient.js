const { request } = require('./httpClient');

const baseUrl = process.env.USER_SERVICE_URL || 'http://user-service:3001';

const getUser = (userId) => request(baseUrl, `/internal/users/${encodeURIComponent(userId)}`);

module.exports = { getUser };
