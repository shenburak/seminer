const dotenv = require('dotenv')
const result = dotenv.config() || {}

module.exports = { env: result.parsed };
