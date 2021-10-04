const jwt = require('jsonwebtoken')


function getID (req) {
    const token =
      req.body.token || req.query.token || req.headers['x-access-token']
    decoded = jwt.verify(token, process.env.TOKEN_KEY)
    req.user = decoded
    console.log(decoded.user_role)
    return decoded.user_id
  }

  module.exports = getID
