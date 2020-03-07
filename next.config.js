const dotenv = require('dotenv')
const result = dotenv.config() || process.env

module.exports = { env: result.parsed };
