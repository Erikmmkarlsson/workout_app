const onlyManager = require('../../auth/onlyManager')

module.exports = function (app, db) { // receiving "app" and "db" instance
    app.get('/api/users', onlyManager, (req, res, next) => {
        /*
          Returns all the users.
          Example usage:
        $ curl http://localhost:8000/api/users -X GET
         */

        console.log('Returning all users...')

        const sql = 'select * from user'
        const params = []
        db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ error: err.message })
                return
            }
            res.json({
                message: 'success',
                data: rows
            })
        })
    })

    app.get('/api/users'  , (req, res, next) => {
        /*
          Returns a specific user
          Example usage:
       $ curl http://localhost:8000/api/users  5 -X GET
        */
        console.log('Returning one user...')

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

    app.patch('/api/users/:id', (req, res, next) => {
        console.log('Updating user...')
        const data = {
            activated: req.body.activated
        }
        const sql = 'UPDATE users  set activated = COALESCE(?,activated)  WHERE id = ?'
        const params = [data.activated, req.params.id]
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