const verifyToken = require('../../auth/')
const getID = require('../../auth/getID')

module.exports = function (app, db) { // receiving "app" and "db" instance
/*
Methods for fetching and deleting profile
*/
  app.get('/api/profile/:id', verifyToken, (req, res, next) => {
    /*
      Returns a specific user
      Example usage:
   $ curl http://localhost:8000/api users 5 -X GET
    */
    const sql = 'select * from users where id = ?'
    const params = [req.params.id]
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: row
      })
    })
  })

  app.delete('/api/profile/', verifyToken, (req, res, next) => {
    /*

      Deletes an user from the db

      */
    console.log('Deleting user...')

    const sql = 'delete from users where id = ?'
    const params = [getID(req)]
    db.get(sql, params, function (err, result) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({ message: 'deleted', changes: this.changes })
    })
  })

  app.patch('/api/profile/', verifyToken, (req, res, next) => {
    /*

      Modifies an existing user in the db.

      */
    console.log('Updating user...')

    const data = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    }

    const sql = 'UPDATE users set name = COALESCE(?,name), email = COALESCE(?,email), role = COALESCE(?,role) WHERE id = ?'
    const params = [data.name, data.email, data.role, getID(req)]
    db.run(sql, params, function (err, row) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: row
      })
    })
  })

  /*
  Methods for fetching password
  */

  app.patch('/api/password/', verifyToken, (req, res, next) => {
    /*

      Modifies password for an existing user in the db.

      */
    console.log('Updating password...')

    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    }

    const sql = 'UPDATE users set password = COALESCE(?,password) WHERE id = ?'
    const params = [data.password, getID(req)]
    db.run(sql, params, function (err, row) {
      if (err) {
        res.status(400).json({ error: err.message })
        return
      }
      res.json({
        message: 'success',
        data: row
      })
    })
  })
}
