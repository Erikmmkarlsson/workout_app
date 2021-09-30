// start.js
const app = require('./server.js')

HTTP_PORT = process.env.HTTP_PORT

// Start server
app.listen(HTTP_PORT, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT))
})
