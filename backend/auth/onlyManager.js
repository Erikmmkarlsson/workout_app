const jwt = require('jsonwebtoken')

const onlyManager = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY)
    req.user = decoded
    console.log(decoded.user_role)
    if (decoded.user_role != 'manager') {
      return res.status(401).send('Only managers allowed')
    }
  } catch (err) {
    return res.status(401).send('Invalid Token')
  }
  return next()
}

module.exports = onlyManager
