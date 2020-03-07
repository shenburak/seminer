const dotenv = require('dotenv')
var result = {}
try {
    result = dotenv.config() || process.env
} catch (e) {
    console.log(e, "dotenv error!!!")
}
module.exports = { env: result.parsed || process.env };
